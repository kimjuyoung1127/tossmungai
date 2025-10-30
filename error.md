-- ⭐ Step 1: Initialize & Create Functions ONLY ⭐

-- 1. DROP ALL (초기화)
DROP FUNCTION IF EXISTS public.trigger_set_timestamp() CASCADE;
DROP FUNCTION IF EXISTS public.update_trainer_rating() CASCADE;
DROP FUNCTION IF EXISTS public.set_review_rating_status() CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversation_participants CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.refunds CASCADE;
DROP TABLE IF EXISTS public.payment_status_history CASCADE;
DROP TABLE IF EXISTS public.toss_api_logs CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.trainer_schedule_exceptions CASCADE;
DROP TABLE IF EXISTS public.trainer_availability CASCADE;
DROP TABLE IF EXISTS public.trainer_service_areas CASCADE;
DROP TABLE IF EXISTS public.trainer_certifications CASCADE;
DROP TABLE IF EXISTS public.trainer_specializations CASCADE;
DROP TABLE IF EXISTS public.trainers CASCADE;
DROP TABLE IF EXISTS public.user_pii_history CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.training_logs CASCADE;
DROP TABLE IF EXISTS public.dog_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.breeds CASCADE;
DROP TABLE IF EXISTS public.specializations CASCADE;
DROP TABLE IF EXISTS public.certification_types CASCADE;
DROP TABLE IF EXISTS public.training_routines CASCADE;

-- 2. Extensions
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

-- 3. Trigger Functions (오류 수정 최종 버전)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_trainer_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_trainer_id UUID;
  new_avg_rating NUMERIC;
  new_review_count INT;
BEGIN
  IF (TG_OP = 'DELETE') THEN target_trainer_id := OLD.trainer_id;
  ELSE target_trainer_id := NEW.trainer_id; END IF;
  SELECT AVG(rating), COUNT(*) INTO new_avg_rating, new_review_count
  FROM public.reviews WHERE trainer_id = target_trainer_id AND is_hidden = false;
  UPDATE public.trainers
  SET avg_rating = COALESCE(new_avg_rating, 0), review_count = COALESCE(new_review_count, 0)
  WHERE id = target_trainer_id;
  IF (TG_OP = 'DELETE') THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_review_rating_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.rating_update_status = 'applied';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
[2단계] 마스터 테이블 및 핵심 테이블 생성
(1단계 성공 후, SQL Editor를 지우고 이 스크립트를 실행합니다. 오류가 발생했던 reviews 테이블이 포함됩니다.)

SQL

-- ⭐ Step 2: Create Master & Core Tables ⭐

-- 4. Master Tables
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
DROP POLICY IF EXISTS "Public read access for breeds" ON public.breeds;
CREATE POLICY "Public read access for breeds" ON public.breeds FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_breeds_name_ko_trgm ON public.breeds USING gin(name_ko gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_breeds_name_en_trgm ON public.breeds USING gin(name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_breeds_search_tags_gin ON public.breeds USING gin(search_tags);
DROP TRIGGER IF EXISTS set_breeds_timestamp ON public.breeds;
CREATE TRIGGER set_breeds_timestamp BEFORE UPDATE ON public.breeds FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.specializations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name TEXT NOT NULL UNIQUE, category TEXT, description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for specializations" ON public.specializations;
CREATE POLICY "Public read access for specializations" ON public.specializations FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.certification_types (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name TEXT NOT NULL UNIQUE, issuing_organization TEXT, level INTEGER,
  validity_period_months INT, description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.certification_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for cert types" ON public.certification_types;
CREATE POLICY "Public read access for cert types" ON public.certification_types FOR SELECT USING (true);

-- 5. Core Tables
CREATE TABLE IF NOT EXISTS public.users (
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
DROP POLICY IF EXISTS "Allow individual read access" ON public.users;
DROP POLICY IF EXISTS "Allow individual update access" ON public.users;
CREATE POLICY "Allow individual read access" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE INDEX IF NOT EXISTS idx_users_toss_user_key ON public.users(toss_user_key);
CREATE INDEX IF NOT EXISTS idx_users_ci_hash ON public.users(ci_hash) WHERE ci_hash IS NOT NULL;
DROP TRIGGER IF EXISTS set_users_timestamp ON public.users;
CREATE TRIGGER set_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.dog_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, breed_id BIGINT REFERENCES public.breeds(id), is_mixed_breed BOOLEAN DEFAULT false,
  mixed_breed_description TEXT, age_months INT NOT NULL CHECK (age_months >= 0),
  weight_kg NUMERIC(5, 2) CHECK (weight_kg > 0), gender TEXT CHECK (gender IN ('male', 'female')),
  is_neutered BOOLEAN, energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  temperament TEXT[], health_conditions TEXT[], photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.dog_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.dog_profiles;
CREATE POLICY "Allow owner CRUD access" ON public.dog_profiles FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_dog_profiles_user_id ON public.dog_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_dog_profiles_breed_id ON public.dog_profiles(breed_id);
DROP TRIGGER IF EXISTS set_dog_profiles_timestamp ON public.dog_profiles;
CREATE TRIGGER set_dog_profiles_timestamp BEFORE UPDATE ON public.dog_profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.training_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title_ko TEXT NOT NULL, title_en TEXT NOT NULL,
  description_ko TEXT, description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('obedience', 'agility', 'behavior', 'trick', 'puppy', 'advanced')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INT CHECK (duration_minutes > 0), equipment TEXT[], steps JSONB, thumbnail_url TEXT,
  recommended_duration_min INT NULL CHECK (recommended_duration_min >= 0),
  recommended_repetitions_min INT NULL CHECK (recommended_repetitions_min >= 0),
  target_breeds BIGINT[], target_min_age_months INT DEFAULT 0 CHECK (target_min_age_months >= 0),
  target_max_age_months INT DEFAULT 999 CHECK (target_max_age_months >= 0), health_restrictions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (title_ko), UNIQUE (title_en)
);
ALTER TABLE public.training_routines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read access" ON public.training_routines;
CREATE POLICY "Allow all read access" ON public.training_routines FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_routines_title_ko_trgm ON public.training_routines USING gin(title_ko gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_routines_title_en_trgm ON public.training_routines USING gin(title_en gin_trgm_ops);
DROP TRIGGER IF EXISTS set_training_routines_timestamp ON public.training_routines;
CREATE TRIGGER set_training_routines_timestamp BEFORE UPDATE ON public.training_routines FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE, bio TEXT,
  hourly_rate INT CHECK (hourly_rate >= 0), business_area_description TEXT,
  primary_location GEOGRAPHY(Point, 4326) NULL, career_years INT CHECK (career_years >= 0),
  avg_rating NUMERIC(3, 2) DEFAULT 0.00 CHECK (avg_rating >= 0 AND avg_rating <= 5),
  review_count INT DEFAULT 0 CHECK (review_count >= 0),
  trainer_tier TEXT DEFAULT 'new' CHECK (trainer_tier IN ('top', 'popular', 'rising', 'new', 'basic')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read access" ON public.trainers;
DROP POLICY IF EXISTS "Allow owner update access" ON public.trainers;
CREATE POLICY "Allow all read access" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Allow owner update access" ON public.trainers FOR UPDATE USING (auth.uid() = id);
CREATE INDEX IF NOT EXISTS idx_trainers_primary_location ON public.trainers USING GIST (primary_location);
DROP TRIGGER IF EXISTS set_trainers_timestamp ON public.trainers;
CREATE TRIGGER set_trainers_timestamp BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.trainer_specializations (
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  specialization_id BIGINT NOT NULL REFERENCES public.specializations(id) ON DELETE CASCADE,
  years_of_experience INTEGER CHECK (years_of_experience >= 0), is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(), PRIMARY KEY (trainer_id, specialization_id)
);
ALTER TABLE public.trainer_specializations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read access" ON public.trainer_specializations;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.trainer_specializations;
CREATE POLICY "Allow all read access" ON public.trainer_specializations FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_specializations FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_specializations_spec_id ON public.trainer_specializations(specialization_id);
CREATE INDEX IF NOT EXISTS idx_trainer_specializations_trainer_id ON public.trainer_specializations(trainer_id);

CREATE TABLE IF NOT EXISTS public.trainer_certifications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  certification_type_id BIGINT NOT NULL REFERENCES public.certification_types(id),
  issue_date DATE NOT NULL, expiry_date DATE, certification_number TEXT, certificate_url TEXT,
  verification_status TEXT DEFAULT 'pending' NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES public.users(id), verified_at TIMESTAMPTZ,
  notification_sent_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_certification_number UNIQUE NULLS NOT DISTINCT (certification_number)
);
ALTER TABLE public.trainer_certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read access" ON public.trainer_certifications;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.trainer_certifications;
CREATE POLICY "Allow all read access" ON public.trainer_certifications FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_certifications FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_certifications_type_id ON public.trainer_certifications(certification_type_id);
CREATE INDEX IF NOT EXISTS idx_trainer_certifications_trainer_id ON public.trainer_certifications(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_certifications_status ON public.trainer_certifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_trainer_certifications_expiry ON public.trainer_certifications(expiry_date);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id), trainer_id UUID NOT NULL REFERENCES public.trainers(id),
  dog_id UUID NOT NULL REFERENCES public.dog_profiles(id), session_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  total_amount INT NOT NULL CHECK (total_amount >= 0),
  expected_platform_fee_amount INTEGER NULL CHECK (expected_platform_fee_amount >= 0),
  expected_trainer_payout_amount INTEGER NULL CHECK (expected_trainer_payout_amount >= 0),
  status TEXT NOT NULL DEFAULT 'payment_pending' CHECK (status IN (
    'payment_pending', 'confirmed', 'service_upcoming', 'service_completed',
    'cancelled_user', 'cancelled_trainer', 'no_show_user', 'no_show_trainer'
  )),
  status_changer_role TEXT NULL CHECK (status_changer_role IN ('user', 'trainer', 'admin', 'system')),
  cancellation_reason TEXT,
  is_user_acknowledged BOOLEAN DEFAULT FALSE NOT NULL,
  is_trainer_acknowledged BOOLEAN DEFAULT FALSE NOT NULL,
  trainer_session_notes TEXT NULL, user_session_feedback TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow related users read access" ON public.bookings;
DROP POLICY IF EXISTS "Allow user insert access" ON public.bookings;
DROP POLICY IF EXISTS "Allow related users update status/ack/notes" ON public.bookings;
CREATE POLICY "Allow related users read access" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() = trainer_id);
CREATE POLICY "Allow user insert access" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'payment_pending');
CREATE POLICY "Allow related users update status/ack/notes" ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = trainer_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (
    (auth.uid() = user_id AND (status_changer_role = 'user' OR status_changer_role IS NULL) AND NOT (NEW.trainer_session_notes IS DISTINCT FROM OLD.trainer_session_notes)) OR
    (auth.uid() = trainer_id AND (status_changer_role = 'trainer' OR status_changer_role IS NULL) AND NOT (NEW.user_session_feedback IS DISTINCT FROM OLD.user_session_feedback)) OR
    (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
  );
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trainer_id ON public.bookings(trainer_id);
DROP TRIGGER IF EXISTS set_bookings_timestamp ON public.bookings;
CREATE TRIGGER set_bookings_timestamp BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  order_no TEXT UNIQUE NOT NULL, pay_token TEXT UNIQUE NOT NULL, mode TEXT NOT NULL CHECK (mode IN ('LIVE', 'TEST')),
  amount INTEGER NOT NULL, pay_method TEXT, transaction_id TEXT UNIQUE, paid_amount INTEGER,
  discounted_amount INTEGER DEFAULT 0, approval_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PAY_STANDBY' CHECK (status IN (
    'PAY_STANDBY', 'PAY_COMPLETE', 'PAY_CANCEL', 'REFUND_PROGRESS', 'REFUND_SUCCESS'
  )),
  card_info JSONB NULL, account_info JSONB NULL, cash_receipt_key TEXT NULL, response_data JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow related booking users read access" ON public.payments;
CREATE POLICY "Allow related booking users read access" ON public.payments FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM bookings WHERE id = booking_id) OR auth.uid() IN (SELECT trainer_id FROM bookings WHERE id = booking_id));
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_no ON public.payments(order_no);
CREATE INDEX IF NOT EXISTS idx_payments_pay_token ON public.payments(pay_token);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
DROP TRIGGER IF EXISTS set_payments_timestamp ON public.payments;
CREATE TRIGGER set_payments_timestamp BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), payment_id UUID NOT NULL REFERENCES public.payments(id),
  refund_no TEXT UNIQUE NOT NULL, amount INTEGER NOT NULL, reason TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'completed', 'failed')),
  approval_time TIMESTAMPTZ, response_data JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow related payment users read access" ON public.refunds;
CREATE POLICY "Allow related payment users read access" ON public.refunds FOR SELECT
  USING (auth.uid() IN (SELECT b.user_id FROM bookings b JOIN payments p ON b.id = p.booking_id WHERE p.id = payment_id) OR
         auth.uid() IN (SELECT b.trainer_id FROM bookings b JOIN payments p ON b.id = p.booking_id WHERE p.id = payment_id));
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON public.refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_refund_no ON public.refunds(refund_no);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id),
  user_id UUID NOT NULL REFERENCES public.users(id), trainer_id UUID NOT NULL REFERENCES public.trainers(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), comment TEXT,
  is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
  moderated_by UUID NULL REFERENCES public.users(id), moderated_at TIMESTAMPTZ NULL,
  rating_update_status TEXT DEFAULT 'pending' NOT NULL CHECK (rating_update_status IN ('pending', 'applied', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access (non-hidden)" ON public.reviews;
DROP POLICY IF EXISTS "Allow owner insert on completed booking" ON public.reviews;
DROP POLICY IF EXISTS "Allow owner update own review" ON public.reviews;
DROP POLICY IF EXISTS "Allow owner delete own review" ON public.reviews;
DROP POLICY IF EXISTS "Allow admin moderation update" ON public.reviews;
DROP POLICY IF EXISTS "Allow admin moderation delete" ON public.reviews;
CREATE POLICY "Allow public read access (non-hidden)" ON public.reviews FOR SELECT USING (is_hidden = false);
CREATE POLICY "Allow owner insert on completed booking" ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid() AND status = 'service_completed'));
CREATE POLICY "Allow owner update own review" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow owner delete own review" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow admin moderation update" ON public.reviews FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Allow admin moderation delete" ON public.reviews FOR DELETE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE INDEX IF NOT EXISTS idx_reviews_trainer_id ON public.reviews(trainer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating_status ON public.reviews(rating_update_status);

-- Triggers (❗ [FIXED] 2개의 트리거로 분리)
DROP TRIGGER IF EXISTS set_reviews_timestamp ON public.reviews;
CREATE TRIGGER set_reviews_timestamp BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
-- 1. (BEFORE) 'applied' 상태를 먼저 설정하는 트리거
DROP TRIGGER IF EXISTS set_rating_status_before_insert_update ON public.reviews;
CREATE TRIGGER set_rating_status_before_insert_update
BEFORE INSERT OR UPDATE ON public.reviews -- BEFORE Trigger
FOR EACH ROW EXECUTE FUNCTION set_review_rating_status(); -- Calls new function from Step 3
-- 2. (AFTER) 훈련사 평점을 계산하는 트리거
DROP TRIGGER IF EXISTS review_changed_update_trainer_rating ON public.reviews;
CREATE TRIGGER review_changed_update_trainer_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews -- AFTER Trigger
FOR EACH ROW EXECUTE FUNCTION update_trainer_rating(); -- Calls fixed function from Step 3

CREATE TABLE IF NOT EXISTS public.training_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  dog_id UUID NOT NULL REFERENCES public.dog_profiles(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES public.training_routines(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INT CHECK (duration_seconds >= 0),
  user_feedback TEXT CHECK (user_feedback IN ('easy', 'moderate', 'hard', 'skipped')),
  success_rate NUMERIC(3, 2) CHECK (success_rate >= 0.00 AND success_rate <= 1.00)
);
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.training_logs;
CREATE POLICY "Allow owner CRUD access" ON public.training_logs FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_user_dog ON public.training_logs(user_id, dog_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_routine ON public.training_logs(routine_id);
[6/6 단계] 확장, 로깅, 스케줄 테이블 생성 (의존성 순서 수정)
SQL

-- ⭐ Step 6: Create Extension, Logging, History & Schedule Tables ⭐

-- 6.1 User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  budget_min INTEGER CHECK (budget_min >= 0), budget_max INTEGER CHECK (budget_max >= 0 AND budget_max >= budget_min),
  preferred_locations TEXT[] DEFAULT ARRAY['home', 'center', 'park']::TEXT[],
  preferred_days INT[] DEFAULT ARRAY[1,2,3,4,5]::INT[], -- 1=Mon, 7=Sun
  preferred_time_start TIME DEFAULT '09:00:00', preferred_time_end TIME DEFAULT '18:00:00',
  max_distance_km NUMERIC DEFAULT 10.0 CHECK (max_distance_km >= 0),
  user_location GEOGRAPHY(Point, 4326) NULL,
  min_trainer_experience_years INTEGER DEFAULT 0 CHECK (min_trainer_experience_years >= 0),
  preferred_specialization_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  requires_verified_trainer BOOLEAN DEFAULT false, notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.user_preferences;
CREATE POLICY "Allow owner CRUD access" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_location ON public.user_preferences USING GIST(user_location);
CREATE INDEX IF NOT EXISTS idx_user_preferences_specializations ON public.user_preferences USING GIN (preferred_specialization_ids);
DROP TRIGGER IF EXISTS set_user_preferences_timestamp ON public.user_preferences;
CREATE TRIGGER set_user_preferences_timestamp BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 6.2 Trainer Service Areas Table
CREATE TABLE IF NOT EXISTS public.trainer_service_areas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  area_name TEXT NOT NULL, area_type TEXT NOT NULL CHECK (area_type IN ('administrative', 'custom_polygon', 'radius')),
  geometry GEOGRAPHY(Polygon, 4326) NULL, center_point GEOGRAPHY(Point, 4326) NULL,
  radius_km NUMERIC NULL CHECK (radius_km > 0), is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.trainer_service_areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.trainer_service_areas;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.trainer_service_areas;
CREATE POLICY "Allow public read access" ON public.trainer_service_areas FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_service_areas FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_service_areas_trainer_id ON public.trainer_service_areas(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_service_areas_geom ON public.trainer_service_areas USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_trainer_service_areas_center ON public.trainer_service_areas USING GIST(center_point);
DROP TRIGGER IF EXISTS set_trainer_service_areas_timestamp ON public.trainer_service_areas;
CREATE TRIGGER set_trainer_service_areas_timestamp BEFORE UPDATE ON public.trainer_service_areas FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 6.3 Messaging Tables (Correct Order)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NULL REFERENCES public.bookings(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_conversations_booking_id ON public.conversations(booking_id);
DROP TRIGGER IF EXISTS set_conversations_timestamp ON public.conversations;
CREATE TRIGGER set_conversations_timestamp BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ, joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow participant read own status" ON public.conversation_participants;
DROP POLICY IF EXISTS "Allow participant update own status" ON public.conversation_participants;
DROP POLICY IF EXISTS "Allow participant to see others in convo" ON public.conversation_participants;
CREATE POLICY "Allow participant read own status" ON public.conversation_participants FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Allow participant update own status" ON public.conversation_participants FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Allow participant to see others in convo" ON public.conversation_participants
  FOR SELECT USING (
    conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
  );
CREATE INDEX IF NOT EXISTS idx_conv_participants_user_id ON public.conversation_participants(user_id);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'trainer', 'admin', 'system')),
  content TEXT NOT NULL CHECK (length(content) > 0),
  message_type TEXT DEFAULT 'text' NOT NULL CHECK (message_type IN ('text', 'image', 'system')),
  file_url TEXT NULL, metadata JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow participant read access" ON public.messages;
DROP POLICY IF EXISTS "Allow participant insert access" ON public.messages;
CREATE POLICY "Allow participant read access" ON public.messages FOR SELECT USING (conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()));
CREATE POLICY "Allow participant insert access" ON public.messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()) AND
    sender_role = (SELECT role FROM users WHERE id = auth.uid())
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- Apply RLS Policy to Conversations (Apply Last)
DROP POLICY IF EXISTS "Allow participant read access" ON public.conversations;
CREATE POLICY "Allow participant read access" ON public.conversations FOR SELECT USING (id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()));

-- 6.4 Logging & History Tables
CREATE TABLE IF NOT EXISTS public.toss_api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES public.users(id),
    api_path TEXT NOT NULL, authorization_code TEXT NULL,
    related_payment_id UUID NULL REFERENCES public.payments(id) ON DELETE SET NULL,
    request_body JSONB NULL, response_data JSONB NULL,
    http_status INT NULL, error_message TEXT NULL,
    is_success BOOLEAN NOT NULL,
    called_at TIMESTAMPTZ DEFAULT NOW(), duration_ms INT NULL
);
ALTER TABLE public.toss_api_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin read access" ON public.toss_api_logs;
CREATE POLICY "Allow admin read access" ON public.toss_api_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_user_id ON public.toss_api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_api_path ON public.toss_api_logs(api_path);
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_success_time ON public.toss_api_logs(is_success, called_at DESC);
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_payment_id ON public.toss_api_logs(related_payment_id);
CREATE INDEX IF NOT EXISTS idx_toss_api_logs_performance ON public.toss_api_logs (api_path, duration_ms DESC);

CREATE TABLE IF NOT EXISTS public.payment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    old_status TEXT NULL, new_status TEXT NOT NULL,
    transaction_amount_delta INTEGER NULL,
    changed_by TEXT NULL, change_reason TEXT NULL,
    changed_at TIMESTAMTz DEFAULT NOW()
);
ALTER TABLE public.payment_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow related payment users read access" ON public.payment_status_history;
DROP POLICY IF EXISTS "Allow admin read access" ON public.payment_status_history;
CREATE POLICY "Allow related payment users read access" ON public.payment_status_history FOR SELECT
  USING (auth.uid() IN (SELECT b.user_id FROM bookings b JOIN payments p ON b.id = p.booking_id WHERE p.id = payment_id) OR
         auth.uid() IN (SELECT b.trainer_id FROM bookings b JOIN payments p ON b.id = p.booking_id WHERE p.id = payment_id));
CREATE POLICY "Allow admin read access" ON public.payment_status_history FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE INDEX IF NOT EXISTS idx_payment_status_history_payment_id ON public.payment_status_history(payment_id, changed_at DESC);

CREATE TABLE IF NOT EXISTS public.user_pii_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    changed_field TEXT NOT NULL CHECK (changed_field IN ('full_name', 'email', 'phone', 'ci')),
    old_value_encrypted TEXT NULL, new_value_encrypted TEXT NULL,
    changed_by UUID NULL REFERENCES public.users(id),
    change_reason TEXT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_pii_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin read access" ON public.user_pii_history;
DROP POLICY IF EXISTS "Allow owner read access" ON public.user_pii_history;
CREATE POLICY "Allow admin read access" ON public.user_pii_history FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Allow owner read access" ON public.user_pii_history FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_user_pii_history_user_time ON public.user_pii_history(user_id, changed_at DESC);

-- 6.5 Scheduling Tables
CREATE TABLE IF NOT EXISTS public.trainer_availability (
    id BIGSERIAL PRIMARY KEY,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL CHECK (end_time > start_time),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trainer_id, day_of_week, start_time, end_time)
);
ALTER TABLE public.trainer_availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.trainer_availability;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.trainer_availability;
CREATE POLICY "Allow public read access" ON public.trainer_availability FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_availability FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_availability_trainer_day ON public.trainer_availability(trainer_id, day_of_week);
DROP TRIGGER IF EXISTS set_trainer_availability_timestamp ON public.trainer_availability;
CREATE TRIGGER set_trainer_availability_timestamp BEFORE UPDATE ON public.trainer_availability FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.trainer_schedule_exceptions (
    id BIGSERIAL PRIMARY KEY,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_full_day_off BOOLEAN DEFAULT FALSE NOT NULL,
    start_time_override TIME NULL,
    end_time_override TIME NULL,
    reason TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (trainer_id, exception_date),
    CONSTRAINT check_override_times CHECK (is_full_day_off = TRUE OR (start_time_override IS NOT NULL AND end_time_override IS NOT NULL AND end_time_override > start_time_override))
);
ALTER TABLE public.trainer_schedule_exceptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.trainer_schedule_exceptions;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.trainer_schedule_exceptions;
CREATE POLICY "Allow public read access" ON public.trainer_schedule_exceptions FOR SELECT USING (true);
CREATE POLICY "Allow owner CRUD access" ON public.trainer_schedule_exceptions FOR ALL USING (auth.uid() = trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_schedule_exceptions_trainer_date ON public.trainer_schedule_exceptions(trainer_id, exception_date);
DROP TRIGGER IF EXISTS set_trainer_schedule_exceptions_timestamp ON public.trainer_schedule_exceptions;
CREATE TRIGGER set_trainer_schedule_exceptions_timestamp BEFORE UPDATE ON public.trainer_schedule_exceptions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 6.6 (Optional) Training Logs Table
CREATE TABLE IF NOT EXISTS public.training_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  dog_id UUID NOT NULL REFERENCES public.dog_profiles(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES public.training_routines(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INT CHECK (duration_seconds >= 0),
  user_feedback TEXT CHECK (user_feedback IN ('easy', 'moderate', 'hard', 'skipped')),
  success_rate NUMERIC(3, 2) CHECK (success_rate >= 0.00 AND success_rate <= 1.00)
);
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow owner CRUD access" ON public.training_logs;
CREATE POLICY "Allow owner CRUD access" ON public.training_logs FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_user_dog ON public.training_logs(user_id, dog_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_routine ON public.training_logs(routine_id);


2단계에서 다시 ERROR: 42P01: missing FROM-clause entry for table "new" 발생함