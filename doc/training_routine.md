-- ⭐ Step 1: 훈련 루틴 10개 삽입 (Dollar-Quoting 수정) ⭐

-- 1. 앉아 훈련
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '앉아 훈련',
  'Sit Training',
  '강아지에게 간식을 이용해 앉는 자세를 가르칩니다. 명령어와 손 신호를 함께 사용합니다.',
  'Teach your dog to sit using treats. Uses verbal cues and hand signals.',
  'obedience',
  'beginner',
  10,
  ARRAY['간식', '클리커(선택)']::TEXT[],
  $$[{"step": 1, "title": "준비하기", "desc": "강아지가 좋아하는 간식을 준비하고, 조용하고 산만하지 않은 공간에서 시작하세요.", "duration_sec": 30, "video_url": null}, {"step": 2, "title": "간식으로 유도하기", "desc": "간식을 강아지 코 앞에서 시작해 천천히 머리 위쪽으로 이동시키세요. 강아지가 간식을 따라 고개를 들면 자연스럽게 엉덩이가 바닥으로 내려갑니다.", "duration_sec": 60, "video_url": null}, {"step": 3, "title": "명령어와 손 신호 추가", "desc": "강아지가 앉는 순간 '앉아'라고 명령하고, 손바닥을 위로 향하는 손 신호를 보여주세요.", "duration_sec": 30, "video_url": null}, {"step": 4, "title": "보상 및 칭찬", "desc": "앉으면 즉시 간식을 주고 '잘했어!' 라고 칭찬하세요. 타이밍이 매우 중요합니다.", "duration_sec": 10, "video_url": null}, {"step": 5, "title": "반복 연습", "desc": "하루 2-3회, 회당 5분씩 10-15회 반복하세요. 강아지가 손짓 없이도 명령어만으로 앉을 수 있을 때까지 연습합니다.", "duration_sec": 300, "video_url": null}]$$::jsonb,
  5,
  10,
  2,
  999,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 2. 배변 훈련
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '배변 훈련',
  'Potty Training',
  '강아지가 정해진 장소에 배변하도록 일정을 만들고 보상하는 훈련입니다.',
  'A routine to train your puppy to eliminate in a designated spot using a schedule and rewards.',
  'puppy',
  'beginner',
  20,
  ARRAY['배변 패드(선택)', '클리너', '효소 제거제']::TEXT[],
  $$[{"step": 1, "title": "배변 일정 만들기", "desc": "아침 기상 직후, 식사 후 15-30분, 낮잠 후, 놀이 후, 잠들기 전에 반드시 배변 장소로 데려가세요. 생후 개월 수 + 1시간이 최대 참을 수 있는 시간입니다 (예: 3개월 = 4시간).", "duration_sec": 120, "video_url": null}, {"step": 2, "title": "배변 장소 지정", "desc": "매번 동일한 야외 장소 또는 배변 패드로 데려가세요. 냄새가 남아있으면 강아지가 그곳이 배변 장소임을 인식합니다.", "duration_sec": 60, "video_url": null}, {"step": 3, "title": "명령어 사용", "desc": "배변 장소에 도착하면 '쉬해' 또는 '응가' 같은 일관된 명령어를 사용하세요.", "duration_sec": 30, "video_url": null}, {"step": 4, "title": "즉시 보상", "desc": "배변을 성공하면 즉시 (3초 이내) 칭찬과 간식으로 보상하세요. 배변 후 실내로 바로 들어오면 '배변=놀이 끝'으로 인식할 수 있으니 잠시 산책을 더 하세요.", "duration_sec": 30, "video_url": null}, {"step": 5, "title": "실수 처리법", "desc": "실내에서 실수했을 때는 절대 처벌하지 말고, 조용히 효소 제거제로 청소하세요. 실수하는 순간을 목격했다면 부드럽게 중단시키고 배변 장소로 데려가세요.", "duration_sec": 180, "video_url": null}, {"step": 6, "title": "완료 시기", "desc": "대부분의 강아지는 생후 4-6개월이면 배변 훈련이 대부분 완료되며, 9개월이면 완벽하게 숙지합니다.", "duration_sec": 30, "video_url": null}]$$::jsonb,
  10,
  5,
  2,
  8,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 3. 이리와 훈련 (리콜)
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '이리와 훈련 (리콜)',
  'Come/Recall Training',
  '강아지가 이름을 부르고 "이리와"라고 명령했을 때 즉시 돌아오도록 가르칩니다.',
  'Teaches your dog to return to you immediately when called.',
  'obedience',
  'intermediate',
  15,
  ARRAY['긴 줄 (5m 이상)', '고가 간식', '클리커(선택)']::TEXT[],
  $$[{"step": 1, "title": "실내에서 시작", "desc": "산만하지 않은 실내에서 강아지와 1-2m 거리를 두고 앉아 있으세요.", "duration_sec": 30, "video_url": null}, {"step": 2, "title": "'이리와' 명령", "desc": "밝고 즐거운 목소리로 강아지 이름을 부른 후 '이리와!' 또는 'Come!' 이라고 말하세요. 동시에 손을 가슴 쪽으로 가져오는 손 신호를 보냅니다.", "duration_sec": 10, "video_url": null}, {"step": 3, "title": "유혹하기", "desc": "강아지가 망설인다면 몸을 낮추거나 뒤로 물러나며 흥미를 유발하세요. 절대 줄을 당기지 마세요.", "duration_sec": 30, "video_url": null}, {"step": 4, "title": "즉시 보상", "desc": "강아지가 당신에게 도착하면 즉시 고가 간식(삶은 닭가슴살 등)과 과도한 칭찬을 주세요. '이리와' = 최고의 보상이라는 인식을 심어줍니다.", "duration_sec": 20, "video_url": null}, {"step": 5, "title": "거리 늘리기", "desc": "실내에서 성공하면 실외로 이동해 긴 줄을 사용해 거리를 점차 늘립니다 (5m → 10m → 20m).", "duration_sec": 300, "video_url": null}, {"step": 6, "title": "산만함 추가", "desc": "다른 사람, 다른 개, 소음 등 산만한 요소를 점차 추가하며 연습하세요. 완벽하게 숙지하기 전까지는 절대 목줄을 풀지 마세요.", "duration_sec": 240, "video_url": null}]$$::jsonb,
  10,
  15,
  3,
  999,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 4. 분리불안 완화 훈련
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '분리불안 완화 훈련',
  'Separation Anxiety Training',
  '보호자가 외출 신호를 둔감화하고, 점진적으로 혼자 있는 시간을 늘려 불안을 줄입니다.',
  'Desensitizes departure cues and gradually increases time alone to reduce anxiety.',
  'behavior',
  'advanced',
  20,
  ARRAY['퍼즐 장난감', '간식', '카메라']::TEXT[],
  $$[{"step": 1, "title": "베이스라인 측정", "desc": "강아지 카메라를 설치하고, 강아지가 스트레스 징후(문 응시, 하품, 헐떡임, 짖기)를 보이기 전까지 몇 초/분 동안 혼자 있을 수 있는지 측정하세요.", "duration_sec": 180, "video_url": null}, {"step": 2, "title": "출발 신호 둔감화", "desc": "열쇠 집기, 신발 신기, 가방 들기 등 외출 신호 동작을 무작위로 집 안에서 반복하되 나가지 않습니다. 이 동작 후 간식을 주어 긍정적 연관을 만드세요.", "duration_sec": 300, "video_url": null}, {"step": 3, "title": "초단기 부재 훈련", "desc": "베이스라인보다 짧은 시간(예: 베이스라인 10초면 5초)만 강아지를 혼자 두고 돌아오세요. 스트레스 징후가 없으면 칭찬하고, 있으면 시간을 더 줄입니다.", "duration_sec": 240, "video_url": null}, {"step": 4, "title": "점진적 시간 증가", "desc": "강아지가 침착하면 1-2초씩 시간을 늘립니다. 5초 → 10초 → 30초 → 1분 → 5분 순으로 매우 천천히 진행하세요. 서두르면 역효과입니다.", "duration_sec": 600, "video_url": null}, {"step": 5, "title": "퍼즐 장난감 활용", "desc": "나가기 직전 간식이 든 퍼즐 장난감(Kong 등)을 주어 '혼자 있기 = 좋은 일'이라는 연관을 만드세요.", "duration_sec": 120, "video_url": null}, {"step": 6, "title": "전문가 상담", "desc": "2주 이상 연습해도 개선이 없다면 수의사 또는 CSAT (Certified Separation Anxiety Trainer) 상담을 받으세요. 약물 치료가 필요할 수 있습니다.", "duration_sec": 60, "video_url": null}]$$::jsonb,
  15,
  3,
  4,
  999,
  ARRAY['심한 분리불안']::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 5. 하우스 훈련 (크레이트)
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '하우스 훈련 (크레이트)',
  'Crate Training',
  '크레이트를 긍정적인 공간으로 인식시키고, "하우스" 명령어로 들어가도록 유도합니다.',
  'Positively associates the crate and teaches a "Crate" or "House" command.',
  'puppy',
  'beginner',
  15,
  ARRAY['크레이트', '담요', '장난감', '간식']::TEXT[],
  $$[{"step": 1, "title": "크레이트와 친해지기", "desc": "크레이트 문을 열어두고 내부에 부드러운 담요와 좋아하는 장난감을 놓으세요. 강아지가 자발적으로 들어가도록 며칠간 유도합니다.", "duration_sec": 180, "video_url": null}, {"step": 2, "title": "간식으로 유도", "desc": "간식을 크레이트 입구 → 중간 → 안쪽 끝까지 던져 강아지가 따라 들어가게 하세요. 들어가면 칭찬하세요.", "duration_sec": 120, "video_url": null}, {"step": 3, "title": "문 닫기 연습", "desc": "강아지가 크레이트 안에서 간식을 먹는 동안 문을 5초간 닫았다가 열어주세요. 점차 시간을 늘립니다 (10초 → 30초 → 1분).", "duration_sec": 300, "video_url": null}, {"step": 4, "title": "'하우스' 명령어 추가", "desc": "강아지가 크레이트에 들어갈 때 '하우스' 또는 'Crate' 명령어를 일관되게 사용하세요.", "duration_sec": 60, "video_url": null}, {"step": 5, "title": "점진적 시간 연장", "desc": "크레이트에서 조용히 있는 시간을 점차 늘립니다. 처음에는 당신이 방에 있고, 나중에는 방을 나갑니다. 절대 짖거나 긁을 때 문을 열지 마세요 (보상으로 인식).", "duration_sec": 600, "video_url": null}]$$::jsonb,
  10,
  5,
  2,
  999,
  ARRAY['심한 분리불안']::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 6. 과도한 짖음 줄이기
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '과도한 짖음 줄이기',
  'Stop Excessive Barking',
  '짖음 유발 요인을 관리하고, "짖어"와 "조용히" 명령어를 가르쳐 짖음을 통제합니다.',
  'Manages triggers and teaches "Speak" and "Quiet" commands to control barking.',
  'behavior',
  'intermediate',
  15,
  ARRAY['간식', '클리커', '화이트 노이즈 기계(선택)']::TEXT[],
  $$[{"step": 1, "title": "짖음 유발 요인 파악", "desc": "강아지가 언제, 무엇 때문에 짖는지 기록하세요 (도어벨, 창밖 보행자, 지루함, 관심 요구 등).", "duration_sec": 180, "video_url": null}, {"step": 2, "title": "환경 관리", "desc": "짖음 유발 요인을 제거하거나 줄이세요. 예: 창문에 프라이버시 필름 부착, 화이트 노이즈로 외부 소음 차단.", "duration_sec": 120, "video_url": null}, {"step": 3, "title": "'짖어' 명령 먼저 가르치기", "desc": "역설적이지만, '짖어' 명령을 먼저 가르치면 '조용히' 명령이 더 효과적입니다. 강아지가 자발적으로 짖을 때 '짖어!'라고 말하고 보상하세요.", "duration_sec": 300, "video_url": null}, {"step": 4, "title": "'조용히' 명령 도입", "desc": "강아지가 2-3번 짖으면 침착한 목소리로 '조용히' 또는 'Quiet'이라고 말하세요. 3초간 조용하면 즉시 보상합니다.", "duration_sec": 240, "video_url": null}, {"step": 5, "title": "조용한 시간 늘리기", "desc": "점차 조용히 있어야 하는 시간을 늘립니다 (3초 → 5초 → 10초 → 30초). 너무 빨리 진행하지 마세요.", "duration_sec": 300, "video_url": null}, {"step": 6, "title": "대체 행동 훈련", "desc": "짖는 대신 '자리로 가기' 또는 '장난감 가져오기' 같은 대체 행동을 가르치세요. 예: 도어벨이 울리면 자리로 가서 간식을 받는 연습.", "duration_sec": 360, "video_url": null}]$$::jsonb,
  10,
  10,
  3,
  999,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 7. 산책 줄 당기지 않기
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '산책 줄 당기지 않기',
  'Loose Leash Walking',
  '강아지가 줄을 당기면 멈추거나 방향을 전환하여, 줄이 느슨할 때 걷는 것을 보상합니다.',
  'Uses the "Stop" or "Turn" method to reward walking on a loose leash.',
  'behavior',
  'intermediate',
  20,
  ARRAY['하네스 또는 목줄', '줄 (1.5-2m)', '간식 파우치']::TEXT[],
  $$[{"step": 1, "title": "실내에서 시작", "desc": "줄을 연결하고 집 안에서 걸으며 강아지가 당신 옆에 있으면 간식을 주세요. 줄이 느슨한 상태를 보상합니다.", "duration_sec": 180, "video_url": null}, {"step": 2, "title": "'정지' 전략", "desc": "강아지가 줄을 당기면 즉시 멈춰 서세요. 나무처럼 가만히 있다가, 강아지가 뒤돌아보거나 줄이 느슨해지면 다시 걷기 시작합니다.", "duration_sec": 300, "video_url": null}, {"step": 3, "title": "방향 전환", "desc": "강아지가 계속 당기면 방향을 180도 바꿔 반대로 걸으세요. 강아지가 당신을 따라오면 보상합니다.", "duration_sec": 240, "video_url": null}, {"step": 4, "title": "보상 빈도 높이기", "desc": "초기에는 3-5보마다 간식을 주어 옆에 있는 것이 좋다는 것을 가르치세요. 숙달되면 간격을 늘립니다.", "duration_sec": 360, "video_url": null}, {"step": 5, "title": "실외 연습", "desc": "조용한 거리에서 시작해 점차 산만한 환경(공원, 번화가)으로 확장하세요. 산만함이 많을수록 보상을 더 자주 주세요.", "duration_sec": 600, "video_url": null}]$$::jsonb,
  15,
  1,
  4,
  999,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 8. 기다려 훈련
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '기다려 훈련',
  'Stay Training',
  '앉거나 엎드린 자세에서 보호자가 멀어지거나 시야에서 사라져도 자세를 유지하도록 가르칩니다.',
  'Teaches the dog to hold a position (sit/down) while the handler increases distance and duration.',
  'obedience',
  'intermediate',
  15,
  ARRAY['간식', '짧은 줄', '긴 줄']::TEXT[],
  $$[{"step": 1, "title": "'앉아' 또는 '엎드려' 먼저", "desc": "강아지를 앉거나 엎드린 자세로 만드세요. 'Stay'는 이 자세들의 연장선입니다.", "duration_sec": 30, "video_url": null}, {"step": 2, "title": "'기다려' 명령과 손 신호", "desc": "'기다려' 또는 'Stay'라고 말하며 손바닥을 강아지 얼굴 앞에 보여주세요 (정지 신호).", "duration_sec": 10, "video_url": null}, {"step": 3, "title": "짧은 거리부터", "desc": "한 발짝 뒤로 물러나세요. 강아지가 자세를 유지하면 즉시 돌아가 보상하세요. 일어나면 다시 '앉아'부터 시작합니다.", "duration_sec": 120, "video_url": null}, {"step": 4, "title": "거리와 시간 늘리기", "desc": "점차 거리(2보 → 5보 → 10보)와 시간(3초 → 10초 → 30초)을 늘립니다. 한 번에 하나씩만 늘리세요 (거리 OR 시간).", "duration_sec": 420, "video_url": null}, {"step": 5, "title": "시야에서 사라지기", "desc": "강아지가 30초 이상 기다릴 수 있으면, 방문이나 장애물 뒤로 숨어 시야에서 사라지는 연습을 하세요.", "duration_sec": 300, "video_url": null}, {"step": 6, "title": "해제 명령", "desc": "항상 '좋아', 'OK', '잘했어' 같은 해제 명령으로 마무리하세요. 이것이 없으면 강아지가 언제 일어나도 되는지 모릅니다.", "duration_sec": 30, "video_url": null}]$$::jsonb,
  10,
  15,
  3,
  999,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 9. 물지 않기 훈련 (입 억제)
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '물지 않기 훈련 (입 억제)',
  'Bite Inhibition Training',
  '놀이 중 손을 물었을 때 "아야!"라고 말하고 놀이를 중단하여, 무는 강도를 조절하고 멈추게 합니다.',
  'Teaches the puppy to control bite pressure by stopping play when they bite too hard.',
  'puppy',
  'beginner',
  10,
  ARRAY['씹는 장난감', '간식']::TEXT[],
  $$[{"step": 1, "title": "놀이 중 물림 감지", "desc": "강아지가 놀이 중 당신의 손을 물면, 즉시 '아야!' 또는 'Ouch!'라고 큰 소리로 말하고 놀이를 중단하세요.", "duration_sec": 10, "video_url": null}, {"step": 2, "title": "놀이 멈추기", "desc": "손을 등 뒤로 숨기고 몸을 돌려 강아지를 무시하세요. 10-20초간 아무 반응도 하지 않습니다.", "duration_sec": 20, "video_url": null}, {"step": 3, "title": "대체 장난감 제공", "desc": "강아지가 진정하면 씹을 수 있는 적절한 장난감을 주고 '이걸 물어'라고 말하세요. 장난감을 물면 칭찬합니다.", "duration_sec": 60, "video_url": null}, {"step": 4, "title": "반복 및 일관성", "desc": "물 때마다 매번 동일하게 반응하세요. 가족 모두가 같은 방식으로 대응해야 효과적입니다.", "duration_sec": 300, "video_url": null}, {"step": 5, "title": "점차 민감도 높이기", "desc": "처음에는 강하게 물 때만 반응하고, 점차 약한 입질에도 반응하여 완전히 물지 않게 만듭니다.", "duration_sec": 180, "video_url": null}]$$::jsonb,
  5,
  5,
  2,
  6,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- 10. 사회화 훈련
INSERT INTO public.training_routines
(title_ko, title_en, description_ko, description_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions, thumbnail_url)
VALUES
(
  '사회화 훈련',
  'Socialization Training',
  '생후 8-16주 황금기에 다양한 사람, 소리, 환경에 긍정적으로 노출시킵니다.',
  'Positively exposes the puppy to various people, sounds, and environments during the critical 8-16 week period.',
  'puppy',
  'beginner',
  30,
  ARRAY['간식', '장난감', '다양한 환경']::TEXT[],
  $$[{"step": 1, "title": "골든 타임 이해", "desc": "생후 8-16주가 사회화의 황금기입니다. 이 시기에 다양한 경험을 긍정적으로 쌓는 것이 평생의 행동에 영향을 미칩니다.", "duration_sec": 60, "video_url": null}, {"step": 2, "title": "다양한 사람 만나기", "desc": "모자 쓴 사람, 안경 낀 사람, 어린이, 노인 등 다양한 외모와 연령대의 사람을 만나게 하세요. 만날 때마다 간식을 주어 긍정적 연관을 만듭니다.", "duration_sec": 600, "video_url": null}, {"step": 3, "title": "다른 개와 만남", "desc": "백신 접종이 완료된 온순한 성견이나 같은 나이 또래의 강아지와 짧게(10-15분) 놀게 하세요. 공격적이거나 너무 거친 개는 피하세요.", "duration_sec": 900, "video_url": null}, {"step": 4, "title": "다양한 환경 노출", "desc": "카페, 공원, 차 안, 엘리베이터, 계단, 다양한 바닥 재질(타일, 나무, 카펫) 등에 노출시키세요. 강아지가 불안해하면 억지로 강요하지 말고 거리를 두고 간식으로 유도하세요.", "duration_sec": 1200, "video_url": null}, {"step": 5, "title": "소리와 사물 노출", "desc": "진공청소기, 드라이기, 자동차 소리, 우산, 쇼핑카트 등 일상적인 소리와 사물에 익숙하게 하세요. 낮은 볼륨부터 시작해 점차 높입니다.", "duration_sec": 600, "video_url": null}]$$::jsonb,
  20,
  1,
  2,
  4,
  ARRAY[]::TEXT[],
  NULL
)
ON CONFLICT (title_ko) DO NOTHING;

-- ⭐ Step 2: 추가 훈련 루틴 20개 삽입 (Dollar-Quoting 수정) ⭐
-- (Supabase SQL Editor에서 실행하세요)

-- 11. 엎드려 훈련
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '엎드려 훈련',
  'Down Training',
  'obedience',
  'beginner',
  10,
  ARRAY['간식']::TEXT[],
  $$[{"step": 1, "title": "앉아 자세부터 시작", "desc": "강아지를 먼저 '앉아' 자세로 만드세요. 엎드려는 앉아 자세에서 시작하는 것이 가장 쉽습니다.", "duration_sec": 10}, {"step": 2, "title": "간식을 바닥으로 내리기", "desc": "간식을 강아지 코 앞에서 천천히 바닥으로 내리세요. 강아지가 간식을 따라 몸을 낮추게 됩니다.", "duration_sec": 60}, {"step": 3, "title": "L자 모양 유도", "desc": "간식을 바닥에 댄 상태에서 강아지 앞으로 살짝 밀어주세요. 이렇게 하면 강아지가 자연스럽게 완전히 엎드리게 됩니다.", "duration_sec": 60}, {"step": 4, "title": "명령어 추가", "desc": "강아지가 완전히 엎드린 순간 '엎드려' 또는 'Down'이라고 말하고 즉시 보상하세요.", "duration_sec": 30}, {"step": 5, "title": "반복 연습", "desc": "하루 2-3회 10-15회 반복하세요. 점차 간식 유도 없이 명령어와 손 신호(손바닥을 아래로)만으로 할 수 있게 연습합니다.", "duration_sec": 300}]$$::jsonb,
  5,
  10,
  3,
  999,
  ARRAY['관절염', '고관절 이형성증']::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 12. 그만 훈련 (물건 놔두기)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '그만 훈련 (물건 놔두기)',
  'Leave It Training',
  'obedience',
  'intermediate',
  15,
  ARRAY['간식 2종류', '장난감']::TEXT[],
  $$[{"step": 1, "title": "손 안의 간식", "desc": "한 손에 간식을 쥐고 주먹을 쥔 채 강아지 코 앞에 제시하세요. 강아지가 냄새를 맡거나 핥으려 해도 무시합니다.", "duration_sec": 60}, {"step": 2, "title": "회피 행동 보상", "desc": "강아지가 손에서 코를 떼거나, 뒤로 물러나거나, 고개를 돌리면 즉시 '그만!'이라고 말하고 다른 손의 더 좋은 간식으로 보상하세요.", "duration_sec": 120}, {"step": 3, "title": "바닥의 간식", "desc": "간식을 바닥에 놓고 손으로 덮으세요. 강아지가 회피 행동을 보일 때까지 기다렸다가 보상합니다.", "duration_sec": 180}, {"step": 4, "title": "손 제거", "desc": "간식을 바닥에 놓고 손을 떼세요. 강아지가 간식을 향해 움직이면 다시 덮고, 참으면 보상합니다.", "duration_sec": 240}, {"step": 5, "title": "실생활 적용", "desc": "산책 중 떨어진 음식, 쓰레기 등에 '그만!' 명령을 사용해 연습하세요. 안전한 환경에서 시작해 점차 난이도를 높입니다.", "duration_sec": 300}]$$::jsonb,
  10,
  15,
  3,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 13. 자리 가기 훈련
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '자리 가기 훈련',
  'Place/Go to Bed Training',
  'obedience',
  'intermediate',
  20,
  ARRAY['매트 또는 침대', '간식', '줄']::TEXT[],
  $$[{"step": 1, "title": "해제 명령어 먼저 가르치기", "desc": "먼저 '자유' 또는 'Free' 같은 해제 명령어를 가르치세요. 이것이 없으면 강아지가 언제까지 자리에 있어야 하는지 모릅니다.", "duration_sec": 180}, {"step": 2, "title": "자리로 유도", "desc": "'자리' 또는 'Place'라고 말하며 강아지를 매트나 침대로 유도하세요. 네 발이 모두 경계 안에 들어가면 즉시 보상합니다.", "duration_sec": 120}, {"step": 3, "title": "엎드려 추가", "desc": "자리에서 '엎드려' 명령을 추가하세요. 자리에서 편안하게 누워있는 것이 최종 목표입니다.", "duration_sec": 180}, {"step": 4, "title": "시간 연장", "desc": "몇 초부터 시작해 점차 1분, 5분, 10분, 30분으로 시간을 늘립니다. 강아지가 자리에서 편안하게 쉴 수 있게 연습하세요.", "duration_sec": 600}, {"step": 5, "title": "산만함 추가", "desc": "도어벨 울리기, 사람 왕래, 다른 개 등 산만한 요소를 점차 추가하며 연습합니다.", "duration_sec": 480}, {"step": 6, "title": "거리에서 보내기", "desc": "강아지와 거리를 두고 '자리'라고 명령해 스스로 매트로 가게 연습하세요.", "duration_sec": 240}]$$::jsonb,
  15,
  10,
  4,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 14. 힐 워킹 (옆에서 걷기)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '힐 워킹 (옆에서 걷기)',
  'Heel Walking',
  'obedience',
  'advanced',
  20,
  ARRAY['줄', '간식 파우치', '클리커(선택)']::TEXT[],
  $$[{"step": 1, "title": "위치 정하기", "desc": "강아지를 왼쪽 다리 옆에 세우세요. 강아지 어깨가 당신 다리와 평행하도록 합니다. 전통적으로 heel은 왼쪽입니다.", "duration_sec": 60}, {"step": 2, "title": "실내에서 시작", "desc": "간식을 왼손에 쥐고 가슴 높이에 유지하세요. 강아지 이름을 부르고 '힐'이라고 말하며 걷기 시작합니다.", "duration_sec": 120}, {"step": 3, "title": "3-5보마다 보상", "desc": "초기에는 3-5보마다 강아지가 올바른 위치에 있으면 간식으로 보상하세요. 강아지 옆 손으로 주어 앞으로 나오는 것을 방지합니다.", "duration_sec": 300}, {"step": 4, "title": "아이 컨택 추가", "desc": "강아지가 당신을 쳐다보며 걷도록 '봐' 또는 'Watch Me' 명령을 추가하세요. 이것이 완벽한 힐의 핵심입니다.", "duration_sec": 240}, {"step": 5, "title": "방향 전환 연습", "desc": "좌회전, 우회전, 뒤로 돌기 등 다양한 방향 전환을 연습하세요. 강아지가 당신의 움직임에 집중하게 됩니다.", "duration_sec": 360}, {"step": 6, "title": "느슨한 줄 유지", "desc": "절대 줄을 팽팽하게 당기지 마세요. 느슨한 줄은 강아지가 당신의 신호(몸짓, 음성)에 집중하게 만듭니다.", "duration_sec": 180}]$$::jsonb,
  15,
  1,
  5,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 15. 아이 컨택 (나 봐)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '아이 컨택 (나 봐)',
  'Eye Contact / Watch Me',
  'obedience',
  'beginner',
  10,
  ARRAY['간식']::TEXT[],
  $$[{"step": 1, "title": "간식을 얼굴 앞에", "desc": "간식을 당신의 눈 높이로 가져가세요. 강아지가 자연스럽게 당신 얼굴을 쳐다보게 됩니다.", "duration_sec": 30}, {"step": 2, "title": "즉시 보상", "desc": "강아지가 당신 눈을 쳐다보는 순간 즉시 '봐!' 또는 'Watch Me!'라고 말하고 간식을 주세요.", "duration_sec": 60}, {"step": 3, "title": "시간 연장", "desc": "점차 아이 컨택을 유지하는 시간을 늘립니다 (1초 → 3초 → 5초 → 10초). 간식 주기 전 시간을 점차 늘리세요.", "duration_sec": 300}, {"step": 4, "title": "간식 없이 연습", "desc": "간식을 손에 들지 않고 '봐!'라고 명령하세요. 강아지가 아이 컨택을 하면 주머니에서 간식을 꺼내 보상합니다.", "duration_sec": 180}, {"step": 5, "title": "산만한 환경에서 연습", "desc": "다른 사람, 다른 개, 소음이 있는 환경에서 연습해 어떤 상황에서도 당신에게 집중하게 만드세요.", "duration_sec": 240}]$$::jsonb,
  5,
  15,
  2,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 16. 이름 인식 훈련
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '이름 인식 훈련',
  'Name Recognition Training',
  'puppy',
  'beginner',
  5,
  ARRAY['간식']::TEXT[],
  $$[{"step": 1, "title": "이름과 간식 연결", "desc": "강아지 이름을 부르고 즉시 입에 간식을 넣어주세요. 이름 = 좋은 일이라는 연관을 만듭니다. 10회 반복하세요.", "duration_sec": 60}, {"step": 2, "title": "자연스러운 환경에서", "desc": "강아지가 방을 돌아다니게 한 후 이름을 한 번만 부르세요. 쳐다보면 '예스!'라고 말하고 간식을 주세요.", "duration_sec": 180}, {"step": 3, "title": "다양한 톤으로 연습", "desc": "행복한 목소리, 조용한 목소리, 속삭이는 목소리 등 다양한 톤으로 연습하세요. 모든 가족 구성원이 연습해야 합니다.", "duration_sec": 120}, {"step": 4, "title": "절대 하지 말아야 할 것", "desc": "이름을 처벌과 연결하지 마세요. '안 돼, 바둑아!'가 아니라 '안 돼'만 사용하세요. 싫어하는 일(목욕, 크레이트)을 할 때 이름을 부르지 마세요.", "duration_sec": 30}]$$::jsonb,
  3,
  10,
  2,
  4,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 17. 그루밍 적응 훈련
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '그루밍 적응 훈련 (터치 연습)',
  'Grooming Acceptance Training',
  'puppy',
  'beginner',
  10,
  ARRAY['간식', '빗', '칫솔']::TEXT[],
  $$[{"step": 1, "title": "발 만지기", "desc": "강아지 발을 부드럽게 만지고 즉시 간식을 주세요. 발가락 사이도 천천히 만져봅니다. 발톱 깎기 준비입니다.", "duration_sec": 120}, {"step": 2, "title": "귀와 입 만지기", "desc": "귀를 들어올리고, 입술을 들어 이를 확인하는 연습을 하세요. 매번 보상합니다. 수의사 검진 준비입니다.", "duration_sec": 120}, {"step": 3, "title": "빗질 연습", "desc": "빗을 보여주고 냄새 맡게 한 후, 몸을 한 번 쓸어내리고 간식을 주세요. 점차 빗질 시간을 늘립니다.", "duration_sec": 180}, {"step": 4, "title": "칫솔 익히기", "desc": "강아지용 칫솔에 맛있는 페이스트를 묻혀 핥게 하세요. 점차 앞니, 송곳니, 어금니를 부드럽게 닦는 연습을 합니다.", "duration_sec": 180}, {"step": 5, "title": "목욕 준비", "desc": "빈 욕조나 세면대에 강아지를 세우고 간식을 주세요. 물 없이 연습한 후 점차 미지근한 물로 발만 적시는 연습을 합니다.", "duration_sec": 180}]$$::jsonb,
  5,
  1,
  2,
  6,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 18. 사람에게 점프하지 않기
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '사람에게 점프하지 않기',
  'Stop Jumping on People',
  'behavior',
  'intermediate',
  15,
  ARRAY['간식', '도우미']::TEXT[],
  $$[{"step": 1, "title": "점프의 이유 이해", "desc": "강아지는 흥분과 관심을 끌기 위해 점프합니다. 점프할 때 어떤 반응(소리, 밀기, 시선)도 주지 않는 것이 핵심입니다.", "duration_sec": 60}, {"step": 2, "title": "무시 전략", "desc": "강아지가 점프하면 팔짱을 끼고 몸을 180도 돌려 완전히 무시하세요. 네 발이 모두 바닥에 닿으면 즉시 돌아서서 칭찬하고 보상합니다.", "duration_sec": 240}, {"step": 3, "title": "앉아로 대체", "desc": "사람을 만날 때 '앉아' 명령을 먼저 주세요. 앉아있는 동안 인사하고, 일어나면 다시 무시합니다.", "duration_sec": 300}, {"step": 4, "title": "도우미와 연습", "desc": "친구에게 문 앞에서 들어오는 연습을 부탁하세요. 강아지가 점프하면 친구는 돌아서 나갑니다. 네 발이 바닥에 있으면 들어와 인사합니다.", "duration_sec": 420}, {"step": 5, "title": "일관성", "desc": "모든 가족 구성원과 방문객이 같은 규칙을 따라야 합니다. 한 사람이라도 점프를 허용하면 훈련이 무너집니다.", "duration_sec": 60}]$$::jsonb,
  10,
  15,
  3,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 19. 다른 개에게 침착하게 반응하기
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '다른 개에게 침착하게 반응하기',
  'Calm Around Other Dogs',
  'behavior',
  'intermediate',
  20,
  ARRAY['간식', '긴 줄', '도우미와 개']::TEXT[],
  $$[{"step": 1, "title": "역치 거리 찾기", "desc": "다른 개를 보고도 침착할 수 있는 최소 거리(예: 20m)를 찾으세요. 이보다 가까우면 짖거나 당긴다면 그것이 역치입니다.", "duration_sec": 180}, {"step": 2, "title": "역치 거리에서 보상", "desc": "역치 거리에서 다른 개가 보이면 즉시 고가 간식을 주세요. 다른 개 = 최고의 간식이라는 연관을 만듭니다.", "duration_sec": 300}, {"step": 3, "title": "'봐' 명령 사용", "desc": "다른 개가 보이면 '봐'라고 명령해 당신에게 집중하게 하세요. 아이 컨택을 하면 보상합니다.", "duration_sec": 240}, {"step": 4, "title": "점진적으로 거리 좁히기", "desc": "몇 주에 걸쳐 역치 거리를 조금씩 줄입니다 (20m → 15m → 10m → 5m). 서두르면 역효과입니다.", "duration_sec": 600}, {"step": 5, "title": "통제된 만남", "desc": "온순한 개와 긴 줄을 사용해 통제된 만남을 가지세요. 침착하면 보상하고, 흥분하면 거리를 벌립니다.", "duration_sec": 480}]$$::jsonb,
  15,
  3,
  4,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 20. 도어벨 반응 줄이기 (둔감화)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '도어벨 반응 줄이기 (둔감화)',
  'Doorbell Desensitization',
  'behavior',
  'intermediate',
  15,
  ARRAY['간식', '매트', '도어벨 녹음(앱)', '도우미']::TEXT[],
  $$[{"step": 1, "title": "둔감화 시작", "desc": "도어벨 소리 녹음 앱을 다운로드하세요. 아주 낮은 볼륨으로 도어벨 소리를 재생하고 즉시 간식을 주세요.", "duration_sec": 120}, {"step": 2, "title": "볼륨 점차 높이기", "desc": "강아지가 침착하면 볼륨을 조금씩 높입니다. 짖으면 볼륨을 다시 낮추세요. 인내심이 필요합니다.", "duration_sec": 300}, {"step": 3, "title": "'자리' 명령과 결합", "desc": "도어벨이 울리면 '자리'라고 명령해 매트로 가게 하세요. 매트에 있으면 간식을 계속 주세요.", "duration_sec": 360}, {"step": 4, "title": "실제 도어벨 연습", "desc": "도우미에게 실제로 도어벨을 누르게 하세요. 강아지가 짖으면 도우미는 물러나고, 침착하면 들어옵니다.", "duration_sec": 420}, {"step": 5, "title": "방문객 인사 규칙", "desc": "방문객은 강아지가 매트에 침착히 있을 때만 인사하게 하세요. 점프하거나 짖으면 완전히 무시합니다.", "duration_sec": 180}]$$::jsonb,
  10,
  5,
  4,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 21. 악수 (손 주기)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '악수 (손 주기)',
  'Shake Hands / Paw',
  'trick',
  'beginner',
  10,
  ARRAY['간식']::TEXT[],
  $$[{"step": 1, "title": "앉아 자세", "desc": "강아지를 앉힌 후, 간식을 주먹에 쥐고 코 앞에 제시하세요.", "duration_sec": 30}, {"step": 2, "title": "발 올리기 유도", "desc": "대부분의 강아지는 간식을 얻기 위해 발로 당신 손을 칩니다. 발이 손에 닿는 순간 '손' 또는 'Shake'라고 말하고 간식을 주세요.", "duration_sec": 120}, {"step": 3, "title": "손 잡기", "desc": "강아지가 발을 올리면 손으로 잡아 가볍게 흔들고 보상하세요.", "duration_sec": 180}, {"step": 4, "title": "명령어만으로", "desc": "간식을 주먹에 쥐지 않고 빈 손을 내밀며 '손'이라고 말하세요. 발을 올리면 보상합니다.", "duration_sec": 240}, {"step": 5, "title": "하이파이브로 확장", "desc": "손을 세로로 세우고 'High Five!'라고 말하세요. 발바닥이 손바닥에 닿으면 보상합니다.", "duration_sec": 180}]$$::jsonb,
  5,
  10,
  3,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 22. 빙글빙글 돌기
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '빙글빙글 돌기',
  'Spin',
  'trick',
  'beginner',
  10,
  ARRAY['간식']::TEXT[],
  $$[{"step": 1, "title": "간식으로 코 유도", "desc": "간식을 강아지 코 앞에서 천천히 원을 그리며 이동시키세요. 강아지가 간식을 따라 몸을 돌립니다.", "duration_sec": 120}, {"step": 2, "title": "완전한 원", "desc": "처음에는 반 바퀴만 돌아도 보상하고, 점차 3/4 바퀴, 완전한 한 바퀴를 요구하세요.", "duration_sec": 180}, {"step": 3, "title": "명령어 추가", "desc": "완전한 원을 그리기 시작할 때 '빙글' 또는 'Spin'이라고 말하세요.", "duration_sec": 60}, {"step": 4, "title": "손 신호 추가", "desc": "검지로 원을 그리는 손 신호를 추가하세요. 점차 간식 유도를 줄이고 손 신호만으로 회전하게 만듭니다.", "duration_sec": 240}, {"step": 5, "title": "방향 추가", "desc": "'빙글' (시계 방향)과 '돌아' (반시계 방향)로 양쪽 방향을 가르치면 더 재미있습니다.", "duration_sec": 180}]$$::jsonb,
  5,
  10,
  4,
  999,
  ARRAY['전정 질환', '척추 문제']::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 23. 죽은 척하기
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '죽은 척하기',
  'Play Dead',
  'trick',
  'intermediate',
  15,
  ARRAY['간식', '매트']::TEXT[],
  $$[{"step": 1, "title": "엎드려 자세부터", "desc": "강아지를 엎드린 자세로 만드세요. 이것이 시작 자세입니다.", "duration_sec": 30}, {"step": 2, "title": "옆으로 눕히기", "desc": "간식을 강아지 코에서 옆구리 쪽으로 천천히 이동시키세요. 강아지가 간식을 따라 몸을 기울이며 옆으로 눕게 됩니다.", "duration_sec": 180}, {"step": 3, "title": "완전히 옆으로", "desc": "강아지가 완전히 옆으로 누우면 '탕!' 또는 'Bang!'이라고 말하며 손가락 총 제스처를 하세요. 즉시 보상합니다.", "duration_sec": 120}, {"step": 4, "title": "시간 연장", "desc": "점차 옆으로 누워있는 시간을 늘립니다 (3초 → 10초 → 30초). 움직이면 보상하지 않고 다시 시도하세요.", "duration_sec": 360}, {"step": 5, "title": "거리에서 연습", "desc": "강아지와 거리를 두고 '탕!'이라고 손가락 총을 쏘세요. 멀리서도 반응하게 연습합니다.", "duration_sec": 240}]$$::jsonb,
  10,
  10,
  5,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 24. 하이 (앉아서 앞발 들기)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '하이 (앉아서 앞발 들기)',
  'Beg / Sit Pretty',
  'trick',
  'intermediate',
  15,
  ARRAY['간식']::TEXT[],
  $$[{"step": 1, "title": "앉아 자세", "desc": "강아지를 벽이나 구석에 앉히세요. 벽이 균형을 잡는 데 도움이 됩니다.", "duration_sec": 30}, {"step": 2, "title": "간식을 위로", "desc": "간식을 강아지 코 위쪽으로 천천히 올리세요. 강아지가 간식을 따라 앞발을 들게 됩니다.", "duration_sec": 120}, {"step": 3, "title": "균형 잡기", "desc": "처음에는 1초만 앞발을 들어도 보상하세요. 점차 3초, 5초, 10초로 시간을 늘립니다.", "duration_sec": 300}, {"step": 4, "title": "명령어 추가", "desc": "균형을 잡기 시작할 때 '하이' 또는 'Beg'라고 말하세요.", "duration_sec": 60}, {"step": 5, "title": "벽 없이 연습", "desc": "벽에서 점차 멀어지며 혼자 균형을 잡게 연습하세요. 핵심 근육이 강해져야 하므로 천천히 진행하세요.", "duration_sec": 420}]$$::jsonb,
  10,
  10,
  6,
  999,
  ARRAY['슬개골 탈구', '척추 문제', '관절염']::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 25. 가져와 (물건 던지기 게임)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '가져와 (물건 던지기 게임)',
  'Fetch',
  'trick',
  'beginner',
  15,
  ARRAY['공 또는 장난감', '간식']::TEXT[],
  $$[{"step": 1, "title": "장난감에 관심 갖기", "desc": "강아지가 좋아하는 장난감을 선택하세요. 장난감을 흔들어 흥미를 유발하고, 입에 물면 칭찬하세요.", "duration_sec": 120}, {"step": 2, "title": "짧은 거리 던지기", "desc": "1-2m 거리로 장난감을 던지세요. 강아지가 가져가면 큰 소리로 '가져와!' 또는 'Fetch!'라고 외치며 흥분을 표현하세요.", "duration_sec": 180}, {"step": 3, "title": "돌아오게 만들기", "desc": "강아지가 장난감을 물고 있으면 몸을 낮추고 손뼉을 치며 '이리와!'라고 부르세요. 돌아오면 과도하게 칭찬합니다.", "duration_sec": 240}, {"step": 4, "title": "'놔' 명령", "desc": "간식을 보여주며 '놓아' 또는 'Drop It'이라고 말하세요. 장난감을 놓으면 간식을 주거나 다시 던져주세요.", "duration_sec": 180}, {"step": 5, "title": "거리 늘리기", "desc": "점차 던지는 거리를 늘리고 (5m → 10m → 20m), 다양한 장난감으로 연습하세요.", "duration_sec": 360}]$$::jsonb,
  10,
  5,
  4,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 26. 충동 조절 훈련 - 음식 앞에서 참기
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '충동 조절 훈련 - 음식 앞에서 참기',
  'Impulse Control - Wait for Food',
  'behavior',
  'intermediate',
  10,
  ARRAY['간식', '밥그릇']::TEXT[],
  $$[{"step": 1, "title": "밥그릇 앞에서 앉아", "desc": "밥그릇을 준비하고 강아지에게 '앉아'라고 명령하세요.", "duration_sec": 10}, {"step": 2, "title": "밥그릇 내리기", "desc": "밥그릇을 천천히 바닥으로 내립니다. 강아지가 일어나면 그릇을 다시 들어 올리세요.", "duration_sec": 60}, {"step": 3, "title": "3초 기다리기", "desc": "그릇이 바닥에 닿은 후 3초를 세세요. 강아지가 앉아있으면 '좋아' 또는 'OK'라고 해제 명령을 하고 먹게 하세요.", "duration_sec": 30}, {"step": 4, "title": "시간 연장", "desc": "점차 기다리는 시간을 늘립니다 (3초 → 5초 → 10초 → 30초). 이것은 충동 조절의 핵심입니다.", "duration_sec": 300}, {"step": 5, "title": "아이 컨택 추가", "desc": "밥그릇을 내려놓고 강아지가 당신을 쳐다볼 때까지 기다리세요. 아이 컨택 = 해제 신호로 만들면 더 고급 훈련입니다.", "duration_sec": 180}]$$::jsonb,
  5,
  1,
  3,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 27. 점프 훈련 (낮은 장애물 넘기)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '점프 훈련 (낮은 장애물 넘기)',
  'Jump Training (Low Obstacles)',
  'trick',
  'intermediate',
  15,
  ARRAY['낮은 장애물(책, 쿠션)', '간식']::TEXT[],
  $$[{"step": 1, "title": "수의사 확인", "desc": "점프 훈련 전 반드시 수의사에게 강아지 관절 상태를 확인받으세요. 생후 12개월 미만 강아지는 성장판이 닫히지 않아 높은 점프를 피해야 합니다.", "duration_sec": 60}, {"step": 2, "title": "매우 낮게 시작", "desc": "책 한 권 높이(5-10cm)로 시작하세요. 간식으로 유도해 강아지가 장애물을 '넘는' 것이 아니라 '밟고 지나가게' 하세요.", "duration_sec": 180}, {"step": 3, "title": "점프 명령어", "desc": "강아지가 장애물을 넘을 때 '점프' 또는 'Jump'라고 말하세요. 성공하면 즉시 보상합니다.", "duration_sec": 120}, {"step": 4, "title": "점진적 높이 증가", "desc": "몇 주에 걸쳐 매우 천천히 높이를 올립니다 (10cm → 15cm → 20cm). 강아지 어깨 높이의 절반을 절대 넘지 마세요.", "duration_sec": 480}, {"step": 5, "title": "착지 안전", "desc": "점프 후 착지 지점이 미끄럽지 않은지, 충분한 공간이 있는지 확인하세요. 잘못된 착지는 부상의 주요 원인입니다.", "duration_sec": 60}]$$::jsonb,
  10,
  5,
  8,
  999,
  ARRAY['슬개골 탈구', '관절염', '척추 문제', '고관절 이형성증']::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 28. 터널 통과 훈련
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '터널 통과 훈련',
  'Tunnel Training',
  'trick',
  'beginner',
  15,
  ARRAY['애견 터널 또는 상자', '간식', '장난감']::TEXT[],
  $$[{"step": 1, "title": "터널 익히기", "desc": "터널을 최대한 짧게(1m) 펼치고 양쪽 끝을 열어두세요. 강아지가 터널 주변을 탐색하고 냄새 맡게 하세요.", "duration_sec": 120}, {"step": 2, "title": "간식으로 유도", "desc": "한쪽 끝에서 간식을 터널 안에 던지거나, 도우미가 반대쪽에서 강아지를 부르게 하세요.", "duration_sec": 180}, {"step": 3, "title": "명령어 추가", "desc": "강아지가 터널에 들어가기 시작하면 '터널' 또는 'Tunnel'이라고 말하세요.", "duration_sec": 60}, {"step": 4, "title": "터널 길이 늘리기", "desc": "강아지가 자신감을 갖게 되면 점차 터널을 길게 펼치세요 (1m → 2m → 3m).", "duration_sec": 300}, {"step": 5, "title": "곡선 터널", "desc": "직선에 익숙해지면 터널을 구부려 곡선으로 만드세요. 이것이 애질리티 코스의 실제 형태입니다.", "duration_sec": 240}]$$::jsonb,
  10,
  5,
  4,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 29. 다리 사이로 지나가기 (Weave)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '다리 사이로 지나가기 (Weave)',
  'Weave Through Legs',
  'trick',
  'advanced',
  15,
  ARRAY['간식']::TEXT[],
  $$[{"step": 1, "title": "한쪽 다리만", "desc": "한쪽 다리를 앞으로 내밀고, 간식으로 강아지를 다리 아래로 유도하세요. 통과하면 보상합니다.", "duration_sec": 120}, {"step": 2, "title": "8자 패턴", "desc": "왼쪽 다리 아래로 유도 → 오른쪽 다리 아래로 유도를 반복해 8자 패턴을 만드세요.", "duration_sec": 240}, {"step": 3, "title": "걸으면서 연습", "desc": "천천히 걸으면서 강아지가 다리 사이를 지그재그로 통과하게 하세요. 처음에는 한 발씩만 걷습니다.", "duration_sec": 360}, {"step": 4, "title": "명령어 추가", "desc": "'위브' 또는 'Weave'라고 명령하며 손 신호로 다리를 가리키세요.", "duration_sec": 60}, {"step": 5, "title": "속도 높이기", "desc": "강아지가 패턴을 이해하면 점차 걷는 속도를 높입니다. 매우 인상적인 트릭이 됩니다!", "duration_sec": 300}]$$::jsonb,
  10,
  10,
  6,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;

-- 30. 코에 간식 올리기 (참을성 훈련)
INSERT INTO public.training_routines
(title_ko, title_en, category, difficulty, duration_minutes, equipment, steps, recommended_duration_min, recommended_repetitions_min, target_min_age_months, target_max_age_months, health_restrictions)
VALUES
(
  '코에 간식 올리기 (참을성 훈련)',
  'Balance Treat on Nose',
  'trick',
  'advanced',
  15,
  ARRAY['납작한 간식(비스킷)']::TEXT[],
  $$[{"step": 1, "title": "기다려 숙달 필수", "desc": "이 트릭은 완벽한 '기다려' 명령이 전제되어야 합니다. 먼저 기다려를 완벽히 가르치세요.", "duration_sec": 60}, {"step": 2, "title": "코 위에 손 올리기", "desc": "강아지를 앉히고 손을 코 위에 올려 '기다려'라고 말하세요. 1초만 참아도 보상합니다.", "duration_sec": 120}, {"step": 3, "title": "간식으로 대체", "desc": "손 대신 납작한 간식을 코 위에 조심스럽게 올리세요. 처음에는 0.5초만 유지해도 보상합니다.", "duration_sec": 180}, {"step": 4, "title": "시간 연장", "desc": "점차 간식을 코에 올려둔 시간을 늘립니다 (1초 → 3초 → 5초 → 10초). 인내심이 핵심입니다.", "duration_sec": 360}, {"step": 5, "title": "해제 및 캐치", "desc": "'좋아!'라고 해제 명령을 하면 강아지가 코를 위로 들어 간식을 공중에 띄워 잡아먹게 가르치세요. 매우 인상적인 마무리입니다!", "duration_sec": 240}]$$::jsonb,
  10,
  10,
  6,
  999,
  ARRAY[]::TEXT[]
)
ON CONFLICT (title_ko) DO NOTHING;