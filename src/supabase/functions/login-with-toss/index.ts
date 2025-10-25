// supabase/functions/login-with-toss/index.ts (수정된 코드)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// ⛔️ 수정됨: Deno 네이티브 crypto 모듈 사용
import { pbkdf2 } from 'node:crypto'; // 'node:crypto' 사용
import { promisify } from 'node:util'; // 콜백을 Promise로 변환

// 1. .env에서 비밀 키(Pepper) 가져오기 (서버에서만)
const SUPER_SECRET_PEPPER = Deno.env.get('SUPER_SECRET_PEPPER')!;

// pbkdf2를 Promise 기반으로 변환
const pbkdf2Promise = promisify(pbkdf2);

// 2. Deno(서버) 환경에서 실행되는 보안 비밀번호 생성 함수 (⛔️ 수정됨)
async function getSecurePassword(tossUserKey: string): Promise<string> {
  const salt = 'mungai-static-salt'; // crypto 모듈은 string을 지원
  const keyMaterial = tossUserKey + SUPER_SECRET_PEPPER;

  // Deno 네이티브 crypto.pbkdf2 사용
  const derivedKey = await pbkdf2Promise(
    keyMaterial,
    salt,
    100000,   // 반복
    32,       // 32바이트 (256비트)
    'sha256'  // 해시 알고리즘
  );

  return derivedKey.toString('hex'); // 64자리 16진수
}

// 3. Supabase Admin 클라이언트 생성 (RLS를 우회하는 강력한 권한)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // ⛔️ Admin 전용 키
);

// 4. 요청 처리 (이하 코드는 동일)
Deno.serve(async (req) => {
  try {
    const { tossUserKey } = await req.json();
    if (!tossUserKey) throw new Error("Toss User Key가 없습니다.");

    const email = `${tossUserKey}@mungai.app`;
    const password = await getSecurePassword(tossUserKey);

    // 5. 로그인 시도 (Admin 권한)
    const { data: loginData, error: loginError } =
      await supabaseAdmin.auth.admin.getUserByEmail(email);

    if (loginData.user) {
      // 6. 기존 유저 -> 로그인
      console.log("기존 유저 로그인 시도 (Admin)");
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return new Response(JSON.stringify(data.session), {
        headers: { 'Content-Type': 'application/json' },
      });

    } else {
      // 7. 신규 유저 -> 회원가입 (Admin 권한)
      console.log("신규 유저 회원가입 (Admin)");
      const { data: signUpData, error: signUpError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // 자동 승인
        });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("유저 생성 실패");

      // 8. public.users 테이블에 데이터 동기화 (Admin 권한)
      const { error: insertError } = await supabaseAdmin.from('users').insert({
        id: signUpData.user.id,
        toss_user_key: tossUserKey,
        role: 'user',
      });
      if (insertError) throw insertError;

      // 9. 방금 만든 유저로 세션 생성
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
      if (error) throw error;

      return new Response(JSON.stringify(data.session), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Edge Function 오류:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});