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