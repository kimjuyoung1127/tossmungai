## 🚀 멍멍AI (토스 앱인토스 + Supabase) - 1주차 개발 보고서: 난관 극복기

> 문서 목적: 초기 기술 스택 전환부터 인증 성공까지의 험난했던 개발 과정, 주요 문제점, 해결 전략, 그리고 성공 요인을 기록하여 토스 앱인토스(Granite) + Supabase 연동의 선구적인 사례를 남깁니다.
> 
- **상태:** `Phase 1 시작`
- **작성일:** 2025년 10월 27일
- **핵심 성과:** **토스 로그인(`appLogin`) → Supabase 서버 인증(mTLS) 연동 성공** 🎉

---

### 📌 개요: 과감한 전환과 예상치 못한 난관

초기 계획이었던 웹뷰(Vite) 기반 개발(Plan A)은 토스 플랫폼 제약으로 불가능함을 확인하고, **네이티브 Granite + Supabase 서버 인증(Plan B)**이라는 새로운 아키텍처로 과감히 전환했습니다. 목표는 토스 로그인과 Supabase를 안전하게 연동하는 것이었으나, 예상보다 훨씬 복잡한 기술적 장벽에 부딪혔습니다.

---

### 🧗 개발 여정: 오류와의 싸움

1주차는 성공보다 실패와 디버깅의 연속이었습니다.

1. **초기 설정 지옥 (`GraniteModule` / `"shared"` 오류):**
    - **문제:** `npm run dev` 후 샌드박스 앱 연결 시, 앱이 즉시 중단되며 네이티브 모듈 로딩 실패.
    - **원인:** `ANDROID_HOME` 환경 변수 누락, 잘못된 폴더(`cd` 누락)에서 `npm run dev` 실행, 샌드박스 앱/PC 캐시 꼬임 등 복합적 문제.
    - **해결:** 환경 변수 재설정, 터미널 재시작, 폴더 위치 확인, `node_modules` 완전 삭제(`Scorched Earth`), 샌드박스 앱 재설치 등 **모든 기본 환경 설정을 처음부터 다시 점검**하여 해결.
2. **인증 대혼란 (`appLogin` undefined / SDK 초기화 실패):**
    - **문제:** 환경 설정 완료 후에도 `_app.tsx`에서 `@apps-in-toss/framework`의 `appLogin` 함수 접근 시 `undefined` 오류 발생. "SDK not properly initialized" 메시지 동반.
    - **삽질:** `context` prop을 통한 접근 시도, `useEffect` 타이밍 문제 해결 시도(`setTimeout`, `while` 루프) → **모두 실패.**
    - **돌파구:** **정확한 공식 문서**("토스 인증 로그인" 섹션) 발견!
        - `appLogin`은 전역 객체에서 `import { appLogin } ...`으로 가져오는 것이 맞음.
        - **샌드박스에서도 작동해야 함**을 확인. (즉, 이전 오류는 초기화 실패가 맞았음)
        - **공식 예제(`with-app-login`)** 존재 확인 및 실행 권고 받음.
3. **서버 통신 장벽 (mTLS `CertificateRequired`):**
    - **문제:** `appLogin` 호출 성공 후 `authorizationCode`를 Supabase Edge Function으로 보내 토스 API(`/generate-token`) 호출 시 `CertificateRequired` 오류 발생.
    - **원인:** 토스 서버 API가 **mTLS (상호 TLS) 인증**을 요구함. Edge Function에서 클라이언트 인증서(`.crt`, `.key`)를 사용한 요청 설정 누락.
    - **해결:**
        - `.crt`, `.key` 파일 내용을 **Base64로 인코딩**하여 Supabase **Secrets**에 저장. (`TOSS_CLIENT_CERT_BASE64`, `TOSS_CLIENT_KEY_BASE64`)
        - Edge Function 코드 수정: Secrets에서 Base64 값을 읽어 `atob()`로 **디코딩** 후, **`Deno.createHttpClient({ cert, key })`*를 사용하여 mTLS 클라이언트 생성.
        - `/generate-token` **및** `/login-me` API 호출 시 `fetch` 옵션에 `client: tossHttpClient` 추가.

---

### ✨ 돌파구: 공식 문서 + 정확한 mTLS 구현

수많은 시행착오 끝에 성공할 수 있었던 핵심 요인은 다음과 같습니다.

- **정확한 공식 문서 식별:** 여러 토스 문서 중 **앱인토스 로그인 전용 API 명세**를 찾아 `appLogin` 사용법과 OAuth2 흐름을 정확히 이해했습니다.
- **mTLS 구현:** Deno 환경에서 Supabase Secrets와 `Deno.createHttpClient`를 이용하여 **mTLS 인증서 기반 API 호출**을 성공적으로 구현했습니다.

---

### ✅ 현재 상태 및 다음 단계

현재 상태:

토스 샌드박스 앱 환경에서 appLogin 호출 → authorizationCode 획득 → Supabase Edge Function에서 mTLS로 토스 API 호출 (/generate-token, /login-me) → userKey 획득 → Supabase 가입/로그인 완료라는 핵심 인증 흐름 전체가 성공적으로 작동함을 확인했습니다! 🥳

**다음 단계 (Phase 1 완료 및 Phase 2 시작):**

1. **DB 스키마 확장:** `DogProfiles`, `Trainers`, `TrainingRoutines` 등 나머지 테이블 스키마를 Supabase에 적용합니다.
2. **기능 개발 시작:** '훈련 추천' MVP 기능 개발에 착수합니다 (`_app.tsx` 정리, `pages/index.tsx` 수정 등).

---

### 🏆 우리가 1호가 될 수 있다! (Why This Matters)

토스 앱인토스(Granite) 환경에서 외부 BaaS인 **Supabase**를 연동하고, 특히 **mTLS 인증이 필요한 서버 API**까지 **Edge Function**으로 성공시킨 이 과정은 **공식 예제에도 아직 없는 선구적인 사례**일 가능성이 높습니다. 우리가 겪은 시행착오와 해결 과정은 앞으로 토스 미니앱 + Supabase 조합을 시도할 다른 개발자들에게 매우 귀중한 자료가 될 것입니다.

---

### 💻 핵심 코드 스니펫 (성공 버전)

**`src/_app.tsx` (appLogin 호출 부분):**

TypeScript

# 

`// src/_app.tsx
import { appLogin, AppsInToss, type AppsInTossProps } from '@apps-in-toss/framework';
// ... other imports ...
import { loginWithToss } from '@/supabase/auth';

function AppContainer(/* ...props... */) {
  // ... state definitions ...

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthStatus('1. 토스 앱 로그인 시도 중 (appLogin)...');
        // ✅ 정확한 함수 호출
        const { authorizationCode, referrer } = await appLogin();

        if (!authorizationCode) throw new Error('인가 코드 받기 실패');
        setAuthCode(authorizationCode);

        setAuthStatus('2. Supabase 로그인 시도 중...');
        // ✅ auth.ts로 코드 전달
        const user = await loginWithToss(authorizationCode, referrer);

        // ... (Supabase 세션 확인) ...
        setAuthStatus('✅ 인증 성공!');
      } catch (error: any) {
        setAuthStatus(`❌ 인증 실패: ${error.message}`);
      }
    };
    initializeAuth();
  }, []);

  // ... (UI 렌더링) ...
}

// ✅ 공식 구조 유지
export default AppsInToss.registerApp(AppContainer, { context: routerContext });`

**`supabase/functions/login-with-toss/index.ts` (mTLS 부분):**

TypeScript

# 

`// supabase/functions/login-with-toss/index.ts
// ... imports and other setup ...

// ✅ Secrets에서 Base64 인코딩된 인증서/키 로드 및 디코딩
const clientCertDecoded = atob(Deno.env.get('TOSS_CLIENT_CERT_BASE64')!);
const clientKeyDecoded = atob(Deno.env.get('TOSS_CLIENT_KEY_BASE64')!);

// ✅ mTLS HttpClient 생성
let tossHttpClient: Deno.HttpClient | undefined;
try {
  tossHttpClient = Deno.createHttpClient({
    cert: clientCertDecoded,
    key: clientKeyDecoded,
  });
} catch (e) { /* ... error handling ... */ }

Deno.serve(async (req) => {
  if (!tossHttpClient) { /* ... handle error ... */ }

  try {
    const { authorizationCode, referrer } = await req.json();

    // ✅ /generate-token 호출 시 client 옵션 사용
    const tokenResponse = await fetch('.../generate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorizationCode, referrer }),
      client: tossHttpClient, // <--- mTLS 적용
    });
    // ... get accessToken ...

    // ✅ /login-me 호출 시 client 옵션 사용
    const userResponse = await fetch('.../login-me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      client: tossHttpClient, // <--- mTLS 적용
    });
    // ... get userKey ...

    // ... Supabase Auth 처리 ...

  } catch (error) { /* ... error handling ... */ }
});`