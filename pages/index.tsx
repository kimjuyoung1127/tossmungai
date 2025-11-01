// pages/index.tsx (Root Onboarding screen)
import React, { useCallback } from 'react';
import { View, Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
  ListRow,
  Asset,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { appLogin } from '@apps-in-toss/framework';
import { loginWithToss } from '@/supabase/auth'; // '@/' 경로 별칭 사용 (tsconfig.json 설정 필요)
import VideoContainer from '@/src/components/onboarding/VideoContainer'; // Import the new component

// Granite 라우트 정의
export const Route = createRoute('/', {
  component: OnboardingScreen,
});

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
  grey700: '#5B6371',
};

// StyleSheet with original-style styles
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 150, // CTA 높이 고려
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: adaptive.grey900,
    marginBottom: 16,
  },
  trustCard: {
    backgroundColor: '#F2F4F6', // adaptive.grey100
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  trustCardSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  metricContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  badge: {
    backgroundColor: '#E9ECEF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  fixedBottomSubText: {
    alignItems: 'center',
    marginTop: 8,
  },
  ctaSubtext: {
    textAlign: 'center',
    fontSize: 12,
    color: adaptive.grey900,
  },
  laterText: {
    textAlign: 'center',
    fontSize: 14,
    color: adaptive.grey900,
    marginTop: 8,
  },
});

function OnboardingScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

  // 둘러보기 로직: '/home' 등 실제 홈 화면 경로로 수정 필요
  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
  }, [navigation]);

  // 로그인 후 역할 선택 화면으로 이동
  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const { authorizationCode, referrer } = await appLogin();

      if (!authorizationCode) {
        throw new Error('토스 로그인 인가 코드를 받지 못했어요.');
      }

      await loginWithToss(authorizationCode, referrer);

      // 로그인 성공 시 역할 선택 화면으로 이동
      navigation.reset({ index: 0, routes: [{ name: '/onboarding/select-role' }] });

    } catch (error: any) {
      Alert.alert(
        "로그인 실패",
        `로그인 중 문제가 발생했어요: ${error.message || '알 수 없는 오류'}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigation]); // navigation 의존성 추가

  // Construct the Supabase video URL from environment variable
  // For Expo, environment variables need to be prefixed with EXPO_PUBLIC_
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const videoUri = supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/onboarding/ai_dog_loop.mp4` : 'https://ewkjiuifaqqdnpvqwuer.supabase.co/storage/v1/object/public/onboarding/ai_dog_loop.mp4';

  return (
    <FixedBottomCTAProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 1. Hero Section */}
        <View style={{ padding: 16 }}>
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                매일 10분, 우리 강아지가 달라집니다
              </Top.TitleParagraph>
            }
            subtitle2={
              <Top.SubtitleParagraph>
                AI가 분석한 맞춤 훈련법을 배우고, 내 주변 최고의 훈련사를 만나보세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>
        <VideoContainer videoUri={videoUri} />

        {/* 2. Value Cards Section */}
        <View style={styles.section}>
          <View style={{ marginTop: 16 }}>
            <ListRow
              left={<Asset.Icon name="icon-brain-mono" frameShape={Asset.frameShape.CleanW24} />}
              contents={
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>AI 맞춤 훈련</Text>
                  <Text style={{ fontSize: 14, color: adaptive.grey700 }}>성향을 분석해 훈련을 추천해요</Text>
                </View>
              }
            />
            <ListRow
              left={<Asset.Icon name="icon-user-account-mono" frameShape={Asset.frameShape.CleanW24} />}
              contents={
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>전문 훈련사 매칭</Text>
                  <Text style={{ fontSize: 14, color: adaptive.grey700 }}>검증된 프로와 예약까지 한 번에</Text>
                </View>
              }
            />
            <ListRow
              left={<Asset.Icon name="icon-creditcard-mono" frameShape={Asset.frameShape.CleanW24} />}
              contents={
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>기록과 결제, 통합 관리</Text>
                  <Text style={{ fontSize: 14, color: adaptive.grey700 }}>진행률과 비용, 한눈에</Text>
                </View>
              }
            />
          </View>
        </View>

        {/* 3. Trust Section with metrics at the top */}
        <View style={styles.section}>
          <View style={styles.metricContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓ 검증 배지 100%</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⭐ 리뷰 1,200+</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔄 재예역 87%</Text>
            </View>
          </View>
          <Text style={[styles.sectionTitle, { color: adaptive.grey900, fontWeight: 'bold', fontSize: 18, marginTop: 16 }]}>
            보호자들이 직접 확인했어요
          </Text>
          <View style={styles.trustCard}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{"\"3일 만에 짖음이 줄었어요!\" ⭐⭐⭐⭐⭐"}</Text>
            <Text style={[styles.trustCardSubtitle, { color: adaptive.grey700, marginTop: 4 }]}>
              - 골든 리트리버 '바둑이' 보호자님
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 4. FixedBottomCTA with emphasis on primary action */}
      <FixedBottomCTA.Double
        leftButton={
          <Button
            type="dark"
            style="weak"
            display="block"
            onPress={handleExplore}
            disabled={isLoading}
          >
            나중에 할래요
          </Button>
        }
        rightButton={
          <Button
            type="primary"
            style="fill"
            display="block"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          >
            1분 만에 시작하기
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default OnboardingScreen;