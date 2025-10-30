-- Go to Supabase Dashboard > Database > Extensions
-- Ensure 'postgis', 'pg_trgm', and 'pgsodium' are enabled.
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
-- CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium; -- Enable via Dashboard UI
-- Go to Supabase Dashboard > Database > Extensions
-- Ensure 'postgis', 'pg_trgm', and 'pgsodium' are enabled.
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
-- CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium; -- Enable via Dashboard UI
-- Run these in Supabase SQL Editor (if not already created)

-- 3.1 Breed Master Table
CREATE TABLE IF NOT EXISTS public.breeds (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name_ko TEXT NOT NULL, name_en TEXT NOT NULL UNIQUE,
  breed_group TEXT, size_category TEXT CHECK (size_category IN ('toy', 'small', 'medium', 'large', 'giant')),
  avg_weight_kg_min NUMERIC, avg_weight_kg_max NUMERIC, temperament TEXT[],
  exercise_needs TEXT CHECK (exercise_needs IN ('low', 'medium', 'high')),
  origin_country TEXT, description TEXT, image_url TEXT,
  search_tags TEXT[] NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for breeds" ON public.breeds FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_breeds_name_ko_trgm ON public.breeds USING gin(name_ko gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_breeds_name_en_trgm ON public.breeds USING gin(name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_breeds_search_tags_gin ON public.breeds USING gin(search_tags);
DROP TRIGGER IF EXISTS set_breeds_timestamp ON public.breeds;
CREATE TRIGGER set_breeds_timestamp BEFORE UPDATE ON public.breeds FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
COMMENT ON TABLE public.breeds IS '반려견 품종 마스터 정보';
COMMENT ON COLUMN public.breeds.search_tags IS '품종 검색을 위한 추가 키워드';

-- 3.2 Specialization Master Table
CREATE TABLE IF NOT EXISTS public.specializations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name_ko TEXT NOT NULL UNIQUE, -- 예: '기초 복종 훈련', '문제 행동 교정', '어질리티'
  name_en TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for specializations" ON public.specializations FOR SELECT USING (true);
COMMENT ON TABLE public.specializations IS '훈련사가 제공할 수 있는 전문 분야 마스터 테이블';

-- 3.3 Certification Type Master Table
CREATE TABLE IF NOT EXISTS public.certification_types (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,          -- 예: 'KPA Certified Training Partner', 'CPDT-KA'
  issuing_organization TEXT NOT NULL, -- 예: 'Karen Pryor Academy', 'CCPDT'
  description TEXT,
  logo_url TEXT,                      -- 자격증 로고 이미지 URL (선택)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.certification_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for cert types" ON public.certification_types FOR SELECT USING (true);
COMMENT ON TABLE public.certification_types IS '훈련사 자격증 종류 마스터 테이블';
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  toss_user_key TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'trainer', 'admin')),
  full_name_encrypted TEXT NULL, email_encrypted TEXT NULL, phone_encrypted TEXT NULL, ci_encrypted TEXT NULL,
  nickname TEXT UNIQUE, profile_image_url TEXT,
  access_token_encrypted TEXT NULL, refresh_token_encrypted TEXT NULL, token_expires_at TIMESTAMPTZ NULL,
  pii_decryption_error BOOLEAN DEFAULT FALSE NOT NULL,
  ci_hash TEXT UNIQUE NULLS NOT DISTINCT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual read access" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admin read access" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_users_toss_user_key ON public.users(toss_user_key);
CREATE INDEX IF NOT EXISTS idx_users_ci_hash ON public.users(ci_hash) WHERE ci_hash IS NOT NULL;

DROP TRIGGER IF EXISTS set_users_timestamp ON public.users;
CREATE TRIGGER set_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TABLE public.trainers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  introduction TEXT,
  career_years INT DEFAULT 0 CHECK (career_years >= 0),
  business_registration_number TEXT NULL,
  primary_location GEOGRAPHY(Point, 4326) NULL,
  website_url TEXT,
  profile_image_url TEXT,
  avg_rating NUMERIC(3, 2) DEFAULT 0.00 CHECK (avg_rating >= 0 AND avg_rating <= 5),
  review_count INT DEFAULT 0 CHECK (review_count >= 0),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read access" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Allow owner update access" ON public.trainers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admin update access" ON public.trainers FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_trainers_primary_location ON public.trainers USING GIST (primary_location);

DROP TRIGGER IF EXISTS set_trainers_timestamp ON public.trainers;
CREATE TRIGGER set_trainers_timestamp BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TABLE public.dog_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  dog_name TEXT NOT NULL,
  breed_id BIGINT REFERENCES public.breeds(id) ON DELETE SET NULL,
  breed_name_custom TEXT NULL,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'unknown')),
  weight_kg NUMERIC CHECK (weight_kg > 0),
  is_neutered BOOLEAN,
  temperament_notes TEXT,
  behavioral_issues TEXT[],
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.dog_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow owner CRUD access" ON public.dog_profiles FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_dog_profiles_user_id ON public.dog_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_dog_profiles_breed_id ON public.dog_profiles(breed_id);

DROP TRIGGER IF EXISTS set_dog_profiles_timestamp ON public.dog_profiles;
CREATE TRIGGER set_dog_profiles_timestamp BEFORE UPDATE ON public.dog_profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  dog_id UUID NOT NULL REFERENCES public.dog_profiles(id) ON DELETE CASCADE,
  booking_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  location TEXT,
  location_detail TEXT NULL,
  training_focus TEXT[],
  notes_for_trainer TEXT,
  status TEXT DEFAULT 'payment_pending' NOT NULL CHECK (status IN ('payment_pending', 'confirmed', 'service_completed', 'cancelled_by_user', 'cancelled_by_trainer', 'no_show')),
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_acknowledged_completion BOOLEAN DEFAULT FALSE,
  trainer_acknowledged_completion BOOLEAN DEFAULT FALSE
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow related users read access" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() = trainer_id);
CREATE POLICY "Allow user insert access" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'payment_pending');
CREATE POLICY "Allow related users update status/ack" ON public.bookings FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = trainer_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trainer_id ON public.bookings(trainer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_time_status ON public.bookings(booking_time, status);

DROP TRIGGER IF EXISTS set_bookings_timestamp ON public.bookings;
CREATE TRIGGER set_bookings_timestamp BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE POLICY "Allow related trainer read access" ON public.dog_profiles
FOR SELECT
USING (id IN (SELECT dog_id FROM public.bookings WHERE trainer_id = auth.uid()));
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  status TEXT DEFAULT 'PAY_STANDBY' NOT NULL CHECK (status IN ('PAY_STANDBY', 'PAY_APPROVED', 'PAY_CANCEL', 'PAY_PROGRESS', 'PAY_COMPLETE', 'REFUND_PROGRESS', 'REFUND_SUCCESS')),
  order_no TEXT UNIQUE NOT NULL,
  pay_token TEXT UNIQUE NULL,
  transaction_id TEXT UNIQUE NULL,
  payment_method TEXT NULL,
  payment_details JSONB NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ NULL,
  refunded_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow related booking users read access" ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT trainer_id FROM public.bookings WHERE id = booking_id));

CREATE POLICY "Allow user insert access for own booking" ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE TABLE public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT DEFAULT 'REFUND_PROGRESS' NOT NULL CHECK (status IN ('REFUND_PROGRESS', 'REFUND_SUCCESS', 'REFUND_FAILED')),
  reason TEXT,
  refund_no TEXT UNIQUE NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  fail_reason TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow related payment users read access" ON public.refunds FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM payments WHERE id = payment_id)
    OR auth.uid() IN (
      SELECT b.trainer_id FROM bookings b JOIN payments p ON b.id = p.booking_id WHERE p.id = payment_id
    )
  );
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  rating_update_status TEXT DEFAULT 'pending' NOT NULL CHECK (rating_update_status IN ('pending', 'applied'))
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access (non-hidden)" ON public.reviews FOR SELECT USING (is_hidden = false);
CREATE POLICY "Allow owner insert on completed booking" ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid() AND status = 'service_completed'));

CREATE POLICY "Allow owner update own review" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow owner delete own review" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow admin moderation access" ON public.reviews FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
-- Training Routines
CREATE TABLE public.training_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko TEXT NOT NULL, title_en TEXT NOT NULL,
  description_ko TEXT, description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('obedience','agility','behavior','trick','puppy','advanced')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
  duration_minutes INT CHECK (duration_minutes > 0),
  equipment TEXT[], steps JSONB, thumbnail_url TEXT,
  recommended_duration_min INT NULL CHECK (recommended_duration_min >= 0),
  recommended_repetitions_min INT NULL CHECK (recommended_repetitions_min >= 0),
  target_breeds BIGINT[], target_min_age_months INT DEFAULT 0 CHECK (target_min_age_months >= 0),
  target_max_age_months INT DEFAULT 999 CHECK (target_max_age_months >= 0),
  health_restrictions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (title_ko), UNIQUE (title_en)
);
ALTER TABLE public.training_routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read access" ON public.training_routines FOR SELECT USING (true);
CREATE POLICY "Allow admin CRUD access" ON public.training_routines FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
-- Trainer Specializations
CREATE TABLE public.trainer_specializations (
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  specialization_id BIGINT NOT NULL REFERENCES public.specializations(id) ON DELETE CASCADE,
  PRIMARY KEY (trainer_id, specialization_id)
);
ALTER TABLE public.trainer_specializations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read access" ON public.trainer_specializations FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_specializations FOR ALL USING (auth.uid() = trainer_id);
-- Trainer Certifications
CREATE TABLE public.trainer_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  certification_type_id BIGINT NOT NULL REFERENCES public.certification_types(id) ON DELETE RESTRICT,
  certification_number TEXT NULL,
  issue_date DATE,
  expiry_date DATE,
  document_url TEXT,
  verification_status TEXT DEFAULT 'pending' NOT NULL CHECK (verification_status IN ('pending','verified','rejected')),
  verified_at TIMESTAMPTZ NULL,
  verified_by UUID NULL REFERENCES public.users(id),
  rejection_reason TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.trainer_certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read access" ON public.trainer_certifications FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_certifications FOR ALL USING (auth.uid() = trainer_id);
CREATE POLICY "Allow admin verification access" ON public.trainer_certifications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
-- Run these in Supabase SQL Editor

-- 5.1 User Preferences Table
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_trainer_gender TEXT CHECK (preferred_trainer_gender IN ('male', 'female', 'any')),
  preferred_training_time TEXT[], -- 선호하는 훈련 시간대 (예: '오전', '오후', '주말')
  preferred_specialization_ids BIGINT[], -- 선호하는 전문 분야 ID 목록
  user_location GEOGRAPHY(Point, 4326) NULL, -- 사용자 현재 또는 선호 위치
  search_radius_km INT DEFAULT 10 CHECK (search_radius_km > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow owner CRUD access" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_location ON public.user_preferences USING GIST(user_location);
CREATE INDEX IF NOT EXISTS idx_user_preferences_specializations ON public.user_preferences USING GIN (preferred_specialization_ids);
DROP TRIGGER IF EXISTS set_user_preferences_timestamp ON public.user_preferences;
CREATE TRIGGER set_user_preferences_timestamp
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
COMMENT ON TABLE public.user_preferences IS '사용자의 훈련사 및 서비스 선호 설정';
COMMENT ON COLUMN public.user_preferences.user_location IS '사용자 선호 위치 (PostGIS geography)';


-- 5.2 Trainer Service Areas Table
CREATE TABLE public.trainer_service_areas (
  id BIGSERIAL PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  area_name TEXT NOT NULL,
  geometry GEOMETRY(Geometry, 4326) NOT NULL,
  center_point GEOGRAPHY(Point, 4326) NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.trainer_service_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.trainer_service_areas
  FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_service_areas
  FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_service_areas_trainer_id ON public.trainer_service_areas(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_service_areas_geom ON public.trainer_service_areas USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_trainer_service_areas_center ON public.trainer_service_areas USING GIST(center_point);
DROP TRIGGER IF EXISTS set_trainer_service_areas_timestamp ON public.trainer_service_areas;
CREATE TRIGGER set_trainer_service_areas_timestamp
  BEFORE UPDATE ON public.trainer_service_areas
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
COMMENT ON TABLE public.trainer_service_areas IS '훈련사가 서비스를 제공하는 지역 정보';
COMMENT ON COLUMN public.trainer_service_areas.geometry IS '서비스 지역 범위 (PostGIS geometry)';


-- 5.3 Conversations Table (RLS 정책 정의는 participants 테이블 생성 후로 이동)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE REFERENCES public.bookings(id) ON DELETE SET NULL,
  last_message_preview TEXT NULL,
  last_message_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
-- RLS 정책은 아래 participants 테이블 생성 후 정의합니다.
DROP TRIGGER IF EXISTS set_conversations_timestamp ON public.conversations;
CREATE TRIGGER set_conversations_timestamp
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE INDEX IF NOT EXISTS idx_conversations_booking_id ON public.conversations(booking_id);
COMMENT ON TABLE public.conversations IS '사용자와 훈련사 간의 대화방';


-- 5.4 Conversation Participants Table
CREATE TABLE public.conversation_participants (
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NULL,
  PRIMARY KEY (conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
-- Read policy needs adjustment to allow seeing participants of *own* conversations
CREATE POLICY "Allow participant read access to own participation" ON public.conversation_participants
  FOR SELECT USING (user_id = auth.uid());
-- Policy to allow seeing *other* participants in *own* conversations
CREATE POLICY "Allow participant to see others in own convo" ON public.conversation_participants
  FOR SELECT USING (conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));
CREATE POLICY "Allow participant update own last_read_at" ON public.conversation_participants
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow participant insert self" ON public.conversation_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_conv_participants_user_id ON public.conversation_participants(user_id);
COMMENT ON TABLE public.conversation_participants IS '대화방 참여자 정보';

-- *** Conversations 테이블 RLS 정책 정의 (이제 participants 테이블이 존재하므로 가능) ***
CREATE POLICY "Allow participant read access for conversations" ON public.conversations
  FOR SELECT USING (id IN (
    SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
  ));
CREATE POLICY "Allow participant insert access for conversations" ON public.conversations
  FOR INSERT WITH CHECK (true); -- Allow anyone to create a conversation initially, participation controls access later.


-- 5.5 Messages Table
CREATE TABLE public.messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'trainer')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow participant read access for messages" ON public.messages
  FOR SELECT USING (
    conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
  );
CREATE POLICY "Allow participant insert access for messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    AND sender_role = (SELECT role FROM users WHERE id = auth.uid()) -- Ensure sender role matches user role
  );
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
COMMENT ON TABLE public.messages IS '대화 메시지 내용';


-- 5.6 Toss API Logs Table
CREATE TABLE public.toss_api_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NULL REFERENCES public.users(id),
  api_path TEXT NOT NULL,
  request_payload JSONB NULL,
  response_payload JSONB NULL,
  is_success BOOLEAN NOT NULL,
  error_code TEXT NULL,
  error_reason TEXT NULL,
  called_at TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INT NULL,
  related_payment_id UUID NULL REFERENCES public.payments(id)
);
ALTER TABLE public.toss_api_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin read access for toss api logs" ON public.toss_api_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));
-- Insert should happen via Edge Function or trusted role
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_user_id ON public.toss_api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_api_path ON public.toss_api_logs(api_path);
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_success_time ON public.toss_api_logs(is_success, called_at DESC);
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_payment_id ON public.toss_api_logs(related_payment_id);
COMMENT ON TABLE public.toss_api_logs IS '토스 API 호출 기록';


-- 5.7 Payment Status History Table
CREATE TABLE public.payment_status_history (
  id BIGSERIAL PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  old_status TEXT NULL,
  new_status TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT NULL
);
ALTER TABLE public.payment_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow related payment users read access for status history" ON public.payment_status_history
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.payments WHERE id = payment_id
      UNION
      SELECT b.trainer_id FROM public.bookings b JOIN public.payments p ON b.id = p.booking_id WHERE p.id = payment_id
    )
  );
CREATE POLICY "Allow admin read access for status history" ON public.payment_status_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));
-- Insert should happen via Trigger or Edge Function
CREATE INDEX IF NOT EXISTS idx_payment_status_history_payment_id ON public.payment_status_history(payment_id, changed_at DESC);
COMMENT ON TABLE public.payment_status_history IS '결제 상태 변경 이력';


-- 5.8 Trainer Availability Table
CREATE TABLE public.trainer_availability (
  id BIGSERIAL PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (trainer_id, day_of_week, start_time, end_time),
  CONSTRAINT check_end_time_after_start_time CHECK (end_time > start_time)
);
ALTER TABLE public.trainer_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for trainer availability" ON public.trainer_availability FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access for trainer availability" ON public.trainer_availability FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_availability_trainer_day ON public.trainer_availability(trainer_id, day_of_week);
DROP TRIGGER IF EXISTS set_trainer_availability_timestamp ON public.trainer_availability;
CREATE TRIGGER set_trainer_availability_timestamp
  BEFORE UPDATE ON public.trainer_availability
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
COMMENT ON TABLE public.trainer_availability IS '훈련사의 기본 활동 가능 시간 (요일별)';
COMMENT ON COLUMN public.trainer_availability.day_of_week IS '요일 (0=일요일, 6=토요일)';

-- 5.9 Training Logs Table (User-side logging)
-- **주의**: 이 테이블은 `dog_profiles` 테이블을 참조해야 합니다. 이전 단계에서 `dog_profiles` 테이블명이 맞는지 확인하세요.
-- 만약 `dogs` 테이블이라면 아래 `dogs(id)` 부분을 `dog_profiles(id)`로 수정해야 합니다.
CREATE TABLE public.training_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  dog_id UUID NOT NULL REFERENCES public.dog_profiles(id) ON DELETE CASCADE, -- 여기를 확인하세요!
  routine_id UUID NULL REFERENCES public.training_routines(id),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INT CHECK (duration_minutes >= 0),
  notes TEXT,
  success_rating SMALLINT CHECK (success_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow owner CRUD access for training logs" ON public.training_logs
  FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_user_dog ON public.training_logs(user_id, dog_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_routine ON public.training_logs(routine_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_date ON public.training_logs(log_date);
COMMENT ON TABLE public.training_logs IS '사용자가 직접 기록하는 반려견 훈련 일지 (선택 사항)';
-- Run these in Supabase SQL Editor

-- 6.1 Trainer Schedule Exceptions Table
CREATE TABLE public.trainer_schedule_exceptions (
    id BIGSERIAL PRIMARY KEY,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_full_day_off BOOLEAN DEFAULT FALSE NOT NULL,
    start_time_override TIME NULL, -- Null if full day off
    end_time_override TIME NULL,   -- Null if full day off
    reason TEXT NULL,             -- e.g., "휴가", "병원 방문"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (trainer_id, exception_date), -- Only one exception record per trainer per day
    CONSTRAINT check_override_times CHECK (is_full_day_off = TRUE OR (start_time_override IS NOT NULL AND end_time_override IS NOT NULL AND end_time_override > start_time_override))
);
ALTER TABLE public.trainer_schedule_exceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.trainer_schedule_exceptions FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_schedule_exceptions FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_schedule_exceptions_trainer_date ON public.trainer_schedule_exceptions(trainer_id, exception_date);
DROP TRIGGER IF EXISTS set_trainer_schedule_exceptions_timestamp ON public.trainer_schedule_exceptions;
CREATE TRIGGER set_trainer_schedule_exceptions_timestamp BEFORE UPDATE ON public.trainer_schedule_exceptions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
COMMENT ON TABLE public.trainer_schedule_exceptions IS '훈련사의 특정 날짜 휴무 또는 근무 시간 변경 정보';

-- 6.2 User PII History Table
CREATE TABLE public.user_pii_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    changed_field TEXT NOT NULL CHECK (changed_field IN ('full_name', 'email', 'phone', 'ci')), -- Which field changed
    old_value_encrypted TEXT NULL, -- Previous encrypted value
    new_value_encrypted TEXT NULL, -- New encrypted value (NULL if deleted?)
    changed_by UUID NULL REFERENCES public.users(id), -- Who changed it (user themselves or admin)
    change_reason TEXT NULL,       -- Why it was changed
    changed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_pii_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin read access" ON public.user_pii_history FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Allow owner read access" ON public.user_pii_history FOR SELECT USING (auth.uid() = user_id);
-- Note: Inserts should ideally happen via trigger or Edge Function
CREATE INDEX IF NOT EXISTS idx_user_pii_history_user_time ON public.user_pii_history(user_id, changed_at DESC);
COMMENT ON TABLE public.user_pii_history IS '사용자 개인 식별 정보(PII) 변경 이력';
-- 7.1 trainer_awards 테이블 생성
CREATE TABLE public.trainer_awards (
    id BIGSERIAL PRIMARY KEY,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    award_name TEXT NOT NULL,
    organization TEXT NULL,
    award_date DATE NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.2 RLS 활성화
ALTER TABLE public.trainer_awards ENABLE ROW LEVEL SECURITY;

-- 7.3 RLS 정책 설정
CREATE POLICY "Allow public read access for trainer awards" ON public.trainer_awards FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access for trainer awards" ON public.trainer_awards FOR ALL USING (auth.uid() = trainer_id);

-- 7.4 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_trainer_awards_trainer_id ON public.trainer_awards(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_awards_award_date ON public.trainer_awards(award_date);

-- 7.5 updated_at 자동 업데이트 트리거 추가
DROP TRIGGER IF EXISTS set_trainer_awards_timestamp ON public.trainer_awards;
CREATE TRIGGER set_trainer_awards_timestamp BEFORE UPDATE ON public.trainer_awards FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

COMMENT ON TABLE public.trainer_awards IS '훈련사의 수상 내역 정보를 저장하는 테이블';
COMMENT ON COLUMN public.trainer_awards.award_name IS '수상 내역 이름 (예: 올해의 훈련사 대상)';
COMMENT ON COLUMN public.trainer_awards.organization IS '수여 기관 (예: 한국애견협회)';
COMMENT ON COLUMN public.trainer_awards.award_date IS '수상 날짜';
COMMENT ON COLUMN public.trainer_awards.description IS '수상 내역에 대한 추가 설명';
-- 8.1 training_session_logs 테이블 생성 (훈련사 기록용, AI 데이터 기반)
CREATE TABLE public.training_session_logs (
    id BIGSERIAL PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    dog_profile_snapshot JSONB NULL, -- 세션 시점의 익명화된 반려견 정보 (예: {"breed_group": "...", "age_months": ..., "behavior_issues": [...]})
    session_goal TEXT[] NULL, -- 훈련 목표 키워드 (예: '산책 중 짖음 감소', '앉아 유지 시간 증가')
    applied_techniques TEXT[] NULL, -- 적용된 훈련 기법 (예: '긍정 강화', '클리커 사용', '타겟팅')
    session_duration_minutes INT NULL CHECK (session_duration_minutes > 0), -- 실제 소요 시간
    location_type TEXT NULL CHECK (location_type IN ('indoor', 'outdoor_park', 'outdoor_street', 'training_center')), -- 훈련 장소 유형
    trainer_notes_anonymized TEXT NULL, -- 익명화된 훈련사 메모 (훈련사만 보거나 AI 학습용, 사용자 비공개 권장)
    outcome_assessment JSONB NULL, -- 훈련 성과 평가 (예: {"goal_achieved": true, "success_rate_change": 15, "next_step_recommendation": "..."})
    user_visible_summary TEXT NULL, -- 사용자에게 보여줄 요약 정보 (선택적 공유)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.2 RLS 활성화
ALTER TABLE public.training_session_logs ENABLE ROW LEVEL SECURITY;

-- 8.3 RLS 정책 설정
-- 훈련사 본인만 자신의 로그 기록 CRUD 가능
CREATE POLICY "Allow trainer CRUD access for session logs" ON public.training_session_logs FOR ALL USING (auth.uid() = trainer_id);
-- 관련 사용자(예약한 유저)는 user_visible_summary 등 일부 필드만 조회 가능하게 설정 (선택 사항)
CREATE POLICY "Allow related user read specific fields" ON public.training_session_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid())
);
-- 위 SELECT 정책은 실제 조회 시 SELECT 절에서 user_visible_summary 등 허용된 컬럼만 명시해야 함. RLS만으로는 컬럼 레벨 제어가 어려움. (뷰 또는 RPC 함수 활용 고려)


-- 8.4 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_training_session_logs_booking_id ON public.training_session_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_training_session_logs_trainer_id ON public.training_session_logs(trainer_id);

-- 8.5 updated_at 자동 업데이트 트리거 추가
DROP TRIGGER IF EXISTS set_training_session_logs_timestamp ON public.training_session_logs;
CREATE TRIGGER set_training_session_logs_timestamp BEFORE UPDATE ON public.training_session_logs FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

COMMENT ON TABLE public.training_session_logs IS '훈련 세션별 상세 기록 (훈련사 작성, AI 데이터 기반)';
COMMENT ON COLUMN public.training_session_logs.dog_profile_snapshot IS '세션 시점의 익명화된 반려견 정보 스냅샷';
COMMENT ON COLUMN public.training_session_logs.applied_techniques IS '적용된 훈련 기법 목록';
COMMENT ON COLUMN public.training_session_logs.trainer_notes_anonymized IS '익명화 처리된 훈련사 메모 (AI 학습용)';
COMMENT ON COLUMN public.training_session_logs.outcome_assessment IS '훈련 성과에 대한 구조화된 평가';
COMMENT ON COLUMN public.training_session_logs.user_visible_summary IS '사용자에게 선택적으로 보여줄 세션 요약';
-- reviews 테이블에 답글 관련 컬럼 추가
ALTER TABLE public.reviews
ADD COLUMN trainer_reply TEXT NULL, -- 훈련사 답글 내용
ADD COLUMN reply_at TIMESTAMPTZ NULL; -- 답글 작성 시간

-- 훈련사 본인만 답글을 달 수 있도록 RLS 정책 수정 (기존 정책에 UPDATE 권한 추가 또는 신규 생성)
-- 예시: 기존 owner update 정책 수정 (FOR UPDATE 뒤에 , DELETE 추가하고 아래 정책 추가)
CREATE POLICY "Allow trainer reply access" ON public.reviews
FOR UPDATE -- 답글 작성을 위해 UPDATE 권한 부여
USING (auth.uid() = trainer_id) -- 훈련사 본인만
WITH CHECK (auth.uid() = trainer_id);

COMMENT ON COLUMN public.reviews.trainer_reply IS '사용자 리뷰에 대한 훈련사의 답글';
COMMENT ON COLUMN public.reviews.reply_at IS '훈련사 답글 작성 시간';
-- dog_profiles 테이블에 초기 훈련 목표 컬럼 추가
ALTER TABLE public.dog_profiles
ADD COLUMN initial_training_goals TEXT[] NULL; -- 온보딩 시 선택한 훈련 목표 키워드 배열

COMMENT ON COLUMN public.dog_profiles.initial_training_goals IS '온보딩 시 사용자가 선택한 초기 훈련 목표 (키워드 배열)';
-- 훈련 루틴 리뷰 테이블 생성
CREATE TABLE public.routine_reviews (
    id BIGSERIAL PRIMARY KEY,
    routine_id UUID NOT NULL REFERENCES public.training_routines(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (routine_id, user_id) -- 사용자는 루틴당 하나의 리뷰만 작성 가능
);

-- RLS 활성화 및 정책
ALTER TABLE public.routine_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.routine_reviews FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD" ON public.routine_reviews FOR ALL USING (auth.uid() = user_id);

-- 인덱스 추가
CREATE INDEX idx_routine_reviews_routine_id ON public.routine_reviews(routine_id);
CREATE INDEX idx_routine_reviews_user_id ON public.routine_reviews(user_id);

-- 타임스탬프 트리거 추가
DROP TRIGGER IF EXISTS set_routine_reviews_timestamp ON public.routine_reviews;
CREATE TRIGGER set_routine_reviews_timestamp BEFORE UPDATE ON public.routine_reviews FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

COMMENT ON TABLE public.routine_reviews IS '훈련 루틴 자체에 대한 사용자 리뷰 및 평점';
-- ⭐ Step 8: Create Notifications Table ⭐

-- 8.1 Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- 알림 수신자
    type TEXT NOT NULL CHECK (type IN ('booking_confirmed', 'booking_reminder', 'new_message', 'review_request', 'system')), -- 알림 종류
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_booking_id UUID NULL REFERENCES public.bookings(id), -- 관련 예약 ID (선택)
    related_conversation_id UUID NULL REFERENCES public.conversations(id), -- 관련 대화 ID (선택)
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.2 Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 8.3 RLS Policies (Corrected - Separate Policies)
-- Policy for SELECT: Allow owners to read their notifications
CREATE POLICY "Allow owner read access" ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for UPDATE: Allow owners to update (e.g., mark as read) their notifications
CREATE POLICY "Allow owner update access" ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id) -- Specifies which rows can be updated
  WITH CHECK (auth.uid() = user_id); -- Ensures the row still belongs to the user after update

-- INSERT policy is omitted as inserts are expected from trusted sources (e.g., Edge Functions)

-- 8.4 Add Indexes
CREATE INDEX idx_notifications_user_id_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- 8.5 Add Comments
COMMENT ON TABLE public.notifications IS '사용자에게 발송되는 인앱 알림';
COMMENT ON COLUMN public.notifications.type IS '알림 종류 구분';
COMMENT ON COLUMN public.notifications.is_read IS '사용자 읽음 여부';