// supabase/functions/login-with-toss/index.ts (Complete Corrected Code)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';

// --- Environment Variables (Secrets) ---
const SUPER_SECRET_PEPPER = Deno.env.get('SUPER_SECRET_PEPPER')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const TOSS_CLIENT_CERT_BASE64 = Deno.env.get('TOSS_CLIENT_CERT_BASE64')!;
const TOSS_CLIENT_KEY_BASE64 = Deno.env.get('TOSS_CLIENT_KEY_BASE64')!;

// --- ❗ Flag for configuration validity ---
let secretsAreValid = true;
if (!SUPER_SECRET_PEPPER || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TOSS_CLIENT_CERT_BASE64 || !TOSS_CLIENT_KEY_BASE64) {
    console.error('CRITICAL: Missing required environment variables/secrets!');
    secretsAreValid = false; // Set flag to false if secrets are missing
}

// --- Supabase Admin Client ---
// Initialize only if secrets seem valid so far
const supabaseAdmin = secretsAreValid ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

// --- Secure Password Generation ---
const pbkdf2Promise = promisify(pbkdf2);
async function getSecurePassword(tossUserKey: string): Promise<string> {
    // Ensure SUPER_SECRET_PEPPER is available before using it
    if (!SUPER_SECRET_PEPPER) throw new Error("Server configuration error: PEPPER is missing.");
    const salt = 'mungai-static-salt';
    const keyMaterial = tossUserKey + SUPER_SECRET_PEPPER;
    const derivedKey = await pbkdf2Promise(keyMaterial, salt, 100000, 32, 'sha256');
    return derivedKey.toString('hex');
}

// --- mTLS HttpClient Creation ---
let tossHttpClient: Deno.HttpClient | undefined;
// Attempt to create only if secrets are valid
if (secretsAreValid) {
    try {
        console.log("Decoding Base64 mTLS credentials...");
        const clientCertDecoded = atob(TOSS_CLIENT_CERT_BASE64);
        const clientKeyDecoded = atob(TOSS_CLIENT_KEY_BASE64);

        console.log("Creating mTLS HttpClient...");
        tossHttpClient = Deno.createHttpClient({
            cert: clientCertDecoded,
            key: clientKeyDecoded,
        });
        console.log("✅ mTLS HttpClient created successfully.");
    } catch (e) {
        console.error("❌ Failed to decode Base64 secrets or create mTLS HttpClient:", e);
        secretsAreValid = false; // Mark config as invalid if mTLS setup fails
    }
}

// --- Main Request Handler ---
Deno.serve(async (req) => {
    // ❗ Check configuration validity at the start of every request
    if (!secretsAreValid || !supabaseAdmin || !tossHttpClient) {
         console.error("Critical: Server not properly configured. Check Secrets and mTLS setup.");
         return new Response(JSON.stringify({ error: "Server configuration error" }), {
             status: 500, headers: { 'Content-Type': 'application/json' },
         });
    }

    try {
        const { authorizationCode, referrer } = await req.json();
        if (!authorizationCode) throw new Error("인가 코드가 없습니다.");

        console.log("Step 1: Toss Access Token 요청 시작 (mTLS)...");
        // --- Step 1: Exchange Authorization Code (mTLS) ---
        const tokenResponse = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authorizationCode, referrer: referrer || 'DEFAULT' }),
            client: tossHttpClient, // Use mTLS client
        });

        if (!tokenResponse.ok) {
            const errorBody = await tokenResponse.text();
            console.error('Toss Token API Error:', tokenResponse.status, errorBody);
            throw new Error(`Toss Token API Error: Status ${tokenResponse.status} - ${errorBody}`);
        }
        const tokenData = await tokenResponse.json();
        if (tokenData.resultType !== 'SUCCESS' || !tokenData.success?.accessToken) {
            console.error('Toss Token Response Error:', tokenData);
            throw new Error(`Toss Access Token 획득 실패: ${tokenData.error?.reason || JSON.stringify(tokenData)}`);
        }
        const accessToken = tokenData.success.accessToken;
        console.log("Step 1: Toss Access Token 획득 성공.");


        console.log("Step 2: Toss 사용자 정보 요청 시작 (mTLS)...");
        // --- Step 2: Get User Info (mTLS) ---
        const userResponse = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/login-me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            client: tossHttpClient, // ✅ Use mTLS client here too
        });

        if (!userResponse.ok) {
            const errorBody = await userResponse.text();
            console.error('Toss User API Error:', userResponse.status, errorBody);
            throw new Error(`Toss User API Error: Status ${userResponse.status} - ${errorBody}`);
        }
        const userData = await userResponse.json();
        if (userData.resultType !== 'SUCCESS' || !userData.success?.userKey) {
            console.error('Toss User Response Error:', userData);
            throw new Error(`Toss 사용자 정보 획득 실패: ${userData.error?.reason || JSON.stringify(userData)}`);
        }
        const tossUserKey = userData.success.userKey.toString();
        console.log("Step 2: Toss 사용자 정보 (userKey) 획득 성공:", tossUserKey);


        // --- Step 3: Supabase Sign In / Sign Up ---
        console.log("Step 3: Supabase 인증 처리 시작...");
        const email = `${tossUserKey}@mungai.app`;
        const password = await getSecurePassword(tossUserKey);

        const { data: signInSessionData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({ email, password });

        if (signInSessionData?.session) {
             console.log("Step 3: Supabase 로그인 성공 (기존 유저)");
             return new Response(JSON.stringify(signInSessionData.session), {
                 headers: { 'Content-Type': 'application/json' }, status: 200 // OK status
             });
         } else {
             console.log("Step 3: Supabase 회원가입 시도 (신규 유저)");
             const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });

             // Handle potential sign-up errors (like user already exists but password was wrong)
             if (signUpError) {
                 // Check if it's a "User already registered" error - which might happen if signIn failed due to wrong password hash logic
                 if (signUpError.message.includes('User already registered')) {
                     console.error("Sign-up failed: User likely already exists but signIn failed. Check password hashing logic or DB state.");
                     // Consider attempting sign-in again or returning a specific error
                 }
                 throw signUpError; // Rethrow other sign-up errors
             }
             if (!signUpData.user) throw new Error("Supabase 유저 생성 실패 (No user data returned)");

             // Sync with public.users table
             const { error: insertError } = await supabaseAdmin.from('users').insert({ id: signUpData.user.id, toss_user_key: tossUserKey, role: 'user' });
             if (insertError) {
                 console.error("CRITICAL: Failed to insert into public.users after Auth signup. Rolling back Auth user.");
                 await supabaseAdmin.auth.admin.deleteUser(signUpData.user.id); // Rollback Auth user
                 throw insertError;
             }

             // Sign in the newly created user to get a session
             const { data: finalSessionData, error: finalSignInError } = await supabaseAdmin.auth.signInWithPassword({ email, password });
             if(finalSignInError) {
                console.error("CRITICAL: Failed to sign in newly created user.");
                throw finalSignInError;
             };
             if (!finalSessionData.session) throw new Error("Failed to get session for new user.");


             console.log("Step 3: Supabase 회원가입 및 로그인 성공");
             return new Response(JSON.stringify(finalSessionData.session), {
                 headers: { 'Content-Type': 'application/json' }, status: 200 // OK status
             });
         }

    } catch (error: any) {
        console.error("❌ Edge Function 오류:", error.message);
        console.error("Stack trace:", error.stack);
        return new Response(JSON.stringify({ error: `Edge Function Error: ${error.message}` }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
        });
    }
});