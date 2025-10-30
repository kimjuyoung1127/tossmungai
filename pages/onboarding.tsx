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
import { createRoute, Video } from '@granite-js/react-native';
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
  const videoRef = React.useRef(null);

  // 둘러보기 로직: '/home' 등 실제 홈 화면 경로로 수정 필요
  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
  }, [navigation]);

  // 로그인 로직은 그대로 둡니다. (버튼 클릭 시 실행됨)
  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const { authorizationCode, referrer } = await appLogin();

      if (!authorizationCode) {
        throw new Error('토스 로그인 인가 코드를 받지 못했어요.');
      }

      await loginWithToss(authorizationCode, referrer);

      // 로그인 성공 시 홈 화면('/home')으로 이동
      navigation.reset({ index: 0, routes: [{ name: '/home' }] });

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
        <View style={{ marginVertical: 16, alignItems: 'center' }}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={{ width: 375, height: 300 }} // Increased height to prevent clipping
          muted={true}
          paused={false}
          isLooping={true}
          resizeMode="cover"
          onError={(error) => {
            // Handle video error silently
          }}
          onLoad={() => {
            // Video loaded successfully
          }}
          onPlaybackStateChanged={(state) => {
            // Monitor playback state but avoid unnecessary intervention
          }}
          onEnd={() => {
            // With isLooping=true, onEnd shouldn't normally fire
            // But if it does, restart the video with minimal delay
            setTimeout(() => {
              if (videoRef.current && videoRef.current.seek) {
                videoRef.current.seek(0);
              }
            }, 50);
          }}
        />
      </View>
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