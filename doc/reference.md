앱인토스 SDK
Granite는 앱인토스 SDK의 공통 런타임 프레임워크로, 앱인토스 SDK의 서비스 런타임을 구성하는 핵심 모듈이에요. 현재는 WebView용 SDK와 ReactNative용 SDK 두 가지 형태로 제공돼요.
아래 문서는 Granite의 AppsInToss와 네이티브가 화면 진입 시 전달하는 InitialProps를 설명해요.

샘플 프로젝트 보러가기 ↗
예제 모음 확인하기 ↗
시그니처
AppsInToss

AppsInToss: {
    registerApp(
      AppContainer: ComponentType<PropsWithChildren<InitialProps>>,
      { appName, context, router }: BedrockProps
    ): (initialProps: InitialProps) => JSX.Element;
    readonly appName: string;
}
InitialProps

type InitialProps = AndroidInitialProps | IOSInitialProps;
AppsInToss
개요
AppsInToss.registerApp은 서비스의 기본 환경을 설정하고, 복잡한 설정 없이 개발을 빠르게 시작할 수 있도록 도와줘요. appName 만 전달해도 파일 기반 라우팅, 쿼리 파라미터 처리, 뒤로 가기 제어 등 핵심 기능을 바로 활용할 수 있어요.

제공 기능
라우팅: 파일 경로에 맞게 URL이 자동으로 매핑돼요. Next.js의 파일 기반 라우팅과 비슷해요.
/my-service/pages/index.ts → intoss://my-service
/my-service/pages/home.ts → intoss://my-service/home.
쿼리 파라미터: URL 스킴으로 전달된 파라미터를 쉽게 사용할 수 있어요. 예: referrer 값을 받아 로깅.
뒤로 가기 제어: 뒤로 가기 이벤트를 가로채 다이얼로그 표시, 화면 닫기 등의 처리를 할 수 있어요.
화면 가시성: 화면이 보이는지/가려졌는지 감지해 상황에 맞는 동작을 처리할 수 있어요.
프로퍼티
registerApp필수 · RegisterService
서비스 초기화를 수행하고 라우팅/파라미터/뒤로가기/가시성 등의 기본 기능을 활성화해요.

InitialProps
개요
React Native 앱에서 사용자가 특정 화면에 진입할 때, 네이티브(Android/iOS)가 앱으로 전달하는 초기 데이터 타입이에요. 화면 초기화에 필요한 중요한 정보가 포함되어 있으며, 플랫폼별로 구조가 달라요.

Android: AndroidInitialProps
iOS: IOSInitialProps
프로퍼티
platform필수 · 'ios' | 'android'
현재 앱이 실행 중인 플랫폼이에요.

initialColorPreference필수 · ColorPreference
초기 컬러 테마예요. 사용자가 설정한 컬러 테마를 나타내요.

networkStatus필수 · NetworkStatus
현재 기기의 네트워크 연결 상태와 연결된 네트워크예요.

schemestring
현재 화면에 진입하는 데 사용한 URL 스킴이에요.

initialFontSize필수 · xSmall | Small | Medium | Large | xLarge | xxLarge | xxxLarge | A11y_Medium | A11y_Large | A11y_xLarge | A11y_xxLarge | A11y_xxxLarge
(iOS only) iOS 시스템 폰트 크기예요. 기본값은 Large예요.

isVisible필수 · boolean
(iOS only) 현재 화면이 보이는 상태인지 여부예요. 초기값은 true예요.

initialFontScale필수 · string
(Android only) Android 접근성 설정을 반영한 시스템 폰트 스케일이에요.

예제
A. AppsInToss로 앱 등록 (베이직)

import { AppsInToss } from '@apps-in-toss/framework';
import { PropsWithChildren } from 'react';
import { InitialProps } from '@granite-js/react-native';
import { context } from '../require.context';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return <>{children}</>;
}

export default AppsInToss.registerApp(AppContainer, { context });
B. InitialProps 활용 (플랫폼별 초기 데이터 사용)

import { AppsInToss } from '@apps-in-toss/framework';
import { PropsWithChildren } from 'react';
import { InitialProps } from '@granite-js/react-native';
import { context } from '../require.context';

function AppContainer({ children, ...initialProps }: PropsWithChildren<InitialProps>) {
  // 화면 진입 시 네이티브가 내려준 초기값을 활용할 수 있어요
  console.log({ initialProps });
  return <>{children}</>;
}

export default AppsInToss.registerApp(AppContainer, { context });
공통 레이아웃
지원환경: React Native
실행환경: Toss AppSandbox App
레이아웃을 사용하면 여러 페이지에서 공통으로 사용되는 UI 요소를 쉽게 관리할 수 있어요. 헤더, 네비게이션 바, 푸터와 같은 공통 컴포넌트를 레이아웃으로 구성하면 코드 중복을 줄이고 일관된 사용자 경험을 제공할 수 있어요.

레이아웃 파일 만들기
레이아웃은 _layout.tsx 파일을 생성해서 구현할 수 있어요. 이 파일의 위치에 따라 적용되는 범위가 달라져요.


import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
레이아웃 적용 범위
레이아웃은 파일 위치에 따라 다른 범위에 적용돼요.

pages/_layout.tsx: 모든 페이지에 적용
pages/about/_layout.tsx: intoss://{서비스명}/about 하위의 모든 페이지에 적용

레이아웃은 중첩해서 사용할 수 있어요. 페이지에 여러 레이아웃이 적용될 때는 상위 디렉토리부터 순차적으로 적용돼요.


pages/
├── _layout.tsx          // 전역 레이아웃
├── about/
│   ├── _layout.tsx     // about 섹션 레이아웃
│   ├── index.tsx       // about 메인 페이지
│   └── team.tsx        // 팀 소개 페이지
└── index.tsx           // 메인 페이지
예를 들어, 위와 같은 구조로 _layout.tsx가 구성되어 있을 때, about/team.tsx 페이지는 다음 순서로 레이아웃이 적용돼요.

pages/_layout.tsx (최상위 레이아웃)
pages/about/_layout.tsx (about 섹션 레이아웃)
pages/about/team.tsx (실제 페이지 컴포넌트)
이렇게 레이아웃을 중첩해서 사용하면 전역적으로 필요한 UI 요소와 특정 섹션에서만 필요한 UI 요소를 효과적으로 구성할 수 있어요.

레이아웃 예시
전역 레이아웃
모든 페이지에 적용되는 레이아웃을 만들어 보세요.


pages/_layout.tsx

components/Header.tsx

components/Footer.tsx

import { PropsWithChildren } from "react";
import { View } from "react-native";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      {children}
      <Footer />
    </View>
  );
}
섹션별 레이아웃
특정 섹션에만 적용되는 레이아웃을 만들어 보세요.


pages/about/_layout.tsx

components/AboutSidebar.tsx

import { PropsWithChildren } from "react";
import { View } from "react-native";
import { AboutSidebar } from "../../components/AboutSidebar";

export default function AboutLayout({ children }: PropsWithChildren) {
  return (
    <View style={{ flexDirection: "row" }}>
      <AboutSidebar />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
레이아웃에서 쿼리 파라미터 받아오기
레이아웃에서 쿼리 파라미터를 받아오려면 useParams 훅을 사용할 수 있어요. useParams는 현재 화면의 파라미터를 읽어서 객체 형태로 반환해요.

useParams 훅 사용 예시
다음은 _layout.tsx 파일에서 useParams 훅을 사용하는 예제예요. URL 쿼리 파라미터로 전달된 title 값을 기반으로 화면 상단에 제목을 동적으로 표시해요.


pages/_layout.tsx

import { useParams } from "react-native-bedrock";
import { PropsWithChildren } from "react";
import { View, Text } from "react-native";

export default function Layout({ children }: PropsWithChildren) {
  // 현재 화면의 파라미터를 가져와요.
  const params = useParams({ strict: false });

  // 'title' 파라미터를 가져오고 기본값을 설정해요.
  const title = params?.title ?? "기본 제목";

  return (
    <View style={{ flex: 1 }}>
      {/* 동적으로 생성된 헤더 */}
      <View style={{ padding: 16, backgroundColor: "#f0f0f0" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{title}</Text>
      </View>
      {/* 자식 컴포넌트를 렌더링 */}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
레퍼런스
화면 이동하기
쿼리 파라미터 사용하기
Pager
Previous page
시작하기공통 설정
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
앱에서 공통으로 사용하는 브랜드/호스트/권한/빌드 출력 등의 전역 옵션을 한 곳에서 관리해요.
아래 예제는 각각 WebView 와 React Native 환경에서의 기본 설정 템플릿이에요.

기본 설정을 하면 브릿지 뷰와 내비게이션 바가 자동으로 노출돼요.
내비게이션 바의 더보기 버튼을 통해 공유/신고하기 등을 진행할 수 있어요.

게임 서비스 설정

게임인 경우에는 다음과 같이 설정해야 해요.

webViewProps.type = 'game'
brand.bridgeColorMode = 'inverted'
자세한 사용 방법은 권한 가이드 와 WebView 속성 제어 가이드를 참고하세요.

브릿지뷰


네비게이션 바 : 비게임


네비게이션 바 : 게임


WebView

interface defineConfig {
  appName: string,           // 콘솔에 등록한 앱ID
  brand: {
    displayName: string,     // 사용자에게 노출될 앱 이름
    primaryColor: string,    // 브랜드 기본 색상(hex)
    icon: string,            // 앱 아이콘(이미지 웹 URL)
    bridgeColorMode: 'basic' | 'inverted', // 기본 모드 | 다크 모드
  },
  web: {
    host: string,            // 개발 서버 호스트
    port: number,            // 개발 서버 포트
    commands: {
      dev: string,           // 실행 명령어
      build: string,         // 빌드 명령어
    },
  },
  permissions: Permission[],    // 런타임 권한(필요 시 확장)
  outdir: string,               // 빌드 산출물 경로
  webViewProps: WebViewProps    // 추가 속성 
}
ReactNative

interface defineConfig({
  scheme: string,            // 앱 라우팅 스킴 (intoss)
  appName: string,           // 콘솔에 등록한 앱ID
  plugins: [
    appsInToss({
      brand: {
        displayName: string,  // 사용자에게 노출될 앱 이름
        primaryColor: string, // 브랜드 기본 색상(hex)
        icon: string,         // 앱 아이콘(이미지 웹 URL)
        bridgeColorMode: 'basic' | 'inverted', // 기본 모드 | 다크 모드
      },
      permissions: Permission[], // 런타임 권한(필요 시 확장)
    }),
  ],
});
예시

WebView

ReactNative

import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'webview-template',
  brand: {
    displayName: '웹뷰템플릿', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: '#3182F6', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "https://static.toss.im/icons/png/4x/icon-person-man.png", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
    bridgeColorMode: 'inverted', // 다크모드 (게임)
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [
    {
      name: "clipboard",
      access: "read",
    },
    {
      name: "clipboard",
      access: "write",
    },
    {
      name: "camera",
      access: "access",
    },
    {
      name: "photos",
      access: "read",
    },
  ],
  outdir: 'dist',
  webViewProps: {
    type: 'partner' | 'game' | 'extenral'
  }
});
Pager
Previous page
공통 네비게이션바
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
상단 공통 네비게이션바에 아이콘 추가하는 방법을 안내드려요.




React Native: useTopNavigation()의 addAccessoryButton()으로 런타임에 버튼을 추가하거나, granite.config.ts의 navigationBar.initialAccessoryButton으로 초기에 한 개를 노출할 수 있어요.

WebView: partner.addAccessoryButton()으로 런타임에 버튼을 추가하고, 클릭 이벤트는 tdsEvent.addEventListener('navigationAccessoryEvent')로 받아요. 초기 노출은 web용 defineConfig의 navigationBar.initialAccessoryButton을 사용해요.

시그니처

interface NavigationBarOptions {
  withBackButton?: boolean;
  withHomeButton?: boolean;
  initialAccessoryButton?: InitialAccessoryButton; // 1개만 노출 가능
}

interface InitialAccessoryButton {
  id: string;
  title?: string;
  icon: {
    name: string;
  };
}
예제
네비게이션 바에 아이콘 버튼 추가하기 (초기 설정)

React

ReactNative

import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
   // ...
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
    initialAccessoryButton: {
      id: 'heart',
      title: 'Heart',
      icon: {
        name: 'icon-heart-mono',
      },
    }
  },
});
네비게이션 바에 아이콘 추가하기 (동적 추가)

React

ReactNative

import { partner, tdsEvent } from '@apps-in-toss/web-framework'
  // ...
  useEffect(() => {
    partner.addAccessoryButton({  // 하트 아이콘 버튼 추가
      id: 'heart',
      title: '하트',
      icon: {
        name: 'icon-heart-mono',
      },
    });

    // 네비게이션 액세서리 버튼 클릭 이벤트 리스너 등록
    const cleanup = tdsEvent.addEventListener('navigationAccessoryEvent', {
      onEvent: ({ id }) => {
        if (id === 'heart') {
          console.log('버튼 클릭');
        }
      },
    });

    return cleanup;
  }, []);
Pager
Previous page
라우팅
지원환경: React Native
실행환경: Toss AppSandbox App
Granite 애플리케이션에서 새로운 화면으로 이동하거나, 화면 히스토리를 제어하는 등의 라우팅 작업을 쉽게 처리할 수 있어요.

WebView 라우팅

WebView에서는 프로젝트에 설정한 웹 라우터(예: React Router) 규칙을 그대로 따라요.

아래 예제 코드를 통해 다양한 라우팅 기능을 설명할게요.

INFO

Granite는 React Navigation을 기반으로 동작해요

예제 코드
예제 코드는 총 3개의 페이지로 구성되어 있고, 구조는 아래와 같아요.


root
├─── pages
│    ├─── page-a.tsx
│    ├─── page-b.tsx
│    └─── page-c.tsx
└─── src
     └─── ...
페이지 A: 화면 이동하기

useNavigation은 화면 간 이동을 처리할 때 사용해요. navigate 메서드로 이동할 화면의 경로와 필요한 데이터를 함께 전달할 수 있어요.


// page-a.tsx
import { createRoute, useNavigation } from '@granite-js/react-native'; 
import { StyleSheet, View, Text, Pressable } from "react-native";

export const Route = createRoute("/page-a", {
  validateParams: (params) => params,
  component: PageA,
});

function PageA() {
  const navigation = useNavigation(); 
  const handlePress = () => {
    navigation.navigate("/page-b");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#3182f6" }]}>
      <Text style={styles.text}>Page A</Text>
      <Pressable onPress={handlePress}>
        <Text style={styles.buttonLabel}>B 페이지로 이동하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
  buttonLabel: {
    color: "white",
  },
});
주요 포인트
useNavigation 훅을 사용해 navigation 객체를 가져와요.
navigation.navigate('/page-b')를 호출하면 'B' 페이지로 이동해요.
페이지 B: 이전 화면으로 돌아가기

goBack 메서드를 사용하면 이전 화면으로 돌아갈 수 있어요. 하지만 이전 화면 기록이 없는 경우에는 에러가 발생할 수 있으니, canGoBack으로 먼저 확인해야 해요.


// page-b.tsx
import { createRoute, useNavigation } from '@granite-js/react-native'; 
import { StyleSheet, View, Text, Pressable } from "react-native";

export const Route = createRoute("/page-b", {
  validateParams: (params) => params,
  component: PageB,
});

function PageB() {
  const navigation = useNavigation(); 

  // 이전 화면으로 돌아가는 함수예요.
  const handlePressBackButton = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.warn("이전 화면으로 이동할 수 없습니다.");
    }
  };

  const handlePressNextButton = () => {
    navigation.navigate("/page-c", {
      message: "안녕!",
      date: new Date().getTime(),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: "#fe9800" }]}>
      <Text style={styles.text}>Page B</Text>
      <Pressable onPress={handlePressBackButton}>
        <Text style={styles.buttonLabel}>이전으로 이동하기</Text>
      </Pressable>
      <Pressable onPress={handlePressNextButton}>
        <Text style={styles.buttonLabel}>C 페이지로 이동하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
  buttonLabel: {
    color: "white",
  },
});
주요 포인트
canGoBack()으로 이전 화면이 있는지 확인하고, 있으면 goBack()을 호출해요.
navigate('/page-c', { message: '안녕!', date: new Date().getTime() })로 데이터를 전달하면서 'C' 페이지로 이동해요.
페이지 C: 전달받은 데이터 사용하기

Route.useParams 훅은 다른 화면에서 전달된 데이터를 가져올 때 사용해요.

이때, createRoute.validateParams 옵션을 설정하면 전달된 데이터를 타입 검증(Type-Safe)하면서 접근할 수 있어요. 이를 통해 잘못된 데이터 형식으로 인한 에러를 방지할 수 있어요.


// page-c.tsx
import { createRoute, useNavigation } from '@granite-js/react-native'; 
import { CommonActions } from "@react-native-bedrock/native/@react-navigation/native";
import { StyleSheet, View, Text, Pressable } from "react-native";

export const Route = createRoute("/page-c", {
  validateParams: (params) => params as { message: string; date: number },
  component: PageC,
});

function PageC() {
  const navigation = useNavigation();
  const params = Route.useParams(); 
  // 또는 아래와 같이 사용할 수 있어요.
  // import { useParams } from 'react-native-bedrock';
  //
  // const params = useParams({
  //   from: '/page-b',
  // });

  const handlePressHomeButton = () => {
    navigation.dispatch((state) => {
      return CommonActions.reset({
        ...state,
        index: 0,
        routes: state.routes.filter((route) => route.name === "/page-a"),
      });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: "#f04452" }]}>
      <Text style={styles.text}>{params.message}</Text> // [!code highlight]
      <Text style={styles.text}>{params.date}</Text> // [!code highlight]
      <View style={styles.line} />
      <Text style={styles.text}>Page C</Text>
      <Pressable onPress={handlePressHomeButton}>
        <Text style={styles.buttonLabel}>처음으로 이동하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
  buttonLabel: {
    color: "white",
  },
});
주요 포인트
Route.useParams 훅을 사용하면 URL에서 전달된 데이터(매개변수)에 접근할 수 있어요.
createRoute.validateParams 옵션을 설정하면 데이터 타입을 검증하면서(Type-Safe) 안전하게 사용할 수 있어요.
화면 파라미터 타입 정의하기
페이지마다 아래와 같은 Route 컴포넌트를 정의해요. 여기서 validateParams 옵션은 해당 화면에서 받을 파라미터의 타입을 정의해요.


export const Route = createRoute("/page-c", {
  validateParams: (params) => params as { message: string; date: number }, 
  component: PageC,
});
위 코드에서 validateParams는 message와 date라는 두 필드를 포함한 매개변수를 타입으로 정의해요.

이를 통해 다른 코드에서 useNavigate나 useParams를 사용할 때, 타입 검사를 통해 필요한 경로와 전달해야 할 데이터를 명확히 알 수 있어요. 이렇게 하면 코드의 안전성과 가독성이 높아져요.

자동 타입 정의 생성
개발 모드에서는 pages/ 디렉토리에 파일이 추가되면 자동으로 타입 정의가 생성되므로 별도의 명령어를 실행하지 않아도 돼요.

생성된 파일 예시
자동으로 생성된 파일은 다음과 같아요. 이 파일은 자동 생성되므로 수동으로 수정할 필요가 없어요.


// src/router.gen.ts

/* eslint-disable */
// This file is auto-generated by @granite-js/react-native. DO NOT EDIT.
import { Route as _AboutRoute } from '../pages/about';
import { Route as _IndexRoute } from '../pages/';

declare module '@granite-js/react-native' {
  interface RegisterScreen {
    '/about': ReturnType<typeof _AboutRoute.useParams>;
    '/': ReturnType<typeof _IndexRoute.useParams>;
  }
}
주요 포인트
각 화면에서 받을 파라미터의 타입을 createRoute.validateParams 옵션으로 정의해두면, navigate와 params 사용 시 타입 검사를 받을 수 있어 더 안전하게 코드를 작성할 수 있어요.
개발 모드에서는 pages/ 디렉토리에 파일이 추가되면 타입 정의가 자동으로 생성되기 때문에 별도의 명령어 실행이 필요하지 않아요.
이렇게 React Navigation을 사용하면 화면 간 이동을 쉽게 처리할 수 있고, 데이터를 전달하거나 기록을 조작하는 기능을 통해 다양한 UX를 구현할 수 있어요. 또한 타입스크립트와 함께 사용하면 안전하고 견고한 코드를 작성할 수 있답니다.

라우팅 상태 초기화하기
navigate-state-1

페이지 A → 페이지 B → 페이지 C 순서로 이동한 직후의 상태는 아래와 그림과 같이 같이 나타낼 수 있어요.

navigate-state-1

페이지 A, 페이지 B, 페이지 C가 순서대로 routes 기록에 남아 있고, index 값은 마지막으로 이동한 페이지 C의 위치인 2를 가리켜요.

reset을 사용하면 화면 이동 기록을 초기화할 수 있어요. 예를 들어, '페이지 A → B → C'로 이동한 후에 '페이지 A'로 돌아가면서 B와 C 기록을 삭제하고 싶다면, CommonActions.reset을 사용해요.


navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: "/page-a" }],
  })
);
navigate-state-2

주요 포인트
CommonActions.reset으로 특정 화면만 기록에 남기고 나머지 화면 기록을 삭제할 수 있어요.
레퍼런스
React Navigation 공식 문서
이전 버전 문서가 필요할 때

이전 버전의 문서는 화면 이동하기에서 확인할 수 있어요.

Pager
Previous page
외부 URL 열기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
openURL
openURL 함수는 지정된 URL을 기기의 기본 브라우저나 관련 앱에서 열어요. 이 함수는 react-native의 Linking.openURL 메서드를 사용하여 URL을 열어요.

시그니처

function openURL(url: string): Promise<any>;
파라미터
url필수 · string
열고자 하는 URL 주소

반환 값
Promise<any>
URL이 성공적으로 열렸을 때 해결되는 Promise

예제
외부 URL 열기

import { openURL } from '@granite-js/react-native';
import { Button } from 'react-native';

function Page() {
  const handlePress = () => {
    openURL('https://google.com');
  };

  return <Button title="구글 웹사이트 열기" onPress={handlePress} />;
}
Pager
Previous page
인증 화면 호출
지원환경: React NativeReact Native SDKv1.2.2WebViewWebView SDKv1.2.2
실행환경: Toss App최소버전v5.233.0
본인확인 요청 API 응답에서 받은 txId를 포함해 appsInTossSignTossCert를 호출해요.


React

ReactNative

import { appsInTossSignTossCert } from '@apps-in-toss/web-framework';

interface AppsInTossSignTossCertParams {
  txId: string; // 본인확인 요청 시 발급받은 txId
}

/**
 * Toss 인증서 화면을 txId 기반으로 호출합니다.
 *
 * 참고:
 * response는 인증 완료 확정 용도가 아닙니다.
 * 서버에서 txId 기준으로 결과조회 API를 호출해 최종 상태를 판별하세요.
 */
export async function openTossCertWithTxId(
  txId: string
): Promise<unknown> {
  try {
    const params: AppsInTossSignTossCertParams = { txId };
    const response = await appsInTossSignTossCert(params);
    return response;
  } catch (e: unknown) {
    // 호출 실패 처리 (사용자 취소/앱 미설치/스킴 실패 등)
    throw e;
  }
}
응답
onSuccess
파라미터 없음
onError
Error { code: string; message: string } (예: 사용자 취소, 앱 미설치, 스킴 실패 등)

// 에러 타입 예시
type AppsInTossSignTossCertError = {
  code: string;
  message: string;
};

// try/catch로 onSuccess/onError 대응하기
try {
  await appsInTossSignTossCert({ params: { txId } });
  // onSuccess: 파라미터 없음
} catch (e: any) {
  const err: AppsInTossSignTossCertError = {
    code: e?.code ?? 'UNKNOWN',
    message: e?.message ?? String(e),
  };
  // onError: 에러 처리
}
Pager
Previous page
Image
지원환경: React Native
실행환경: Toss AppSandbox App
Image 컴포넌트를 사용해서 비트맵 이미지(png, jpg 등)나 벡터 이미지(svg)를 로드하고 화면에 렌더링할 수 있어요. 이미지 형식에 맞게 자동으로 적절한 방식으로 렌더링돼요.

시그니처

function Image(props: ImageProps): import("react/jsx-runtime").JSX.Element;
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.styleobject
이미지 컴포넌트의 스타일을 설정하는 객체예요. width, height 등 레이아웃 관련 속성을 포함할 수 있어요.

props.sourceobject
로드할 이미지 리소스에 대한 정보를 담고 있는 객체예요.

props.source.uristring
로드할 이미지 리소스를 나타내는 URI 주소예요.

props.source.cache'immutable' | 'web' | 'cacheOnly' · 'immutable'
이미지 캐시 전략을 설정할 수 있는 옵션이에요. 이 옵션은 비트맵 이미지에만 적용돼요. 기본값은 immutable이예요.

props.onLoadStart() => void
이미지 로딩이 시작될 때 호출되는 콜백 함수예요.

props.onLoadEnd() => void
이미지 로딩이 완료되었을 때 호출되는 콜백 함수예요.

props.onError() => void
이미지 로드 중 에러가 발생했을 때 호출되는 콜백 함수예요.

예제
이미지 로드 및 렌더링 예시
다음 예시는 비트맵 및 벡터 이미지 리소스를 로드하고, 에러가 발생했을 때 console.log로 에러 메시지를 출력하는 방법을 보여줘요.


import { View } from 'react-native';
import { Image } from '@granite-js/react-native';

function ImageExample() {
  return (
    <View>
      <Image
        source={{ uri: 'my-image-link' }}
        style={{
          width: 300,
          height: 300,
          borderWidth: 1,
        }}
        onError={() => {
          console.log('이미지 로드 실패');
        }}
      />

      <Image
        source={{ uri: 'my-svg-link' }}
        style={{
          width: 300,
          height: 300,
          borderWidth: 1,
        }}
        onError={() => {
          console.log('이미지 로드 실패');
        }}
      />
    </View>
  );
}
이미지 불러오기에 실패했을때 처리하기
Image 컴포넌트를 사용해서 이미지를 로드하다가 문제가 발생하면, onError 콜백이 호출돼요. 이 onError 콜백으로 에러를 처리할 수 있어요.


이미지를 불러오다가 네트워크 문제나 잘못된 URL 등으로 인해 이미지를 불러오지 못할 수 있어요.

이때 onError 콜백 함수가 호출돼요. 이 콜백을 사용하면 이미지를 불러오는 데 실패했다는 메시지를 콘솔에 출력할 수 있어요.

아래는 에러가 발생했을 때, 빨간색 테두리를 추가한 View를 표시하는 코드에요.

onError 콜백에서 에러를 감지하고, hasError 상태를 업데이트해 에러가 발생했을 때 다른 UI를 보여주는 거죠.


import { useState } from "react";
import { View } from "react-native";
import { Image, createRoute } from '@granite-js/react-native';

export const Route = createRoute("/", {
  component: Index,
});

function Index() {
  const [hasError, setHasError] = useState(false); 

  return (
    <View>
      {hasError === true ? (
        <ErrorView />
      ) : (
        <Image
          style={{
            width: 100,
            height: 100,
          }}
          source={{
            uri: "invalid url", // 잘못된 URL을 사용해서 에러를 발생시켜요.
          }}
          onError={() => {
            Alert.alert("이미지 에러");
            setHasError(true);
          }}
        />
      )}
    </View>
  );
}

/** 임의의 에러 뷰 */
function ErrorView() {
  return (
    <View
      style={{
        width: 100,
        height: 100,
        borderColor: "red",
        borderWidth: 1,
      }}
    />
  );
}ottie
지원환경: React Native
실행환경: Toss AppSandbox App
Lottie 컴포넌트를 사용해서 Lottie 애니메이션을 렌더링할 수 있어요. 이 컴포넌트로 Lottie JSON 파일을 로드하고 애니메이션을 재생해요. 특징으로는 레이아웃 시프팅을 방지하려면 높이를 필수로 지정해야 해요.

시그니처

function Lottie({ width, maxWidth, height, src, autoPlay, speed, style, onAnimationFailure, ...props }: Props): import("react/jsx-runtime").JSX.Element;
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요. lottie-react-native 라이브러리의 LottieView 컴포넌트에서 지원하는 속성들을 사용할 수 있어요.

props.widthnumber | '100%'
Lottie 애니메이션의 너비예요.

props.height필수 · number | '100%'
Lottie 애니메이션의 높이예요. 레이아웃 시프팅 방지를 위해 필수로 지정해야 해요.

props.src필수 · string
Lottie JSON 파일의 URL이에요. 안정성 검사를 위해서 LottieView의 source를 직접 사용하지 않아요. src를 사용해 주세요.

props.maxWidthnumber
Lottie 애니메이션의 최대 너비예요.

props.autoPlayboolean · true
컴포넌트가 마운트되면 자동으로 애니메이션을 재생할지 여부예요.

props.speednumber · 1
애니메이션의 재생 속도예요.

반환 값
ReactElement
lottie-react-native 라이브러리의 LottieView 엘리먼트를 반환해요.

예제
Lottie 애니메이션 렌더링하기
다음 예시는 Lottie 애니메이션을 렌더링하고, 애니메이션 로드 실패 시 콘솔에 에러 메시지를 출력하는 방법을 보여줘요.


import { Lottie } from '@granite-js/react-native';

function LottieExample() {
 return (
   <Lottie
     height={100}
     src="https://my-lottie-animation-url.com"
     autoPlay={true}
     loop={false}
     onAnimationFailure={() => {
       console.log('Animation Failed');
     }}
     onAnimationFinish={() => {
       console.log('Animation Finished');
     }}
   />
 );BlurView
지원환경: React Native
실행환경: Toss AppSandbox App
BlurView 컴포넌트는 iOS에서 배경을 블러 처리하는 UI 효과를 줘요. 이 컴포넌트는 배경을 흐리게 표시해요. iOS에서만 지원되고 Android에서는 기본 View 를 렌더링해요.

블러의 강도를 조절할 수 있고, Vibrancy 효과를 적용할 수 있어요. 블러가 적용되지 않을 경우에는 reducedTransparencyFallbackColor를 사용해 배경색을 설정할 수 있어요.

isSupported 속성을 통해 현재 기기에서 블러가 지원되는지 확인할 수 있어요. iOS 5.126.0 이상에서만 블러 효과가 지원되고, Android에서는 지원되지 않아요.

시그니처

function BlurView({ blurType, blurAmount, reducedTransparencyFallbackColor, vibrancyEffect, ...viewProps }: BlurViewProps): import("react/jsx-runtime").JSX.Element;
파라미터
propsBlurViewProps
props BlurView에 전달할 속성들이에요. react-native의 ViewProps를 상속하므로, 기본적인 레이아웃 속성도 함께 사용할 수 있어요. @react-native-community/blur의 속성과 같아요.

props.blurTypeBlurType
블러의 유형을 설정해요. light, dark, extraDark 같은 값을 사용해 블러의 스타일을 정의할 수 있어요.

props.blurAmountnumber · 10
블러 효과의 강도를 설정해요. 값이 클수록 블러 효과가 더 강해져요. 기본값은 10이며 0부터 100까지 설정할 수 있어요.

props.vibrancyEffectboolean · false
Vibrancy Effect를 활성화해요. Vibrancy 효과는 블러된 배경 위의 콘텐츠를 더 생동감 있게 보이도록 해줘요. iOS에서만 지원되며, 기본값은 false예요.

props.reducedTransparencyFallbackColorstring
투명도가 제한될 경우 사용할 대체 배경색이에요. 블러가 지원되지 않거나 제대로 렌더링되지 않을 때 유용해요.

반환 값
JSX.Element
iOS에서는 블러가 적용된 BlurView 또는 VibrancyView 컴포넌트를 반환하고, Android에서는 기본 View를 반환해요.

유의할 점

BlurView는 iOS에서만 지원돼요. Android에서는 기본 View가 렌더링되며, 블러 효과가 적용되지 않아요.

예제
BlurView를 사용해 텍스트를 블러 처리하기

import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from '@granite-js/react-native';

function BlurViewExample() {
 return (
   <View style={styles.container}>
     <Text style={styles.absolute}>Blurred Text</Text>
     <BlurView style={styles.absolute} blurType="light" blurAmount={1} />
     <Text>Non Blurred Text</Text>
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   justifyContent: 'center',
   alignItems: 'center',
   width: '100%',
   height: 300,
 },
 absolute: {
   position: 'absolute',
   top: 0,
   left: 0,
   bottom: 0,
   right: 0,
 },
});Video
지원환경: React Native
실행환경: Toss AppSandbox App
Video 컴포넌트는 다른 앱에서 음악을 재생 중일 때, 토스 앱에서 그 음악을 중지시키지 않도록 오디오 포커스를 제어하는 로직이 구현된 컴포넌트에요. 앱의 상태에 따라 자동으로 재생하거나 일시정지해요. 예를 들어, 앱이 백그라운드로 전환되면 비디오가 자동으로 일시정지돼요.

WARNING

Video 컴포넌트는 react-native-video 버전(6.0.0-alpha.6) 을 사용하고 있어요. 따라서 일부 타입이나 기능이 최신 버전과 호환되지 않을 수 있어요.

시그니처

Video: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<VideoRef>>
파라미터
propsVideoProperties
`react-native-video`에서 제공하는 속성들이에요.

props.mutedboolean · false
비디오의 음소거 상태를 제어해요. true면 비디오의 오디오가 음소거되고, false면 오디오가 재생돼요. 기본값은 false에요.

props.pausedboolean · false
비디오 재생을 제어하는 속성이에요. true이면 비디오가 일시 정지되고, false이면 비디오가 재생돼요. 기본값은 false이고, 자동 재생돼요.

props.onAudioFocusChangedOnAudioFocusChanged
오디오 포커스가 변경될 때 호출되는 콜백 함수에요. muted 가 false 인 경우에 필수로 구현해야해요. 자세한 내용은 OnAudioFocusChanged를 참고해주세요.

props.source.uristring
재생할 비디오의 소스에요. 파일 경로나 URL을 설정할 수 있어요.

ref필수 · Ref<VideoRef>
비디오 인스턴스에 접근하기 위한 ref 객체에요. 이 ref를 통해 비디오 인스턴스의 여러 메서드에 접근할 수 있어요.

프로퍼티
isAvailableboolean
Video 컴포넌트를 사용할 수 있는지 확인하는 값이에요. 이 값을 확인해서 사용자가 비디오를 렌더링할 수 있는지 혹은 환경적 제약(예: 네트워크 연결 문제, 지원되지 않는 디바이스 등)으로 인해 비디오 기능을 사용할 수 없는지를 먼저 확인할 수 있어요. 이 값이 false라면, 비디오를 렌더링하지 않거나 대체 콘텐츠를 제공하는 등의 처리를 해야 해요.

반환 값
JSX.Element
비디오를 렌더링하는 JSX 엘리먼트를 반환해요. Animated를 사용해 부드러운 애니메이션 효과를 포함한 비디오 재생을 제공해요.

예제
비디오 자동재생 예제

import { useRef } from 'react';
import { View } from 'react-native';
import { Video } from '@granite-js/react-native';

function VideoExample() {
  const videoRef = useRef(null);

  return (
    <View>
      <Video
        ref={videoRef}
        source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
        muted={true}
        paused={false}
        resizeMode="cover"
        style={{ width: 300, height: 200, borderWidth: 1 }}
      />
    </View>
  );
}RNVideoRef
지원환경: React Native
실행환경: Toss AppSandbox App
react-native-video의 ref 타입이에요.

시그니처

type RNVideoRef = VideoRef;사용자 행동 기록하기
지원환경: React Native
실행환경: Toss App
Analytics
Analytics 는 사용자의 행동을 기록하고 분석하기 위한 객체예요. 이 객체를 사용해서 화면 진입, 버튼 클릭, 컴포넌트 노출 등의 이벤트를 자동으로 수집하고 기록할 수 있어요. 서비스 개선이나 사용자 흐름 분석에 필요한 데이터를 수집할 때 사용해요.

시그니처

Analytics: {
    readonly init: typeof init;
    readonly Screen: typeof LoggingScreen;
    readonly Press: import("react").ForwardRefExoticComponent<import(".").LoggingPressProps & import("react").RefAttributes<unknown>>;
    readonly Impression: typeof LoggingImpression;
    readonly Area: typeof LoggingArea;
}
프로퍼티
inittypeof init
분석 기능을 시작할 때 설정을 적용하는 함수예요. 앱이 초기화 시점에 한 번 호출해서 설정을 적용해야 해요. 자세한 내용은 init를 참고하세요.

Presstypeof LoggingPress
버튼이나 터치 가능한 컴포넌트의 클릭 이벤트 로그를 남기는 컴포넌트예요. 자세한 내용은 LoggingPress를 참고하세요.

Impressiontypeof LoggingImpression
사용자가 화면에 특정 컴포넌트를 실제로 보았는지를 판단하고 로그를 남기는 컴포넌트예요. 자세한 내용은 LoggingImpression를 참고하세요.

Areatypeof LoggingArea
여러 컴포넌트를 하나의 영역으로 묶어서 분석할 수 있는 컴포넌트예요. 자세한 내용은 LoggingArea를 참고하세요.분석 초기 설정하기
지원환경: React Native
실행환경: Toss App
init
init 은 분석 기능을 시작할 때 설정을 적용하는 함수예요. 분석 기능을 사용하기 전에 반드시 호출해야 해요.

시그니처

declare function init(options: AnalyticsConfig): void;
파라미터
options필수 · AnalyticsConfig
분석 기능을 사용하기 위한 설정 객체예요.영역 단위로 기록하기
지원환경: React Native
실행환경: Toss App
LoggingArea
LoggingArea 함수로 여러 컴포넌트의 텍스트를 하나로 묶어서 로그를 남길 수 있어요. 지정한 영역이 노출되거나 클릭 했을 때 로그를 수집할 수 있어요.

시그니처

function LoggingArea({ children, params: _params, ...props }: LoggingAreaProps): import("react/jsx-runtime").JSX.Element;
예제
여러 컴포넌트를 하나의 영역으로 묶어서 분석하는 예시

import { Analytics } from '@apps-in-toss/framework';
import { View, Text } from 'react-native';

// 영역 안의 노출이나 클릭 정보를 자동으로 수집해요.
function TrackElements() {
  return (
    <Analytics.Area>
      <View>
        <Text>Hello</Text>
        <Text>World!</Text>
      </View>
    </Analytics.Area>
  );
}컴포넌트 노출 기록하기
지원환경: React Native
실행환경: Toss App
LoggingImpression
LoggingImpression 는 요소가 뷰포트에 표시되었는지 판단하고 로그를 남기는 컴포넌트예요. 예를 들어, 스크롤 아래에 있는 요소가 뷰포트에 표시되었을 때를 감지해 로그를 남겨요.

시그니처

function LoggingImpression({ enabled, impression: impressionType, ...props }: LoggingImpressionProps): import("react/jsx-runtime").JSX.Element;
예제
컴포넌트의 노출 정보를 자동으로 수집하는 예시

import { Analytics } from '@apps-in-toss/framework';

// 영역 안의 노출 정보를 자동으로 수집해요.
function TrackElements() {
  return (
    <Analytics.Impression>
      <Text>Hello</Text>
    </Analytics.Impression>
  );
}클릭 이벤트 기록하기
지원환경: React Native
실행환경: Toss App
LoggingPress
LoggingPress 는 요소가 사용자 액션에 의해 눌렸을 때 눌렸다고 로그를 남기는 컴포넌트예요. 예를 들어, 버튼을 눌러 구매를 하는 로그를 남기고 싶을 때 사용해요.

잠시만요

샌드박스나 QR 테스트 환경에서는 클릭 이벤트가 실제로 쌓이지 않아요.

이벤트는 라이브 환경에서만 수집돼요.

또한 콘솔에서 데이터를 확인할 수 있는 시점은 +1일 후 예요.

시그니처

LoggingPress: import("react").ForwardRefExoticComponent<LoggingPressProps & import("react").RefAttributes<unknown>>
예제
클릭 가능한 요소의 클릭 이벤트를 자동으로 수집하는 예시

import { Analytics } from '@apps-in-toss/framework';
import { Button } from 'react-native';

// 클릭 가능한 요소의 클릭 이벤트를 자동으로 수집해요.
function TrackElements() {
  return (
    <Analytics.Press>
      <Button label="Press Me" />
    </Analytics.Press>
  );
}토스앱 공유 링크 만들기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getTossShareLink
getTossShareLink 함수는 사용자가 지정한 경로를 토스 앱에서 열 수 있는 공유 링크를 생성해요.
이 링크를 다른 사람과 공유하면 토스 앱이 실행되며 지정한 경로로 바로 이동해요.

만약 토스앱이 설치되어 있지 않은 경우 :

iOS 사용자는 앱스토어로 이동하고,
Android 사용자는 플레이스토어로 이동해요.
경로는 토스 앱 내부의 특정 화면을 나타내는 딥링크(deep link) 형식이어야 해요.
예를 들어 아래와 같이 작성할 수 있어요.


intoss://<앱이름>
intoss://<앱이름>/about?name=test
이 함수를 사용하면 deep_link_value가 포함된 완성된 공유 링크를 쉽게 만들 수 있어요.

앱 출시 전 테스트 방법
intoss:// 스킴은 앱이 출시된 이후에만 접근할 수 있어요.
앱 출시 전에 테스트를 하려면, 콘솔에 앱 번들을 업로드한 뒤 아래 방법으로 진행하세요.
(콘솔에서 앱 번들 업로드하기)

업로드 후 생성된 QR 코드(앱 스킴) 를 통해 deploymentId를 확인해요.
deploymentId는 앱 번들을 업로드할 때마다 새로 발급돼요.

예시 :


intoss-private://intossbench?_deploymentId=0198c10b-68c3-7d2b-a0ab-2c9626b475ec
아래 예시를 참고해 테스트를 진행해요.
하위 path를 적용한 경우 :

intoss-private://intossbench/path/pathpath?_deploymentId=0198c10b-68c3-7d2b-a0ab-2c9626b475ec
쿼리 파라미터를 적용한 경우 :

intoss-private://intossbench?_deploymentId=0198c10b-68c3-7d2b-a0ab-2c9626b475ec&queryParams=%7B%22categoryKey%22%3A%22
시그니처

function getTossShareLink(path: string): Promise<string>;
파라미터
path필수
딥링크로 열고 싶은 경로예요. intoss://로 시작하는 문자열이어야 해요.

반환 값
Promise<string>
deep_link_value가 포함된 토스 공유 링크를 반환해요.

예제

React

React Native

import { share, getTossShareLink } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';

function ShareButton() {
  async function handleClick() {
    // '/' 경로를 딥링크로 포함한 토스 공유 링크를 생성해요.
    const tossLink = await getTossShareLink('intoss://my-app');
    // 생성한 링크를 메시지로 공유해요.
    await share({ message: tossLink });
  }

  return <Button onClick={handleClick}>공유하기</Button>;
}메시지 공유하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
share
share 함수로 사용자가 콘텐츠를 쉽게 공유할 수 있도록, 네이티브 공유 시트를 표시할 수 있어요.
예를 들어, 초대 메시지나 텍스트 정보를 사용자가 설치된 앱 목록에서 원하는 앱(예: 메신저, 메모 앱)을 선택해서 메시지를 공유할 수 있어요. 각 플랫폼(Android, iOS)에서 기본으로 제공하는 공유 인터페이스를 활용해요.

options.message 속성에 공유할 메시지를 전달하면, 사용자가 선택할 수 있는 앱 목록이 표시돼요. 예를 들어, 사용자가 텍스트 메시지를 공유하거나 메모 앱에 저장하려고 할 때 유용해요.

시그니처

function share(message: {
    message: string;
}): Promise<void>;
파라미터
options필수 · object
공유할 메시지를 담은 객체예요.

options.message필수 · string
공유할 텍스트 문자열이에요. 예를 들어, "안녕하세요! 이 내용을 공유합니다."

예제
공유하기 기능 구현하기
아래는 버튼을 클릭하면 메시지를 공유하는 간단한 예제예요.



React

React Native

import { share } from "@apps-in-toss/web-framework";

const ShareButton = () => {
  const handleShare = async () => {
    try {
      await share({ message: "공유할 메시지" });
      console.log("공유 완료");
    } catch (error) {
      console.error("공유 실패:", error);
    }
  };

  return <button onClick={handleShare}>공유하기</button>;
};
사용자 입력을 받아 메시지 공유하기
사용자가 직접 입력한 메시지를 공유하도록 구현할 수도 있어요. 다음은 초대 메시지 작성 기능 예제예요.

import { useState } from "react";
import { TextInput, Button, View, Alert } from "react-native";
import { share } from '@apps-in-toss/framework';

function ShareWithInput() {
  const [invitationMessage, setInvitationMessage] = useState(""); 

  const handleShare = () => {
    if (!invitationMessage.trim()) {
      Alert.alert("공유할 메시지를 입력하세요.");
      return;
    }
    share({ message: invitationMessage }); 
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 8,
        }}
        placeholder="초대 메시지를 입력하세요"
        value={invitationMessage}
        onChangeText={setInvitationMessage}
      />
      <Button title="초대 메시지 공유" onPress={handleShare} />
    </View>
  );
}파일 저장하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
saveBase64Data
saveBase64Data 함수는 문자열로 인코딩된 Base64 데이터를 지정한 파일 이름과 MIME 타입으로 사용자 기기에 저장해요. 이미지, 텍스트, PDF 등 다양한 형식의 데이터를 저장할 수 있어요.

시그니처

function saveBase64Data(params: SaveBase64DataParams): Promise<void>;
파라미터
params필수 · SaveBase64DataParams
저장할 데이터와 파일 정보를 담은 객체예요.

params.data필수 · string
Base64 형식으로 인코딩된 데이터 문자열이에요.

params.fileName필수 · string
저장할 파일 이름이에요. 확장자도 같이 붙여줘야해요. 예를 들어, 'example.png'로 저장할 수 있어요.

params.mimeType필수 · string
저장할 파일의 MIME 타입이에요. 예를 들어 'image/png' 로 지정하면 이미지, 'application/pdf'는 PDF 파일이에요. 자세한 내용은 MIME 문서를 참고해주세요.

예제
Base64 이미지 데이터를 사용자 기기에 저장하기

React

React Native

import { saveBase64Data } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';

function SaveButton() {
  const handleSave = async () => {
    try {
      await saveBase64Data({
        data: 'iVBORw0KGgo...',
        fileName: 'some-photo.png',
        mimeType: 'image/png',
      });
    } catch (error) {
      console.error('데이터 저장에 실패했어요:', error);
    }
  };

  return <Button onClick={handleSave}>저장</Button>;
}토스 인증 로그인
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
appLogin
appLogin 함수는 토스 인증으로 로그인해요. 로그인이 완료되면 다시 토스 앱으로 이동해요.

시그니처

function appLogin(): Promise<{
  authorizationCode: string;
  referrer: "DEFAULT" | "SANDBOX";
}>;
예제
토스 인증을 통해 로그인을 하는 예제

React

React Native

import { appLogin } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';

function Page() {
  async function handleLogin() {
    const { authorizationCode, referrer } = await appLogin();

    // 획득한 인가 코드(`authorizationCode`)와 `referrer`를 서버로 전달해요.
  }

  return <Button size="medium" onClick={handleLogin}>로그인</Button>;
}앨범 가져오기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
fetchAlbumPhotos
사용자의 앨범에서 사진 목록을 불러오는 함수예요. 최대 개수와 해상도를 설정할 수 있고 갤러리 미리보기, 이미지 선택 기능 등에 활용할 수 있어요.

시그니처

function fetchAlbumPhotos(options: {
  maxCount: number;
  maxWidth: number;
  base64: boolean;
}): Promise<ImageResponse[]>;
파라미터
options필수
조회 옵션을 담은 객체예요.

options.maxCountnumber · 10
가져올 사진의 최대 개수를 설정해요. 숫자로 입력하며 기본값은 10이에요.

options.maxWidthnumber · 1024
사진의 최대 폭을 제한해요. 단위는 픽셀이며 기본값은 1024이에요.

options.base64boolean · false
이미지를 base64 형식으로 반환할지 설정해요. 기본값은 false예요.

프로퍼티
openPermissionDialog
사진첩 읽기 권한을 다시 요청하는 다이얼로그를 표시해요. 사용자는 "허용", "한 번만 허용", "안하기" 중 하나를 선택할 수 있어요. "허용"이나 "한 번만 허용"을 선택하면 allowed를 반환하고, "안하기"를 선택하면 denied를 반환해요.

getPermission
사진첩 읽기 권한의 현재 상태를 반환해요. allowed는 사용자가 사진첩 읽기 권한을 허용한 상태예요. denied는 사용자가 사진첩 읽기 권한을 거부한 상태예요. notDetermined는 사진첩 읽기 권한 요청을 한 번도 하지 않은 상태예요.

반환 값
Promise<ImageResponse[]>
앨범 사진의 고유 ID와 데이터 URI를 포함한 배열을 반환해요.

FetchAlbumPhotosPermissionError
사진첩 권한이 거부되었을 때 발생하는 에러예요. 에러가 발생했을 때 error instanceof FetchAlbumPhotosPermissionError를 통해 확인할 수 있어요.

시그니처

class FetchAlbumPhotosPermissionError extends PermissionError {
    constructor();
}
예제
사진의 최대 폭을 360px로 제한하여 가져오기
사진을 가져오는 예제예요. "권한 확인하기"버튼을 눌러서 현재 사진첩 읽기 권한을 확인해요. 사용자가 권한을 거부했거나 시스템에서 권한이 제한된 경우에는 FetchAlbumPhotosPermissionError를 반환해요. "권한 요청하기"버튼을 눌러서 사진첩 읽기 권한을 요청할 수 있어요.


React

React Native

import { fetchAlbumPhotos, FetchAlbumPhotosPermissionError, ImageResponse } from '@apps-in-toss/web-framework';
import { useState } from 'react';


const base64 = true;

// 앨범 사진 목록을 가져와 화면에 표시하는 컴포넌트
function AlbumPhotoList() {
  const [albumPhotos, setAlbumPhotos] = useState<ImageResponse[]>([]);

  const handlePress = async () => {
    try {
      const response = await fetchAlbumPhotos({
        base64,
        maxWidth: 360,
      });
      setAlbumPhotos((prev) => [...prev, ...response]);
    } catch (error) {
      if (error instanceof FetchAlbumPhotosPermissionError) {
        // 앨범 읽기 권한 없음
      }
      console.error('앨범을 가져오는 데 실패했어요:', error);
    }
  };

  return (
    <div>
      {albumPhotos.map((image) => {
        // base64 형식으로 반환된 이미지를 표시하려면 데이터 URL 스키마 Prefix를 붙여야해요.
        const imageUri = base64 ? 'data:image/jpeg;base64,' + image.dataUri : image.dataUri;

        return <Image source={{ uri: imageUri }} key={image.id} />;
      })}
      <input type="button" value="앨범 가져오기" onClick={handlePress} />
      <input type="button"
        value="권한 확인하기"
        onClick={async () => {
          const permission = await fetchAlbumPhotos.getPermission();
          alert(permission);
        }}
      />
      <input type="button"
        value="권한 요청하기"
        onClick={async () => {
          const permission = await fetchAlbumPhotos.openPermissionDialog();
          alert(permission);
        }}
      />
    </div>
  );
}연락처 가져오기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
fetchContacts
fetchContacts 는 사용자의 연락처 목록을 페이지 단위로 가져오는 함수예요.

시그니처
사용자의 연락처 목록을 페이지 단위로 가져오는 함수예요.

시그니처

function fetchContacts(options: {
  size: number;
  offset: number;
  query?: {
    contains?: string;
  };
}): Promise<ContactResult>;
파라미터
options필수
연락처를 가져올 때 지정하는 옵션 객체예요.

options.size필수
한 번에 가져올 연락처 개수예요. 예를 들어, 10을 전달하면 최대 10개의 연락처를 가져와요.

options.offset필수
가져올 연락처의 시작 지점이에요. 처음 호출할 때는 0을 전달해야 해요. 이후에는 이전 호출에서 반환된 nextOffset 값을 사용해요.

options.query필수
추가적인 필터링 옵션이에요.

options.query.contains필수
이름에 특정 문자열이 포함된 연락처만 가져오고 싶을 때 사용해요. 이 값을 전달하지 않으면 모든 연락처를 가져와요.

프로퍼티
openPermissionDialog
연락처 읽기 권한을 다시 요청하는 다이얼로그를 표시해요. 사용자는 "허용", "한 번만 허용", "안하기" 중 하나를 선택할 수 있어요. "허용"이나 "한 번만 허용"을 선택하면 allowed를 반환하고, "안하기"를 선택하면 denied를 반환해요.

getPermission
연락처 읽기 권한의 현재 상태를 반환해요. allowed는 사용자가 연락처 읽기 권한을 허용한 상태예요. denied는 사용자가 연락처 읽기 권한을 거부한 상태예요. notDetermined는 연락처 읽기 권한 요청을 한 번도 하지 않은 상태예요.

반환 값
Promise<ContactResult>
연락처 목록과 페이지네이션 정보를 포함한 객체를 반환해요.

result: 가져온 연락처 목록이에요.
nextOffset: 다음 호출에 사용할 오프셋 값이에요. 더 가져올 연락처가 없으면 null이에요.
done: 모든 연락처를 다 가져왔는지 여부를 나타내요. 모두 가져왔다면 true예요.
FetchContactsPermissionError
연락처 권한이 거부되었을 때 발생하는 에러예요. 에러가 발생했을 때 error instanceof FetchContactsPermissionError를 통해 확인할 수 있어요.

시그니처

class FetchContactsPermissionError extends PermissionError {
    constructor();
}
예제
특정 문자열이 포함된 연락처 목록 가져오기
연락처 목록을 가져오는 예제예요. "권한 확인하기"버튼을 눌러서 현재 연락처 읽기 권한을 확인해요. 사용자가 권한을 거부했거나 시스템에서 권한이 제한된 경우에는 FetchContactsPermissionError를 반환해요. "권한 요청하기"버튼을 눌러서 연락처 읽기 권한을 요청할 수 있어요.


React

React Native

import { ContactEntity, fetchContacts, FetchContactsPermissionError } from '@apps-in-toss/web-framework';
import { useState } from 'react';


// 특정 문자열을 포함한 연락처 목록을 가져와 화면에 표시하는 컴포넌트
function ContactsList() {
  const [contacts, setContacts] = useState<{
    result: ContactEntity[];
    nextOffset: number | null;
    done: boolean;
  }>({
    result: [],
    nextOffset: null,
    done: false,
  });

  const handlePress = async () => {
    try {
      if (contacts.done) {
        console.log('모든 연락처를 가져왔어요.');
        return;
      }

      const response = await fetchContacts({
        size: 10,
        offset: contacts.nextOffset ?? 0,
        query: { contains: '김' },
      });
      setContacts((prev) => ({
        result: [...prev.result, ...response.result],
        nextOffset: response.nextOffset,
        done: response.done,
      }));
    } catch (error) {
      if (error instanceof FetchContactsPermissionError) {
        // 연락처 읽기 권한 없음
      }
      console.error('연락처를 가져오는 데 실패했어요:', error);
    }
  };

  return (
    <div>
      {contacts.result.map((contact, index) => (
        <span key={index}>
          {contact.name}: {contact.phoneNumber}
        </span>
      ))}
      <input type="button"
        value={contacts.done ? '모든 연락처를 가져왔어요.' : '다음 연락처 가져오기'}
        disabled={contacts.done}
        onClick={handlePress}
      />
      <input type="button"
        value="권한 확인하기"
        onClick={async () => {
          const permission = await fetchContacts.getPermission();
          alert(permission);
        }}
      />
      <input type="button"
        value="권한 요청하기"
        onClick={async () => {
          const permission = await fetchContacts.openPermissionDialog();
          alert(permission);
        }}
      />
    </div>
  );
}친구 초대하고 리워드 받기
지원환경: WebView
실행환경: Toss AppSandbox App
contactsViral
contactsViral 함수는 친구에게 공유하고 리워드를 받을 수 있는 기능을 제공해요. 사용자가 친구에게 공유를 완료하면, 앱 브릿지를 통해 이벤트가 전달되고, 해당 이벤트를 기반으로 리워드 정보를 받을 수 있어요.

주의하세요

본 기능은 토스앱 5.223.0 버전부터 지원해요. 하위 버전에서는 undefined가 반환됩니다.
기능 사용을 위해서는 미니앱 승인이 반드시 필요합니다. 미승인 상태에서는 Internal Server Error가 발생합니다.
참고하세요

테스트 환경(샌드박스 앱)에서는 빈 화면으로 보여요. 리워드 지급 버튼을 눌러도 실제로 동작하지 않아요.
콘솔 내 QR코드로 테스트를 진행해 주세요.
콘솔에 등록된 리워드 ID를 활용하여 테스트를 할 수 있어요.
친구 목록은 상호 연락처 저장 여부 외에도 다음 조건에 따라 달라질 수 있어요
마케팅 수신 동의 여부
야간 마케팅 수신 동의 여부
푸시 토큰 등록 여부
연락처 알림 차단 여부
시그니처

function contactsViral(params: ContactsViralParams): () => void;
파라미터
params필수
연락처 공유 기능을 실행할 때 사용하는 파라미터예요. 옵션 설정과 이벤트 핸들러를 포함해요.
자세한 내용은 ContactsViralParams 문서를 참고하세요.

반환값
() => void
앱브릿지 cleanup 함수를 반환해요. 공유 기능이 끝나면 반드시 이 함수를 호출해서 리소스를 해제해야 해요.

예제
친구에게 공유하고 리워드 받기

React

React Native

import { contactsViral } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';
import { useCallback } from 'react';

function ContactsViralButton({ moduleId }: { moduleId: string }) {
  const handleContactsViral = useCallback(() => {
    try {
      const cleanup = contactsViral({
        options: { moduleId: moduleId.trim() },
        onEvent: (event) => {
          if (event.type === 'sendViral') {
            console.log('리워드 지급:', event.data.rewardAmount, event.data.rewardUnit);
          } else if (event.type === 'close') {
            console.log('모듈 종료:', event.data.closeReason);
          }
        },
        onError: (error) => {
          console.error('에러 발생:', error);
        },
      });

      return cleanup;
    } catch (error) {
      console.error('실행 중 에러:', error);
    }
  }, [moduleId]);

  return <Button onClick={handleContactsViral}>친구에게 공유하고 리워드 받기</Button>;
}친구 초대 파라미터
지원환경: WebView
실행환경: Toss AppSandbox App
ContactsViralParams
ContactsViralParams 는 contactsViral 함수를 실행할 때 사용하는 파라미터 타입이에요. 옵션을 설정하고, 이벤트 및 에러 처리 콜백을 지정할 수 있어요.

시그니처

interface ContactsViralParams {
  options: ContactsViralOption;
  onEvent: (event: ContactsViralEvent) => void;
  onError: (error: unknown) => void;
}
프로퍼티
options필수
공유 기능에 사용할 옵션 객체예요.
자세한 타입은 ContactsViralOption 문서를 참고하세요.

onEvent필수
공유 이벤트가 발생했을 때 실행되는 함수예요.
RewardFromContactsViralEvent 또는 ContactsViralSuccessEvent 타입의 이벤트 객체가 전달돼요.

onError필수
예기치 않은 에러가 발생했을 때 실행되는 함수예요. 에러 객체는 타입이 unknown이에요.친구 초대 옵션
지원환경: WebView
실행환경: Toss AppSandbox App
ContactsViralOption
ContactsViralOption는 연락처 공유 기능을 사용할 때 필요한 옵션이에요.

시그니처

type ContactsViralOption = {
  moduleId: string;
};
프로퍼티
moduleId필수
공유 리워드를 구분하는 UUID 형식의 고유 ID예요.
앱인토스 콘솔의 미니앱 > 공유 리워드 메뉴에서 확인할 수 있어요.

Pager
Previous page
친구 초대 파라미터
Next page
친구 초대 완료 반환 이벤트
지원환경: WebView
실행환경: Toss AppSandbox App
ContactsViralSuccessEvent
ContactsViralSuccessEvent 는 연락처 공유 모듈이 정상적으로 종료됐을 때 전달되는 이벤트 객체예요. 종료 이유와 함께 리워드 상태 및 남은 친구 수 등 관련 정보를 제공해요.

시그니처

type ContactsViralSuccessEvent = {
  type: 'close';
  data: {
    closeReason: 'clickBackButton' | 'noReward';
    sentRewardAmount?: number;
    sendableRewardsCount?: number;
    sentRewardsCount: number;
    rewardUnit?: string;
  };
};
프로퍼티
type필수
이벤트의 타입이에요. 공유 모듈이 종료되었을 때 close 값을 갖고 돌아와요.

data필수
모듈 종료와 관련된 세부 정보를 담고 있어요.

data.closeReason필수
모듈이 종료된 이유예요.
clickBackButton: 사용자가 뒤로 가기 버튼을 눌러 종료한 경우
noReward: 받을 수 있는 리워드가 없어서 종료된 경우

data.sentRewardAmount
사용자가 받은 전체 리워드 수량이에요. 선택적으로 전달돼요.

data.sendableRewardsCount
아직 공유할 수 있는 친구 수예요. 선택적으로 전달돼요.

data.sentRewardsCount필수
사용자가 공유를 완료한 친구 수예요.

data.rewardUnit
리워드의 단위예요. 앱인토스 콘솔에 설정된 하트, 보석 같은 이름이 들어가요. 선택적으로 전달돼요.

예제
모듈 종료 이벤트 처리하기

contactsViral({
  options: { moduleId: 'your-module-id' },
  onEvent: (event) => {
    if (event.type === 'close') {
      console.log('종료 사유:', event.data.closeReason);
      console.log('공유 완료한 친구 수:', event.data.sentRewardsCount);
    }
  },
  onError: (error) => {
    console.error('에러 발생:', error);
  },
});
Pager
Previous page
친구 초대 옵션
Next page
공유 완료 리워드 정보 이벤트
지원환경: WebView
실행환경: Toss AppSandbox App
RewardFromContactsViralEvent
RewardFromContactsViralEvent 는 친구에게 공유하기를 완료했을 때 지급할 리워드 정보를 담는 타입이에요. 이 타입을 사용하면 공유가 완료됐을 때 지급할 리워드 정보를 확인할 수 있어요.

시그니처

type RewardFromContactsViralEvent = {
  type: 'sendViral';
  data: {
    rewardAmount: number;
    rewardUnit: string;
  };
};
프로퍼티
type필수
이벤트의 타입이에요. 친구에게 공유를 완료했을 때 'sendViral' 값을 갖고 돌아와요.

data필수
지급할 리워드 관련 정보를 담고 있어요.

data.rewardAmount필수
지급할 리워드 수량이에요. 앱인토스 콘솔에서 설정한 수량 및 금액 값이에요.

data.rewardUnit필수
리워드의 단위예요. 앱인토스 콘솔에 설정된 리워드 이름인 '하트', '보석' 등이 들어가요.

예제
공유 완료 후 리워드 정보 처리하기

contactsViral({
  options: { moduleId: 'your-module-id' },
  onEvent: (event) => {
    if (event.type === 'sendViral') {
      console.log('리워드 지급:', event.data.rewardAmount, event.data.rewardUnit);
    }
  },
  onError: (error) => {
    console.error('에러 발생:', error);
  },
});
Pager
Previous page
친구 초대 완료 반환 이벤트
Next page
현재 위치 가져오기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getCurrentLocation
디바이스의 현재 위치 정보를 가져오는 함수예요. 위치 기반 서비스를 구현할 때 사용되고, 한 번만 호출되어 현재 위치를 즉시 반환해요. 예를 들어 지도 앱에서 사용자의 현재 위치를 한 번만 가져올 때, 날씨 앱에서 사용자의 위치를 기반으로 기상 정보를 제공할 때, 매장 찾기 기능에서 사용자의 위치를 기준으로 가까운 매장을 검색할 때 사용하면 유용해요.

시그니처

function getCurrentLocation(options: {
  accuracy: Accuracy;
}): Promise<Location>;
파라미터
options필수 · GetCurrentLocationOptions
위치 정보를 가져올 때 사용하는 옵션 객체예요.

options.accuracyAccuracy
위치 정보의 정확도 수준이에요. 정확도는 Accuracy 타입으로 설정돼요.

프로퍼티
openPermissionDialog
위치 정보 권한을 다시 요청하는 다이얼로그를 표시해요. 사용자는 "허용", "한 번만 허용", "안하기" 중 하나를 선택할 수 있어요. "허용"이나 "한 번만 허용"을 선택하면 allowed를 반환하고, "안하기"를 선택하면 denied를 반환해요.

getPermission
위치 정보 권한의 현재 상태를 반환해요. allowed는 사용자가 위치 정보 권한을 허용한 상태예요. denied는 사용자가 위치 정보 권한을 거부한 상태예요. notDetermined는 위치 정보 권한 요청을 한 번도 하지 않은 상태예요.

반환 값
Promise<Location>
디바이스의 위치 정보가 담긴 객체를 반환해요. 자세한 내용은 Location을 참고해주세요.

GetCurrentLocationPermissionError
위치 권한이 거부되었을 때 발생하는 에러예요. 에러가 발생했을 때 error instanceof GetCurrentLocationPermissionError를 통해 확인할 수 있어요.

시그니처

class GetCurrentLocationPermissionError extends PermissionError {
    constructor();
}
예제
디바이스의 현재 위치 정보 가져오기
"권한 확인하기"버튼을 눌러서 현재 위치정보 권한을 확인해요. 사용자가 권한을 거부했거나 시스템에서 권한이 제한된 경우에는 GetCurrentLocationPermissionError를 반환해요. "권한 요청하기"버튼을 눌러서 위치정보 권한을 요청할 수 있어요.


React

React Native

import { Accuracy, getCurrentLocation, Location } from '@apps-in-toss/web-framework';
import { useState } from 'react';


// 현재 위치 정보를 가져와 화면에 표시하는 컴포넌트
function CurrentPosition() {
  const [position, setPosition] = useState<Location | null>(null);

  const handlePress = async () => {
    try {
      const response = await getCurrentLocation({ accuracy: Accuracy.Balanced });
      setPosition(response);
    } catch (error) {
      console.error('위치 정보를 가져오는 데 실패했어요:', error);
    }
  };

  return (
    <div>
      {position ? (
        <span>
          위치: {position.coords.latitude}, {position.coords.longitude}
        </span>
      ) : (
        <span>위치 정보를 아직 가져오지 않았어요</span>
      )}
      <input type="button" value="현재 위치 정보 가져오기" onClick={handlePress} />
      <input type="button"
        value="권한 확인하기"
        onClick={async () => {
          alert(await getCurrentLocation.getPermission());
        }}
      />
      <input type="button"
        value="권한 요청하기"
        onClick={async () => {
          alert(await getCurrentLocation.openPermissionDialog());
        }}
      />
    </div>
  );
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-location-once 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
공유 완료 리워드 정보 이벤트
Next page
실시간 위치 추적하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
startUpdateLocation
디바이스의 위치 정보를 지속적으로 감지하고, 위치가 변경되면 콜백을 실행하는 함수예요. 콜백 함수를 등록하면 위치가 변경될 때마다 자동으로 호출돼요. 실시간 위치 추적이 필요한 기능을 구현할 때 사용할 수 있어요. 예를 들어 지도 앱에서 사용자의 현재 위치를 실시간으로 업데이트할 때, 운동 앱에서 사용자의 이동 거리를 기록할 때 등이에요. 위치 업데이트 주기와 정확도를 조정해 배터리 소모를 최소화하면서도 필요한 정보를 얻을 수 있어요.

시그니처

function startUpdateLocation(options: {
  onError: (error: unknown) => void;
  onEvent: (location: Location) => void;
  options: StartUpdateLocationOptions;
}): () => void;
파라미터
onError필수 · (error: unknown) => void
위치 정보 감지에 실패했을 때 호출되는 콜백 함수예요.

onEvent필수 · (location: Location) => void
위치 정보가 변경될 때 호출되는 콜백 함수예요. 자세한 내용은 Location을 참고해주세요.

options필수 · StartUpdateLocationOptions
위치 정보 감지에 필요한 설정 객체에요.

options.accuracynumber
위치 정확도를 설정해요.

options.timeIntervalnumber
위치 정보를 업데이트하는 최소 주기로, 단위는 밀리초(ms)예요. 이 값은 위치 업데이트가 발생하는 가장 짧은 간격을 설정하지만, 시스템이나 환경의 영향을 받아 지정한 주기보다 더 긴 간격으로 업데이트될 수 있어요.

options.distanceIntervalnumber
위치 변경 거리를 미터(m) 단위로 설정해요.

프로퍼티
openPermissionDialog
위치 정보 권한을 다시 요청하는 다이얼로그를 표시해요. 사용자는 "허용", "한 번만 허용", "안하기" 중 하나를 선택할 수 있어요. "허용"이나 "한 번만 허용"을 선택하면 allowed를 반환하고, "안하기"를 선택하면 denied를 반환해요.

getPermission
위치 정보 권한의 현재 상태를 반환해요. allowed는 사용자가 위치 정보 권한을 허용한 상태예요. denied는 사용자가 위치 정보 권한을 거부한 상태예요. notDetermined는 위치 정보 권한 요청을 한 번도 하지 않은 상태예요.

StartUpdateLocationPermissionError
위치 업데이트 권한이 거부되었을 때 발생하는 에러예요. 에러가 발생했을 때 error instanceof StartUpdateLocationPermissionError를 통해 확인할 수 있어요.

시그니처

StartUpdateLocationPermissionError: typeof GetCurrentLocationPermissionError
예제
위치 정보 변경 감지하기
위치 정보가 변경되는것을 감지하는 예제예요. "위치 정보 변경 감지하기"를 눌러서 감지할 수 있어요.

"권한 확인하기"버튼을 눌러서 현재 위치 정보 변경 감지 권한을 확인해요. 사용자가 권한을 거부했거나 시스템에서 권한이 제한된 경우에는 StartUpdateLocationPermissionError를 반환해요. "권한 요청하기"버튼을 눌러서 위치 정보 변경 감지 권한을 요청할 수 있어요.


React

React Native

import { Accuracy, Location, startUpdateLocation, StartUpdateLocationPermissionError } from '@apps-in-toss/web-framework';
import { useCallback, useState } from 'react';


// 위치 정보 변경 감지하기
function LocationWatcher() {
  const [location, setLocation] = useState<Location | null>(null);

  const handlePress = useCallback(() => {
    startUpdateLocation({
      options: {
        accuracy: Accuracy.Balanced,
        timeInterval: 3000,
        distanceInterval: 10,
      },
      onEvent: (location) => {
        setLocation(location);
      },
      onError: (error) => {
        if (error instanceof StartUpdateLocationPermissionError) {
          // 위치 정보 변경 감지 권한 없음
        }
        console.error('위치 정보를 가져오는데 실패했어요:', error);
      },
    });
  }, []);

  return (
    <div>
      {location != null && (
        <>
          <span>위도: {location.coords.latitude}</span>
          <span>경도: {location.coords.longitude}</span>
          <span>위치 정확도: {location.coords.accuracy}m</span>
          <span>높이: {location.coords.altitude}m</span>
          <span>고도 정확도: {location.coords.altitudeAccuracy}m</span>
          <span>방향: {location.coords.heading}°</span>
        </>
      )}

      <input type="button" value="위치 정보 변경 감지하기" onClick={handlePress} />

      <input type="button"
        value="권한 확인하기"
        onClick={async () => {
          const permission = await startUpdateLocation.getPermission();
          alert(permission);
        }}
      />
      <input type="button"
        value="권한 요청하기"
        onClick={async () => {
          const permission = await startUpdateLocation.openPermissionDialog();
          alert(permission);
        }}
      />
    </div>
  );
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-location-callback 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
현재 위치 가져오기
Next page
훅으로 위치 사용하기
지원환경: React Native
실행환경: Toss AppSandbox App
useGeolocation
useGeolocation 는 디바이스의 위치 정보를 반환하는 훅이에요. 위치가 변경되면 값도 변경돼요. GPS 정보를 활용해 현재 위치를 감지하고, 사용자의 이동에 따라 자동으로 업데이트돼요. 예를 들어, 지도 기반 서비스에서 사용자의 현재 위치를 표시하거나, 배달 앱에서 실시간 이동 경로를 추적할 때 활용할 수 있어요. 위치 정보의 정확도와 업데이트 주기를 조정할 수 있어서 배터리 소모를 최소화하면서도 필요한 수준의 정확도를 유지할 수 있어요.

시그니처

function useGeolocation({ accuracy, distanceInterval, timeInterval }: UseGeolocationOptions): Location | null;
파라미터
options필수 · UseGeolocationOptions
위치 정보 감지에 필요한 설정 객체에요.

options.accuracyAccuracy
위치 정확도를 설정해요. Accuracy.Lowest: 오차범위 3KM 이내, Accuracy.Low: 오차범위 1KM 이내, Accuracy.Balanced: 오차범위 몇 백미터 이내, Accuracy.High: 오차범위 10M 이내, Accuracy.Highest: 가장 높은 정확도, Accuracy.BestForNavigation: 네비게이션을 위한 최고 정확도

options.timeIntervalnumber
위치 정보를 업데이트하는 최소 주기로, 단위는 밀리초(ms)예요. 이 값은 위치 업데이트가 발생하는 가장 짧은 간격을 설정하지만, 시스템이나 환경의 영향을 받아 지정한 주기보다 더 긴 간격으로 업데이트될 수 있어요.

options.distanceIntervalnumber
위치 변경 거리를 미터(m) 단위로 설정해요.

반환 값
Location | null
디바이스의 위치 정보가 담긴 객체를 반환해요. 자세한 내용은 Location을 참고해주세요.

예제
위치 정보 변경 감지하기

import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useGeolocation, Accuracy } from '@apps-in-toss/framework';

// 위치 정보 변경 감지하기
function LocationWatcher() {
  const location = useGeolocation({
    accuracy: Accuracy.Balanced,
    distanceInterval: 10,
    timeInterval: 1000,
  });

  if (location == null) {
    return <Text>위치 정보를 가져오는 중이에요...</Text>;
  }

  return (
    <View>
      <Text>위치 정보: {location.latitude}, {location.longitude}</Text>
    </View>
  );
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-location-tracking 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
실시간 위치 추적하기
Next page
정확도 옵션
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
Accuracy
Accuracy 는 위치 정확도 옵션이에요.

시그니처

enum Accuracy {
    /**
     * 오차범위 3KM 이내
     */
    Lowest = 1,
    /**
     * 오차범위 1KM 이내
     */
    Low = 2,
    /**
     * 오차범위 몇 백미터 이내
     */
    Balanced = 3,
    /**
     * 오차범위 10M 이내
     */
    High = 4,
    /**
     * 가장 높은 정확도
     */
    Highest = 5,
    /**
     * 네비게이션을 위한 최고 정확도
     */
    BestForNavigation = 6
}
Pager
Previous page
훅으로 위치 사용하기
Next page
위치 정보 객체위치 정보 객체
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
Location
Location 는 위치 정보를 나타내는 객체예요.

시그니처

interface Location {
    /**
     * Android에서만 지원하는 옵션이에요.
     *
     * - `FINE`: 정확한 위치
     * - `COARSE`: 대략적인 위치
     *
     * @see https://developer.android.com/codelabs/approximate-location
     */
    accessLocation?: 'FINE' | 'COARSE';
    /**
     * 위치가 업데이트된 시점의 유닉스 타임스탬프예요.
     */
    timestamp: number;
    /**
     * @description 위치 정보를 나타내는 객체예요. 자세한 내용은 [LocationCoords](/react-native/reference/framework/Types/LocationCoords.html)을 참고해주세요.
     */
    coords: LocationCoords;
}
Pager
Previous page
정확도 옵션
Next page
좌표 정보
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
LocationCoords
LocationCoords는 세부 위치 정보를 나타내는 객체예요.

시그니처

interface LocationCoords {
    /**
     * 위도
     */
    latitude: number;
    /**
     * 경도
     */
    longitude: number;
    /**
     * 높이
     */
    altitude: number;
    /**
     * 위치 정확도
     */
    accuracy: number;
    /**
     * 고도 정확도
     */
    altitudeAccuracy: number;
    /**
     * 방향
     */
    heading: number;
}
Pager
Previous page
위치 정보 객체
Next page
네이티브 저장소 이용하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
Storage
Storage 로 네이티브의 저장소를 사용할 수 있어요.

시그니처

Storage: {
  getItem: typeof getItem;
  setItem: typeof setItem;
  removeItem: typeof removeItem;
  clearItems: typeof clearItems;
}
프로퍼티
getItemtypeof getItem
모바일 앱의 로컬 저장소에서 아이템을 가져오는 함수예요. 자세한 내용은 getItem을 참고하세요.

setItemtypeof setItem
모바일 앱의 로컬 저장소에 아이템을 저장하는 함수예요. 자세한 내용은 setItem을 참고하셰요.

removeItemtypeof removeItem
모바일 앱의 로컬 저장소에서 아이템을 삭제하는 함수예요. 자세한 내용은 removeItem을 참고하세요.

clearItemstypeof clearItems
모바일 앱의 로컬 저장소를 초기화하는 함수예요. 자세한 내용은 clearItems을 참고하세요.

예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-storage 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
좌표 정보
Next page
값 저장하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
setItem
setItem 함수는 모바일 앱의 로컬 저장소에 문자열 데이터를 저장해요. 주로 앱이 종료되었다가 다시 시작해도 데이터가 유지되어야 하는 경우에 사용해요.

시그니처

function setItem(key: string, value: string): Promise<void>;
파라미터
key필수 · string
저장할 아이템의 키를 입력해요.

value필수 · string
저장할 아이템의 값을 입력해요.

반환 값
Promise<void>
아이템을 성공적으로 저장하면 아무 값도 반환하지 않아요.

예제
my-key에 아이템 저장하기

React

React Native

import { Storage } from '@apps-in-toss/web-framework';
import { Button, Text } from '@toss-design-system/mobile';
import { useState } from 'react';

const KEY = 'my-key';

function StorageClearButton() {
  const [storageValue, setStorageValue] = useState<string | null>(null);

  async function handleSet() {
    await Storage.setItem(KEY, 'my-value');
  }

  async function handleGet() {
    const storageValue = await Storage.getItem(KEY);
    setStorageValue(storageValue);
  }

  async function handleRemove() {
    await Storage.removeItem(KEY);
  }

  return (
    <>
      <Text>{storageValue}</Text>
      <Button onClick={handleSet}>저장하기</Button>
      <Button onClick={handleGet}>가져오기</Button>
      <Button onClick={handleRemove}>삭제하기</Button>
    </>
  );
}
Pager
Previous page
네이티브 저장소 이용하기
Next page
값 읽기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getItem
getItem 함수는 모바일 앱의 로컬 저장소에서 문자열 데이터를 가져와요. 주로 앱이 종료되었다가 다시 시작해도 데이터가 유지되어야 하는 경우에 사용해요.

시그니처

function getItem(key: string): Promise<string | null>;
파라미터
key필수 · string
가져올 아이템의 키를 입력해요.

반환 값
Promise<string | null>
지정한 키에 저장된 문자열 값을 반환해요. 값이 없으면 null을 반환해요.

예제
my-key에 저장된 아이템 가져오기

React

React Native

import { Storage } from '@apps-in-toss/web-framework';
import { Button, Text } from '@toss-design-system/mobile';
import { useState } from 'react';

const KEY = 'my-key';

function StorageClearButton() {
  const [storageValue, setStorageValue] = useState<string | null>(null);

  async function handleSet() {
    await Storage.setItem(KEY, 'my-value');
  }

  async function handleGet() {
    const storageValue = await Storage.getItem(KEY);
    setStorageValue(storageValue);
  }

  async function handleRemove() {
    await Storage.removeItem(KEY);
  }

  return (
    <>
      <Text>{storageValue}</Text>
      <Button onClick={handleSet}>저장하기</Button>
      <Button onClick={handleGet}>가져오기</Button>
      <Button onClick={handleRemove}>삭제하기</Button>
    </>
  );
}
Pager
Previous page
값 저장하기
Next page
값 삭제하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
removeItem
removeItem 함수는 모바일 앱의 로컬 저장소에서 특정 키에 해당하는 아이템을 삭제해요.

시그니처

declare function removeItem(key: string): Promise<void>;
파라미터
key필수 · string
삭제할 아이템의 키를 입력해요.

반환 값
Promise<void>
아이템을 삭제하면 아무 값도 반환하지 않아요.

예제
my-key에 저장된 아이템 삭제하기

React

React Native

import { Storage } from '@apps-in-toss/web-framework';
import { Button, Text } from '@toss-design-system/mobile';
import { useState } from 'react';

const KEY = 'my-key';

function StorageClearButton() {
  const [storageValue, setStorageValue] = useState<string | null>(null);

  async function handleSet() {
    await Storage.setItem(KEY, 'my-value');
  }

  async function handleGet() {
    const storageValue = await Storage.getItem(KEY);
    setStorageValue(storageValue);
  }

  async function handleRemove() {
    await Storage.removeItem(KEY);
  }

  return (
    <>
      <Text>{storageValue}</Text>
      <Button onClick={handleSet}>저장하기</Button>
      <Button onClick={handleGet}>가져오기</Button>
      <Button onClick={handleRemove}>삭제하기</Button>
    </>
  );
}
Pager
Previous page
값 읽기
Next page
모든 항목 삭제
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
clearItems
clearItems 함수는 모바일 앱의 로컬 저장소의 모든 아이템을 삭제해요.

시그니처

declare function clearItems(): Promise<void>;
반환 값
Promise<void>
아이템을 삭제하면 아무 값도 반환하지 않고 저장소가 초기화돼요.

예제
저장소 초기화하기

React

React Native

import { Storage } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';

function StorageClearButton() {
  async function handleClick() {
    await Storage.clearItems();
    console.log('Storage cleared');
  }

  return <Button onClick={handleClick}>저장소 초기화</Button>;
}
Pager
Previous page
값 삭제하기
Next page
카메라로 사진 촬영하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
openCamera
카메라를 실행해서 촬영된 이미지를 반환하는 함수예요.

시그니처

function openCamera(options: {
  base64: boolean;
  maxWidth: number;
}): Promise<ImageResponse>;
파라미터
options필수 · OpenCameraOptions
카메라 실행 시 사용되는 옵션 객체예요.

options.base64boolean · false
이미지를 Base64 형식으로 반환할지 여부를 나타내는 불리언 값이에요. 기본값은 false예요. true로 설정하면 dataUri 대신 Base64 인코딩된 문자열을 반환해요.

options.maxWidthnumber · 1024
이미지의 최대 너비를 나타내는 숫자 값이에요. 기본값은 1024예요.

프로퍼티
openPermissionDialog
카메라 접근 권한을 다시 요청하는 다이얼로그를 표시해요. 사용자는 "허용", "한 번만 허용", "안하기" 중 하나를 선택할 수 있어요. "허용"이나 "한 번만 허용"을 선택하면 allowed를 반환하고, "안하기"를 선택하면 denied를 반환해요.

getPermission
카메라 접근 권한의 현재 상태를 반환해요. allowed는 사용자가 카메라 접근 권한을 허용한 상태예요. denied는 사용자가 카메라 접근 권한을 거부한 상태예요. notDetermined는 카메라 접근 권한 요청을 한 번도 하지 않은 상태예요.

반환 값
Promise<ImageResponse>
촬영된 이미지 정보를 포함한 객체를 반환해요. 반환 객체의 구성은 다음과 같아요:

id: 이미지의 고유 식별자예요.
dataUri: 이미지 데이터를 표현하는 데이터 URI예요.
OpenCameraPermissionError
카메라 권한이 거부되었을 때 발생하는 에러예요. 에러가 발생했을 때 error instanceof OpenCameraPermissionError를 통해 확인할 수 있어요.

시그니처

class OpenCameraPermissionError extends PermissionError {
    constructor();
}
예제
카메라 실행 후 촬영된 사진 가져오기
카메라로 사진을 찍고 결과를 가져오는 예제예요. 이 과정에서 현재 카메라 권한 상태를 확인할 수 있고, 권한이 없으면 권한을 요청해요. 사용자가 권한을 거부했거나 시스템에서 권한이 제한된 경우에는 OpenCameraPermissionError를 반환해요.


React

React Native

import { ImageResponse, openCamera, OpenCameraPermissionError } from '@apps-in-toss/web-framework';
import { useState } from 'react';


const base64 = true;

// 카메라를 실행하고 촬영된 이미지를 화면에 표시하는 컴포넌트
function Camera() {
  const [image, setImage] = useState<ImageResponse | null>(null);

  const handlePress = async () => {
    try {
      const response = await openCamera({ base64 });
      setImage(response);
    } catch (error) {
      if (error instanceof OpenCameraPermissionError) {
        console.log('권한 에러');
      }

      console.error('사진을 가져오는 데 실패했어요:', error);
    }
  };

  // base64 형식으로 반환된 이미지를 표시하려면 데이터 URL 스키마 Prefix를 붙여야해요.
  const imageUri = base64 ? 'data:image/jpeg;base64,' + image?.dataUri : image?.dataUri;

  return (
    <div>
      {image ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} /> : <span>사진이 없어요</span>}
      <input type="button" value="사진 촬영하기" onClick={handlePress} />
      <input type="button"
        value="권한 확인하기"
        onClick={async () => {
          const permission = await openCamera.getPermission();
          Alert.alert(permission);
        }}
      />

      <input type="button"
        value="권한 요청하기"
        onClick={async () => {
          const currentPermission = await openCamera.openPermissionDialog();
          Alert.alert(currentPermission);
        }}
      />
    </div>
  );
}클립보드 텍스트 가져오기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getClipboardText
클립보드에 저장된 텍스트를 가져오는 함수예요. 복사된 텍스트를 읽어서 다른 작업에 활용할 수 있어요.

시그니처

function getClipboardText(): Promise<string>;
프로퍼티
openPermissionDialog
클립보드 읽기 권한을 다시 요청하는 다이얼로그를 표시해요. 사용자는 "허용", "한 번만 허용", "안하기" 중 하나를 선택할 수 있어요. "허용"이나 "한 번만 허용"을 선택하면 allowed를 반환하고, "안하기"를 선택하면 denied를 반환해요.

getPermission
클립보드 읽기 권한의 현재 상태를 반환해요. allowed는 사용자가 클립보드 읽기 권한을 허용한 상태예요. denied는 사용자가 클립보드 읽기 권한을 거부한 상태예요. notDetermined는 클립보드 읽기 권한 요청을 한 번도 하지 않은 상태예요.

반환 값
Promise<string>
클립보드에 저장된 텍스트를 반환해요. 클립보드에 텍스트가 없으면 빈 문자열을 반환해요.

GetClipboardTextPermissionError
클립보드 읽기 권한이 거부되었을 때 발생하는 에러예요. 에러가 발생했을 때 error instanceof GetClipboardTextPermissionError를 통해 확인할 수 있어요.

시그니처

class GetClipboardTextPermissionError extends PermissionError {
    constructor();
}
예제
클립보드의 텍스트 가져오기
클립보드의 텍스트를 가져오는 예제예요. "권한 확인하기"버튼을 눌러서 현재 클립보드 읽기 권한을 확인해요. 사용자가 권한을 거부했거나 시스템에서 권한이 제한된 경우에는 GetClipboardTextPermissionError를 반환해요. "권한 요청하기"버튼을 눌러서 클립보드 읽기 권한을 요청할 수 있어요.


React

React Native

import {
  getClipboardText,
  GetClipboardTextPermissionError,
  SetClipboardTextPermissionError,
} from '@apps-in-toss/web-framework';
import { useState } from 'react';
 *

// '붙여넣기' 버튼을 누르면 클립보드에 저장된 텍스트를 가져와 화면에 표시해요.
function PasteButton() {
  const [text, setText] = useState(''); 

  const handlePress = async () => {
    try {
      const clipboardText = await getClipboardText();
      setText(clipboardText || '클립보드에 텍스트가 없어요.');
    } catch (error) {
      if (error instanceof GetClipboardTextPermissionError) {
        // 클립보드 읽기 권한 없음
      } 

      if (error instanceof SetClipboardTextPermissionError) {
        // 클립보드 쓰기 권한 없음
      }
    }
  };

  return (
    <div>
      <span>{text}</span>
      <input type="button" value="붙여넣기" onClick={handlePress} />
      <input type="button"
        value="권한 확인하기"
        onClick={async () => {
          const permission = await getClipboardText.getPermission();
          alert(permission);
        }}
      />
      <input type="button"
        value="권한 요청하기"
        onClick={async () => {
          const permission = await getClipboardText.openPermissionDialog();
          alert(permission);
        }}
      />
    </div>
  );
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-clipboard-text 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
카메라로 사진 촬영하기
Next page
클립보드 텍스트 복사하기클립보드 텍스트 복사하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
setClipboardText
텍스트를 클립보드에 복사해서 사용자가 다른 곳에 붙여 넣기 할 수 있어요.

시그니처

function setClipboardText(text: string): Promise<void>;
파라미터
text필수 · Promise<void>
클립보드에 복사할 텍스트예요. 문자열 형식으로 입력해요.

프로퍼티
openPermissionDialog
클립보드 쓰기 권한을 다시 요청하는 다이얼로그를 표시해요. 사용자는 "허용", "한 번만 허용", "안하기" 중 하나를 선택할 수 있어요. "허용"이나 "한 번만 허용"을 선택하면 allowed를 반환하고, "안하기"를 선택하면 denied를 반환해요.

getPermission
클립보드 쓰기 권한의 현재 상태를 반환해요. allowed는 사용자가 클립보드 쓰기 권한을 허용한 상태예요. denied는 사용자가 클립보드 쓰기 권한을 거부한 상태예요. notDetermined는 클립보드 쓰기 권한 요청을 한 번도 하지 않은 상태예요.

SetClipboardTextPermissionError
클립보드 쓰기 권한이 거부되었을 때 발생하는 에러예요. 에러가 발생했을 때 error instanceof SetClipboardTextPermissionError를 통해 확인할 수 있어요.

시그니처

class SetClipboardTextPermissionError extends PermissionError {
    constructor();
}
예제
텍스트를 클립보드에 복사하기
텍스트를 클립보드에 복사하는 예제예요. "권한 확인하기"버튼을 눌러서 현재 클립보드 쓰기 권한을 확인해요. 사용자가 권한을 거부했거나 시스템에서 권한이 제한된 경우에는 SetClipboardTextPermissionError를 반환해요. "권한 요청하기"버튼을 눌러서 클립보드 쓰기 권한을 요청할 수 있어요.


React

React Native

import { setClipboardText, SetClipboardTextPermissionError } from '@apps-in-toss/web-framework';


// '복사' 버튼을 누르면 "복사할 텍스트"가 클립보드에 복사돼요.
function CopyButton() {
  const handleCopy = async () => {
    try {
      await setClipboardText('복사할 텍스트');
      console.log('텍스트가 복사됐어요!');
    } catch (error) {
      if (error instanceof SetClipboardTextPermissionError) {
        // 텍스트 쓰기 권한 거부됨
      }
    }
  };

  return (
    <>
      <input type="button" value="복사" onClick={handleCopy} />
      <input type="button"
        value="권한 확인하기"
        onClick={async () => {
          const permission = await setClipboardText.getPermission();
          Alert.alert(permission);
        }}
      />
      <input type="button"
        value="권한 요청하기"
        onClick={async () => {
          const permission = await setClipboardText.openPermissionDialog();
          Alert.alert(permission);
        }}
      />
    </>
  );
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-clipboard-text 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
클립보드 텍스트 가져오기
Next page
토스페이 객체
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
TossPay
TossPay는 토스페이 결제 관련 함수를 모아둔 객체예요.

시그니처

TossPay: {
  checkoutPayment: typeof checkoutPayment;
}
프로퍼티
checkoutPaymenttypeof checkoutPayment
토스페이 결제를 인증하는 함수예요. 자세한 내용은 checkoutPayment를 참고하세요.

Pager
Previous page
클립보드 텍스트 복사하기
Next page
결제 인증 실행하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
checkoutPayment
checkoutPayment 함수는 토스페이 결제창을 띄우고, 사용자 인증을 수행해요. 인증이 완료되면 성공 여부를 반환해요.

이 함수는 결제창을 통해 사용자 인증만 해요. 실제 결제 처리는 인증 성공 후 서버에서 별도로 해야 해요.

시그니처

function checkoutPayment(options: CheckoutPaymentOptions): Promise<CheckoutPaymentResult>;
파라미터
options필수 · CheckoutPaymentOptions
결제창을 띄울 때 필요한 옵션이에요.

반환 값
Promise<CheckoutPaymentResult>
인증 성공 여부를 포함한 결과를 반환해요.

예제
토스페이 결제창 띄우고 인증 처리하기

React

React Native

import { checkoutPayment } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';

function TossPayButton() {
  async function handlePayment() {
    try {
      // 실제 구현 시 결제 생성 역할을 하는 API 엔드포인트로 대체해주세요.
      const { payToken } = await fetch('/my-api/payment/create').then((res) => res.json());

      const { success, reason } = await checkoutPayment({ payToken });

      if (success) {
        // 실제 구현 시 결제를 실행하는 API 엔드포인트로 대체해주세요.
        await fetch('/my-api/payment/execute', {
          method: 'POST',
          body: JSON.stringify({ payToken }),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        console.log('인증 실패:', reason);
      }
    } catch (error) {
      console.error('결제 인증 중 오류가 발생했어요:', error);
    }
  }

  return <Button onClick={handlePayment}>결제하기</Button>;
}
Pager
Previous page
토스페이 객체
Next page
결제 옵션
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
CheckoutPaymentOptions
CheckoutPaymentOptions 는 토스페이 결제창을 띄울 때 필요한 옵션이에요.

시그니처

interface CheckoutPaymentOptions {
  payToken: string;
}
프로퍼티
payToken필수 · string
결제 토큰이에요.

Pager
Previous page
결제 인증 실행하기
Next page
결제 결과 반환
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
CheckoutPaymentResult
CheckoutPaymentResult 는 토스페이 결제창에서 사용자가 인증에 성공했는지 여부예요.

시그니처

interface CheckoutPaymentResult {
  success: boolean;
  reason?: string;
}
프로퍼티
success필수 · boolean
인증이 성공했는지 여부예요.

reasonstring
인증이 실패했을 경우의 이유예요.

Pager
Previous page
결제 옵션
Next page
결제 결과 반환
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
CheckoutPaymentResult
CheckoutPaymentResult 는 토스페이 결제창에서 사용자가 인증에 성공했는지 여부예요.

시그니처

interface CheckoutPaymentResult {
  success: boolean;
  reason?: string;
}
프로퍼티
success필수 · boolean
인증이 성공했는지 여부예요.

reasonstring
인증이 실패했을 경우의 이유예요.

Pager
Previous page
결제 옵션
Next page
인앱 결제 객체
지원환경: React NativeWebView
실행환경: Toss App
IAP
IAP는 인앱 결제 관련 함수를 모아둔 객체예요.

주의하세요

토스앱 5.219.0 버전부터 지원해요. 인앱 결제를 지원하지 않는 버전에서는 undefined를 반환해요.

시그니처

IAP {
  getProductItemList: typeof getProductItemList;
  createOneTimePurchaseOrder: typeof createOneTimePurchaseOrder;
  getPendingOrders: typeof getPendingOrders;
  getCompletedOrRefundedOrders: typeof getCompletedOrRefundedOrders;
  completeProductGrant: typeof completeProductGrant;
}
프로퍼티
getProductItemListtypeof getProductItemList
인앱 결제로 구매할 수 있는 상품 목록을 가져오는 함수예요. 자세한 내용은 getProductItemList를 참고하세요.

createOneTimePurchaseOrdertypeof createOneTimePurchaseOrder
인앱 결제를 요청하는 함수예요. 자세한 내용은 createOneTimePurchaseOrder를 참고하세요.

getPendingOrderstypeof getPendingOrders
대기 중인 주문 목록을 가져와요. 자세한 내용은 getPendingOrders 문서를 참고하세요.

getCompletedOrRefundedOrderstypeof getCompletedOrRefundedOrders
인앱결제로 구매하거나 환불한 주문 목록을 가져와요. 자세한 내용은 getCompletedOrRefundedOrders 문서를 참고하세요.

completeProductGranttypeof completeProductGrant
상품 지급 처리를 완료했다는 메시지를 앱에 전달해요. 자세한 내용은 completeProductGrant 문서를 참고하세요.

Pager
Previous page
결제 결과 반환
Next page
상품목록 가져오기
지원환경: React NativeWebView
실행환경: Toss App
getProductItemList
getProductItemList 는 인앱 결제로 구매할 수 있는 상품 목록을 담은 함수예요. 상품 목록을 화면에 표시할 때 사용해요.

시그니처

function getProductItemList(): Promise<{ products: IapProductListItem[] } | undefined>;
반환값
Promise<{ products: IapProductListItem[] } | undefined>
상품 목록을 포함한 객체를 반환해요. 앱 버전이 최소 지원 버전(5.219.0)보다 낮으면 undefined를 반환해요.

프로퍼티

interface IapProductListItem {
  sku: string;
  displayAmount: string;
  displayName: string;
  iconUrl: string;
  description: string;
}
IapProductListItem
인앱결제로 구매할 수 있는 상품 하나의 정보를 담은 객체예요. 상품 목록을 화면에 표시할 때 사용해요.

sku필수 · string
상품의 고유 ID예요. IAP.createOneTimePurchaseOrder를 호출할때 사용하는 productId와 동일한 값이에요.


displayAmount필수 · string
화면에 표시할 상품 이름이에요. 상품 이름은 앱인토스 콘솔에서 설정한 값이에요.


displayName필수 · string
통화 단위가 포함된 가격 정보예요. 예를 들어 "1,000원"으로 가격과 통화가 함께 표시돼요.


iconUrl필수 · string
상품 아이콘 이미지의 URL이에요. 아이콘은 앱인토스 콘솔에서 설정한 이미지예요.


description필수 · string
상품에 대한 설명이에요. 설명은 앱인토스 콘솔에서 설정한 값이에요.


예제
구매 가능한 인앱결제 상품목록 가져오기

React

React Native

import { IAP, IapProductListItem } from "@apps-in-toss/web-framework";
import { Button, List, ListRow } from "@toss-design-system/mobile";
import { useEffect, useState } from "react";

function IapProductList() {
  const [products, setProducts] = useState<IapProductListItem[]>([]);

  async function buyIapProduct (productId: string) {
    try {
      await IAP.createOneTimePurchaseOrder({
        productId,
      });

      console.error("인앱결제에 성공했어요");
    } catch (error) {
      console.error("인앱결제에 실패했어요:", error);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await IAP.getProductItemList();
        setProducts(response?.products ?? []);
      } catch (error) {
        console.error("상품 목록을 가져오는 데 실패했어요:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <List>
      {products.map((product) => (
        <ListRow
          key={product.sku}
          left={<ListRow.Image type="square" src={product.iconUrl} />}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.displayName}
              middle={product.description}
              bottom={product.displayAmount}
            />
          }
          right={
            <Button size="medium" onClick={() => buyIapProduct(product.sku)}>
              구매하기
            </Button>
          }
        />
      ))}
    </List>
  );
}
예제 응답

{
  "products": [
    {
      "sku": "sku1",
      "displayName": "광고 제거",
      "displayAmount": "4,900원",
      "iconUrl": "https://cdn.example.com/icons/premium-monthly.png",
      "description": "광고 제거 및 프리미엄 기능 제공"
    },
    {
      "sku": "sku2",
      "displayName": "코인 100개",
      "displayAmount": "9,900원",
      "iconUrl": "https://cdn.example.com/icons/coin-100.png",
      "description": "앱 내에서 사용할 수 있는 코인 100개"
    }
  ]
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-in-app-purchase 코드를 내려받아 체험해 보세요.

Pager
Previous page
인앱 결제 객체
Next page
결제하기
지원환경: React NativeWebView
실행환경: Toss App
createOneTimePurchaseOrder
createOneTimePurchaseOrder 함수는 인앱 결제 결제창을 띄우고, 사용자가 결제를 진행해요. 만약 결제 중에 에러가 발생하면 에러 유형에 따라 에러 페이지로 이동해요.

시그니처

function createOneTimePurchaseOrder(params: IapCreateOneTimePurchaseOrderOptions): () => void;
파라미터


interface IapCreateOneTimePurchaseOrderOptions {
  options: {sku: string; processProductGrant: (params: { orderId: string }) => boolean | Promise<boolean> };
  onEvent: (event: SuccessEvent) => void | Promise<void>;
  onError: (error: unknown) => void | Promise<void>;
}

interface IapCreateOneTimePurchaseOrderResult {
  orderId: string;
  displayName: string;
  displayAmount: string;
  amount: number;
  currency: string;
  fraction: number;
  miniAppIconUrl: string | null;
}

interface SuccessEvent {
  type: 'success';
  data: IapCreateOneTimePurchaseOrderResult;
}
options필수
인앱 결제를 필요한 옵션이에요.

params.sku필수 · string
주문할 상품의 ID예요.

params.processProductGrant필수 · (params: { orderId: string }) => boolean | Promise<boolean>
주문이 만들어진 뒤 실제로 상품을 지급할 때 호출해요. `orderId`를 받아서 지급 성공 여부를 true 또는 Promise<true>로 반환해요. 지급에 실패하면 false를 반환해요.

onEvent필수 · (event: SuccessEvent) => void | Promise<void>
결제가 성공했을 때 호출해요.

event.type필수 · "success"
이벤트의 타입이에요. "success"를 반환해요.

event.data필수 · IapCreateOneTimePurchaseOrderResult
인앱 결제가 완료되면 결제 세부 정보와 상품 정보를 담아 반환해요. 반환된 정보로 결제한 상품의 정보를 화면에 표시할 때 사용할 수 있어요.

event.data.orderId필수 · string
결제 주문 ID이에요. 결제 완료 후 결제 상태를 조회할 때 사용해요.

event.data.displayName필수 · string
화면에 표시할 상품 이름이에요.

event.data.displayAmount필수 · string
통화 단위가 포함된 가격 정보예요.

event.data.amount필수 · number
상품 가격 숫자 값이에요.

event.data.currency필수 · string
상품 가격 통화 단위예요.

event.data.fraction필수 · number
가격을 표시할 때 소수점 아래 몇 자리까지 보여줄지 정하는 값이에요.

event.data.miniAppIconUrlstring | null
미니앱 아이콘 이미지의 URL이에요.

onError필수 · (error: unknown) => void | Promise<void>
결제 과정에서 에러가 발생했을 때 호출해요. 에러 객체를 받아서 로깅하거나 복구 절차를 실행할 수 있어요.

에러코드
INVALID_PRODUCT_ID : 유효하지 않은 상품 ID이거나, 해당 상품이 존재하지 않습니다. 상품 ID를 확인해주세요.
유효하지 않은 상품 ID이거나, 해당 상품이 존재하지 않을 때 발생해요.


PAYMENT_PENDING : 결제 승인이 대기 중입니다. 결제 승인을 기다려주세요.
사용자가 요청한 결제가 아직 승인을 기다리고 있을 때 발생해요.


NETWORK_ERROR : 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
서버 내부 문제로 요청을 처리할 수 없을 때 발생해요.


INVALID_USER_ENVIRONMENT : 이 상품은 현재 기기, 계정 또는 설정 환경에서는 구매가 지원되지 않습니다.
특정 기기, 계정 또는 설정 환경에서 구매할 수 없는 상품일 때 발생해요.


APP_MARKET_VERIFICATION_FAILED : 앱스토어에서 사용자 정보 검증에 실패했습니다. 환불이 필요합니다.
사용자가 결제를 완료했지만, 앱스토어에서 사용자 정보 검증에 실패했을 때 발생해요. 사용자가 앱스토어에 문의해서 환불을 요청해야해요.


TOSS_SERVER_VERIFICATION_FAILED : 결제가 완료되었지만, 서버 전송에 실패했습니다.
사용자가 결제를 완료했지만, 서버 전송에 실패해서 결제 정보를 저장할 수 없을 때 발생해요.


INTERNAL_ERROR : 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
서버 내부 문제로 요청을 처리할 수 없을 때 발생해요.


KOREAN_ACCOUNT_ONLY : 한국 계정만 사용 가능합니다. 다른 계정을 사용해주세요.
iOS 환경에서 사용자의 계정이 한국 계정이 아닐 때 발생해요.


USER_CANCELED : 사용자가 결제를 취소했습니다.
사용자가 결제를 완료하지 않고 주문서 페이지를 이탈했을 때 발생해요.


PRODUCT_NOT_GRANTED_BY_PARTNER : 파트너사의 상품 지급이 실패했습니다
파트너사의 상품 지급이 실패했을 때 발생해요. 토스앱 5.230.0 이상에서만 발생해요.


반환값
() => void
앱브릿지 cleanup 함수를 반환해요. 인앱결제 기능이 끝나면 반드시 이 함수를 호출해서 리소스를 해제해야 해요.

예제
특정 인앱결제 주문서 페이지로 이동하기

React

React Native

import { IAP } from "@apps-in-toss/web-framework";
import { Button } from "@toss-design-system/mobile";
import { useCallback } from "react";
 
 interface Props {
   sku: string;
 }
 
 function IapCreateOneTimePurchaseOrderButton({ sku }: Props) { 
  const handleClick = useCallback(() => {
    const cleanup = IAP.createOneTimePurchaseOrder({
      options: {
        sku,
        processProductGrant: ({ orderId }) => {
          // 상품 지급 로직을 작성해요.
          return true; // 상품 지급 여부를 반환해요.
        }
        },
      onEvent: (event) => {
        console.log(event);
      },
      onError: (error) => {
        console.error(error);
      },
    });

    return cleanup;
  }, []);

   return <Button onClick={handleClick}>구매하기</Button>;
 }
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-in-app-purchase 코드를 내려받아 체험해 보세요.

Pager
Previous page
상품목록 가져오기
Next page
대기 중인 목록 가져오기
지원환경: React NativeReact Native SDKv1.4.2WebViewWebView SDKv1.4.2
실행환경: Toss AppiOSv5.231.0Androidv5.234.0Sandbox AppiOS2025-10-28Android2025-10-22
getPendingOrders
getPendingOrders 는 결제는 완료되었지만 상품이 아직 지급되지 않은 주문 목록을 가져오는 함수예요.
조회된 주문 정보를 확인하여 사용자에게 상품을 지급하세요.
createOneTimePurchaseOrder 함수 호출 후 결과를 받지 못한 경우에도 해당 주문을 조회할 수 있어요.

앱 버전이 최소 지원 버전(안드로이드 5.234.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

시그니처

function getPendingOrders(): Promise<{ orders: Order[] } | undefined>;
반환값
Promise<{ orders: Order[] } | undefined>
대기 중인 주문 목록(orders)을 포함한 객체를 반환해요.
앱 버전이 최소 지원 버전(안드로이드 5.234.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

반환 객체 프로퍼티

interface Order {
  orderId: string;
  sku: string;
}
orders필수 · Order[]
대기 중인 주문의 배열이에요. 대기 중인 주문이 없으면 빈 배열을 반환해요.

orders[].orderId필수 · string
주문의 고유 ID 예요.

orders[].sku필수 · string
주문 상품의 고유 ID 예요.

sku 필드가 추가되었어요

SDK 1.4.2 버전에서 sku 필드가 추가되었어요.
해당 필드는 안드로이드 5.234.0 이상, iOS 5.231.0 이상 에서만 반환돼요.

예제

React

ReactNative

import { IAP } from '@apps-in-toss/web-framework';
async function fetchOrders() {
  try {
    const pendingOrders = await IAP.getPendingOrders();
    return pendingOrders;
  } catch (error) {
    console.error(error);
  }
}
Pager
Previous page
결제하기
Next page
대기 중인 목록 가져오기
지원환경: React NativeReact Native SDKv1.4.2WebViewWebView SDKv1.4.2
실행환경: Toss AppiOSv5.231.0Androidv5.234.0Sandbox AppiOS2025-10-28Android2025-10-22
getPendingOrders
getPendingOrders 는 결제는 완료되었지만 상품이 아직 지급되지 않은 주문 목록을 가져오는 함수예요.
조회된 주문 정보를 확인하여 사용자에게 상품을 지급하세요.
createOneTimePurchaseOrder 함수 호출 후 결과를 받지 못한 경우에도 해당 주문을 조회할 수 있어요.

앱 버전이 최소 지원 버전(안드로이드 5.234.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

시그니처

function getPendingOrders(): Promise<{ orders: Order[] } | undefined>;
반환값
Promise<{ orders: Order[] } | undefined>
대기 중인 주문 목록(orders)을 포함한 객체를 반환해요.
앱 버전이 최소 지원 버전(안드로이드 5.234.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

반환 객체 프로퍼티

interface Order {
  orderId: string;
  sku: string;
}
orders필수 · Order[]
대기 중인 주문의 배열이에요. 대기 중인 주문이 없으면 빈 배열을 반환해요.

orders[].orderId필수 · string
주문의 고유 ID 예요.

orders[].sku필수 · string
주문 상품의 고유 ID 예요.

sku 필드가 추가되었어요

SDK 1.4.2 버전에서 sku 필드가 추가되었어요.
해당 필드는 안드로이드 5.234.0 이상, iOS 5.231.0 이상 에서만 반환돼요.

예제

React

ReactNative

import { IAP } from '@apps-in-toss/web-framework';
async function fetchOrders() {
  try {
    const pendingOrders = await IAP.getPendingOrders();
    return pendingOrders;
  } catch (error) {
    console.error(error);
  }
}
Pager
Previous page
결제하기
Next page
상품 지급하기
지원환경: React NativeWebView
실행환경: Toss App
completeProductGrant
completeProductGrant 함수는 대기 중인 주문의 상품 지급을 완료 처리하는 함수예요.
사용자에게 상품을 지급하고 completeProductGrant 함수를 호출하여 지급 상태를 완료로 변경하세요.

앱 버전이 최소 지원 버전(안드로이드 5.231.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

시그니처

function completeProductGrant(params: {
  params: {
    orderId: string;
  };
}): Promise<boolean | undefined>;
파라미터
{ params: { orderId: string } }
결제가 완료된 주문 정보를 담은 객체예요.

params.orderIdstring
주문의 고유 ID예요. 상품 지급을 완료할 주문을 지정할 때 사용해요.

반환값
Promise<boolean | undefined>
상품 지급이 완료됐는지 여부를 반환해요. 앱 버전이 최소 지원 버전(안드로이드 5.233.0, iOS 5.233.0)보다 낮으면 undefined를 반환해요.

예제

 import { IAP } from '@apps-in-toss/framework';
 
 async function handleGrantProduct(orderId: string) {
   try {
     await IAP.completeProductGrant({ params: { orderId } });
   } catch (error) {
     console.error(error);
   }
 }
Pager
Previous page
대기 중인 목록 가져오기
Next page
주문목록 가져오기
지원환경: React NativeWebView
실행환경: Toss App
getCompletedOrRefundedOrders
getCompletedOrRefundedOrders 는 인앱결제로 구매하고 환불한 주문 목록을 가져와요.
인앱결제 결제 및 상품 지급이 완료된 주문건와 환불된 주문건을 조회할 수 있어요.

결제는 완료되었지만 상품이 아직 지급되지 않은 주문건은 조회되지 않아요.
getPendingOrders함수를 통해 orderId를 조회하여 사용자에게 상품을 지급한 후 completeProductGrant함수를 통해 상품 지급을 완료 처리하세요.

앱 버전이 최소 지원 버전(안드로이드 5.231.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

시그니처

function getCompletedOrRefundedOrders(params?: {
  key?: string | null;
}): Promise<CompletedOrRefundedOrdersResult | undefined>;
반환값
Promise<{ CompletedOrRefundedOrdersResult } | undefined>
페이지네이션을 포함한 주문 목록 객체를 반환해요.
앱 버전이 최소 지원 버전(안드로이드 5.231.0, iOS 5.231.0)보다 낮으면 undefined를 반환해요.

반환 객체 프로퍼티

interface CompletedOrRefundedOrdersResult {
    hasNext: boolean;
    nextKey?: string | null;
    orders: {
        orderId: string;
        sku: string;
        status: 'COMPLETED' | 'REFUNDED';
        date: string;
    }[];
}
hasNext필수 · boolean
다음 페이지가 있는지 여부예요. `true`면 더 많은 주문이 남아 있어요.

nextKey선택 · string | null · null
다음 페이지 조회를 위한 커서 키예요. 이전 응답의 nextKey 값을 사용해요. 첫 호출 시에는 생략하거나 null로 전달해요.

orders필수 · Array
주문 정보를 담은 배열이에요. 각 요소는 하나의 주문을 나타내요.

orders[].orderId필수 · string
주문의 고유 ID 예요.

orders[].sku필수 · string
주문 상품의 고유 ID 예요.

orders[].status필수 · {'COMPLETED' | 'REFUNDED'}
주문의 상태예요. 'COMPLETED'는 주문이 완료된 상태, 'REFUNDED'는 환불된 상태를 의미해요.

orders[].date필수 · string
주문의 날짜 정보예요. ISO 8601 형식(YYYY-MM-DDTHH:mm:ss)을 사용해요.
예를 들어 "2025-09-22T00:00:00" 형식으로 제공돼요.
주문 상태가 `COMPLETED`라면 주문한 날짜를, `REFUNDED`라면 환불한 날짜를 나타내요.

예제

 import { IAP } from '@apps-in-toss/framework';
 
 async function fetchOrders() {
   try {
     const pendingOrders = await IAP.getCompletedOrRefundedOrders();
     return response;
   } catch (error) {
     console.error(error);
   }
 }
Pager
Previous page
상품 지급 처리하기
Next page
스크롤 뷰에서 요소 감지하기
지원환경: React Native
실행환경: Toss AppSandbox App
IOScrollView, ImpressionArea
IOScrollView와 ImpressionArea를 사용해서 스크롤 뷰 내에서 요소가 화면에 보이는지 확인할 수 있어요. 특정 요소가 화면에 일정 비율 이상 나타나면 onImpressionStart 콜백이 호출돼요.

ImpressionArea의 areaThreshold 값을 설정하면, 설정한 비율 이상으로 요소가 보이면 onImpressionStart 콜백이 호출돼요.

IOScrollView 내부에서만 사용할 수 있어요

ImpressionArea는 반드시 IOScrollView 내부에 있어야 해요.

그렇지 않으면, IOContext.Provider 밖에서 사용되었습니다.라는 에러가 발생해요.


스크롤 뷰에서 요소가 20% 이상 나타날 때 처리하기
다음 코드는 높이 100px을 가진 요소가 IOScrollView에서 20%이상 나타났을 때onImpressionStart가 호출되는 예제에요.

빨간색 선은 100px의 20% 지점을 시각적으로 표시한 예시예요.


import { createRoute, ImpressionArea, IOScrollView } from '@granite-js/react-native';
import { ReactNode } from 'react';
import { Alert, Text, View } from 'react-native';

export const Route = createRoute('/image', {
  component: Image,
});

/* 스크롤을 위한 Dummy 콘텐츠 */
const dummies = new Array(10).fill(undefined);

/** 20% 지점 */
const AREA_THRESHOLD = 0.2; 

function Image() {
  return (
    <IOScrollView> // [!code focus]
      {dummies.map((_, index) => {
        return <DummyContent key={index} text={10 - index} />;
      })}
      <ImpressionArea
        areaThreshold={AREA_THRESHOLD} 
        onImpressionStart={() => { 
          Alert.alert('Impression Start'); 
        }} 
      > // [!code focus]
        <View
          style={{
            width: '100%',
            height: 100,
            backgroundColor: 'blue',
          }}
        >
          <DebugLine areaThreshold={AREA_THRESHOLD} />
        </View>
      </ImpressionArea> // [!code focus]
    </IOScrollView> 
  );
}

/** 비율을 시각적으로 표시하는 디버그 컴포넌트 */
function DebugLine({ areaThreshold }: { areaThreshold: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: `${areaThreshold * 100}%`,
        width: '100%',
        height: 1,
        backgroundColor: 'red',
      }}
    />
  );
}

/** Dummy 영역 */
function DummyContent({ text }: { text: ReactNode }) {
  return (
    <View
      style={{
        width: '100%',
        height: 100,
        borderWidth: 1,
      }}
    >
      <Text>{text}</Text>
    </View>
  );
}
레퍼런스
IOScrollView 컴포넌트
ImpressionArea 컴포넌트
Pager
Previous page화면 방향 설정하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
setDeviceOrientation
setDeviceOrientation 함수는 기기의 화면 방향을 설정하는 기능을 제공해요. 이 기능은 특정 화면에서 가로 모드나 세로 모드를 강제로 지정해야 할 때 유용해요.

type 옵션을 통해 원하는 화면 방향을 지정할 수 있어요. 특히, 이 함수는 앱 전체에 영향을 미치므로 특정 화면에서만 사용하려면 화면을 벗어날 때 이전 상태로 복구하는 추가 작업이 필요해요.

예를 들어, 동영상 감상 화면에서는 가로 모드를 강제하고, 화면을 떠날 때 설정을 복구해서 다른 화면들의 방향 설정에 영향을 주지 않도록 할 수 있어요.

시그니처

function setDeviceOrientation(options: {
  type: 'portrait' | 'landscape';
}): Promise<void>;
파라미터
options필수 · object
화면 방향 설정 값이에요.

options.type필수 · string
화면 방향을 지정하는 옵션이에요.

'portrait' | 'landscape' 중 하나를 선택할 수 있어요.

반환 값
Promise<void>
화면 방향 설정이 완료되면 해결되는 Promise를 반환해요.

예제
화면 방향 설정하기

React

React Native

import { setDeviceOrientation } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';

function SetDeviceOrientationButton() {
  function handleClick() {
    setDeviceOrientation({ type: 'landscape' });
  }

  return <Button onClick={handleClick}>가로 모드로 변경</Button>;
}
화면 방향 복구하기
특정 화면을 벗어날 때 이전 상태로 복구하려면 다음과 같이 useEffect를 사용하세요.


React

React Native

import { setDeviceOrientation } from '@apps-in-toss/web-framework';
import { Text } from '@toss-design-system/mobile';
import { useEffect } from 'react';

function VideoScreen() {
  useEffect(() => {
    setDeviceOrientation({ type: 'landscape' });

    return () => {
      setDeviceOrientation({ type: 'portrait' }); // 설정을 이전 상태로 복구해요.
    };
  }, []);

  return <Text>동영상을 감상하는 화면</Text>;
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-game 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page화면 방향 설정하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
setDeviceOrientation
setDeviceOrientation 함수는 기기의 화면 방향을 설정하는 기능을 제공해요. 이 기능은 특정 화면에서 가로 모드나 세로 모드를 강제로 지정해야 할 때 유용해요.

type 옵션을 통해 원하는 화면 방향을 지정할 수 있어요. 특히, 이 함수는 앱 전체에 영향을 미치므로 특정 화면에서만 사용하려면 화면을 벗어날 때 이전 상태로 복구하는 추가 작업이 필요해요.

예를 들어, 동영상 감상 화면에서는 가로 모드를 강제하고, 화면을 떠날 때 설정을 복구해서 다른 화면들의 방향 설정에 영향을 주지 않도록 할 수 있어요.

시그니처

function setDeviceOrientation(options: {
  type: 'portrait' | 'landscape';
}): Promise<void>;
파라미터
options필수 · object
화면 방향 설정 값이에요.

options.type필수 · string
화면 방향을 지정하는 옵션이에요.

'portrait' | 'landscape' 중 하나를 선택할 수 있어요.

반환 값
Promise<void>
화면 방향 설정이 완료되면 해결되는 Promise를 반환해요.

예제
화면 방향 설정하기

React

React Native

import { setDeviceOrientation } from '@apps-in-toss/web-framework';
import { Button } from '@toss-design-system/mobile';

function SetDeviceOrientationButton() {
  function handleClick() {
    setDeviceOrientation({ type: 'landscape' });
  }

  return <Button onClick={handleClick}>가로 모드로 변경</Button>;
}
화면 방향 복구하기
특정 화면을 벗어날 때 이전 상태로 복구하려면 다음과 같이 useEffect를 사용하세요.


React

React Native

import { setDeviceOrientation } from '@apps-in-toss/web-framework';
import { Text } from '@toss-design-system/mobile';
import { useEffect } from 'react';

function VideoScreen() {
  useEffect(() => {
    setDeviceOrientation({ type: 'landscape' });

    return () => {
      setDeviceOrientation({ type: 'portrait' }); // 설정을 이전 상태로 복구해요.
    };
  }, []);

  return <Text>동영상을 감상하는 화면</Text>;
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-game 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
스크롤 뷰에서 요소 감지하기요소 노출 감지하기
지원환경: React Native
실행환경: Toss AppSandbox App
InView
InView 컴포넌트는 화면에 요소가 보이기 시작하거나 화면에서 사라지는 것을 감지하는 컴포넌트예요. 요소가 화면에 조금이라도 보이기 시작하면 onChanged 핸들러가 호출되고 첫 번째 인자로 true 값이 전달돼요. 반대로 요소가 화면에서 사라지면 false 값이 전달돼요. onChanged 핸들러의 두 번째 인자로 요소의 화면 노출 비율이 전달돼요. 노출 비율 값은 0에서 1.0 사이예요. 예를 들어 0.2가 전달되면 컴포넌트가 20%만큼 화면에 노출된 상태라는 의미예요.

유의하세요

InView는 반드시 IOContext가 포함된 IOScrollView 또는 IOFlatList 내부에서 사용해야 해요. 만약 IOContext 외부에서 사용하면 IOProviderMissingError가 발생해요.

시그니처

class InView<T = ViewProps> extends PureComponent<InViewProps<T>> {
  static contextType: import("react").Context<IOContextValue>;
  static defaultProps: Partial<InViewProps>;
  context: undefined | IOContextValue;
  mounted: boolean;
  protected element: Element;
  protected instance: undefined | ObserverInstance;
  protected view: any;
  constructor(props: InViewProps<T>);
  componentDidMount(): void;
  componentWillUnmount(): void;
  protected handleChange: (inView: boolean, areaThreshold: number) => void;
  protected handleRef: (ref: any) => void;
  protected handleLayout: (event: LayoutChangeEvent) => void;
  measure: (...args: any) => void;
  measureInWindow: (...args: any) => void;
  measureLayout: (...args: any) => void;
  setNativeProps: (...args: any) => void;
  focus: (...args: any) => void;
  blur: (...args: any) => void;
  render(): import("react/jsx-runtime").JSX.Element | null;
}
파라미터
props필수 · Object
컴포넌트에 전달되는 props 객체예요.

props.children필수 · React.ReactNode
컴포넌트 하위에 렌더링될 자식 컴포넌트들이에요.

prop.asReact.ComponentType · View
실제 렌더링할 컴포넌트를 지정해요. 기본값은 View 컴포넌트예요.

triggerOnceboolean · false
요소가 화면에 처음 보일 때 한 번만 onChange 콜백을 호출하려면 이 옵션을 사용해요.

onLayout(event: LayoutChangeEvent) => void
레이아웃에 변경이 생겼을 때 호출되는 콜백 함수예요.

onChange(inView: boolean, areaThreshold: number) => void
요소가 화면에 나타나거나 사라질 때 호출되는 콜백 함수예요. 첫 번째 인자로 노출 여부가, 두 번째 인자로 노출 비율이 전달돼요.

예제
InView컴포넌트로 요소의 10% 지점을 감지하기

import { LayoutChangeEvent, View, Text, Dimensions } from "react-native";
import { InView, IOScrollView } from '@granite-js/react-native';

function InViewExample() {
  const handleLayout = (event: LayoutChangeEvent) => {
    console.log("레이아웃 변경됨", event.nativeEvent.layout);
  };

  const handleChange = (inView: boolean, areaThreshold: number) => {
    if (inView) {
      console.log(`${areaThreshold * 100}% 비율만큼 화면에 보이는 상태`);
    } else {
      console.log("화면에 보이지 않는 상태");
    }
  };

  return (
    <IOScrollView>
      <View style={{ height: HEIGHT, width: "100%", backgroundColor: "blue" }}>
        <Text style={{ color: "white" }}>스크롤을 내려주세요</Text>
      </View>
      <InView onLayout={handleLayout} onChange={handleChange}>
        <View style={{ width: 100, height: 300, backgroundColor: "yellow" }}>
          <View
            style={{
              position: "absolute",
              top: 30,
              width: 100,
              height: 1,
              borderWidth: 1,
            }}
          >
            <Text style={{ position: "absolute", top: 0 }}>10% 지점</Text>
          </View>
        </View>
      </InView>
    </IOScrollView>
  );
}
Pager
Previous page
컴포넌트 노출 감지하기
지원환경: React Native
실행환경: Toss AppSandbox App
ImpressionArea
ImpressionArea 는 특정 컴포넌트가 화면에 보이는지 여부를 감지해서 외부에 알려주는 컴포넌트예요. 이 컴포넌트를 사용해서 화면에 특정 컴포넌트가 보이면 로그를 수집하거나 애니메이션을 실행하는 구현을 쉽게 할 수 있어요. 화면에 보이는지 여부는 useVisibility의 반환값과 뷰포트(Viewport) 내에 표시되었는 지 알려주는 IOScrollView와 InView 컴포넌트로 감지해요. React에서 ScrollView를 사용하면 뷰가 화면에 보이지 않더라도, ImpressionArea를 사용하면 해당 뷰가 실제로 화면에 보일때만 이벤트를 발생시킬 수 있어요.

유의하세요

ImpressionArea는 반드시 IOScrollView 안에서 사용해야 해요. 만약 IOScrollView 외부에서 사용해야 한다면, UNSAFE__impressFallbackOnMount 속성을 true로 설정해서 컴포넌트가 마운트될 때를 기준으로 감지할 수 있어요. 이 속성이 false로 설정된 상태에서 IOScrollView 외부에서 사용하면 IOProviderMissingError가 발생해요.

시그니처

function ImpressionArea(props: Props): ReactElement;
파라미터
onImpressionStart() => void
자식 컴포넌트가 화면에 보일 때 실행되는 콜백함수예요.

onImpressionEnd() => void
자식 컴포넌트가 화면에 가려졌을 때 실행되는 콜백함수예요.

enabledboolean · true
화면에 보여졌다는 조건을 직접 제어하는 값이에요. 기본값은 true 에요. false 로 전달하면 화면에 보여져도 onImpressionStart 콜백 함수가 실행되지 않아요.

areaThresholdnumber · 0
보여지는 영역의 비율을 설정하는 값이에요. 이 값보다 큰 비율로 컴포넌트가 화면에 나타나면 onImpressionStart를 호출해요.

timeThresholdnumber · 0
이 컴포넌트가 화면에 보인 후 onImpressionStart 호출될 때까지의 시간을 밀리초 단위로 설정해요.기본값은 0밀리초(0초)에요.

styleViewStyle
InView 컴포넌트에 적용할 style 값이에요. 기본값은 undefined이고, style을 지정하고 싶을 때 사용해요.

UNSAFE__impressFallbackOnMountboolean · false
컴포넌트가 마운트될 때 즉시 화면에 나타난 것으로 간주할지 여부예요. 기본값은 false예요.

값은 0부터 1 사이의 숫자로 설정하며, 0으로 설정하면 컴포넌트의 1px이라도 보일 때 이벤트가 발생해요. 반대로, 1로 설정하면 컴포넌트가 100% 화면에 노출될 때만 이벤트가 호출돼요.IOScrollView를 사용하지 않는 상황에서, 컴포넌트가 뷰포트(Viewport) 안에 있는지 판단할 수 없을 떼 유용해요. 예를 들어, IOScrollView 밖에 위치한 컴포넌트는 true로 설정하면 마운트 시점에 보여졌다고 판단해요.

반환 값
ReactElement
화면에 보이는 여부를 감지할 수 있는 컴포넌트가 반환돼요.

예제
기본 사용 예시

import { useState } from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import { ImpressionArea, IOScrollView } from '@granite-js/react-native';

function ImpressionAreaExample() {
 const [isImpressionStart, setIsImpressionStart] = useState(false);

 return (
   <>
     <Text>{isImpressionStart ? 'Impression Start' : 'Impression End'}</Text>
       <IOScrollView
         style={{
           flex: 1,
           margin: 16,
           backgroundColor: 'white',
         }}
       >
       <View
         style={{
           height: Dimensions.get('screen').height,
           borderWidth: 1,
           borderColor: 'black',
         }}
       >
         <Text>Scroll to here</Text>
       </View>

       <ImpressionArea
         onImpressionStart={() => setIsImpressionStart(true)}
         onImpressionEnd={() => setIsImpressionStart(false)}
       >
         <Button title="Button" />
       </ImpressionArea>
     </IOScrollView>
   </>
 );
}
마운트 시점에 감지하는 예시
ImpressionArea가 IOScrollView와 같은 컴포넌트 내부에 위치하지 않을 때, UNSAFE__impressFallbackOnMount를 true로 설정하면 컴포넌트가 마운트될 때 화면에 보여진 것으로 간주해요.


import { useState } from 'react';
import { Button, Dimensions, ScrollView, Text, View } from 'react-native';
import { ImpressionArea } from 'react-native-bedrock';

function ImpressionArea2Example() {
 const [isImpressionStart, setIsImpressionStart] = useState(false);

 return (
   <>
     <Text>{isImpressionStart ? 'Impression Start' : 'Impression End'}</Text>
     <ScrollView
       style={{
         flex: 1,
         margin: 16,
         backgroundColor: 'white',
       }}
     >
       <View
         style={{
           height: Dimensions.get('screen').height,
           borderWidth: 1,
           borderColor: 'black',
         }}
       >
         <Text>Scroll to here</Text>
       </View>

       <ImpressionArea
         UNSAFE__impressFallbackOnMount={true}
         onImpressionStart={() => setIsImpressionStart(true)}
         onImpressionEnd={() => setIsImpressionStart(false)}
       >
         <Button title="Button" />
       </ImpressionArea>
     </ScrollView>
   </>
 );
}
Pager
Previous page
스크롤 영역 노출 감지하기
지원환경: React Native
실행환경: Toss AppSandbox App
IOScrollView
IOScrollView는 Intersection Observer 기능이 추가된 ScrollView 컴포넌트예요. 스크롤 중 특정 요소가 화면에 보이거나 사라지는 상태를 감지할 수 있어요. 이 기능을 활용해 InView 컴포넌트를 자식 요소로 사용하면, 화면에 노출되는지 여부를 쉽게 확인할 수 있어요.

시그니처

IOScrollView: ForwardRefExoticComponent<IOScrollViewProps & RefAttributes<IOScrollViewController>>
예제
IOScrollView를 사용해 리스트의 각 항목이 화면에 나타나는지 여부를 확인할 수 있어요. 리스트의 각 항목이 화면에 나타나면 InView 컴포넌트가 visible 상태로 변경되어요.


import { ReactNode, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InView, IOScrollView } from '@granite-js/react-native';

const mockData = Array.from({ length: 30 }, (_, i) => ({ key: String(i) }));

function IOScrollViewPage() {
 return (
   <IOScrollView>
     {mockData.map((data) => (
       <InViewItem key={data.key}>{data.key}</InViewItem>
     ))}
   </IOScrollView>
 );
}

function InViewItem({ children }: { children: ReactNode }) {
 const [visible, setVisible] = useState(false);

 return (
   <InView onChange={setVisible}>
     <View style={styles.item}>
       <Text>{children}</Text>
       <Text>{visible ? 'visible' : ''}</Text>
     </View>
   </InView>
 );
}

const styles = StyleSheet.create({
 item: {
   padding: 16,
   borderBottomWidth: 1,
   borderBottomColor: '#ddd',
 },
});
Pager
Previous page
리스트 항목 노출 감지하기
지원환경: React Native
실행환경: Toss AppSandbox App
IOFlatList
IOFlatList는 스크롤 중 특정 요소가 화면에 보이거나 사라지는지를 감지하기 위해 Intersection Observer 기능을 추가한 FlatList 컴포넌트예요. 이 컴포넌트를 사용하면 리스트의 각 항목이 화면에 나타나는지 여부를 쉽게 확인하고 처리할 수 있어요.

InView와 함께 사용하면 각 요소의 노출 상태를 확인할 수 있어요. 자식 요소로 포함된 InView 컴포넌트는 IOFlatList의 관찰 기능을 통해 요소가 화면에 보이는지 여부를 감지하고, 노출 상태에 따라 이벤트를 발생시켜요.

시그니처

IOFlatList: typeof IOFlatListFunction;
예제
IOFlatList를 사용해 리스트의 각 항목이 화면에 나타나는지 여부를 확인할 수 있어요. 리스트의 각 항목이 화면에 나타나면 InView 컴포넌트가 visible 상태로 변경되어요.


import { ReactNode, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { InView, IOFlatList } from '@granite-js/react-native';

const mockData = Array.from({ length: 30 }, (_, i) => ({ key: String(i) }));

function FlatListPage() {
  return (
    <IOFlatList
      data={mockData}
      renderItem={({ item }) => <InViewItem>{item.key}</InViewItem>}
    />
  );
}

function InViewItem({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  return (
    <InView onChange={setVisible}>
      <View style={styles.item}>
        <Text>{children}</Text>
        <Text>{visible ? "visible" : ""}</Text>
      </View>
    </InView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
Pager
Previous page
화면 보임 여부 확인하기
지원환경: React Native
실행환경: Toss AppSandbox App
useVisibility
useVisibility 훅을 사용하면 화면이 현재 사용자에게 보이는지 여부를 알 수 있어요. 사용자가 화면을 보고 있을 때만 특정 작업을 실행하거나, 로그를 남길 수 있어요.

앱의 화면이 현재 사용자에게 보인다면 true를 반환하고, 보이지 않는다면 false를 반환해요. 단, 시스템 공유하기 모달(share)을 열고 닫을 때는 화면이 보이는 상태가 바뀌지 않아요.

사용 예시는 다음과 같아요.

다른 앱으로 전환하거나 홈 버튼을 누르면 false 를 반환해요.
다시 토스 앱으로 돌아오거나 화면이 보이면 true 를 반환해요.
토스 앱 내 다른 서비스로 이동하면 false 를 반환해요.
시그니처

function useVisibility(): boolean;
반환 값
boolean
현재 화면이 사용자에게 보이는지 여부에요.

예제
화면이 보이는 상태를 확인하는 예제
아래 코드는 화면이 사용자에게 보였을 때 visibility 값을 console.log로 확인하는 예시예요.

홈 화면으로 이동하면 false가 기록되고, 다시 돌아오면 true가 기록돼요.
외부 링크(https://toss.im)로 이동하면 false가 기록되고, 다시 돌아오면 true가 기록돼요.

import { useVisibility } from '@granite-js/react-native';
import { useEffect } from 'react';
import { Button, Linking } from 'react-native';

export default function VisibilityPage() {
  const visibility = useVisibility();

  useEffect(() => {
    console.log({
      visibility,
    });
  }, [visibility]);

  return (
    <Button
      onPress={() => {
        Linking.openURL('https://toss.im');
      }}
      title="https://toss.im 이동"
    />
  );
}

/**
 * 출력 예시:
 * { "visibility": false }
 * { "visibility": true }
 * { "visibility": false }
 * { "visibility": true }
 */
Pager
Previous page
가시성 변경 감지하기
지원환경: React Native
실행환경: Toss AppSandbox App
useVisibilityChange
useVisibilityChange 훅을 사용하면 페이지나 컴포넌트가 사용자에게 보이는지 여부가 변경될 때 이를 감지할 수 있어요. 화면이 보이는 상태가 바뀌면 전달된 콜백 함수가 호출돼요. 예를 들어, 사용자가 다른 탭으로 이동하거나, 창을 최소화할 때 콜백이 호출돼요.

반환값이 true이면 visible, false이면 hidden 문자열이 전달돼요.

참고하세요

WebView에서 앱이 백그라운드로 전환되었을 때 콜백 함수를 등록하는 방법은 visibilitychange를 활용할 수 있어요.
자세한 내용은 MDN Web Docs를 참고해 주세요.

시그니처

function useVisibilityChange(callback: VisibilityCallback): void;
파라미터
callback필수 · VisibilityCallback
화면이 보이는지 여부가 바뀔 때 그 변경을 전달하는 콜백 함수를 호출해요.

예제
화면의 보이는 상태가 변경될 때 로그를 남기는 예제
아래 코드는 화면의 보이는 상태가 변경될 때 visibilityState 값을 console.log로 기록하는 예시예요.

홈 화면으로 이동하면 hidden, 다시 돌아오면 visible을 기록해요.
외부 링크(https://toss.im)로 이동하면 hidden을 기록하고, 다시 돌아오면 visible을 기록해요.

import { useVisibilityChange } from '@granite-js/react-native';
import { Button, Linking } from 'react-native';

export default function ImagePage() {
  useVisibilityChange((visibilityState) => {
    console.log({ visibilityState });
  });

  return (
    <Button
      onPress={() => {
        Linking.openURL('https://toss.im');
      }}
      title="https://toss.im 이동"
    />
  );
}

/**
 * 출력 예시:
 * { "visibilityState": "hidden" }
 * { "visibilityState": "visible" }
 * { "visibilityState": "hidden" }
 * { "visibilityState": "visible" }
 */
Pager
Previous page
화면 닫기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
closeView
closeView 는 현재 화면을 닫는 함수에요. 예를 들어, "닫기" 버튼을 눌러서 서비스를 종료할 때 사용할 수 있어요.

시그니처

function closeView(): Promise<void>;
반환 값
Promise<void>
예제
닫기 버튼을 눌러 화면 닫기

import { Button } from 'react-native';
import { closeView } from '@granite-js/react-native';

function CloseButton() {
 return <Button title="닫기" onPress={closeView} />;
}
Pager
Previous page뒤로가기 이벤트 제어하기
지원환경: React Native
실행환경: Toss AppSandbox App
useBackEvent
useBackEvent 는 뒤로 가기 이벤트를 등록하고 제거할 수 있는 컨트롤러 객체를 반환하는 Hook이에요. 이 Hook을 사용하면 특정 컴포넌트가 활성화되었을 때만 뒤로 가기 이벤트를 처리할 수 있어요. addEventListener 를 쓰면 뒤로 가기 이벤트를 등록할 수 있고, removeEventListener 를 쓰면 뒤로 가기 이벤트를 제거할 수 있어요. 사용자가 화면을 보고 있을 때만 등록된 뒤로 가기 이벤트가 등록돼요. 화면을 보고 있다는 조건은 useVisibility 을 사용해요.

이 Hook을 사용해 특정 컴포넌트에서 뒤로 가기 이벤트를 처리하는 로직을 정의할 수 있어요.

시그니처

function useBackEvent(): BackEventControls;
반환 값
BackEventControls
뒤로 가기 이벤트를 제어할 수 있는 객체예요. 이 객체에는 이벤트를 등록하는 addEventListener 메서드와와 제거하는 removeEventListener 메서드가 포함 되어 있어요.

에러
Error
이 훅이 BackEventProvider 내에서 사용되지 않은 경우 에러를 발생시켜요.

예제
뒤로 가기 이벤트 등록 및 제거 예제
"Add BackEvent" 버튼을 누르면 뒤로 가기 이벤트가 등록돼요. 이후 뒤로 가기 버튼을 누르면 "back"이라는 알림이 뜨고, 실제로 뒤로 가지 않아요.
"Remove BackEvent" 버튼을 누르면 등록된 이벤트가 제거돼요. 이후 뒤로 가기 버튼을 누르면 기존 동작대로 정상적으로 뒤로 가요.

import { useEffect, useState } from "react";
import { Alert, Button, View } from "react-native";
import { useBackEvent } from '@granite-js/react-native';

function UseBackEventExample() {
  const backEvent = useBackEvent();

  const [handler, setHandler] = useState<{ callback: () => void } | undefined>(
    undefined
  );

  useEffect(() => {
    const callback = handler?.callback;

    if (callback != null) {
      backEvent.addEventListener(callback);

      return () => {
        backEvent.removeEventListener(callback);
      };
    }

    return;
  }, [backEvent, handler]);

  return (
    <View>
      <Button
        title="Add BackEvent"
        onPress={() => {
          setHandler({ callback: () => Alert.alert("back") });
        }}
      />
      <Button
        title="Remove BackEvent"
        onPress={() => {
          setHandler(undefined);
        }}
      />
    </View>
  );
}
Pager
Previous page화면 항상 켜짐 설정하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
setScreenAwakeMode
setScreenAwakeMode 함수는 화면이 항상 켜져 있도록 설정하거나 해제하는 기능을 제공해요. 이 기능은 웹툰, 동영상, 문서 읽기 등 화면을 지속해서 켜두어야 하는 상황에서 유용해요.

enabled 옵션을 true로 설정하면 화면이 꺼지지 않게 유지하고, false로 설정하면 기본 화면 보호기 시간에 따라 화면이 꺼져요. 특히, 이 함수는 앱 전체에 영향을 미치므로 특정 화면에서만 사용하려면 화면을 벗어날 때 이전 상태로 복구하는 추가 작업이 필요해요.

예를 들어, 미디어 콘텐츠 감상 화면에서는 항상 켜짐 모드를 활성화하고, 화면을 떠날 때 설정을 복구해서 불필요한 배터리 소모를 방지할 수 있어요.

다만, 앱에서 벗어나는 상황에서는 항상 켜짐 모드가 비활성화될 수 있으니 주의해야 해요.

시그니처

function setScreenAwakeMode(options: {
    enabled: boolean;
}): Promise<{
    enabled: boolean;
}>;
파라미터
options필수 · object
화면 항상 켜짐 모드의 설정 값이에요.

options.enabled필수 · boolean
화면 항상 켜짐 모드를 켜거나 끄는 옵션이에요.

true로 설정하면 화면이 항상 켜지고, false로 설정하면 화면 보호기 시간에 따라 꺼져요.

반환 값
object
현재 화면 항상 켜짐 모드의 설정 상태를 반환해요.

boolean
enabled 화면 항상 켜짐 모드가 켜져 있는지 여부를 나타내는 값이에요.

예제
화면 항상 켜짐 모드 설정하기

import { Button } from 'react-native';
import { setScreenAwakeMode } from 'react-native-bedrock';

function SetScreenAwakeMode() {
  return (
    <Button
      title="화면 항상 켜기"
      onPress={() => {
        setScreenAwakeMode({ enabled: true });
      }}
    />
  );
}
화면 항상 켜짐 모드 복구하기
특정 화면을 벗어날 때 이전 상태로 복구하려면 다음과 같이 useEffect를 사용하세요.


import { useEffect } from 'react';
import { setScreenAwakeMode, cleanUp } from 'react-native-bedrock';

function MediaScreen() {
  useEffect(() => {
    setScreenAwakeMode({ enabled: true });

    return () => {
      setScreenAwakeMode({ enabled: false }); // 설정을 이전 상태로 복구해요.
    };
  }, []);

  return <Text>미디어 콘텐츠를 감상하는 화면</Text>;
}
Pager
Previous page화면 캡처 차단하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
setSecureScreen
setSecureScreen 함수는 네이티브 수준에서 화면 캡처를 차단하거나 허용할 수 있어요. 사용자가 화면을 캡처하려고 시도할 때 이를 방지해 보안을 강화할 수 있죠. 이 설정은 화면별로 동작하도록 구현할 수 있어 유연하게 사용할 수 있어요.

민감한 정보를 다루는 애플리케이션에서는 화면 캡처를 차단하거나 필요에 따라 허용하는 기능이 중요해요. 이 기능은 특히 금융 앱, 의료 데이터 앱 등 민감한 정보를 보호해야 할 때 유용해요.

예를 들어 계좌 잔고, 거래 내역 같이 민감한 데이터를 표시할 때 활용할 수 있어요.

시그니처

function setSecureScreen(options: {
    enabled: boolean;
}): Promise<{
    enabled: boolean;
}>;
파라미터
options필수 · object
화면 캡쳐 설정 옵션이에요.

options.enabled필수 · boolean
화면 캡쳐를 차단할지 여부를 설정해요. true면 캡쳐를 차단하고, false면 허용해요.

반환 값
enabled: boolean
현재 설정된 캡쳐 차단 상태를 반환해요.

구현 가이드
캡처 차단과 해제 설정하기
아래 코드는 화면이 표시될 때 캡처를 차단하고, 화면을 벗어날 때 차단을 해제해요.


import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createRoute } from '@granite-js/react-native';
import { setSecureScreen } from '@apps-in-toss/framework';

export const Route = createRoute("/secure-screen", {
  component: SecureScreen,
});

function SecureScreen() {
  useEffect(() => {
    // 화면에 진입할 때 캡처 차단 활성화
    setSecureScreen({ enabled: true }); 
    console.log("화면 캡처 차단 활성화");

    return () => {
      // 화면을 벗어날 때 캡처 차단 해제
      setSecureScreen({ enabled: false }); 
      console.log("화면 캡처 차단 해제");
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>이 화면은 캡처가 차단되어 있습니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
Pager
Previous page쿼리 파라미터 사용하기
지원환경: React Native
실행환경: Toss AppSandbox App
useParams
useParams는 지정된 라우트에서 파라미터를 가져오는 훅이에요.

애플리케이션이 URL 스킴으로 실행될 때, 스킴에 포함된 쿼리 스트링 값을 참조할 수 있어요. 스킴으로 애플리케이션을 실행할 때, 필요한 데이터를 전달하거나 특정 기능을 활성화할 수 있어요.

추가로 validateParams 옵션을 활용하면, 화면에서 필요한 쿼리 파라미터를 정의하고 유효성을 검사할 수 있어요.

시그니처

function useParams<TScreen extends keyof RegisterScreen>(options: {
    from: TScreen;
    strict?: true;
}): RegisterScreen[TScreen];
파라미터
options필수 · BedrockRouteHooksOptions<TScreen>
가져올 라우트의 정보를 담은 객체예요.

options.fromstring
파라미터를 가져올 라우트 경로예요. 이 값을 지정하지 않으면 현재 라우트에서 파라미터를 가져와요. 엄격 모드(strict)가 true인 경우 반드시 지정해야 해요.

options.strictboolean
엄격 모드 설정이에요. true로 설정하면 지정된 라우트와 현재 라우트가 일치하지 않으면 에러를 발생시켜요. false로 설정하면 validateParams 검증을 생략하고 현재 화면의 파라미터를 그대로 반환해요.

예제
라우트 파라미터 가져오기

React Native

import React from 'react';
import { Text } from 'react-native';
import { createRoute, useParams } from '@granite-js/react-native';

export const Route = createRoute('/examples/use-params', {
  validateParams: (params) => params as { id: string },
  component: UseParamsExample,
});

function UseParamsExample() {
  // 첫 번째 방법: 라우트 객체의 `useParams` 메서드 사용
  const params = Route.useParams();

  // 두 번째 방법: useParams 훅 직접 사용
  const params2 = useParams({ from: '/examples/use-params' });

  // 세 번째 방법: strict 모드를 false로 설정하여 사용
  // strict: false로 설정하면 현재 라우트의 파라미터를 가져오며,
  // validateParams가 정의되어 있어도 검증을 건너뛰어요.
  const params3 = useParams({ strict: false }) as { id: string };

  return (
    <>
      <Text>{params.id}</Text>
      <Text>{params2.id}</Text>
      <Text>{params3.id}</Text>
    </>
  );
}
쿼리 스트링 값 유효성 검증하기

필수로 포함해야 하는 쿼리 파라미터는 validateParams 옵션을 사용해서 유효성을 검사할 수 있어요.

예를 들어, 아래 예시 코드는 name 파라미터가 없으면 에러를 발생시켜요.

그래서 필수 쿼리 파라미터가 누락되지 않도록 validateParams 옵션을 사용해요.


vanilla

valibot

zod

import { createRoute } from '@granite-js/react-native';
import { View, Text } from "react-native";

export const Route = createRoute("/", {
  component: Index,
  validateParams: (params) => {
    if (!("name" in params)) {
      throw Error("name is required");
    }
    if (typeof params.name !== "string") {
      throw Error("name must be a string");
    }

    if (!("age" in params)) {
      throw Error("age is required");
    }
    if (typeof params.age !== "number") {
      throw Error("age must be a number");
    }

    return params as {
      name: string;
      age: number;
    };
  },
});

function Index() {
  const { name, age } = Route.useParams();

  return (
    <View>
      <Text>이름: {name}</Text>
      <Text>나이: {age}</Text>
    </View>
  );
}
쿼리 파라미터 값 변환하기
createRoute.parserParams 옵션을 사용하면 쿼리 스트링으로 전달된 string 값을 원하는 타입으로 변환할 수 있어요.
기본적으로 useParams는 숫자, 문자열, 배열, 객체 같은 대부분의 단순 타입은 자동으로 변환하기 때문에 파서를 직접 재정의해야 할 일은 많지 않아요.
하지만 복잡한 데이터 구조를 사용해야 할 때나 특정한 params를 지우고 싶을 때는 파서를 직접 정의해서 원하는 타입으로 변환할 수 있어요.

parserParams 옵션의 결과가 validateParams 옵션에 전달되기 전에 변환됩니다.

기본 파서를 사용한 타입 변환
기본 파서를 활용하면 쿼리 스트링 값이 자동으로 적절한 타입으로 변환돼요. 아래 예제는 쿼리 파라미터를 타입에 맞게 변환하는 방법을 보여줘요.


import { createRoute } from '@granite-js/react-native';
import { View, Text } from "react-native";

// URL 예시: intoss://test-app?name=tom&age=10&arr=1,2,3&obj={"name":"jane","age":20}
export const Route = createRoute("/", {
  component: Index,
  validateParams: (params) => ({
    // 기본 파서로 인해 쿼리 파라미터 값을 올바른 타입으로 자동으로 변환
    name: params.name as string, // 문자열로 변환
    age: params.age as number, // 숫자로 변환
    arr: params.arr as string[], // 배열로 변환
    obj: params.obj as { name: string; age: number }, // 객체로 변환
  }),
});

function Index() {
  const { name, age, arr, obj } = Route.useParams();

  return (
    <View>
      <Text>
        이름: {name}, 타입: {typeof name}
      </Text>
      <Text>
        나이: {age}, 타입: {typeof age}
      </Text>
      <Text>
        배열: {JSON.stringify(arr)}, 타입: {typeof arr}
      </Text>
      <Text>
        객체: {JSON.stringify(obj)}, 타입: {typeof obj}
      </Text>
    </View>
  );
}
파서 재정의
parserParams 옵션을 사용하면 기본 파서로 처리하기 어려운 query parameter를 변환하는 함수를 직접 정의해서 사용할 수 있어요. 예를 들어, 특정 파라미터(referer)를 제거하고 나머지 파라미터를 기본 파서로 처리하는 방법을 아래 코드에서 보여줘요.


import { createRoute } from '@granite-js/react-native';
import { View, Text } from "react-native";

// URL 예시: intoss://test-app?name=tom&age=10&referer=https://google.com
export const Route = createRoute("/", {
  component: Index,

  // 특정 파라미터를 제거하고 나머지를 기본 파서로 처리
  parserParams: (params) => {
    const { referer, ...rest } = params;
    return rest;
  },

  validateParams: (params) => {
    // 여기서 `params`는 parserParams 함수에서 변환된 값이에요.
    // 즉, `referer`는 이미 제거된 상태로 전달돼요.
    return {
      name: params.name,
      age: params.age,
    } as {
      name: string;
      age: number;
    };
  },
});

// 컴포넌트에서 파라미터 사용
function Index() {
  const { name, age } = Route.useParams();

  return (
    <View>
      <Text>
        이름: {name}, 타입: {typeof name}
      </Text>
      <Text>
        나이: {age}, 타입: {typeof age}
      </Text>
    </View>
  );
}
중복된 쿼리 파라미터 주의사항

만약 같은 이름의 쿼리 파라미터가 여러 번 사용되면, 해당 값은 배열로 반환돼요. 예를 들어, age 파라미터가 두 번 포함되면 다음과 같이 처리돼요.


// 스킴: `intoss://test-app?name=tom&age=10&age=20`
const params = useParams({
  from: "/",
});

// params
{ name: 'tom', age: [10, 20] }
이전 버전 문서가 필요할 때

이전 버전의 문서는 쿼리 파라미터 사용하기에서 확인할 수 있어요.

Pager
Previous page화면 복귀 후 코드 실행하기
지원환경: React Native
실행환경: Toss AppSandbox App
useWaitForReturnNavigator
useWaitForReturnNavigator 는 화면 전환을 하고 돌아왔을 때 다음 코드를 동기적으로 실행할 수 있도록 도와주는 Hook 이에요. 화면 이동은 @react-navigation/native useNavigation의 navigate를 사용해요.

예를 들어, 사용자가 다른 화면으로 이동했다가 돌아왔다는 로그를 남기고 싶을 때 사용해요.

시그니처

function useWaitForReturnNavigator<T extends Record<string, object | undefined>>(): <RouteName extends keyof T>(route: RouteName, params?: T[RouteName]) => Promise<void>;
예제
화면 이동 후 돌아왔을 때 코드가 실행되는 예제
"이동하기" 버튼을 누르면 다른 화면으로 이동하고, 돌아왔을 때 로그가 남겨져요.


import { Button } from 'react-native';
import { useWaitForReturnNavigator } from '@apps-in-toss/framework';

function UseWaitForReturnNavigator() {
  const navigate = useWaitForReturnNavigator();

  return (
    <Button
      title="이동하기"
      onPress={async () => {
        console.log(1);
        await navigate('/examples/use-visibility');
        // 화면에 돌아오면 이 코드가 실행됩니다.
        console.log(2);
      }}
    />
  );
}
Pager
Previous page뒤로가기 버튼 이벤트 제어하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
graniteEvent
graniteEvent를 사용하면 네이티브 앱에서 웹 앱으로 전달되는 이벤트를 감지할 수 있어요. 이 중 backEvent는 뒤로가기 버튼을 눌렀을 때 웹 앱으로 전달되는 이벤트예요. React Native는 useBackEvent 를 쓸 수 있어요.

해결하는 문제
사용자가 중요한 작업 도중 실수로 뒤로가기 버튼을 눌러 화면이 닫히는 상황을 방지할 수 있어요.
예를 들어, 결제 중이거나 폼을 작성 중일 때 뒤로가기를 막고 싶을 때 사용해요.
backEvent를 감지해서 사용자에게 확인창을 보여주고, 확인한 경우에만 이동을 허용할 수 있어요.
동작 방식
graniteEvent.addEventListener('backEvent', options)로 이벤트를 구독할 수 있어요.

onEvent: 사용자가 뒤로가기 버튼을 눌렀을 때 호출돼요. 아무 작업도 하지 않으면 기본 동작이 차단돼요.
onError: 이벤트 처리 중 에러가 발생하면 호출돼요. 사용자에게 알림을 보여주거나, 오류 로그를 남길 수 있어요.
이벤트 리스너는 함수에서 반환된 unsubscription() 함수를 호출하면 해제할 수 있어요.

사용 예시
사용자가 뒤로가기 버튼을 눌렀을 때 확인창을 띄우고, '확인'을 누르면 이동을 허용해요. '취소'를 누르면 현재 화면에 머물러요.


React

React Native

import { graniteEvent } from '@apps-in-toss/web-framework';
import { useEffect, useState } from 'react';

/**
 * 작성 중인 내용을 보호하기 위해 뒤로가기를 차단하고,
 * 사용자의 확인을 받은 경우에만 허용하는 컴포넌트예요.
 * 
 * @example
 * import { ConfirmBackNavigation } from './ConfirmBackNavigation';
 * 
 * const App = () => <ConfirmBackNavigation />;
 */
function ConfirmBackNavigation() {
  const [formValue, setFormValue] = useState('');

  useEffect(() => {
    // 뒤로가기 버튼 눌렀을 때 사용자 확인을 받아요
    const unsubscription = graniteEvent.addEventListener('backEvent', {
      onEvent: () => {
        const shouldLeave = window.confirm('작성 중인 내용이 저장되지 않아요. 나가시겠어요?');
        if (shouldLeave) {
          // 나가는 코드를 작성해요.
        }
      },
      onError: (error) => {
        alert(`에러가 발생했어요: ${error}`);
      },
    });

    return unsubscription;
  }, []);

  return (
    <div>
      <h2>입력 폼</h2>
      <textarea
        value={formValue}
        onChange={(e) => setFormValue(e.target.value)}
        placeholder="여기에 내용을 입력해 주세요"
        rows={5}
        style={{ width: '100%' }}
      />
    </div>
  );
}
Pager
Previous page
화면 복귀 후 코드 실행하기
Next page
앱 진입 완료 이벤트 감지하기앱 진입 완료 이벤트 감지하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
appsInTossEvent
appsInTossEvent를 사용하면 토스 앱에서 전달되는 다양한 상태 이벤트를 처리할 수 있어요.

그중 entryMessageExited 이벤트는 앱 진입 직후 표시되는 "ㅇㅇ으로 이동했어요"와 같은 안내 메시지가 화면에서 사라지는 시점을 알려줘요.

해결하는 문제
앱 진입 시 표시된 안내 메시지가 사라진 정확한 순간을 감지할 수 있어요.
메시지가 사라진 직후, 초기화 작업이나 데이터 로딩을 정확한 타이밍에 실행할 수 있어요.
사용자가 앱을 정상적으로 이용할 준비가 완료됐음을 명확히 할 수 있어요.
동작 방식
appsInTossEvent.addEventListener('entryMessageExited', options)를 사용해서 이벤트를 구독할 수 있어요.

onEvent: 안내 메시지가 화면에서 사라지는 즉시 호출돼요. 이 시점에 초기화 작업을 실행할 수 있어요.
구독한 리스너는 반환된 unsubscription 함수를 호출해서 해제할 수 있어요.

사용 예시
안내 메시지가 사라진 직후 게임을 시작하는 예시예요.


React

React Native

import { appsInTossEvent } from '@apps-in-toss/web-framework';
import { useEffect } from 'react';

/**
 * 안내 메시지가 사라진 시점에 게임을 시작하는 컴포넌트예요.
 *
 * @example
 * import { GameStarter } from './GameStarter';
 *
 * const App = () => <GameStarter />;
 */
function GameStarter() {
  useEffect(() => {
    const unsubscription = appsInTossEvent.addEventListener('entryMessageExited', {
      onEvent: () => {
        // 진입 메시지가 사라진 직후 게임 시작
        startGame();
      },
      onError: (error) => {
        console.error('게임 시작 이벤트 처리 중 오류:', error);
      },
    });

    return () => {
      unsubscription();
    };
  }, []);

  /**
   * 게임을 시작하는 함수예요.
   * 타이머 시작, 캐릭터 등장 등 초기 게임 로직을 이곳에 작성해요.
   */
  const startGame = () => {
    console.log('게임을 시작합니다!');
    // 게임 시작 로직 추가
  };

  return (
    <div>
      <h2>게임을 준비 중...</h2>
    </div>
  );
}
Pager
Previous page
뒤로가기 버튼 이벤트 제어하기
Next page
ScrollViewInertialBackground
지원환경: React Native
실행환경: Toss AppSandbox App
iOS ScrollView 콘텐츠의 위, 아래 공간에 배경색을 추가해서, 스크롤 했을 때 자연스러운 시각 효과를 제공해요. iOS에서는 스크롤이 끝에 도달했을 때 살짝 튕기는 듯한 Bounce 효과가 발생해요. 이때 콘텐츠 위, 아래 공간에 배경색을 설정하면 더 일관된 유저 경험을 제공할 수 있어요.

시그니처

function ScrollViewInertialBackground({ topColor, bottomColor, spacer: _spacer, }: ScrollViewInertialBackgroundProps): import("react/jsx-runtime").JSX.Element;
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.topColorstring
스크롤 위쪽 영역에 적용할 배경색이에요. 기본값은 시스템 테마에 맞춰 자동으로 적용되는 adaptive.background에요.

props.bottomColorstring
스크롤 아래쪽 영역에 적용할 배경색이에요. 기본값은 시스템 테마에 맞춰 자동으로 적용되는 adaptive.background에요.

props.spacernumber
배경색이 적용될 콘텐츠 위, 아래 공간 사이의 공간 크기를 지정해요. 기본값은 `useWindowDimensions`로 가져온 화면 높이를 사용해요.

예제
스크롤 뷰 위, 아래에 배경색을 추가하기
스크롤 뷰 위에 빨간색, 아래에 파란색 배경색을 추가해요. 스크롤을 벗어난 영역에 배경색이 적용돼요.


import { ScrollView, View, Text } from 'react-native';
import { ScrollViewInertialBackground } from 'react-native-bedrock';

const dummies = Array.from({ length: 20 }, (_, i) => i);

function InertialBackgroundExample() {
  return (
    <ScrollView>
      <ScrollViewInertialBackground topColor="red" bottomColor="blue" />
      {dummies.map((i) => (
        <View
          key={`dummy-${i}`}
          style={{ width: '100%', height: 100, borderBottomColor: 'black', borderBottomWidth: 1 }}
        >
          <Text>스크롤을 해보세요.</Text>
        </View>
      ))}
    </ScrollView>
  );
}
Pager
Previous page
WebView 속성 제어하기
Next page
ColorPreference
지원환경: React Native
실행환경: Toss AppSandbox App
현재 기기의 색상 모드를 나타내는 타입이에요. 라이트모드, 다크모드를 나타내는 문자열이에요

시그니처

type ColorPreference = 'light' | 'dark';
타입 정의
ColorPreference
'light' | 'dark'

Pager
Previous page
ScrollViewInertialBackground
Next page
KeyboardAboveView
지원환경: React Native
실행환경: Toss AppSandbox App
키보드가 화면에 나타날 때 자식 컴포넌트를 키보드 위로 자동으로 올려주는 컴포넌트예요. 예를 들어, 텍스트 입력 중 "전송" 버튼을 키보드 위에 고정시키고 싶을 때 유용해요.

시그니처

function KeyboardAboveView({ style, children, ...props }: ComponentProps<typeof View>): ReactElement;
파라미터
props.styleStyleProp<ViewStyle>
추가적인 스타일을 적용할 수 있어요. 예를 들어, 배경색이나 크기 등을 설정할 수 있어요.

props.childrenReactNode
키보드가 나타날 때 키보드 위로 표시할 컴포넌트예요. 예를 들어, 버튼, 텍스트 입력창 등을 넣을 수 있어요.

반환 값
ReactElement
키보드가 나타났을 때 키보드 위로 조정된 `Animated.View`를 반환해요.

예제
키보드 위로 요소를 올리기

import { ScrollView, TextInput, View, Text } from 'react-native';
import { KeyboardAboveView } from 'react-native-bedrock';

function KeyboardAboveViewExample() {
  return (
    <>
      <ScrollView>
        <TextInput placeholder="placeholder" />
      </ScrollView>

      <KeyboardAboveView>
        <View style={{ width: '100%', height: 50, backgroundColor: 'yellow' }}>
          <Text>Keyboard 위에 있어요.</Text>
        </View>
      </KeyboardAboveView>
    </>
  );
}
Pager
Previous page
ColorPreference
Next page
OnAudioFocusChanged
지원환경: React Native
실행환경: Toss AppSandbox App
오디오 포커스가 변경될 때 호출되는 콜백 함수에요. muted 가 false 인 경우에 필수로 구현해야해요.

시그니처

type OnAudioFocusChanged = NonNullable<VideoProperties['onAudioFocusChanged']>;
파라미터
event필수 · Object
오디오 포커스 정보를 담고 있는 이벤트 객체예요.

event.hasAudioFocus필수 · boolean
비디오 컴포넌트가 오디오 포커스를 가지고 있는지 여부를 나타내요.

Pager
Previous page
KeyboardAboveView
Next page
기기 고유식별자 확인하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getDeviceId
getDeviceId 함수는 사용 중인 기기의 고유 식별자를 문자열로 반환해요.

이 함수는 현재 사용 중인 기기의 고유 식별자를 문자열로 반환해요. 기기별로 설정이나 데이터를 저장하거나 사용자의 기기를 식별해서 로그를 기록하고 분석하는 데 사용할 수 있어요. 같은 사용자의 여러 기기를 구분하는 데도 유용해요.

시그니처

function getDeviceId(): string;
반환 값
string
기기의 고유 식별자를 나타내는 문자열이에요.

예제
기기 고유 식별자 가져오기

React

React Native

import { getDeviceId } from "@apps-in-toss/web-framework";
import { useState } from "react";

const DeviceInfo = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const fetchDeviceId = async () => {
    setDeviceId(getDeviceId());
  };

  return (
    <div>
      <button onClick={fetchDeviceId}>기기 ID 가져오기</button>
      {deviceId && <p>Device ID: {deviceId}</p>}
    </div>
  );
};
}
Pager
Previous page
OnAudioFocusChanged
Next page
애플리케이션 환경 확인하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getOperationalEnvironment
getOperationalEnvironment 함수로 애플리케이션의 환경 정보를 사용해서 애플리케이션이 현재 어느 배포 환경(예: sandbox, toss)에서 실행 중인지 확인할 수 있어요.
토스 앱에서 실행 중이라면 'toss', 샌드박스 환경에서 실행 중이라면 'sandbox'를 반환해요.

운영 환경은 앱이 실행되는 컨텍스트를 의미하며, 특정 기능의 사용 가능 여부를 판단하는 데 활용할 수 있어요.

시그니처

function getOperationalEnvironment(): 'toss' | 'sandbox';
반환 값
'toss' | 'sandbox'
현재 운영 환경을 나타내는 문자열이에요.

'toss': 토스 앱에서 실행 중이에요.
'sandbox': 샌드박스 환경에서 실행 중이에요.
예제
현재 운영 환경 확인하기
애플리케이션이 배포된 환경에 따라 실행 환경이 달라질 수 있어요. 예를 들어, sandbox 환경에서는 일부 테스트 기능을 제공하고, toss 환경에서는 실제 서비스를 제공할 수 있어요. 실행 환경을 확인하면 이러한 기능 차이를 관리할 수 있죠.

다음은 실행 환경을 확인하는 예시예요.



React

React Native

import { getOperationalEnvironment } from '@apps-in-toss/web-framework';
import { Text } from '@toss-design-system/mobile';

function EnvironmentInfo() {
  const environment = getOperationalEnvironment();

  return <Text>{`현재 실행 환경은 '${environment}'입니다.`}</Text>;
}
실행 환경에 따라 기능 제한하기
특정 배포 환경에서만 제공해야 하는 기능이 있을 수 있어요. 아래는 sandbox 환경에서만 특별한 기능을 제공하는 예시예요.


import { View, Text } from 'react-native';
import { getOperationalEnvironment } from '@apps-in-toss/framework';

const isSandbox = getOperationalEnvironment() === 'sandbox'; // 'sandbox' 환경인지 확인하는 변수

function Component() {
  const handlePress = () => {
    if (isSandbox) {
      // 'sandbox' 환경에서 제공할 기능
    } else {
      // 다른 환경에서 제공할 기능
    }
  };

  return <Button onPress={handlePress}>자세히 보기</Button>;
}
Pager
Previous page
기기 고유식별자 확인하기
Next page
토스앱 버전 가져오기
지원환경: React NativeWebView
실행환경: Toss App
getTossAppVersion
getTossAppVersion 함수는 토스 앱 버전을 가져옵니다. 예를 들어, 5.206.0과 같은 형태로 반환돼요. 토스 앱 버전을 로그로 남기거나, 특정 기능이 특정 버전 이상에서만 실행될 때 사용돼요.

시그니처

function getTossAppVersion(): string
반환 값
string
토스 앱 버전

예제
토스 앱 버전 확인하기

React

React Native

import { getTossAppVersion } from '@apps-in-toss/web-framework';
import { Text } from '@toss-design-system/mobile';

function TossAppVersionPage() {
  const tossAppVersion = getTossAppVersion();

  return <Text>{tossAppVersion}</Text>;
}
Pager
Previous page
애플리케이션 환경 확인하기
Next page
앱 최소 버전 확인하기
지원환경: React NativeWebView
실행환경: Toss App
isMinVersionSupported
isMinVersionSupported 함수는 현재 토스 앱 버전이 지정한 최소 버전 이상인지 확인해요.

이 함수는 현재 실행 중인 토스 앱의 버전이 파라미터로 전달된 최소 버전 요구사항을 충족하는지 확인해요. 특정 기능이 최신 버전에서만 동작할 때, 사용자에게 앱 업데이트를 안내할 수 있어요.

시그니처

function isMinVersionSupported(minVersions: {
  android: `${number}.${number}.${number}` | 'always' | 'never';
  ios: `${number}.${number}.${number}` | 'always' | 'never';
}): boolean;
파라미터
minVersions필수 · Object
플랫폼별 최소 버전 요구사항을 지정하는 객체예요.

minVersions.android필수 · (${number}.${number}.${number} | 'always' | 'never')
안드로이드 플랫폼의 최소 버전 요구사항이에요.

minVersions.ios필수 · (${number}.${number}.${number} | 'always' | 'never')
iOS 플랫폼의 최소 버전 요구사항이에요.

반환 값
boolean
현재 앱 버전이 최소 버전 이상이면 true, 그렇지 않으면 false를 반환해요.

예제
앱 버전 확인하기

React

React Native

import { isMinVersionSupported } from '@apps-in-toss/web-framework';
import { Text } from '@toss-design-system/mobile';

function VersionCheck() {
  const isSupported = isMinVersionSupported({
    android: '1.2.0',
    ios: '1.3.0',
  });

  return <div>{!isSupported && <Text>최신 버전으로 업데이트가 필요해요.</Text>}</div>;
}
Pager
Previous page
토스앱 버전 가져오기
Next page
실행중인 플랫폼 확인하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getPlatformOS
getPlatformOS 는 현재 실행 중인 플랫폼을 확인하는 함수예요. 이 함수는 react-native의 Platform.OS 값을 기반으로 동작하며, ios 또는 android 중 하나의 문자열을 반환해요.

시그니처

function getPlatformOS(): 'ios' | 'android';
반환 값
'ios' | 'android'
현재 실행 중인 플랫폼

예제
현재 실행중인 OS 플랫폼 확인하기

import { getPlatformOS } from '@apps-in-toss/framework';
import { Text } 'react-native';

function Page() {
  const platform = getPlatformOS();

  return <Text>현재 플랫폼: {platform}</Text>;
}
Pager
Previous page
앱 최소 버전 확인하기
Next page
스킴 값 가져오기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getSchemeUri
getSchemeUri 는 처음에 화면에 진입한 스킴 값을 반환해요. 페이지 이동으로 인한 URI 변경은 반영되지 않아요.

시그니처

function getSchemeUri(): string;
반환 값
string
처음에 화면에 진입한 스킴 값을 반환해요.

예제
처음 진입한 스킴 값 가져오기

import { getSchemeUri } from '@apps-in-toss/framework';
import { Text } from 'react-native';

function MyPage() {
 const schemeUri = getSchemeUri();

 return <Text>처음에 화면에 진입한 스킴 값: {schemeUri}</Text>
}
Pager
Previous page
실행중인 플랫폼 확인하기
Next page
Flex
지원환경: React Native
실행환경: Toss AppSandbox App
Flex는 자식 요소들을 Flexbox 레이아웃을 기준으로 배치하는 컴포넌트예요. Flexbox를 사용하면, 가로 및 세로 방향으로 요소들을 쉽게 정렬하고, 중앙 정렬을 간편하게 설정할 수 있어요. 자식 요소를 정 중앙에 배치할 때에는 Flex.Center, 세로 중앙에 배치할 때에는 Flex.CenterVertical, 가로 중앙에 배치할 때에는 Flex.CenterHorizontal을 사용해요.

시그니처

Flex: FlexType
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.align'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' · 'stretch'
중심축 기준(Flex 방향)으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들면 'center'는 수평 중앙에 배치하고, 'stretch'는 요소의 폭이 'auto'인 경우 부모의 폭에 맞게 늘려요. 이 값은 `alignItems`에 적용되며, 기본값은 'stretch'예요.

props.justify'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' · 'flex-start'
교차축(Flex 방향의 교차 방향) 기준으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, flex-start는 요소를 부모의 위쪽에 배치하고, 'center'는 부모의 수직 중앙에 배치해요. 이 값은 `justifyContent`에 적용되며, 기본값은 'flex-start'예요.

props.direction'column' | 'row' · 'column'
자식 요소들이 배치될 방향을 설정하는 값이에요. `flexDirection`에 적용되며, 기본값은 'column'이에요.

props.styleViewProps['style']
Flex 컴포넌트에 적용할 style 객체예요. Flexbox 레이아웃 외에 컴포넌트의 배경색, 테두리, 여백 등 다른 스타일을 지정할 때 사용해요. 기본값은 undefined에요.

프로퍼티
CenterFlexCenter
Flex.Center는 자식 요소들을 Flex Layout 기준으로 가로와 세로 모두 정 중앙에 배치하는 컴포넌트예요.

CenterVerticalFlexCenterVertical
Flex.CenterVertical는 자식 요소들을 Flex Layout 기준으로 세로 방향으로 중앙에 정렬하기 위한 컴포넌트예요.

CenterHorizontalFlexCenterHorizontal
Flex.CenterHorizontal는 자식 요소들을 Flex Layout 기준으로 가로 방향으로 중앙에 정렬하기 위한 컴포넌트예요.

예제
가로, 세로 방향으로 요소들을 배치하는 예제예요.

import { Flex } from '@granite-js/react-native';
import { Text } from 'react-native';

function FlexExample() {
  return (
    <>
      <Flex direction="column">
        <Text>세로로 배치해요</Text>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Flex>
      <Flex direction="row">
        <Text>가로로 배치해요</Text>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Flex>
    </>
  );
}
Pager
Previous page
스킴 값 가져오기
Next page
FlexCenter
지원환경: React Native
실행환경: Toss AppSandbox App
Flex.Center는 자식 요소들을 Flexbox 레이아웃 기준으로 가로와 세로 모두 정 중앙에 배치하는 컴포넌트예요. alignItems와 justifyContent 속성 모두 'center'로 설정되어, 자식 요소들이 부모 컴포넌트의 중앙에 배치돼요. Flexbox를 사용해 중앙 정렬을 간편하게 할 수 있어요.

시그니처

FlexCenter: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<View>>
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.align'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' · 'center'
중심축 기준(Flex 방향)으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, 'center'는 수평 중앙에 배치하고, 'stretch'는 요소의 폭이 'auto'일 때 부모의 폭에 맞게 늘려요. 이 값은 `alignItems`에 적용되며, 기본값은 'center'예요.

props.justify'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' · 'center'
교차축(Flex 방향의 교차 방향) 기준으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, flex-start는 요소를 부모의 위쪽에 배치하고, 'center'는 부모의 수직 중앙에 배치해요. 이 값은 `justifyContent`에 적용되며, 기본값은 'center'예요.

props.direction'column' | 'row' · 'column'
자식 요소들이 배치될 방향을 설정하는 값이에요. 기본값은 'column'으로, 세로 방향으로 배치돼요.

props.styleViewProps['style']
Flex.Center 컴포넌트에 적용할 style 객체예요. Flexbox 레이아웃 외에 컴포넌트의 배경색, 테두리, 여백 등 다른 스타일을 지정할 때 사용해요. 기본값은 undefined에요.

예제
요소를 정 중앙에 배치하는 예제예요.

import { Flex } from '@granite-js/react-native';
import { Text } from 'react-native';

function FlexCenterExample() {
  return (
    <Flex.Center style={{ width: '100%', height: 100, borderWidth: 1 }}>
      <Text>정 중앙에 배치해요</Text>
    </Flex.Center>
  );
}
Pager
Previous page
Flex
Next page
FlexCenterHorizontal
지원환경: React Native
실행환경: Toss AppSandbox App
Flex.CenterHorizontal는 자식 요소들을 Flexbox 레이아웃 기준으로 가로 방향으로 중앙에 정렬하기 위한 컴포넌트예요. alignItems 속성이 'center'로 설정되어, 자식 요소들이 부모 컴포넌트의 가로 중앙에 배치돼요.

시그니처

FlexCenterHorizontal: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<View>>
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.align'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' · 'center'
중심축 기준(Flex 방향)으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, 'center'는 수평 중앙에 배치하고, 'stretch'는 요소의 폭이 'auto'인 경우 부모의 폭에 맞게 늘려요. 이 값은 `alignItems`에 적용되며, 기본값은 'center'예요.

props.justify'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' · 'flex-start'
교차축(Flex 방향의 교차 방향) 기준으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, flex-start는 요소를 부모의 위쪽에 배치하고, 'center'는 부모의 수직 중앙에 배치해요. 이 값은 `justifyContent`에 적용되며, 기본값은 'flex-start'예요.

props.direction'column' | 'row' · 'column'
자식 요소들이 배치될 방향을 설정하는 값이에요. 기본값은 'column'으로 세로 방향으로 배치돼요.

props.styleViewProps['style']
Flex.CenterHorizontal 컴포넌트에 적용할 style 객체예요. Flexbox 레이아웃 외에 컴포넌트의 배경색, 테두리, 여백 등 다른 스타일을 지정할 때 사용해요. 기본값은 undefined에요.

예제
가로 방향으로 요소들을 중앙 정렬하는 예제예요.

import { Flex } from '@granite-js/react-native';
import { Text } from 'react-native';

function FlexCenterHorizontalExample() {
  return (
    <Flex.CenterHorizontal style={{ width: '100%', height: 100, borderWidth: 1 }}>
      <Text>가로 중앙에 배치해요</Text>
    </Flex.CenterHorizontal>
  );
}
Pager
Previous page
FlexCenter
Next page
FlexCenterVertical
지원환경: React Native
실행환경: Toss AppSandbox App
Flex.CenterVertical는 자식 요소들을 Flexbox 레이아웃 기준으로 세로 방향으로 중앙에 정렬하기 위한 컴포넌트예요. justifyContent 속성이 'center'로 설정되어, 자식 요소들이 부모 컴포넌트의 세로 중앙에 배치돼요.

시그니처

FlexCenterVertical: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<View>>
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.align'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' · 'center'
중심축 기준(Flex 방향)으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, 'center'는 수평 중앙에 배치하고, 'stretch'는 요소의 폭이 'auto'인 경우 부모의 폭에 맞게 늘려요. 이 값은 `alignItems`에 적용되며, 기본값은 'stretch'예요.

props.justify'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' · 'center'
교차축(Flex 방향의 교차 방향) 기준으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, flex-start는 요소를 부모의 위쪽에 배치하고, 'center'는 부모의 수직 중앙에 배치해요. 이 값은 `justifyContent`에 적용되며, 기본값은 'center'예요.

props.direction'column' | 'row' · 'column'
자식 요소들이 배치될 방향을 설정하는 값이에요. 기본값은 'column'으로, 세로 방향으로 배치돼요.

props.styleViewProps['style']
Flex.CenterVertical 컴포넌트에 적용할 style 객체예요. Flexbox 레이아웃 외에 컴포넌트의 배경색, 테두리, 여백 등 다른 스타일을 지정할 때 사용해요. 기본값은 undefined에요.

예제
세로 방향으로 요소들을 중앙 정렬하는 예제예요.

import { Flex } from '@granite-js/react-native';
import { Text } from 'react-native';

function FlexCenterVerticalExample() {
  return (
    <Flex.CenterVertical style={{ width: '100%', height: 100, borderWidth: 1 }}>
      <Text>세로 중앙에 배치해요</Text>
    </Flex.CenterVertical>
  );
}
Pager
Previous page
FlexCenterHorizontal
Next page
Spacing
지원환경: React Native
실행환경: Toss AppSandbox App
Spacing은 빈 공간을 차지해서 여백을 추가하는 컴포넌트예요. 가로 혹은 세로 방향으로 여백의 크기를 지정할 수 있어요.

시그니처

Spacing: import("react").NamedExoticComponent<Props>
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.size필수 · number
여백의 크기를 설정하는 숫자 값이에요.

props.direction'vertical' | 'horizontal' · 'vertical'
여백을 차지할 방향을 설정해요. 기본값은 'vertical'이에요.

props.styleStyleProp<ViewStyle>
Spacing 컴포넌트에 적용할 style 값이에요. 기본값은 undefined이고, 추가 스타일을 적용할 때 사용돼요.

예제
가로, 세로 방향에 크기가 16인 여백을 추가하여 빈 공간을 만들어 낸 예제

import { View, Text } from 'react-native';
import { Spacing } from '@granite-js/react-native';

function SpacingExample() {
  return (
    <View>
      <Text>Top</Text>
      <Spacing size={16} direction="vertical" style={{ backgroundColor: 'red', width: 5 }} />
      <Text>Bottom, 세로 여백만큼 아래에 위치해 있어요</Text>

      <View style={{ flexDirection: 'row' }}>
        <Text>Left</Text>
        <Spacing size={16} direction="horizontal" style={{ backgroundColor: 'red', height: 5 }} />
        <Text>Right, 가로 여백만큼 옆에 위치해 있어요</Text>
      </View>
    </View>
  );
}
Pager
Previous page
FlexCenterVertical
Next page
Stack
지원환경: React Native
실행환경: Toss AppSandbox App
Stack은 자식 요소들을 Stack 방식으로 가로 혹은 세로로 배치하고, 자식 요소 사이에 간격을 설정할 수 있는 컴포넌트예요. direction 속성으로 가로(horizontal) 또는 세로(vertical) 방향을 지정할 수 있고, 자식 요소들 사이의 간격을 gutter 속성으로 조절할 수 있어요. 가로로 배치할 때는 Stack.Horizontal, 세로로 배치할 때는 Stack.Vertical 컴포넌트를 사용할 수 있어요.

시그니처

Stack: StackType
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.align'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
중심축 기준(Flex 방향)으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들면 'center'는 수평 중앙에 배치하고, 'stretch'는 요소의 폭이 'auto'인 경우 부모의 폭에 맞게 늘려요. 이 값은 `alignItems`에 적용돼요.

props.justify'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
교차축(Flex 방향의 교차 방향) 기준으로 자식 요소를 정렬하는 설정 값이에요. 'column' 방향을 예로 들어, flex-start는 요소를 부모의 위쪽에 배치하고, 'center'는 부모의 수직 중앙에 배치해요. 이 값은 `justifyContent`에 적용돼요.

props.direction'vertical' | 'horizontal' · 'vertical'
자식 요소를 배치할 방향을 설정하는 값이에요. 기본값은 'vertical'이에요.

props.gutternumber | ReactElement
자식 요소 간의 간격을 설정하는 값이에요. 숫자를 입력하면 픽셀 단위로 여백을 설정하고, ReactElement를 전달하면 해당 컴포넌트가 간격으로 사용돼요. 숫자를 사용하면 간격을 정확하게 제어할 수 있고, ReactElement를 사용하면 더 복잡한 커스텀 간격을 구현할 수 있어요.

프로퍼티
HorizontalStackHorizontal
Stack.Horizontal은 자식 요소들을 가로 방향으로 정렬하여 쌓는 컴포넌트예요.

VerticalStackVertical
Stack.Vertical은 자식 요소들을 세로 방향으로 정렬하여 쌓는 컴포넌트예요.

예제
가로, 세로 방향으로 요소들을 배치하고 간격을 16으로 설정한 예제예요.

import { Text } from 'react-native';
import { Stack } from '@granite-js/react-native';

function StackExample() {
  return (
    <>
      <Stack gutter={16} direction="horizontal">
        <Text>16간격을 두고 가로 방향으로 배치해요</Text>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Stack>
      <Stack gutter={16} direction="vertical">
        <Text>16간격을 두고 세로 방향으로 배치해요</Text>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Stack>
    </>
  );
}
Pager
Previous page
Spacing
Next page
StackHorizontal
지원환경: React Native
실행환경: Toss AppSandbox App
Stack.Horizontal은 자식 요소를 가로로 쌓아 배치하는 컴포넌트에요. 이 컴포넌트를 사용하면, 자식 요소 간의 간격을 gutter 속성으로 쉽게 조절할 수 있어, 가로 방향으로 일관된 레이아웃을 유지할 수 있어요.

시그니처

StackHorizontal: import("react").ForwardRefExoticComponent<StackWithoutDirectionProps & import("react").RefAttributes<View>>
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.align'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' · 'stretch'
자식 요소의 가로 정렬을 설정하는 값이에요. Flexbox의 align-items 속성과 동일하게 동작하며, 기본값은 'stretch'로 자식 요소의 폭이 'auto'인 경우 부모의 너비에 맞춰 늘어나요.

props.justify'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' · 'flex-start'
자식 요소의 가로 정렬을 설정하는 값이에요. Flexbox의 justify-content 속성과 동일하게 동작하며, 기본값은 'flex-start'로 자식 요소들이 위쪽에 정렬돼요.

props.gutternumber | ReactElement
자식 요소 간의 간격을 설정하는 값이에요. 숫자를 입력하면 픽셀 단위로 여백을 설정하고, ReactElement를 전달하면 해당 컴포넌트가 간격으로 사용돼요. 숫자를 사용하면 간격을 정확하게 제어할 수 있고, ReactElement를 사용하면 더 복잡한 커스텀 간격을 구현할 수 있어요.

예제
가로 방향으로 요소들을 배치하고, 간격을 16으로 설정한 예제예요.

import { Stack } from '@granite-js/react-native';
import { View, Text } from 'react-native';

function StackHorizontalExample() {
  return (
       <Stack.Horizontal gutter={16}>
        <Text>16간격을 두고 가로 방향으로 배치해요</Text>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Stack.Horizontal>
  );
}
Pager
Previous page
Stack
Next page
StackVertical
지원환경: React Native
실행환경: Toss AppSandbox App
Stack.Vertical은 자식 요소를 세로로 쌓아 배치하는 컴포넌트에요. 이 컴포넌트를 사용하면 자식 요소 간의 간격을 gutter 속성으로 쉽게 조절할 수 있어, 세로 방향으로 일관된 레이아웃을 유지할 수 있어요.

시그니처

StackVertical: import("react").ForwardRefExoticComponent<StackWithoutDirectionProps & import("react").RefAttributes<View>>
파라미터
propsobject
컴포넌트에 전달되는 props 객체예요.

props.alignstring · 'stretch'
자식 요소의 세로 정렬을 설정하는 값이에요. Flexbox의 align-items 속성과 동일하게 동작하며, 기본값은 'stretch'로 자식 요소의 높이가 'auto'인 경우 부모의 높이에 맞춰 늘어나요.

props.justifystring · 'flex-start'
자식 요소의 가로 정렬을 설정하는 값이에요. Flexbox의 justify-content 속성과 동일하게 동작하며, 기본값은 'flex-start'로 자식 요소들이 왼쪽에 정렬돼요.

props.gutternumber | ReactElement
자식 요소 간의 간격을 설정하는 값이에요. 숫자를 입력하면 픽셀 단위로 여백을 설정하고, ReactElement를 전달하면 해당 컴포넌트가 간격으로 사용돼요. 숫자를 사용하면 간격을 정확하게 제어할 수 있고, ReactElement를 사용하면 더 복잡한 커스텀 간격을 구현할 수 있어요.

예제
가로 방향으로 요소들을 배치하고 간격으로 16만큼 설정한 예제예요.

import { Stack } from '@granite-js/react-native';
import { View, Text } from 'react-native';

function StackVerticalExample() {
  return (
       <Stack.Vertical gutter={16}>
        <Text>16간격을 두고 세로 방향으로 배치해요</Text>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Stack.Vertical>
  );
}
Pager
Previous page
StackHorizontal
Next page
margin
지원환경: React Native
실행환경: Toss AppSandbox App
margin 함수는 컴포넌트의 외부 간격을 설정해서, 컴포넌트들 간의 적절한 간격을 확보해요. 가로(x), 세로(y), 그리고 각 방향(top, right, bottom, left)별로 외부 여백을 숫자로 지정할 수 있어요. 숫자를 입력하면 모든 방향에 동일한 값을 적용하거나, 각 방향별로 개별 설정이 가능해요. 또한 자주 쓰는 값에 대한 프리셋이 있어 쉽게 적용할 수 있어요.

시그니처

margin: BoxSpacing
파라미터
option필수 · BoxSpacingOption
바깥쪽 여백을 지정하는 옵션 값이예요. 숫자를 넣으면 모든 방향에 동일한 값을 적용하고,

각 방향에 대해 개별 값을 설정할 수도 있어요.

프로퍼티
x필수 · (value: number) => ViewStyle
컴포넌트의 가로 방향(왼쪽과 오른쪽)에 입력한 숫자만큼의 바깥쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

x4필수 · ViewStyle
가로 방향에 4px의 바깥쪽 여백을 적용하는 스타일 객체예요

x8필수 · ViewStyle
가로 방향에 8px의 바깥쪽 여백을 적용하는 스타일 객체예요

x12필수 · ViewStyle
가로 방향에 12px의 바깥쪽 여백을 적용하는 스타일 객체예요.

x16필수 · ViewStyle
가로 방향에 16px의 바깥쪽 여백을 적용하는 스타일 객체예요.

x24필수 · ViewStyle
가로 방향에 24px의 바깥쪽 여백을 적용하는 스타일 객체예요.

x32필수 · ViewStyle
가로 방향에 32px의 바깥쪽 여백을 적용하는 스타일 객체예요.

y필수 · (value: number) => ViewStyle
컴포넌트의 세로 방향(위쪽과 아래쪽)에 입력한 숫자만큼의 바깥쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

y4필수 · ViewStyle
세로 방향에 4px의 바깥쪽 여백을 적용하는 스타일 객체예요

y8필수 · ViewStyle
세로 방향에 8px의 바깥쪽 여백을 적용하는 스타일 객체예요

y12필수 · ViewStyle
세로 방향에 12px의 바깥쪽 여백을 적용하는 스타일 객체예요.

y16필수 · ViewStyle
세로 방향에 16px의 바깥쪽 여백을 적용하는 스타일 객체예요.

y24필수 · ViewStyle
세로 방향에 24px의 바깥쪽 여백을 적용하는 스타일 객체예요.

y32필수 · ViewStyle
세로 방향에 32px의 바깥쪽 여백을 적용하는 스타일 객체예요.

top필수 · (value: number) => ViewStyle
컴포넌트의 위쪽 방향에 입력한 숫자만큼의 바깥쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

top4필수 · ViewStyle
위에 4px의 바깥쪽 여백을 적용하는 스타일 객체예요

top8필수 · ViewStyle
위에 8px의 바깥쪽 여백을 적용하는 스타일 객체예요

top12필수 · ViewStyle
위에 12px의 바깥쪽 여백을 적용하는 스타일 객체예요.

top16필수 · ViewStyle
위에 16px의 바깥쪽 여백을 적용하는 스타일 객체예요.

top24필수 · ViewStyle
위에 24px의 바깥쪽 여백을 적용하는 스타일 객체예요.

top32필수 · ViewStyle
위에 32px의 바깥쪽 여백을 적용하는 스타일 객체예요.

right필수 · (value: number) => ViewStyle
컴포넌트의 오른쪽 방향에 입력한 숫자만큼의 바깥쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

right4필수 · ViewStyle
오른쪽에 4px의 바깥쪽 여백을 적용하는 스타일 객체예요

right8필수 · ViewStyle
오른쪽에 8px의 바깥쪽 여백을 적용하는 스타일 객체예요

right12필수 · ViewStyle
오른쪽에 12px의 바깥쪽 여백을 적용하는 스타일 객체예요.

right16필수 · ViewStyle
오른쪽에 16px의 바깥쪽 여백을 적용하는 스타일 객체예요.

right24필수 · ViewStyle
오른쪽에 24px의 바깥쪽 여백을 적용하는 스타일 객체예요.

right32필수 · ViewStyle
오른쪽에 32px의 바깥쪽 여백을 적용하는 스타일 객체예요.

bottom필수 · (value: number) => ViewStyle
컴포넌트의 아래쪽 방향에 입력한 숫자만큼의 바깥쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

bottom4필수 · ViewStyle
아래에 4px의 바깥쪽 여백을 적용하는 스타일 객체예요

bottom8필수 · ViewStyle
아래에 8px의 바깥쪽 여백을 적용하는 스타일 객체예요

bottom12필수 · ViewStyle
아래에 12px의 바깥쪽 여백을 적용하는 스타일 객체예요.

bottom16필수 · ViewStyle
아래에 16px의 바깥쪽 여백을 적용하는 스타일 객체예요.

bottom24필수 · ViewStyle
아래에 24px의 바깥쪽 여백을 적용하는 스타일 객체예요.

bottom32필수 · ViewStyle
아래에 32px의 바깥쪽 여백을 적용하는 스타일 객체예요.

left필수 · (value: number) => ViewStyle
컴포넌트의 왼쪽 방향에 입력한 숫자만큼의 바깥쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

left4필수 · ViewStyle
왼쪽에 4px의 바깥쪽 여백을 적용하는 스타일 객체예요

left8필수 · ViewStyle
왼쪽에 8px의 바깥쪽 여백을 적용하는 스타일 객체예요

left12필수 · ViewStyle
왼쪽에 12px의 바깥쪽 여백을 적용하는 스타일 객체예요.

left16필수 · ViewStyle
왼쪽에 16px의 바깥쪽 여백을 적용하는 스타일 객체예요.

left24필수 · ViewStyle
왼쪽에 24px의 바깥쪽 여백을 적용하는 스타일 객체예요.

left32필수 · ViewStyle
왼쪽에 32px의 바깥쪽 여백을 적용하는 스타일 객체예요.

예제
가로, 세로 방향에 8px의 바깥쪽 여백을 적용하고, 아래 방향에 임의의 여백(100px)을 적용하는 예제예요.

import { padding } from '@granite-js/react-native';
import { View } from 'react-native';

function Component() {
  return (
    <View>
      <View style={margin.x8}>
        <Text>가로 여백이 있어요</Text>
      </View>
      <View style={margin.y8}>
        <Text>세로 여백이 있어요</Text>
      </View>
      <View style={margin.bottom(100)}>
        <Text>아래에 100만큼의 여백이 있어요</Text>
      </View>
    </View>
  );
}
Pager
Previous page
StackVertical
Next page
padding
지원환경: React Native
실행환경: Toss AppSandbox App
padding 함수는 컴포넌트의 안쪽 여백을 설정함으로써 콘텐츠와 경계 사이에 적절한 간격을 확보해요. 가로(x), 세로(y), 그리고 각 방향(top, right, bottom, left)별로 외부 여백을 숫자로 지정할 수 있어요. 숫자를 입력하면 모든 방향에 동일한 값을 적용하거나, 각 방향별로 개별 설정이 가능해요. 또한 자주 쓰는 값에 대한 프리셋이 있어 쉽게 적용할 수 있어요.

시그니처

padding: BoxSpacing
파라미터
option필수 · BoxSpacingOption
안쪽 여백을 지정하는 옵션 값이예요. 숫자를 넣으면 모든 방향에 동일한 값을 적용하고,

각 방향에 대해 개별 값을 설정할 수도 있어요.

프로퍼티
x필수 · (value: number) => ViewStyle
컴포넌트의 가로 방향(왼쪽과 오른쪽)에 입력한 숫자만큼의 안쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

x4필수 · ViewStyle
가로 방향에 4px의 안쪽 여백을 적용하는 스타일 객체예요

x8필수 · ViewStyle
가로 방향에 8px의 안쪽 여백을 적용하는 스타일 객체예요

x12필수 · ViewStyle
가로 방향에 12px의 안쪽 여백을 적용하는 스타일 객체예요.

x16필수 · ViewStyle
가로 방향에 16px의 안쪽 여백을 적용하는 스타일 객체예요.

x24필수 · ViewStyle
가로 방향에 24px의 안쪽 여백을 적용하는 스타일 객체예요.

x32필수 · ViewStyle
가로 방향에 32px의 안쪽 여백을 적용하는 스타일 객체예요.

y필수 · (value: number) => ViewStyle
컴포넌트의 세로 방향(위쪽과 아래쪽)에 입력한 숫자만큼의 안쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

y4필수 · ViewStyle
세로 방향에 4px의 안쪽 여백을 적용하는 스타일 객체예요

y8필수 · ViewStyle
세로 방향에 8px의 안쪽 여백을 적용하는 스타일 객체예요

y12필수 · ViewStyle
세로 방향에 12px의 안쪽 여백을 적용하는 스타일 객체예요.

y16필수 · ViewStyle
세로 방향에 16px의 안쪽 여백을 적용하는 스타일 객체예요.

y24필수 · ViewStyle
세로 방향에 24px의 안쪽 여백을 적용하는 스타일 객체예요.

y32필수 · ViewStyle
세로 방향에 32px의 안쪽 여백을 적용하는 스타일 객체예요.

top필수 · (value: number) => ViewStyle
컴포넌트의 위쪽 방향에 입력한 숫자만큼의 안쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

top4필수 · ViewStyle
위에 4px의 안쪽 여백을 적용하는 스타일 객체예요

top8필수 · ViewStyle
위에 8px의 안쪽 여백을 적용하는 스타일 객체예요

top12필수 · ViewStyle
위에 12px의 안쪽 여백을 적용하는 스타일 객체예요.

top16필수 · ViewStyle
위에 16px의 안쪽 여백을 적용하는 스타일 객체예요.

top24필수 · ViewStyle
위에 24px의 안쪽 여백을 적용하는 스타일 객체예요.

top32필수 · ViewStyle
위에 32px의 안쪽 여백을 적용하는 스타일 객체예요.

right필수 · (value: number) => ViewStyle
컴포넌트의 오른쪽 방향에 입력한 숫자만큼의 안쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

right4필수 · ViewStyle
오른쪽에 4px의 안쪽 여백을 적용하는 스타일 객체예요

right8필수 · ViewStyle
오른쪽에 8px의 안쪽 여백을 적용하는 스타일 객체예요

right12필수 · ViewStyle
오른쪽에 12px의 안쪽 여백을 적용하는 스타일 객체예요.

right16필수 · ViewStyle
오른쪽에 16px의 안쪽 여백을 적용하는 스타일 객체예요.

right24필수 · ViewStyle
오른쪽에 24px의 안쪽 여백을 적용하는 스타일 객체예요.

right32필수 · ViewStyle
오른쪽에 32px의 안쪽 여백을 적용하는 스타일 객체예요.

bottom필수 · (value: number) => ViewStyle
컴포넌트의 아래쪽 방향에 입력한 숫자만큼의 안쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

bottom4필수 · ViewStyle
아래에 4px의 안쪽 여백을 적용하는 스타일 객체예요

bottom8필수 · ViewStyle
아래에 8px의 안쪽 여백을 적용하는 스타일 객체예요

bottom12필수 · ViewStyle
아래에 12px의 안쪽 여백을 적용하는 스타일 객체예요.

bottom16필수 · ViewStyle
아래에 16px의 안쪽 여백을 적용하는 스타일 객체예요.

bottom24필수 · ViewStyle
아래에 24px의 안쪽 여백을 적용하는 스타일 객체예요.

bottom32필수 · ViewStyle
아래에 32px의 안쪽 여백을 적용하는 스타일 객체예요.

left필수 · (value: number) => ViewStyle
컴포넌트의 왼쪽 방향에 입력한 숫자만큼의 안쪽 여백을 설정하는 스타일 객체를 반환해요. 반환된 객체는 컴포넌트의 style 속성에 전달되어 여백이 적용돼요.

left4필수 · ViewStyle
왼쪽에 4px의 안쪽 여백을 적용하는 스타일 객체예요

left8필수 · ViewStyle
왼쪽에 8px의 안쪽 여백을 적용하는 스타일 객체예요

left12필수 · ViewStyle
왼쪽에 12px의 안쪽 여백을 적용하는 스타일 객체예요.

left16필수 · ViewStyle
왼쪽에 16px의 안쪽 여백을 적용하는 스타일 객체예요.

left24필수 · ViewStyle
왼쪽에 24px의 안쪽 여백을 적용하는 스타일 객체예요.

left32필수 · ViewStyle
왼쪽에 32px의 안쪽 여백을 적용하는 스타일 객체예요.

예제
가로, 세로 방향에 8px의 안쪽 여백을 적용하고, 아래 방향에 임의의 여백(100px)을 적용하는 예제예요.

import { padding } from '@react-native-bedrock/core';
import { View } from 'react-native';

function Component() {
  return (
    <View>
      <View style={padding.x8}>
        <Text>가로 여백이 있어요</Text>
      </View>
      <View style={padding.y8}>
        <Text>세로 여백이 있어요</Text>
      </View>
      <View style={padding.bottom(100)}>
        <Text>아래에 100만큼의 여백이 있어요</Text>
      </View>
    </View>
  );
}
Pager
Previous page
margin
Next page
오버레이 제어하기
지원환경: React Native
실행환경: Toss AppSandbox App
useOverlay
useOverlay는 뒤로가기 버튼을 눌렀을 때 Overlay를 닫고 화면을 종료할 수 있도록 도와주는 hook이에요. 이 hook은 Overlay의 열림과 닫힘 상태를 간편하게 관리하고 싶을 때 유용해요.

시그니처

function useOverlay(): {
    close: () => void;
    open: (overlayElement: CreateOverlayElement) => void;
};
반환 값
{ open: (overlayElement: CreateOverlayElement) => void; close: () => void; }
open 함수는 overlayElement를 받아 Overlay를 표시하고, close 함수는 등록된 Overlay를 닫습니다.

예제

import { useOverlay } from '@apps-in-toss/framework';

 const overlay = useOverlay();

  const openBottomSheet = useCallback(() => {
    return new Promise<void>((resolve) => {
      overlay.open(({ isOpen, exit, close }) => {
        const handleClose = () => {
          close();
          resolve();
        };

        return (
          <BottomSheet
            open={isOpen}
            onClose={handleClose}
            onExited={exit}
            header={<BottomSheet.Header>BottomSheet V1 Header</BottomSheet.Header>}
            cta={<BottomSheet.CTA onPress={handleClose}>확인</BottomSheet.CTA>}
          >
            <View>
              <TextField size="classic" label="name" value="FOCUS ME" />
            </View>
          </BottomSheet>
        );
      });
    });
  }, []);
Pager
Previous page
padding오버레이 생성·관리하기
지원환경: React Native
실행환경: Toss AppSandbox App
useOverlayBase
useOverlayBase는 Dialog처럼 별도의 UI 레이어를 띄우는 Overlay를 선언적으로 다루기 위한 hook이에요. 이 hook을 사용하려면 사용하는 화면의 _app.tsx에 를 추가해야 해요. Promise와 함께 사용할 수 있어서 비동기 작업과 결합해 Overlay를 제어할 때 유용해요. 여러 개의 Overlay가 필요할 때는 useOverlayBase를 여러 번 호출하면 돼요.

시그니처

function useOverlayBase({ exitOnUnmount }?: Options): {
    open: (overlayElement: CreateOverlayElement) => void;
    close: () => void;
};
파라미터
exitOnUnmountboolean · true
useOverlayBase를 호출한 컴포넌트가 unmount될 때 overlay도 자동으로 unmount(=exit)되도록 설정하는 옵션이예요. 만약 exitOnUnmount를 false로 설정하면, useOverlayBase를 호출한 컴포넌트가 unmount되어도 overlay는 자동으로 unmount되지 않고 등록된 overlay가 메모리에 계속 남아 있어요. 이럴 때는 원하는 시점에 직접 exit 함수를 호출해서 overlay를 수동으로 unmount 해주세요.

반환 값
{ open: (overlayElement: CreateOverlayElement) => void; close: () => void; }
open 함수는 overlayElement를 받아 Overlay를 표시하고, close 함수는 등록된 Overlay를 닫아요.

예제

// _app.tsx
import { OverlayProvider } from '@apps-in-toss/framework';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverlayProvider>
      <Component {...pageProps} />
    </OverlayProvider>
  )
}

// Page.tsx
import { useOverlayBase } from '@react-native-bedrock/core';

const overlay = useOverlayBase();
const openFooConfirmDialog = () => {
  return new Promise<boolean>(resolve => {
    overlay.open(({ isOpen, close }) => (
      <FooConfirmDialog
        open={isOpen}
        onClose={() => {
          resolve(false);
          close();
        }}
        onConfirm={() => {
          resolve(true);
          close();
        }}
      />
    ));
  });
};

await openFooConfirmDialog();
// ConfirmDialog의 confirmButton을 누르거나 onClose가 호출된 후
console.log('dialog closed');
Pager
Previous page
네트워크 연결 상태 확인하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
getNetworkStatus
getNetworkStatus 는 디바이스의 현재 네트워크 연결 상태를 가져오는 함수예요. 반환 값은 NetworkStatus 타입으로, 인터넷 연결 여부와 연결 유형(Wi-Fi, 모바일 데이터 등)을 나타내요. 값은 다음 중 하나예요.

OFFLINE: 인터넷에 연결되지 않은 상태예요.
WIFI: Wi-Fi에 연결된 상태예요.
2G: 2G 네트워크에 연결된 상태예요.
3G: 3G 네트워크에 연결된 상태예요.
4G: 4G 네트워크에 연결된 상태예요.
5G: 5G 네트워크에 연결된 상태예요.
WWAN: 인터넷은 연결되었지만, 연결 유형(Wi-Fi, 2G~5G)을 알 수 없는 상태예요. 이 상태는 iOS에서만 확인할 수 있어요.
UNKNOWN: 인터넷 연결 상태를 알 수 없는 상태예요. 이 상태는 안드로이드에서만 확인할 수 있어요.
시그니처

function getNetworkStatus(): Promise<NetworkStatus>;
반환 값
Promise<NetworkStatus>
네트워크 상태를 반환해요.

예제
현재 네트워크 상태 가져오기
네트워크 연결 상태를 가져와 화면에 표시하는 예제예요.


import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { getNetworkStatus, NetworkStatus } from '@apps-in-toss/framework';

function GetNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus | ''>('');

  useEffect(() => {
    async function fetchStatus() {
      const networkStatus = await getNetworkStatus();
      setStatus(networkStatus);
    }

    fetchStatus();
  }, []);

  return (
    <View>
      <Text>현재 네트워크 상태: {status}</Text>
    </View>
  );
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-network-status 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

HTTP 통신하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
Bedrock에서 네트워크 통신을 하는 방법을 소개해요.

Fetch API 사용하기
Bedrock에서는 React Native처럼 Fetch API를 사용해서 네트워크 통신을 할 수 있어요. Fetch API는 비동기 네트워크 요청을 간단히 구현할 수 있는 표준 웹 API에요.

다음은 "할 일 목록"을 가져오는 API를 사용해 "할 일"이 완료됐을 때 취소선을 표시하는 예제에요.


pages/index.tsx

Todo.tsx

import { createRoute } from '@granite-js/react-native';
import { useCallback, useState } from "react";
import { Button, ScrollView } from "react-native";
import { Todo, TodoItem } from "./Todo";

export const Route = createRoute("/", {
  component: Index,
});

function Index() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const handlePress = useCallback(async () => {
    /**
     * JSONPlaceholder API에서 할 일 데이터를 가져와요.
     * @link https://jsonplaceholder.typicode.com/
     */
    const result = await fetch("https://jsonplaceholder.typicode.com/todos");
    const json = await result.json(); // 응답 데이터를 JSON으로 변환해요.
    setTodos(json); // 가져온 데이터를 상태로 저장해요.
  }, []);

  return (
    <>
      <Button title="할 일 목록 확인하기" onPress={handlePress} />
      <ScrollView>
        {todos.map((todo) => {
          return (
            <Todo
              key={todo.id}
              id={todo.id}
              title={todo.title}
              completed={todo.completed}
            />
          );
        })}
      </ScrollView>
    </>
  );
}
예제 영상을 보면 버튼을 클릭하면 네트워크 요청이 발생하고, 화면에 할 일 목록이 표시돼요. 네트워크 요청이 발생할 때 네트워크 인스펙터에서 요청과 응답을 확인할 수 있어요.

네트워크 요청 확인 방법은 디버깅하기 문서를 참고하면 자세히 알 수 있어요.
다른 라이브러리 사용하기
React Native는 XMLHttpRequest API를 지원해요. 따라서, 이 API를 사용하는 써드파티 네트워크 라이브러리도 사용할 수 있어요.

자세한 내용은 React Native 공식 문서를 참고하세요.

로케일 가져오기
지원환경: React NativeWebView
실행환경: Toss App
getLocale
getLocale 함수는 사용자의 로케일(locale) 정보를 반환해요. 네이티브 모듈에서 로케일 정보를 가져올 수 없을 때는 기본값으로 'ko-KR'을 반환합니다. 앱의 현지화 및 언어 설정과 관련된 기능을 구현할 때 사용하세요.

시그니처

function getLocale(): string;
반환 값
string
사용자의 로케일 정보를 반환해요.

예제
현재 사용자의 로케일 정보 가져오기

import { getLocale } from '@apps-in-toss/framework';
import { Text } from 'react-native';

function MyPage() {
 const locale = getLocale();

 return (
   <Text>사용자의 로케일 정보: {locale}</Text>
 )
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-locale 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
http 통신하기햅틱 진동 실행하기
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
generateHapticFeedback
generateHapticFeedback 는 디바이스에 햅틱 진동을 일으키는 함수예요. 예를 들어, 버튼 터치나 화면전환에 드라마틱한 효과를 주고 싶을 때 사용할 수 있어요. HapticFeedbackOptions에서 진동타입을 확인해 보세요.

시그니처

function generateHapticFeedback(options: HapticFeedbackOptions): Promise<void>;
반환 값
void
예제
버튼을 눌러 햅틱 일으키기

import { Button } from "react-native";
import { generateHapticFeedback } from '@apps-in-toss/framework';

function GenerateHapticFeedback() {
  return (
    <Button
      title="햅틱"
      onPress={() => {
        generateHapticFeedback({ type: "tickWeak" });
      }}
    />
  );
}
예제 앱 체험하기
apps-in-toss-examples 저장소에서 with-haptic-feedback 코드를 내려받거나, 아래 QR 코드를 스캔해 직접 체험해 보세요.

Pager
Previous page
로케일 가져오기
Next page
진동 타입(옵션)
지원환경: React NativeWebView
실행환경: Toss AppSandbox App
HapticFeedbackOptions
HapticFeedbackOptions 는 generateHapticFeedback 함수에 전달할 햅틱진동의 타입을 나타내요. 진동타입의 종류는 다음과 같아요.


type HapticFeedbackType =
| "tickWeak"
| "tap"
| "tickMedium"
| "softMedium"
| "basicWeak"
| "basicMedium"
| "success"
| "error"
| "wiggle"
| "confetti";
시그니처

interface HapticFeedbackOptions {
    type: HapticFeedbackType;
}
타입 정의
HapticFeedbackOptions
type: HapticFeedbackType

HapticFeedbackType
"tickWeak" | "tap" | "tickMedium" | "softMedium" | "basicWeak" | "basicMedium" | "success" | "error" | "wiggle" | "confetti"

Pager
Previous page
햅틱 진동 실행하기
Next page
