# 멍멍AI 프로젝트 아키텍처

```mermaid
graph TD
    subgraph "멍멍AI App (Toss App)"
        A[Frontend <br> Granite <br> (React Native for UI/Logic)]
        B[Toss Integration <br> @apps-in-toss/framework]
    end

    subgraph "Backend (Supabase - BaaS)"
        C[Authentication <br> (Toss User Key + Hash)]
        D[Database <br> (Dog Profiles, Trainers)]
        E[Storage <br> (Trainer Licenses)]
    end

    A -- User Interaction --> B
    B -- Toss API: Login, Pay, Permissions --> C
    A -- Data Request --> D
    A -- File Upload --> E
```

알겠습니다. 잼 오버뷰 (최종 로드맵)을 현재까지의 실제 진행 상황과 확정된 기술 스택을 반영하여 최신 버전으로 수정했습니다.

Phase 0의 가장 큰 장애물이었던 네이티브 환경 설정(GraniteModule 오류)이 해결되었고, 이제 Supabase 연동을 시작할 차례입니다.

멍멍AI: 8주 최종 개발 로드맵 (v1.1 - 10/25 기준)

🚀 최종 아키텍처 (Granite + Supabase)

구성 요소기술 스택주요 역할프론트엔드Granite (React Native)앱의 모든 UI와 로직.토스 연동@apps-in-toss/framework토스 로그인, 토스페이 결제, 위치 권한 등 SDK API 호출.DB/백엔드Supabase (BaaS)반려견 프로필, 훈련사 목록, 예약 등 우리의 고유 데이터를 저장, 관리, 보호(RLS).🗓️ 단계별 실행 계획

Phase 0: Granite + Supabase 환경 구축 (Week 1)

목표: 'Granite' 프론트엔드와 'Supabase' 백엔드를 연결하고 "Hello World"를 샌드박스 앱에서 실행합니다.

상태: [✅ 완료]

실행 로그:

[Granite] 프로젝트 생성: (완료)

npx ait init 실행 (in tossapp/mungai)

'React Native 프레임워크 (Granite)' 템플릿 선택

appName을 mungai로 설정

granite.config.ts 파일 생성 확인

[Granite] 의존성 설치: (완료)

npm install 실행 (TDS, @apps-in-toss/framework 등 기본 패키지)

[Supabase] 클라이언트 설치: (완료)

npm install @supabase/supabase-js (BaaS 연동)

npm install @noble/ciphers @noble/hashes react-native-get-random-values (보안 인증용)

[TEST] 샌드박스 실행: (완료)

npm run dev (메트로 서버) 실행

adb reverse tcp:8081 tcp:8081 (포트 포워딩)

**'앱인토스 샌드박스 앱'**에서 intoss://mungai 스킴 실행

[성공] GraniteModule 오류 해결, "Running shared" 로그 및 기본 화면 렌더링 확인

Phase 1: 핵심 인증 및 DB 설계 (Week 2)

목표: 토스 로그인과 Supabase 인증을 보안적으로 연결하고, 전체 DB 스키마를 확정합니다.

상태: [⌛️ 다음 단계 (진행 중)]

실행:

[Granite] 토스 유저 키 확보: [TO-DO]

AppsInToss.getUserKey() (또는 유사 SDK 함수)를 호출하여 토스 유저 식별 키를 가져옵니다.

[Supabase] (필수 보안) 보안 인증 함수 (loginWithToss) 구현: [TO-DO]

.env에 SUPER_SECRET_PEPPER (암호화용 비밀 키)를 추가합니다.

tossUserKey를 그대로 PW로 쓰지 않고, tossUserKey + PEPPER를 **해시(SHA256 등)**하여 **'보안 가상 비밀번호'**를 생성합니다.

이 가상 이메일/보안PW로 supabase.auth.signUp 또는 signInWithPassword 로직을 완성합니다.

[Supabase] DB 스키마 설계: [TO-DO]

Users, DogProfiles, Trainers, TrainingRoutines, Bookings, Payments, Reviews 테이블 설계를 확정하고 생성합니다.

[Supabase] RLS (보안): [TO-DO]

"사용자는 자신의 DogProfiles만 조회/수정할 수 있다" 등 핵심 RLS 정책을 적용합니다.

Phase 2: '훈련 추천' MVP (Weeks 3-4)

목표: 첫 번째 핵심 기능인 '규칙 기반' 훈련 추천을 완성합니다.

상태: [TO-DO]

실행:

[Supabase] (병목 주의) TrainingRoutines 테이블에 MVP용 훈련 콘텐츠(최소 20개)를 수동으로 입력합니다.

[Granite] 온보딩 UI: TDS 컴포넌트를 사용해 반려견 프로필(품종, 나이, 특성) 입력 설문 플로우를 개발하고, DogProfiles 테이블에 저장합니다.

[Supabase] 추천 로직: recommend_routines(dog_id) **SQL 함수(RPC)**를 구현합니다. (프로필 기반으로 TrainingRoutines 필터링)

[Granite] 추천된 훈련 목록 및 상세 보기 화면을 개발합니다.

Phase 3: '훈련사 매칭' MVP (Weeks 5-7)

목표: 두 번째 핵심 기능인 훈련사 '검색', '예약', '결제'를 완성합니다.

상태: [TO-DO]

실행:

[Granite] 위치 권한: granite.config.ts의 permissions 배열에 **'location'**을 추가합니다.

[Granite] 지도 UI (WebView):

react-native-webview를 설치하고 Kakao Maps API를 연동합니다.

AppsInToss.requestPermission('location')으로 위치를 받아옵니다.

Supabase nearby_trainers RPC (PostGIS) 함수를 호출하여 훈련사 마커를 표시합니다.

[Supabase] 훈련사 기능: 훈련사 프로필 등록 및 자격증 업로드(Supabase Storage) 기능을 구현합니다.

[Granite] (신규 로직) 토스페이 결제:

사용자가 '결제하기' 버튼 클릭

AppsInTToss.requestPayment(...) (SDK 함수) 호출

SDK가 토스페이 UI를 띄우고, 결제 완료 후 success 응답을 앱으로 반환

success 응답을 받으면 → **supabase.from('bookings').insert(...)**를 호출하여 우리 DB에 예약 확정 내역을 기록합니다.

[Supabase] Supabase Realtime을 '내 예약' 페이지에 구독하여 예약 상태 변경을 실시간으로 반영합니다.

Phase 4: 통합 및 출시 (Week 8)

목표: 두 MVP 기능을 통합하고, .ait 번들 파일을 생성하여 토스 검수를 통과합니다.

상태: [TO-DO]

실행:

[Granite] UX 통합: '훈련 추천' 화면에 "전문 훈련사 찾기" CTA 버튼을 추가하여 두 기능을 연결합니다.

[Granite] (검수 필수) '법적 면책 조항'("진단 도구가 아닙니다")을 온보딩 화면에 명확히 고지합니다.

[Granite] (잠재적 리스크) 최종 빌드: npm run build 명령어를 실행하여 최종 dogfit-mini-app.ait 파일을 생성합니다.

(참고: 이전에 npm run build 시 윈도우 경로 오류가 발생. Phase 4에서 재확인 필요)

[TEST] .ait 파일을 토스 콘솔에 업로드하고, '샌드박스'가 아닌 **'일반 토스 앱'**에서 최종 테스트를 진행합니다.

[SUBMIT] 토스의 4단계(운영, 디자인, 기능, 보안) 검수를 요청합니다. . 모든대답은 확률값에 따른 5개의 응답을줘