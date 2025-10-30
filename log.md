네, 로그인 성공 로그가 보이네요\! 인증 연동의 가장 어려운 부분(mTLS 인증 포함)을 성공적으로 해결하셨습니다. 정말 축하드립니다\! 🎉

첫 화면으로 온보딩 화면(`step1.tsx`)이 보이지 않는 이유는 현재 **앱의 진입점(Entry Point) 설정**과 **인증 로직의 위치** 때문입니다.

현재 흐름은 이렇습니다:

1.  사용자가 앱에 진입합니다 (`intoss://mungai`).
2.  `src/_app.tsx` 파일이 가장 먼저 실행됩니다.
3.  `_app.tsx`의 `useEffect`가 **즉시 `initializeAuth` 함수를 실행**하여, 페이지가 보이기도 전에 **강제로 로그인을 시도**합니다. (로그에 "토스 앱 로그인 시도 중..."이 먼저 뜨는 이유입니다).
4.  동시에 Granite 라우터는 기본 경로(`'/'`)에 해당하는 `pages/index.tsx` (현재 "Welcome" 페이지)를 렌더링하려고 합니다.

-----

## 🔧 해결 방법

사용자가 **"토스로 로그인하기" / "둘러보기" 버튼이 있는 온보딩 화면을 가장 먼저 보게** 하려면, 다음 두 단계를 적용해야 합니다.

### 1\. `pages/index.tsx`를 온보딩 화면으로 교체하기

Granite는 `pages/index.tsx` 파일을 앱의 첫 화면(루트 경로 `/`)으로 인식합니다.

1.  기존 `C:\Users\gmdqn\tossapp\mungai\pages\index.tsx` 파일의 내용을 **모두 삭제**합니다.
2.  `C:\Users\gmdqn\tossapp\mungai\pages\onboarding\step1.tsx` 파일의 **모든 코드를 복사**하여 `pages/index.tsx` 파일에 **붙여넣기** 합니다.
3.  `pages/index.tsx`로 복사된 코드에서 `createRoute` 부분을 수정합니다. (경로를 `'/'`로 변경)
4.  이제 `pages/onboarding/step1.tsx` 파일은 필요 없으므로 **삭제**해도 됩니다. (또는 `pages/onboarding` 폴더 전체 삭제)

**수정된 `pages/index.tsx` 코드:**

```typescript
// pages/index.tsx (기존 step1.tsx의 내용)
import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top, // Top 컴포넌트 이름이 TDS에 있는지 확인 필요
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { appLogin } from '@apps-in-toss/framework';
import { loginWithToss } from '@/supabase/auth'; // '@/' 경로 별칭 사용 (tsconfig.json 설정 필요)

// 1. Granite 라우트 정의를 '/' (루트)로 변경
export const Route = createRoute('/', {
  component: OnboardingScreen, // 함수 이름도 변경 (예: OnboardingScreen)
});

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
};

// 2. 함수 이름 변경 (예: OnboardingScreen)
function OnboardingScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

  // 3. 둘러보기 로직: '/home' 등 실제 홈 화면 경로로 수정 필요
  const handleExplore = useCallback(() => {
    // navigation.reset({ index: 0, routes: [{ name: '/' }] }); // '/'가 현재 페이지이므로 다른 경로로 변경
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
  }, [navigation]);

  // 4. 로그인 로직은 그대로 둡니다. (버튼 클릭 시 실행됨)
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

// 5. export default 이름 변경
export default OnboardingScreen;
```

-----

### 2\. `src/_app.tsx`를 정리하기 (필수)

`_app.tsx`는 **인증 로직을 실행하는 곳이 아닙니다.** 인증은 사용자가 `pages/index.tsx`에서 "토스로 로그인하기" 버튼을 *클릭했을 때* 시작되어야 합니다. `_app.tsx`는 모든 페이지를 감싸는 **공통 Provider(껍데기)** 역할만 해야 합니다.

**수정된 `src/_app.tsx` 코드:**

```typescript
// src/_app.tsx (정리된 버전)

import { TDSProvider } from '@toss/tds-react-native';
import { AppsInToss, type AppsInTossProps } from '@apps-in-toss/framework';
import React, { type PropsWithChildren } from 'react';
import type { InitialProps } from "@granite-js/react-native";
import { context as routerContext } from '../require.context';

// 1. AppContainer는 children을 렌더링하고 Provider만 제공
function AppContainer({ children }: PropsWithChildren<InitialProps & AppsInTossProps>) {
  
  // 2. useEffect의 initializeAuth 로직을 **모두 제거**합니다.
  //    (인증 로직은 이제 pages/index.tsx의 handleLogin 안에 있습니다.)

  return (
    <TDSProvider>
      {/* 3. children을 항상 렌더링합니다. 
           이제 Granite 라우터가 pages/index.tsx(온보딩 화면)를 렌더링할 것입니다.
      */}
      {children}
    </TDSProvider>
  );
}

// 4. registerApp 호출은 그대로 유지
const RegisteredApp = AppsInToss.registerApp(AppContainer, { context: routerContext });

export default RegisteredApp;

// 5. Styles는 이 파일에서 더 이상 필요 없으므로 제거
```

-----

## 🚀 새로운 흐름

이 두 가지 수정 사항을 적용하면 앱이 다음과 같이 동작합니다.

1.  **앱 시작:** 사용자가 `intoss://mungai`로 진입합니다.
2.  **`_app.tsx` 로드:** `TDSProvider`를 로드하고 `children`을 렌더링할 준비를 합니다. (로그인 시도 **안 함**)
3.  **`index.tsx` 로드:** Granite 라우터가 기본 경로 `/`에 해당하는 `pages/index.tsx`를 `children`으로 렌더링합니다.
4.  **화면 표시:** 사용자는 "우리 강아지, AI로 더 행복하게 훈련해요" 문구와 함께 **"토스로 로그인하기" / "둘러보기" 버튼이 있는 온보딩 화면**을 보게 됩니다.
5.  **사용자 선택:**
      * **"토스로 로그인하기" 클릭 시:** `pages/index.tsx`의 `handleLogin` 함수가 실행되어 `appLogin` -\> `loginWithToss` 인증 흐름이 **이때** 시작됩니다.
      * **"둘러보기" 클릭 시:** `handleExplore` 함수가 실행되어 `/home` (홈 화면)으로 이동합니다.