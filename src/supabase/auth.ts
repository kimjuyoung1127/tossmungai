// supabase/auth.ts
import { supabase } from './supabase';

/**
 * 토스 유저 키를 Supabase Edge Function(서버)으로 보내 로그인을 처리합니다.
 * @param tossUserKey - AppsInToss.getUserKey()로 받은 고유 식별자
 */
export async function loginWithToss(tossUserKey: string) {
  if (!tossUserKey) {
    throw new Error("Toss User Key가 없습니다.");
  }

  console.log("Supabase Edge Function 'login-with-toss' 호출 시도...");

  // 1. 우리가 만들 Edge Function을 '호출'합니다.
  const { data, error } = await supabase.functions.invoke('login-with-toss', {
    body: { tossUserKey: tossUserKey },
  });

  if (error) {
    console.error("Edge Function 호출 실패:", error.message);
    throw error;
  }

  // 2. Edge Function이 반환한 세션(JWT)을 앱에 설정합니다.
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