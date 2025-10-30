// onboarding.tsx (Onboarding screen component)
import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { appLogin } from '@apps-in-toss/framework';
import { loginWithToss } from '@/supabase/auth'; // '@/' 경로 별칭 사용 (tsconfig.json 설정 필요)

// Granite 라우트 정의
export const Route = createRoute('/', {
  component: OnboardingScreen,
});

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
};

function OnboardingScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

  // 둘러보기 로직: '/home' 등 실제 홈 화면 경로로 수정 필요
  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
  }, [navigation]);

  // 로그인 로직은 그대로 둡니다. (버튼 클릭 시 실행됨)
  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Attempting Toss login...');
      const { authorizationCode, referrer } = await appLogin();
      console.log('Received auth code:', authorizationCode ? 'Yes' : 'No');

      if (!authorizationCode) {
        throw new Error('토스 로그인 인가 코드를 받지 못했어요.');
      }

      console.log('Attempting Supabase login with Toss code...');
      await loginWithToss(authorizationCode, referrer);
      console.log('Supabase login successful.');

      // 로그인 성공 시 홈 화면('/home')으로 이동
      navigation.reset({ index: 0, routes: [{ name: '/home' }] });

    } catch (error: any) {
      console.error("Login process failed:", error);
      Alert.alert(
        "로그인 실패",
        `로그인 중 문제가 발생했어요: ${error.message || '알 수 없는 오류'}`
      );
    } finally {
      setIsLoading(false);
      console.log('Login attempt finished.');
    }
  }, [navigation]); // navigation 의존성 추가

  return (
    <FixedBottomCTAProvider>
      <View style={{ flex: 1, justifyContent: 'space-between', padding: 16 }}>
        {/* === 메인 콘텐츠 === */}
        <Top
          title={
            <Top.TitleParagraph color={adaptive.grey900}>
              우리 강아지, AI로 더 행복하게 훈련해요
            </Top.TitleParagraph>
          }
          subtitle2={
            <Top.SubtitleParagraph>
              AI가 분석한 맞춤 훈련법을 배우고, 내 주변 최고의 훈련사를 만나보세요.
            </Top.SubtitleParagraph>
          }
        />
        <View />
      </View>

      {/* === 하단 고정 버튼 === */}
      <FixedBottomCTA.Double
        leftButton={
          <Button
            type="dark"
            style="weak"
            display="block"
            onPress={handleExplore}
            disabled={isLoading}
          >
            로그인 없이 둘러보기
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
            토스로 로그인하기
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default OnboardingScreen;