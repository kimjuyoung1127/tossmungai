// supabase/functions/login-with-toss/index.ts (Base64 디코딩 적용)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';

// --- Environment Variables (Secrets) ---
const SUPER_SECRET_PEPPER = Deno.env.get('SUPER_SECRET_PEPPER')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// ✅ Base64 인코딩된 Secrets 값을 가져옵니다.
const TOSS_CLIENT_CERT_BASE64 = Deno.env.get('TOSS_CLIENT_CERT_BASE64')!;
const TOSS_CLIENT_KEY_BASE64 = Deno.env.get('TOSS_CLIENT_KEY_BASE64')!;

// --- Error Handling ---
// ✅ Base64 Secrets 누락 검사 추가
if (!SUPER_SECRET_PEPPER || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TOSS_CLIENT_CERT_BASE64 || !TOSS_CLIENT_KEY_BASE64) {
    console.error('CRITICAL: Missing required environment variables/secrets (including Base64 mTLS cert/key)!');
    // Consider returning an error response immediately
     return Deno.serve(async (req) => new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 }));
}

// --- Supabase Admin Client (변경 없음) ---
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Secure Password Generation (변경 없음) ---
const pbkdf2Promise = promisify(pbkdf2);
async function getSecurePassword(tossUserKey: string): Promise<string> { /* ... 이전 코드와 동일 ... */ }

// --- mTLS HttpClient 생성 (✅ Base64 디코딩 추가) ---
let tossHttpClient: Deno.HttpClient | undefined;
let clientCertDecoded: string | undefined;
let clientKeyDecoded: string | undefined;

try {
    // ✅ atob() 함수로 Base64 문자열을 디코딩하여 원래 PEM 문자열로 변환합니다.
    clientCertDecoded = atob(TOSS_CLIENT_CERT_BASE64);
    clientKeyDecoded = atob(TOSS_CLIENT_KEY_BASE64);

    tossHttpClient = Deno.createHttpClient({
        cert: clientCertDecoded, // 디코딩된 인증서 문자열 전달
        key: clientKeyDecoded,   // 디코딩된 개인 키 문자열 전달
    });
    console.log("mTLS HttpClient created successfully from Base64 secrets.");
} catch (e) {
    console.error("Failed to decode Base64 secrets or create mTLS HttpClient:", e);
    // Base64 디코딩 실패 또는 HttpClient 생성 실패 시 에러 처리
}


// --- Main Request Handler (변경 없음 - HttpClient 생성 실패 시 에러 반환 로직 추가됨) ---
Deno.serve(async (req) => {
    if (!tossHttpClient) {
         // HttpClient 생성 실패 시 에러 반환
         return new Response(JSON.stringify({ error: "mTLS client initialization failed" }), {
             status: 500, headers: { 'Content-Type': 'application/json' },
         });
    }

    try {
        // ... (이하 /generate-token, /login-me, Supabase 인증 로직은 이전과 동일) ...
        const { authorizationCode, referrer } = await req.json();
        // ...
        const tokenResponse = await fetch('https://apps-in-toss-api.toss.im/.../generate-token', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ authorizationCode, referrer: referrer || 'DEFAULT' }),
             client: tossHttpClient, // ✅ mTLS 클라이언트 사용
         });
        // ... (이하 동일) ...
    } catch (error) {
        // ... (에러 처리 동일) ...
    }
});