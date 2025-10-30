멍멍AI: 8주 최종 개발 로드맵 (v1.2 - 10/28 인증 성공 반영)
🚀 최종 아키텍처 (Granite + Supabase Edge Function + mTLS)
프론트엔드: Granite (React Native) - UI/UX 및 SDK 호출 담당

토스 연동: @apps-in-toss/framework - appLogin(로그인 시작), checkoutPayment(결제 인증) 등 클라이언트 SDK 함수 제공

백엔드 (서버): Supabase Edge Functions (Deno) - 핵심 로직 처리

토스 OAuth2 API 호출 (/generate-token, /login-me): mTLS 인증서 + AccessToken 사용 -> userKey 획득

토스페이 API 호출 (/make-payment, /execute-payment): mTLS 인증서 + x-toss-user-key 헤더 사용 -> 결제 생성/실행

Supabase Admin Client 사용: 사용자 인증(가상 계정), DB 작업(RLS 우회)

DB/스토리지: Supabase (BaaS) - 데이터 저장(RLS 적용), 파일 저장

(Mermaid 다이어그램은 Edge Function 역할을 명확히 하여 수정 필요)

🗓️ 단계별 실행 계획
Phase 0: Granite + Supabase 환경 구축 (Week 1)
목표: Granite 프론트엔드 개발 환경 설정 및 Supabase 백엔드(Client, Edge Function) 기본 연동 확인

상태: [✅ 완료]

실행 로그:

[Granite] 프로젝트 생성 및 기본 설정 완료 (npx ait init, granite.config.ts - plugins, env 설정)

[Granite] 필수 의존성 설치 완료 (@supabase/supabase-js, @react-native-async-storage/async-storage, react-native-url-polyfill)

[Supabase] 클라이언트 초기화 코드 작성 완료 (src/supabase/supabase.ts)

[Supabase] Edge Function 배포 환경 설정 완료 (Supabase CLI 설치/연동)

[TEST] 샌드박스 실행 및 기본 렌더링 확인 완료 (npm run dev, adb reverse) - GraniteModule 등 초기 오류 해결

Phase 1: 핵심 인증 및 DB 설계 (Week 2)
목표: Plan B (서버 인증) 흐름 구현 완료 및 DB 스키마 v3.7 적용

상태: [✅ 인증 로직 구현/테스트 완료], [⌛️ DB 스키마 적용 대기]

실행 로그 & 계획:

[Granite] appLogin 호출: (완료)

_app.tsx에서 @apps-in-toss/framework의 appLogin() 함수를 성공적으로 호출하여 authorizationCode 및 referrer 획득 확인. (SDK 초기화 타이밍 이슈 해결)

[Supabase] 보안 인증 함수 (loginWithToss): (완료)

클라이언트(auth.ts): authorizationCode, referrer를 받아 Edge Function(login-with-toss) 호출.

Edge Function (login-with-toss):

authorizationCode 수신.

Secrets에 저장된 mTLS 인증서(Base64 디코딩) 및 Deno.createHttpClient 사용하여 토스 API /generate-token 호출 → accessToken 획득.

accessToken과 mTLS 인증서 사용하여 토스 API /login-me 호출 → userKey 획득.

Secrets에 저장된 SUPER_SECRET_PEPPER 사용하여 userKey 기반 보안 가상 비밀번호 생성 (PBKDF2 해싱).

가상 이메일/보안PW로 supabaseAdmin을 통해 signInWithPassword 또는 createUser 실행.

성공 시 public.users 테이블에 toss_user_key 저장/업데이트.

최종 Supabase 세션(JWT)을 클라이언트에 반환.

[성공] 샌드박스 앱에서 "✅ 인증 성공!" 확인.

[Supabase] DB 스키마 v3.7 적용: [TO-DO] 👈 (다음 작업)

제공된 최종 DB 스키마 v3.7 SQL 코드를 Supabase SQL Editor에서 실행하여 모든 테이블(Users, DogProfiles, Trainers, Bookings, Payments, Refunds, Reviews, Logs, History 등) 및 RLS 정책, 트리거, 인덱스 생성.

Phase 2: '훈련 추천' MVP (Weeks 3-4)
목표: 첫 번째 핵심 기능인 '규칙 기반' 훈련 추천 UI 및 로직 완성

상태: [TO-DO]

실행:

[Supabase] (병목) TrainingRoutines 테이블에 MVP용 훈련 콘텐츠(최소 20개, 다국어 필드 고려) 입력. breeds 테이블 데이터 입력.

[Granite] 온보딩 UI: TDS 컴포넌트 사용, 반려견 프로필(DogProfiles) 입력/저장 구현.

[Supabase] 추천 로직: recommend_routines(dog_id) SQL 함수(RPC) 구현 (룰 기반 필터링).

[Granite] 추천 화면: 추천된 훈련 목록(/pages/recommendations.tsx) 및 상세 보기 화면 개발.

Phase 3: '훈련사 매칭' MVP (Weeks 5-7)
목표: 두 번째 핵심 기능인 훈련사 '검색', '예약', '결제' 완성

상태: [TO-DO]

실행:

[Granite] 권한 설정: granite.config.ts permissions 배열에 'location' 추가 확인.

[Granite] 지도 UI (WebView): Kakao Maps API 연동, 사용자 위치 받아 nearby_trainers RPC(PostGIS) 호출하여 훈련사 표시.

[Supabase/Granite] 훈련사 등록/프로필: 훈련사가 프로필(trainers 테이블) 등록/수정 및 자격증(trainer_certifications, Supabase Storage) 업로드 기능 구현 (별도 Edge Function 또는 클라이언트 RLS 기반 직접 수정).

[Granite/Supabase] (수정된 결제 로직) 토스페이 결제:

클라이언트: 사용자가 '결제하기' 클릭 → booking_id, amount 등 정보를 Edge Function(create-payment)으로 전송.

Edge Function (create-payment): bookings.id(orderNo), amount 등으로 /make-payment API 호출 (mTLS + x-toss-user-key 헤더 - users 테이블 조회) → payToken 획득 후 클라이언트에 반환.

클라이언트: 받은 payToken으로 @apps-in-toss/framework의 checkoutPayment() SDK 호출.

클라이언트: checkoutPayment 성공 시, payToken, orderNo(bookings.id)를 Edge Function(execute-payment)으로 전송.

Edge Function (execute-payment): 전달받은 정보와 x-toss-user-key 헤더(users 테이블 조회)로 /execute-payment API 호출 (mTLS 필요?).

Edge Function: 성공 응답 수신 → payments 테이블 상세 정보 저장 (status='PAY_COMPLETE') → bookings 테이블 status='confirmed' 업데이트. payment_status_history 기록.

[Supabase/Granite] Realtime 적용: '내 예약' 페이지에서 bookings 테이블 상태 변경 실시간 구독/표시.

Phase 4: 통합 및 출시 (Week 8)
목표: 두 MVP 기능 통합, 최종 테스트 및 토스 검수 통과

상태: [TO-DO]

실행:

[Granite] UX 통합: 기능 간 자연스러운 이동 경로(CTA 버튼 등) 구현.

[Granite] 법적 고지: 면책 조항 등 필수 안내 문구 적용.

[Granite] 최종 빌드: npm run build로 .ait 파일 생성 (윈도우 경로 오류 발생 시 WSL 환경 고려).

[TEST] 실제 앱 테스트: .ait 파일을 토스 콘솔 업로드 후 **'일반 토스 앱'**에서 최종 기능 검증.

[SUBMIT] 토스 4단계 검수 요청.