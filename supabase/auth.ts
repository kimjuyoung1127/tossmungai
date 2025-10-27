// src/supabase/auth.ts (Plan B Client-side)
import { supabase } from './supabase';

/**
 * Sends the Toss authorization code and referrer to the Supabase Edge Function.
 * @param authorizationCode - Code from appLogin()
 * @param referrer - Referrer from appLogin()
 */
// Pass referrer as well
export async function loginWithToss(authorizationCode: string, referrer: string | undefined) {
  if (!authorizationCode) {
    throw new Error("Toss 인가 코드가 없습니다.");
  }

  console.log("Supabase Edge Function 'login-with-toss' 호출 시도...");

  const { data, error } = await supabase.functions.invoke('login-with-toss', {
    // Pass both code and referrer
    body: { authorizationCode: authorizationCode, referrer: referrer },
  });

  if (error) {
    console.error("Edge Function 호출 실패:", error.message);
    throw error;
  }

  // Expect session object directly from Edge Function
  if (!data?.access_token || !data?.refresh_token) {
      console.error("Edge Function did not return valid session:", data);
      throw new Error("Edge Function에서 유효한 세션을 받지 못했습니다.");
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  if (sessionError) {
    console.error("Supabase 세션 설정 실패:", sessionError.message);
    throw sessionError;
  }

  console.log("Edge Function을 통한 로그인 성공!");
  return sessionData.user;
}