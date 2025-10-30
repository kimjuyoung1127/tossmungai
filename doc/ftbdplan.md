알겠습니다. DB 스키마(v3.9) 적용 및 마스터 데이터 입력 완료 상태를 반영하여 **통합 개발 플랜(v4.1)**을 업데이트했습니다.

---

## 🐶 멍멍AI: 통합 개발 플랜 (v4.1 - 12주, Solo Dev)

**핵심 원칙:** 각 Phase별로 필요한 백엔드 인프라/API를 먼저 (또는 동시에) 구축하고, 이를 활용하는 프론트엔드 UI/로직을 구현합니다.

---

### **Week 1: Phase 0 - 환경 구축 & 초기 인증**

* **백엔드:**
    * [✅ 완료] Supabase 프로젝트 설정 (DB, Auth, Storage)
    * [✅ 완료] mTLS 인증서 생성 및 Supabase Secrets 등록
    * [✅ 완료] `login-with-toss` Edge Function 개발 및 배포 (mTLS API 호출, Supabase 가상 계정 생성/로그인 로직 포함)
    * [✅ 완료] Supabase CLI 연동 확인
* **프론트엔드:**
    * [✅ 완료] Granite 프로젝트 생성, 의존성 설치, Supabase 클라이언트 설정
    * [✅ 완료] Sentry 등 에러 추적 도구 초기 설정
    * [✅ 완료] 토스 샌드박스 앱 실행 및 기본 렌더링 확인

---

### **Week 2: Phase 1 - DB 적용 완료 & 기본 UI 골격** ⭐

* **백엔드:**
    * **[✅ 완료]** DB 스키마(v3.9) 전체 적용: 모든 테이블, RLS 정책, 트리거(`trigger_set_timestamp`, `update_trainer_rating`), 인덱스 적용
    * **[✅ 완료]** 마스터 데이터 입력: `breeds`, `specializations`, `certification_types` 테이블 초기 데이터 입력
* **프론트엔드:**
    * **[✅ 완료]** 토스 로그인 연동 (핵심 로직): `appLogin()` 호출 -> `login-with-toss` Edge Function 호출 -> Supabase 세션 받아 로컬 저장
    * **(진행 중)** 최소 온보딩 UI (2단계): 반려견 기본 정보(`dog_profiles`) 입력 폼 UI 개발 및 DB 저장 로직 연동 (초기 목표 제외)
    * **(진행 중)** 메인 레이아웃: 토스 **플로팅 탭 바** UI (홈/훈련사/내활동/설정 - 4개 탭) 및 기본 페이지 라우팅 설정

---

### **Week 3: Phase 2 - 훈련사 검색 핵심** ⭐

* **백엔드:**
    * **`nearby_trainers` RPC 함수 개발:** PostGIS(`ST_DWithin`) 활용 위치 기반 조회 및 기본 필터링(전문 분야, 평점) 로직 구현
    * **PostGIS 인덱스 확인/최적화:** `trainers`, `trainer_service_areas`, `user_preferences` 위치 필드 GIST 인덱스 적용 확인
    * **(Optional) Trigram 인덱스 추가:** 훈련사 이름, 전문 분야 텍스트 검색 대비 인덱스 추가 고려
* **프론트엔드:**
    * **위치 권한 요청** 로직 구현
    * **지도 UI (WebView):** Kakao Maps 연동, `nearby_trainers` RPC 호출하여 마커 표시
    * **목록/필터 UI:** 훈련사 목록 UI, 필터 바텀 시트 UI 개발 및 `nearby_trainers` RPC 연동

---

### **Week 4: Phase 2 - 훈련사 프로필 상세** ⭐

* **백엔드:** (주요 로직은 Week 3 완료, 필요시 조회용 RPC 추가)
    * 훈련사 상세 정보 조회를 위한 RPC 함수 최적화 (관련 테이블 JOIN 등)
* **프론트엔드:**
    * **훈련사 프로필 상세 UI 개발:** 탭 구조 기반 UI 구현. 기본 정보(`trainers`), 전문 분야(`specializations`), 자격증(`certifications`), **수상 내역(`trainer_awards`)** ✨, 리뷰 요약(`reviews`), 예약 가능 시간(UI) 표시 로직 구현
    * **신뢰 Badge** UI 구현 (`is_verified` 등 활용)

---

### **Week 5: Phase 3 - 예약 신청 & 결제 API** ⭐

* **백엔드:**
    * **`create-payment` Edge Function 개발:** `/make-payment` API 호출, `payments` 테이블 저장 로직 구현
    * **`execute-payment` Edge Function 개발:** `/execute-payment` API 호출, `payments`/`bookings`/`payment_status_history` 업데이트 로직, 에러 로깅(`toss_api_logs`) 구현
    * **Supabase Admin Client** 사용 설정 확인
* **프론트엔드:**
    * **통합 예약 신청 UI 개발:** 날짜/시간 선택(가능 시간 조회 로직 필요), 반려견 선택, 목표/장소/메모 입력 UI 및 `bookings` 테이블 저장 로직 연동 (초기 상태 `payment_pending`)
    * **결제 버튼 로직:** `create-payment` 호출 -> `payToken` 받아 `checkoutPayment()` SDK 호출 -> 성공 시 `execute-payment` 호출 및 결과 처리 UI 구현

---

### **Week 6: Phase 4 - 내 활동 (예약/리뷰 관리)**

* **백엔드:**
    * **`update_trainer_rating` DB 트리거** 기능 검증/테스트
    * **(Optional) 예약 취소/환불 로직** (RPC/Edge Function) 개발 시작
    * **(Optional) 알림 생성 로직** (DB 트리거/Edge Function) 개발 시작 ✨
* **프론트엔드:**
    * **내 예약 목록/상세 UI:** `bookings` 조회 및 상태별 UI/액션 버튼 구현
    * **리뷰 작성/조회 UI:** 리뷰 폼(`reviews` 저장) 구현, **훈련사 답글(`trainer_reply`)** 표시 UI 구현 ✨
    * **훈련 내용 확인 UI:** `training_session_logs` 공유 필드 표시 ✨
    * **Empty State UI** 구현 (예약, 리뷰)

---

### **Week 7: Phase 5 & 6 - 설정 & (Optional) 훈련 콘텐츠**

* **백엔드:**
    * **설정 관련 CRUD 지원:** RLS 정책 확인 및 필요시 관리용 RPC/Edge Function 개발 (자격증 검증 로직 등)
    * **(Optional) `recommend_routines` RPC 함수** 개발 (훈련 루틴 추천 로직)
    * **(Optional) 루틴 리뷰/훈련 기록 CRUD** RLS 정책 확인 ✨
* **프론트엔드:**
    * **사용자 설정 UI:** 프로필(`users`), 반려견(`dog_profiles`), 선호도(`user_preferences`) 관리 UI 개발
    * **훈련사 설정 UI (훈련사 계정):** 프로필(`trainers`, `awards`✨ 등), 시간(`availability`, `exceptions`), 지역(`service_areas`), 자격증(`certifications`) 관리 UI 개발. (Optional) 훈련 로그(`training_session_logs`✨) 입력 UI 개발
    * **(Optional) 훈련 콘텐츠 UI:** 루틴 목록/상세 UI, (Optional) 루틴 리뷰/훈련 기록 UI 개발 ✨

---

### **Weeks 8-9: Phase 7 - 통합 테스트 & 품질 보증** ⭐

* **백엔드 & 프론트엔드:**
    * **테스트 환경 구축:** Jest, Mock 서버, CI/CD 파이프라인 준비
    * **Unit/Integration Test:** 백엔드 함수(RPC/Edge Function) 및 프론트엔드 컴포넌트/플로우 테스트 코드 작성 및 실행
    * **E2E Test:** Detox 설정 및 주요 시나리오 자동화 테스트 구현/실행
    * **수동 테스트:** 실제 디바이스 테스트 (iOS/Android)
    * **성능/보안/가이드라인 검증:** 로딩 속도, 메모리 누수, `.ait` 번들 크기, API 보안, 토스 가이드라인 준수 최종 검토
    * **DB 성능 튜닝:** 느린 쿼리 최적화, 인덱스 점검

---

### **Weeks 10-11: Phase 8 - 베타 테스팅** ⭐

* **백엔드 & 프론트엔드:**
    * **베타 빌드 배포:** 테스터 대상 QR 코드 배포 및 가이드 제공
    * **모니터링 & 피드백 수집:** Sentry, Supabase 로그, 사용자 피드백(설문 등) 취합
    * **핫픽스 & 개선:** 수집된 피드백 기반 Critical/Major 버그 수정 및 개선 사항 반영 (프론트/백엔드 모두)

---

### **Week 12: Phase 9 - 최종 빌드 & 검수 요청**

* **백엔드 & 프론트엔드:**
    * **최종 QA 및 코드 동결**
    * **프론트엔드:** 최종 `.ait` 번들 생성 (`npm run build`)
    * **백엔드:** 운영 환경 Supabase 프로젝트 설정 (Secrets 등), 최종 코드 배포, 백업/모니터링 설정 확인
    * **토스 콘솔:** '앱 내 기능'(피처) 등록 및 '검토 요청하기' 제출
    * **(이후)** 검수 피드백 대응

---

⭐ = 핵심 MVP 기능 관련 중요 단계
✨ = 최종 스키마(v3.9) 신규 테이블/필드 관련 구현 내용