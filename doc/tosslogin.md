React Native
준비가 필요해요

프로젝트를 스캐폴딩하고 서비스를 실행하려면 환경설정이 필요해요. 아래 가이드를 먼저 확인해 주세요.

iOS 환경설정 문서 바로가기
Android 환경설정 문서 바로가기
기존 RN 프로젝트가 있는 경우

이미 React Native로 만든 서비스가 있어도 앱인토스에서 동작하려면 Granite 기반으로 스캐폴딩 해야 해요.

Granite을 사용해 "Welcome!"페이지가 표시되는 서비스를 만들어볼게요. 이를 통해 로컬 서버를 연결하는 방법과 파일 기반 라우팅을 배울 수 있어요.

스캐폴딩
앱을 만들 위치에서 다음 명령어를 실행하세요.

이 명령어는 프로젝트를 초기화하고 필요한 파일과 디렉토리를 자동으로 생성해요.


npm

pnpm

yarn

$ npm create granite-app
1. 앱 이름 지정하기
앱 이름은 kebab-case 형식으로 만들어 주세요. 예를 들어, 아래와 같이 입력해요.


# 예시
my-granite-app
2. 도구 선택하기
granite에서는 프로젝트를 생성할 때 필요한 도구를 선택할 수 있어요. 현재 제공되는 선택지는 다음 두 가지예요. 둘 중 한 가지 방법을 선택해서 개발 환경을 세팅하세요.

prettier + eslint: 코드 포맷팅과 린팅을 각각 담당하며, 세밀한 설정과 다양한 플러그인으로 유연한 코드 품질 관리를 지원해요.
biome: Rust 기반의 빠르고 통합적인 코드 포맷팅과 린팅 도구로, 간단한 설정으로 효율적인 작업이 가능해요.
3. 의존성 설치하기
프로젝트 디렉터리로 이동한 뒤, 사용 중인 패키지 관리자에 따라 의존성을 설치하세요.


npm

pnpm

yarn

$ cd my-granite-app
$ npm install
스캐폴딩 전체 예시
아래는 my-granite-app이라는 이름으로 새로운 앱을 스캐폴딩한 결과예요.

스캐폴딩을 마쳤다면 프로젝트 구조가 생성돼요.

환경 구성하기
ReactNative SDK를 이용해 번들 파일을 생성하고 출시하는 방법을 소개해요.

설치하기
앱인토스 미니앱을 개발하려면 @apps-in-toss/framework 패키지를 설치해야 해요. 사용하는 패키지 매니저에 따라 아래 명령어를 실행하세요.


npm

pnpm

yarn

$ npm install @apps-in-toss/framework
설정파일 구성하기
ait init 명령어로 앱 개발에 필요한 기본 환경을 구성할 수 있어요.

아래 명령어 중 사용하는 패키지 관리자에 맞는 명령어를 실행하세요.


npm

pnpm

yarn

 npx ait init
프레임워크를 선택하세요.

앱 이름(appName)을 입력하세요.

이 이름은 앱인토스 콘솔에서 앱을 만들 때 사용한 이름과 같아야 해요. 앱인토스 콘솔에서 앱 이름을 확인할 수 있어요.

모든 과정을 완료하면 프로젝트 루트에 granite.config.ts 파일이 생성돼요. 이 파일은 앱 설정을 관리하는 데 사용돼요.


granite.config.ts

import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  appName: "<app-name>",
  plugins: [
    appsInToss({
      brand: {
        displayName: "%%appName%%", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
        primaryColor: "#3182F6", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
        icon: null, // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
        bridgeColorMode: "basic",
      },
      permissions: [],
    }),
  ],
});
<app-name>: 앱인토스에서 만든 앱 이름이에요.
brand: 앱 브랜드와 관련된 구성이에요.
displayName: 브릿지 뷰에 표시할 앱 이름이에요.
icon: 앱 아이콘 이미지 주소예요. 사용자에게 앱 브랜드를 전달해요.
primaryColor: Toss 디자인 시스템(TDS) 컴포넌트에서 사용할 대표 색상이에요. RGB HEX 형식(eg. #3182F6)으로 지정해요.
bridgeColorMode: 브릿지 뷰의 배경 색상 유형이에요. 흰 배경인 basic 또는 검은 배경인 inverted 중 하나를 선택할 수 있어요.
permissions: 권한이 필요한 함수 앱 설정하기 문서를 참고해서 설정하세요.
TDS React Native 패키지 설치하기
@apps-in-toss/framework를 사용하려면 TDS React Native 패키지를 추가로 설치해야 해요. 자세한 내용은 React Native TDS를 참고해 주세요.

번들 파일 생성하기
번들 파일은 .ait 확장자를 가진 파일로, 빌드된 프로젝트를 패키징한 결과물이에요. 이를 생성하려면 아래 명령어를 실행하세요.


npm

pnpm

yarn

npm run build
위 명령어를 실행하면 프로젝트 루트 디렉터리에 <서비스명>.ait 파일이 생성돼요. 해당 파일은 앱을 출시할 때 사용해요.

앱 출시하기
앱을 출시하는 방법은 앱 출시하기문서를 참고하세요.

코드 확인해보기
프로젝트의 _app.tsx 파일에 다음과 같은 코드가 들어있을 거예요.


_app.tsx

import { AppsInToss } from '@apps-in-toss/framework';
import { PropsWithChildren } from 'react';
import { InitialProps } from '@granite-js/react-native';
import { context } from '../require.context';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return <>{children}</>;
}

export default AppsInToss.registerApp(AppContainer, { context });
스캐폴딩 된 코드 알아보기
스캐폴딩 명령어를 실행하면 다음과 같은 파일이 생성돼요.


/pages/index.tsx

import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const goToAboutPage = () => {
    navigation.navigate('/about');
  };

  return (
    <Container>
      <Text style={styles.title}>🎉 Welcome! 🎉</Text>
      <Text style={styles.subtitle}>
        This is a demo page for the <Text style={styles.brandText}>Granite</Text> Framework.
      </Text>
      <Text style={styles.description}>This page was created to showcase the features of the Granite.</Text>
      <TouchableOpacity style={styles.button} onPress={goToAboutPage}>
        <Text style={styles.buttonText}>Go to About Page</Text>
      </TouchableOpacity>
    </Container>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    color: '#0064FF',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 24,
    color: '#202632',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0064FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  codeContainer: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    width: '100%',
  },
  code: {
    color: 'white',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    fontSize: 14,
  },
});
파일 기반 라우팅 이해하기
Granite 개발 환경은 Next.js와 비슷한 파일 시스템 기반의 라우팅을 사용해요.

파일 기반 라우팅은 파일 구조에 따라 자동으로 경로(URL 또는 스킴)가 결정되는 시스템이에요. 예를 들어, pages라는 디렉토리에 detail.ts 파일이 있다면, 이 파일은 자동으로 /detail 경로로 연결돼요.

Granite 애플리케이션에서는 이 개념이 스킴과 연결돼요. 스킴은 특정 화면으로 연결되는 주소인데요. 예를 들어, pages/detail.ts라는 파일은 자동으로 intoss://my-granite-app/detail 이라는 스킴으로 접근할 수 있는 화면이에요. 모든 Granite 화면은 intoss:// 스킴으로 시작해요.


my-granite-app
└─ pages
    ├─ index.tsx       // intoss://my-granite-app
    ├─ detail.tsx      // intoss://my-granite-app/detail
    └─ item
        ├─ index.tsx    // intoss://my-granite-app/item
        └─ detail.tsx    // intoss://my-granite-app/item/detail
index.tsx 파일: intoss://my-granite-app
detail.tsx 파일: intoss://my-granite-app/detail
item/index.tsx 파일: intoss://my-granite-app/item
item/detail.tsx 파일: intoss://my-granite-app/item/detail

┌─ 모든 Granite 화면을 가리키는 스킴은
│  intoss:// 으로 시작해요
│
-------------
intoss://my-granite-app/detail
         ==============~~~~~~~
             │           └─ pages 하위에 있는 경로를 나타내요
             │
             └─ 서비스 이름을 나타내요
이렇게 개발자는 별도로 라우팅 설정을 하지 않아도, 파일을 추가하기만 하면 새로운 화면이 자동으로 설정돼요.

서버 실행하기
로컬 개발 서버 실행하기
이제 여러분만의 Granite 페이지를 만들 준비가 끝났어요. 🎉 다음으로 로컬에서 my-granite-app 서비스를 실행해 볼게요.

앱 실행 환경을 먼저 설정하세요.

iOS 환경설정
Android 환경설정
스캐폴딩된 프로젝트 디렉터리로 이동한 뒤, 선택한 패키지 매니저를 사용해 dev 스크립트를 실행하세요. 이렇게 하면 개발 서버가 시작돼요.


npm

pnpm

yarn

$ cd my-granite-app
$ npm run dev
명령어를 실행하면 아래와 같은 화면이 표시돼요.Metro 실행 예시

참고하세요

개발 서버 실행 중 too many open files 에러가 발생한다면, node_modules 디렉터리를 삭제한 뒤 다시 의존성을 설치해 보세요.


rm -rf node_modules
npm install  # 또는 yarn, pnpm에 맞게
실행 혹은 빌드시 '[Apps In Toss Plugin] 플러그인 옵션이 올바르지 않습니다' 에러가 발생한다면?

'[Apps In Toss Plugin] 플러그인 옵션이 올바르지 않습니다. granite.config.ts 구성을 확인해주세요.'
라는 메시지가 보인다면, granite.config.ts의 icon 설정을 확인해주세요.
아이콘을 아직 정하지 않았다면 ''(빈 문자열)로 비워둔 상태로도 테스트할 수 있어요.


...
displayName: 'test-app', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
primaryColor: '#3182F6', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
icon: '',// 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
...
미니앱 실행하기(시뮬레이터·실기기)
준비가 필요해요

미니앱은 샌드박스 앱을 통해서만 실행되기때문에 샌드박스 앱(테스트앱) 설치가 필수입니다.
개발 및 테스트를 위해 샌드박스앱을 설치해주세요.

iOS 시뮬레이터(샌드박스앱)에서 실행하기
앱인토스 샌드박스 앱을 실행해요.
샌드박스 앱에서 스킴을 실행해요. 예를 들어 서비스 이름이 kingtoss라면, intoss://kingtoss를 입력하고 "스키마 열기" 버튼을 눌러주세요.
Metro 서버가 실행 중이라면 시뮬레이터와 자동으로 연결돼요. 화면 상단에 Bundling {n}%...가 표시되면 연결이 성공한 거예요.
아래는 iOS 시뮬레이터에서 로컬 서버를 연결한 후 "Welcome!" 페이지를 표시하는 예시예요.

iOS 실기기에서 실행하기
서버 주소 입력하기
아이폰에서 앱인토스 샌드박스 앱을 실행하려면 로컬 서버와 같은 와이파이에 연결되어 있어야 해요. 아래 단계를 따라 설정하세요.

샌드박스 앱을 실행하면 "로컬 네트워크" 권한 요청 메시지가 표시돼요. 이때 "허용" 버튼을 눌러주세요.

샌드박스 앱에서 서버 주소를 입력하는 화면이 나타나요.

컴퓨터에서 로컬 서버 IP 주소를 확인하고, 해당 주소를 입력한 뒤 저장해주세요.

IP 주소는 한 번 저장하면 앱을 다시 실행해도 변경되지 않아요.
macOS를 사용하는 경우, 터미널에서 ipconfig getifaddr en0 명령어로 로컬 서버의 IP 주소를 확인할 수 있어요.
"스키마 열기" 버튼을 눌러주세요.

화면 상단에 Bundling {n}%... 텍스트가 표시되면 로컬 서버에 성공적으로 연결된 거예요.

Android 실기기 또는 에뮬레이터 연결하기
Android 실기기(휴대폰 또는 태블릿)를 컴퓨터와 USB로 연결하세요. (USB 연결 가이드)

adb 명령어를 사용해서 8081 포트와 5173포트를 연결하고 연결 상태를 확인해요.

8081 포트, 5173 포트 연결하기

기기가 하나만 연결되어 있다면 아래 명령어만 실행해도 돼요.


adb reverse tcp:8081 tcp:8081
adb reverse tcp:5173 tcp:5173
특정 기기를 연결하려면 -s 옵션과 디바이스 아이디를 추가해요.


adb -s {디바이스아이디} reverse tcp:8081 tcp:8081
# 예시: adb -s R3CX30039GZ reverse tcp:8081 tcp:8081
adb -s {디바이스아이디} reverse tcp:5173 tcp:5173
# 예시: adb -s R3CX30039GZ reverse tcp:5173 tcp:5173
연결 상태 확인하기

연결된 기기와 포트를 확인하려면 아래 명령어를 사용하세요.


adb reverse --list
# 연결된 경우 예시: UsbFfs tcp:8081 tcp:8081
특정 기기를 확인하려면 -s 옵션을 추가해요.


adb -s {디바이스아이디} reverse --list
# 예시: adb -s R3CX30039GZ reverse --list

# 연결된 경우 예시: UsbFfs tcp:8081 tcp:8081
앱인토스 샌드박스 앱에서 스킴을 실행하세요. 예를 들어, 서비스 이름이 kingtoss라면 intoss://kingtoss를 입력하고 실행 버튼을 누르세요.

Metro 서버가 실행 중이라면 실기기 또는 에뮬레이터와 자동으로 연결돼요. 화면 상단에 번들링 프로세스가 진행 중이면 연결이 완료된 거예요.

아래는 Android 시뮬레이터에서 로컬 서버를 연결한 후 "Welcome!" 페이지를 표시하는 예시예요.

자주 쓰는 adb 명령어(Android)
개발 중에 자주 쓰는 adb 명령어를 정리했어요.

연결 끊기

adb kill-server
8081 포트 연결하기

adb reverse tcp:8081 tcp:8081
adb reverse tcp:5173 tcp:5173
# 특정 기기 연결: adb -s {디바이스아이디} reverse tcp:8081 tcp:8081
연결 상태 확인하기

adb reverse --list
# 특정 기기 확인: adb -s {디바이스아이디} reverse --list
트러블슈팅
디버깅하기
1. 준비
React Native Debugger를 사용해서 JavaScript 디버깅을 하려면 Chrome 브라우저가 필요해요. 다음 링크로 브라우저를 다운로드 하세요.

Chrome 웹브라우저 다운로드 링크
2. 개발 서버 실행
Metro 개발 서버는 React Native 애플리케이션을 개발할 때 코드 번들링, 핫 리로딩, 자원 제공 등의 역할을 해주는 번들러예요. 쉽게 말해서, 앱이 실행될 수 있도록 JavaScript 코드를 준비하고 관리하는 도구라고 생각하면 돼요.

다음 명령어로 Metro 개발 서버를 실행해서 디버깅을 시작해 볼게요.


yarn dev
# 또는
yarn granite dev
Metro 개발 서버를 띄운 화면

3. 디버거 실행
개발 서버가 실행됐다면, 터미널에서 j 키를 눌러 React Native Debugger를 열 수 있어요. 다만, 아래와 같이 Metro와 테스트 기기 간의 연결이 이루어진 상태에서만 React Native Debugger가 열려요.

기기와 연결된 상태

탭 소개
Metro 개발 서버가 제공하는 디버깅 도구를 사용해서 편리하게 애플리케이션의 상태를 분석하고, 문제를 찾아 해결할 수 있어요. 각 탭에서는 모니터링하거나 조작할 수 있는 항목을 알아봐요.

디버거 탭 소개 이미지

Console: Console API를 통해 기록한 로그를 확인할 수 있어요. 또한, REPL(Read–Eval–Print Loop) 환경을 지원하기 때문에 코드를 입력하면 결과를 콘솔에서 확인할 수 있어요.

Source: 현재 실행 중인 코드를 보고 중단점을 추가할 수 있어요.

Network: 개발 서버에 연결된 서비스의 네트워크 활동을 확인할 수 있어요.

Memory: Memory Snapshot을 기록해서 Hermes 엔진의 메모리 사용 상황을 프로파일링할 수 있어요.

Profiler: 코드 실행 성능을 측정할 수 있는 도구예요.

기본 사용법
이제 Metro 개발 서버를 사용해서 React Native 애플리케이션에서 다양한 디버깅 기능을 활용하는 방법을 알아볼게요.

디버깅 공통
React Native 디버거를 사용하면 코드에서 발생하는 문제를 쉽게 찾고 해결할 수 있어요. 특히 유용한 기능은 Breakpoints에요. 이 기능을 사용하면 코드가 중단된 시점의 상태를 확인할 수 있어요. 가장 기본적인 기능은 다음과 같아요.

Resume: 일시 정지된 코드를 다시 실행해요.
Scope 정보: 현재 Scope에 접근 할 수 있는 변소와 그 값을 확인할 수 있어요.
Call Stack: 코드가 실행된 순서와 호출된 함수 목록, Call Stack을 확인할 수 있어요.
Breakpoints 사용 예시 이미지 1

일시정지된 시점에서 변수의 값을 바로 확인할 수도 있어요. 다음과 같이 변수 위로 마우스 커서를 올리면 돼요.

Breakpoints 사용 예시 이미지 2

debugger 키워드로 디버깅하기
또 다른 유용한 기능은 debugger 키워드예요. 이 키워드를 소스 코드에 추가하면 코드가 해당 지점에 도달했을 때 자동으로 중단되어 현재 상태를 살펴볼 수 있어요.

 코드 사용 예시 이미지

중단점으로 디버깅하기
중단점을 설정해서 특정 위치에서 코드 실행을 멈추는 기능도 사용할 수 있어요. 중단점을 추가하려면 커맨드(Command) + P 키를 눌러 파일 검색 창을 띄우고, 확인하고 싶은 파일명을 입력하세요.

중단점 추가 예시 이미지 1

파일을 열었다면, 중단점을 설정하고 싶은 위치를 클릭해서 추가할 수 있어요. 중단점에 도달했을 때 코드 실행이 멈추면 현재 상태를 확인할 수 있어요.

중단점 추가 예시 이미지 2

예외 상황 디버깅하기
코드에서 예외(에러)가 발생했을 때 자동으로 그 지점에서 일시 정지되도록 설정할 수 있어요. 이 기능을 사용하면 미리 예상하지 못한 에러와 그 원인을 쉽게 파악할 수 있죠.

이 기능은 Metro 디버거의 Source 탭에서 설정할 수 있어요. 우측 상단의 Breakpoints 섹션에서 "Pause on uncaught exceptions" 을 활성화하면 예기치 못한 예외 발생 시 코드가 자동으로 중단돼요. "Pause on caught exceptions" 을 활성화하면 모든 예외(핸들링 여부와 관계없이)에서 일시 정지할 수 있어요.

예외 상황 디버깅 설정 예시 이미지 1

예외 상황 디버깅 설정 예시 이미지 2

유의하세요

서비스 코드에서 심각한 예외가 발생해 서비스가 완전히 중단된 후에 예외 Breakpoints가 제대로 동작하지 않는 버그가 있어요.

임시 해결 방법은 개발 서버와 React Native Debugger를 재시작하는 거예요.

네트워크 활동 검사
React Native 애플리케이션의 네트워크 활동을 기록하고 확인할 수 있는 네트워크 인스펙터 기능을 사용해 볼게요.

네트워크 인스펙터를 사용하면 요청과 응답 데이터를 포함한 네트워크 활동을 다음과 같이 확인할 수 있어요. 이 도구를 사용하면 각 요청의 헤더와 응답 데이터를 상세히 분석할 수 있어요.

네트워크 활동 검사 예시 이미지

프로파일링
프로파일링 도구를 사용하면 React Native 애플리케이션의 메모리 사용량과 코드 실행 성능을 상세히 분석할 수 있어요. 이를 통해 성능 최적화와 메모리 누수 문제를 발견하고 해결할 수 있죠.

메모리
메모리 프로파일링 기능은 메모리 사용량을 분석하고, 메모리 누수를 탐지하는 데 유용해요. 이 도구를 사용해 앱이 메모리를 어떻게 관리하고 있는지 확인할 수 있어요.

먼저, 프로파일링 유형을 선택하세요.
"Take snapshot" 버튼을 눌러 스냅샷을 기록할 수 있어요.
기록된 스냅샷을 보며 메모리 사용 상태를 분석하고 필요한 정보를 찾아요.
메모리 프로파일링 예시 이미지 1

메모리 프로파일링 예시 이미지 2

성능 측정
성능 측정 도구를 사용하면 코드의 실행 성능을 분석할 수 있어요. 이 기능은 성능 최적화가 필요한 부분을 식별하고 개선하는 데 유용해요.

다음은 성능 측정 도구의 사용 예시에요. 이 도구를 사용해 기록을 시작하고, 실행된 코드의 성능을 평가할 수 있어요.

성능 측정 도구 사용 예시 1

성능 측정 도구 사용 예시 2

React DevTools로 디버깅하기
React DevTools는 React Native 애플리케이션의 컴포넌트 구조를 시각적으로 탐색하고 디버깅할 수 있는 도구예요. 디버깅 도구의 React DevTools에서 바로 사용할 수 있어요.

기기와 연결하기
React DevTools를 사용하려면 먼저 개발 중인 애플리케이션의 연결이 필요해요.

서비스가 실행되기 전이라면 개발 모드에서 React Native 서비스를 실행해 주세요. 서비스가 이미 실행 중이라면, 개발 모드 RN 뷰를 새로고침해야 해요. R 키를 눌러서 새로고침해주세요.

React DevTools 기기와 연결하기 1

다음과 같이 React DevTools 화면이 나타나면 연결이 완료된 거예요.

React DevTools 기기와 연결하기 2

안드로이드 기기를 사용한다면, adb reverse tcp:8097 tcp:8097 명령어를 입력해서 포트를 열어야 React DevTools가 정상적으로 동작해요. 만약 문제가 있다면 담당자에게 문의해주세요.

사용 팁
React DevTools에 있는 여러 유용한 기능을 효과적으로 사용하는 몇 가지 팁을 알려드릴게요.

요소 인스펙팅
특정 요소를 쉽게 찾고 확인할 수 있는 기능이에요. 요소 선택 버튼을 누른 뒤, 테스트 중인 기기에서 확인할 요소를 터치하면 React DevTools에서 해당 요소로 바로 이동해요.

인스펙팅 화면

Prop 변경하기
선택한 컴포넌트의 Prop(속성)을 확인하고, 실시간으로 변경할 수 있어요. 원하는 Prop을 더블 클릭한 뒤 값을 입력하면 바로 반영됩니다.

Prop 변경 사용 예시 이미지

Suspense 테스트하기
Suspense 요소의 대기 상태를 시뮬레이션할 수 있는 기능이에요. 타이머 아이콘을 눌러 Suspense 대기 상태를 테스트해볼 수 있어요.

Suspense 테스트 사용 예시 이미지

상세 정보 로깅하기
특정 요소의 세부 정보를 콘솔에서 확인할 수 있어요. 디버그 버튼을 누르면 선택한 요소의 세부 정보가 콘솔에 기록됩니다.

상세 정보 로깅 예시 이미지

번들 파일 생성하기
번들 파일은 .ait 확장자를 가진 파일로, 빌드된 프로젝트를 패키징한 결과물이에요. 이를 생성하려면 아래 명령어를 실행하세요.


npm

pnpm

yarn

npm run build
위 명령어를 실행하면 프로젝트 루트 디렉터리에 <서비스명>.ait 파일이 생성돼요.

무엇을 위해 생성하나요?

토스앱 실제 컨텍스트에서 테스트할 때 (일부 기능은 샌드박스앱이 아닌 토스앱 위에서만 동작해요)
검수 요청 제출 시 .ait 번들을 업로드해야 할 때
언제 필요하나요?

샌드박스 앱으로 개발을 마친 뒤, 토스앱 위에서 최종 동작을 확인하고 싶을 때
로그인/푸시/결제/딥링크 등 토스앱내에서만 동작하는 기능을 점검해야 할 때
기능 구현을 마무리하고 앱 검수 제출을 준비할 때
출시하기
출시하는 방법은 앱 출시하기문서를 참고하세요.

트러블슈팅
기타 다른 문제가 발생했다면, 다음을 시도해 보세요.

앱을 완전히 종료해요.
개발 서버를 중단하고 네트워크 인스펙터를 닫아요.
앱을 다시 시작하고 dev 스크립트를 실행해 개발 서버를 재실행해요.
이 절차로도 문제가 해결되지 않으면, 담당자에게 제보해 주세요.

Pager
Previous page
WebView
개발 구조 이해하기
앱인토스는 개발 편의를 위해 SDK·API를 제공해요.
SDK는 WebView와 React Native, 두 가지 방식으로 제공돼요.

이 문서에서는 앱인토스의 전체 개발 구조와 주요 설정 방법, 그리고 개발 시 반드시 알아야 할 유의사항을 함께 안내해요.

⚠️ 앱인토스 API를 사용하려면 mTLS 기반의 서버 간(Server-to-Server) 통신이 반드시 필요해요.
mTLS 인증서는 파트너사 서버와 앱인토스 서버 간 통신을 암호화하고 쌍방 신원 확인에 사용돼요.

다음 기능을 사용하려면 반드시 mTLS 인증서를 통한 통신이 필요해요.

토스 로그인
토스 페이
인앱 결제
기능성 푸시, 알림
프로모션(토스 포인트)




mTLS 인증서 발급 방법
서버 mTLS 인증서는 콘솔에서 직접 발급할 수 있어요.

1. 앱 선택하기
앱인토스 콘솔에 접속해 인증서를 발급받을 앱을 선택하고, 왼쪽 메뉴에서 mTLS 인증서 탭을 클릭하세요.
+ 발급받기 버튼을 누르면 돼요.



2. 인증서 발급·보관
mTLS 인증서가 발급되면 인증서와 키 파일을 다운로드할 수 있어요.

참고하세요

인증서와 키 파일은 유출되지 않도록 안전한 위치에 보관하세요.
인증서가 만료되기 전에 반드시 재발급해 주세요.


발급된 인증서는 콘솔에서 아래와 같이 확인할 수 있어요.



일반적으로 인증서는 하나만 사용하지만, 무중단 교체를 위해 두 개 이상 등록해 둘 수도 있어요.
그래서 콘솔에서는 인증서를 여러 개 등록/관리할 수 있게 구성했어요.

인증서로 요청 보내기 예제
앱인토스 서버에 요청하려면, 발급받은 인증서/키를 서버 애플리케이션에 설정하세요.
아래는 다양한 언어에서 mTLS를 사용해 요청을 보내는 예제예요.
(환경에 맞게 경로·알고리즘·TLS 버전 등을 조정하세요.)

개발 시 유의사항
앱인토스 환경에서 개발할 때 알아두면 좋은 주의사항이에요.

CORS 허용을 위한 Origin 등록
다음 도메인을 Origin 허용 목록에 등록해 주세요

https://<appName>.apps.tossmini.com : 실제 서비스 환경
https://<appName>.private-apps.tossmini.com : 콘솔 QR 테스트 환경
iOS의 서드파티 쿠키 차단 정책
iOS/iPadOS 13.4 이상에서는 서드파티 쿠키가 완전히 차단돼요.
앱인토스 도메인이 아닌 파트너사 도메인에서 쿠키 기반 로그인을 구현하면 정상 동작하지 않아요.

공식 안내: Full third-party cookie blocking
토큰 기반 등 대체 인증 방식을 적용해주세요.
App Transport Security (ATS)
샌드박스 환경에서는 HTTP 통신이 가능하지만, 서비스 환경에서는 HTTPS만 허용돼요.
HTTP 요청은 샌드박스 앱에서만 정상적으로 동작한다는 점을 유의하세요.

게임 리소스 분리 다운로드 권장
앱인토스 미니앱의 빌드 파일은 압축 해제 기준 100MB 이하만 허용돼요.
빌드 파일에 모든 리소스(이미지, 사운드, 영상 등)를 포함하면 용량을 초과할 수 있어요.
필수적으로 리소스 다운로드를 빌드 파일과 분리해야 합니다.

앱 실행에 꼭 필요한 최소 리소스만 빌드 파일에 포함하세요.
대용량 리소스는 외부 스토리지/CDN을 통해 다운로드하도록 구성해 주세요.
추가 리소스는 단계적 다운로드(Lazy Loading)를 적용하면 사용자 경험이 향상돼요.
외부 3자 로깅 솔루션 제한
정책상 외부 3자 로깅 솔루션 사용은 제한돼요. 현재 허용되는 솔루션은 아래와 같아요.
추가 제안이 있으면 채널톡으로 보내주세요. 내부 검토 후 안내드릴게요.

[ 시스템 로거 ]

Sentry
[ 분석용 로거 ]

Google Analytics
Unity Analytics
Amplitudes (단, Webview 에서만 사용 가능)
비게임 미니앱은 '피처' 단위로 노출돼요
미니앱 개발이 완료되면, 토스앱 내에서 피처(기능) 단위로 사용자에게 노출할 수 있어요.
하나의 서비스(앱)는 반드시 하나 이상의 피처를 가져야 하며, 최대 3개까지 등록할 수 있어요.

피처란?
토스 사용자에게 노출되는 기능 단위의 랜딩 페이지예요.

예:

오늘의 운동 루틴 보기 → Page A로 이동
식단 기록하기 → Page B로 이동
건강 리포트 확인하기 → Page C로 이동


피처 등록 위치
최초 등록: 콘솔 > 앱 출시 > 검토 요청하기 단계
이후 관리: 콘솔 > 앱 내 기능 탭에서 수정/추가
등록 시 피처 이름과 이동할 주소를 꼭 입력해주세요.

기본 스킴: intoss://{appName} (하위 경로: intoss://{appName}/path)
쿼리 파라미터 설정 가능
제공 기능 단위로 세분화하여 등록
최대 3개까지 등록 가능
기능 이름은 ~기록하기, ~보러 가기 등 ‘~하기’ 형태 권장(명사형도 가능)
개발 환경별 피처 구성
1. Webview
라우터 경로를 피처 주소와 매핑해요.


<Route path="/search" element={<SearchPage />} />
피처 주소는 intoss://{appName}/search로 입력하면 해당 페이지로 이동할 수 있어요.

2. React Native (Bedrock 기반)
Next.js 유사 파일 기반 라우팅을 사용해요.
/pages/search.tsx → /search 경로 매핑 → intoss://{appName}/search로 진입 시 렌더링
자세한 구조는 파일 기반 라우팅 이해하기 를 참고하세요.

자주 묻는 질문

`ERR_NETWORK` 에러가 발생해요.



인증서가 노출되면 어떻게 되나요?




인증서가 만료되면 어떻게 하나요?





인증서는 몇 개까지 발급할 수 있나요?




출시하기 QR코드에서는 정상 작동했는데, 토스앱에서 흰 화면이 노출돼요.



출시하기 QR코드에서는 정상 작동했는데, 토스앱에서 브릿지 뷰가 뜨고 이후 동작하지 않아요.



iOS에서 쿠키 기반 로그인이 안돼요.




앱 용량이 초과된다는 오류가 발생해요.



Pager
Previous page
TDS React Native
Android 환경설정
React Native 개발을 위해 필요한 Android 개발 환경을 준비하는 방법을 안내해요.

1. Android Studio 설치하기
React Native를 Android 환경에서 개발하려면 Android SDK와 adb(Android Debug Bridge)가 필요해요. 먼저, 아래 링크를 통해 Android Studio를 설치해 주세요.

Android Studio 설치 링크
2. Android SDK Command-line Tools 설치하기
Android SDK Command-line Tools를 설치하려면 아래 단계를 따라 주세요.

Android Studio를 열고 상단 메뉴에서 [Android Studio] > [Settings] 를 클릭하세요.
왼쪽 메뉴에서 [Languages & Frameworks] > [Android SDK] 를 선택하세요.
[SDK Tools] 탭에서 "Android SDK Command-line Tools"를 체크하고 "OK" 버튼을 눌러 설치하세요.이미지
3. 환경 변수 설정하기
adb를 사용하려면 환경 변수를 설정해야 해요.

macOS 환경에서 설정하기
사용 중인 셸의 초기화 스크립트에 다음과 같이 환경 변수를 추가하세요.


export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
Windows 환경에서 설정하기
실행 프롬프트 열기
Windows + R 키를 눌러 실행 창을 열고 SystemPropertiesAdvanced를 입력한 뒤 Enter 키를 눌러주세요.

실행 프롬프트

환경 변수 메뉴로 진입하기
[시스템 속성] 창에서 [고급] 탭을 선택하고, 하단의 [환경 변수] 버튼을 눌러주세요.

환경 변수

사용자 변수에서 Path 편집
사용자 변수 섹션에서 Path 변수를 선택한 뒤 [편집] 버튼을 눌러주세요.

INFO

만약 Path 변수가 없다면, [새로 만들기] 버튼을 눌러 새 변수를 생성하고 이름을 Path로 설정하면 돼요.

Path 환경 변수

Android SDK 경로 추가하기
편집 창에서 [새로 만들기] 버튼을 눌러 다음 경로를 추가하세요.

C:\Users\{사용자명}\AppData\Local\Android\sdk\platform-tools

여기서 {사용자명}은 현재 Windows 사용자 계정 이름으로 바꿔 입력해야 해요.

환경 변수 추가

환경 변수가 제대로 설정되었는지 확인하려면 아래 명령어를 실행하세요.


adb version
# Android Debug Bridge version 1.0.41
# Version 33.0.2-8557947
# Installed as /Users/heecheol.kim/Library/Android/sdk/platform-tools/adb
설치와 설정이 잘 되었는지 확인했다면, adb를 사용할 준비가 완료된 거예요.

더 자세한 내용은 Android 공식 문서 "환경 변수"를 참고하세요.

기기 연결하기
PC와 Android 기기를 연결하는 방법을 안내해요. 이 문서를 따라 adb(Android Debug Bridge)를 사용해서 기기와 통신할 수 있어요.

개발자 옵션 활성화 하기
INFO

기기 제조사에 따라 개발자 옵션을 활성화하는 방법이 다를 수 있어요. 사용 중인 기기의 제조사별 가이드는 인터넷 검색으로 확인하세요.

갤럭시 기기 기준

[설정] 앱 열기
[휴대전화 정보] > [소프트웨어 정보] 메뉴로 이동
[빌드 번호] 항목을 빠르게 여러번 탭하기
자세한 방법은 삼성 지원 홈페이지에서 확인할 수 있어요.

USB 디버깅 활성화 하기
개발자 옵션이 활성화되었다면, 이제 USB 디버깅 옵션을 활성화해 주세요.

[설정] 앱을 열어주세요.
[개발자 옵션] 메뉴로 이동해주세요.
[USB 디버깅] 항목을 활성화 해주세요.
개발자 옵션USB 디버깅 메뉴
PC와 기기 연결하기
USB 케이블로 PC와 기기를 연결한 뒤, 다음 명령어를 실행해 기기가 정상적으로 연결되었는지 확인해 주세요.


adb devices
# * daemon not running; starting now at tcp:5037
# * daemon started successfully
# List of devices attached
# R3CTA0BMCPK	device
제대로 연결되었다면 "List of devices attached" 아래에 기기의 디바이스 아이디가 표시돼요. 다음 예시에서는 R3CTA0BMCPK가 디바이스 아이디예요.

에뮬레이터 설정하기
Android 에뮬레이터는 실제 Android 기기처럼 동작하며, React Native 화면을 테스트할 수 있는 유용한 도구예요. 하지만 디버깅과 QA 작업은 가능한 실기기에서 진행하는 것을 권장해요.

1. Android Studio에서 에뮬레이터 추가 설정 화면 열기
Android Studio를 실행한 후 오른쪽 메뉴에서 [Virtual Device Manager] > [+ 버튼]을 순서대로 클릭해 주세요.

안드로이드 스튜디오로 에뮬레이터 설정 화면 열기

2. 에뮬레이터 추가하기
테스트 환경은 실제 사용자 환경과 비슷하게 설정하는 게 좋아요. 아래는 "갤럭시 S23"과 비슷한 에뮬레이터를 만드는 방법이에요.

갤럭시 S23 사양

디스플레이: 6.1인치
운영체제: API 33부터 지원 (예시에서는 API 35 사용)
안드로이드 스튜디오로 에뮬레이터 설정

위 영상처럼 [Pixel 8a] > [VanilaIceCream (API 35)] > [AVD Name 설정] 순으로 진행하면 에뮬레이터 설정을 완료할 수 있어요.

에뮬레이터 실행하기
추가한 에뮬레이터 목록을 확인할 수 있고, 원하는 에뮬레이터를 바로 실행할 수 있어요.

1. Android Studio에서 에뮬레이터 목록 확인하기
Android Studio를 실행한 후 오른쪽 메뉴에서 [Virtual Device Manager]를 클릭해 주세요.

2. 에뮬레이터 실행하기
실행하고자 하는 에뮬레이터를 확인한 뒤, 재생 버튼을 눌러 실행할 수 있어요.

에뮬레이터 실행하기

앱인토스 샌드박스 앱 다운로드 받기
실제 기기와 에뮬레이터에서 같은 APK 파일을 사용해요.

앱인토스 샌드박스 앱 다운로드
앱인토스 샌드박스 앱 설치하기
앱인토스 샌드박스 앱은 아래의 방법들을 활용해서 기기에 설치할 수 있어요.

1. Android Studio를 활용하기
Android Stuido를 활용해서 실기기에 앱인토스 샌드박스 앱을 설치할 수 있어요.

Android Studio에서 오른쪽 메뉴의 [Device Manager]에 연결된 기기가 표시되는지 확인해요.
안드로이드 실행가능한 기기 목록 보여주기

연결된 기기의 오른쪽에 있는 [Start Mirroring] 버튼을 클릭하면 기기 화면을 Android Studio에 표시할 수 있어요.
안드로이드 실행가능한 기기 목록 보여주기

다운로드한 앱인토스 샌드박스 앱 APK 파일을 끌고 와서 기기에 설치할 수 있어요.
안드로이드 스튜디오로 앱 설치

2. adb 커맨드로 설치하기
터미널에서 APK 파일이 있는 폴더로 이동해요.
아래 명령어로 APK 파일을 설치해요.

adb install -r -t {파일이름}
예를 들어, 파일 이름이 apssintoss-debug.apk라면 아래 명령어를 사용해요.


adb install -r -t apssintoss-debug.apk
adb로 앱인토스 샌드박스 앱 다운로드

Pager
Previous page
개발 구조 이해하기
테스트앱(샌드박스)
앱인토스는 개발용 토스앱을 제공하지 않아요.
대신 전용 샌드박스 앱으로 개발·테스트 환경을 구성할 수 있어요.

반드시 확인!

실서비스 런칭 전, 샌드박스 앱에서 사전 테스트를 완료해 주세요.
샌드박스 검증 없이 진행한 기능은 런칭/검수 단계에서 반려될 수 있어요.

샌드박스 앱이란?
앱인토스는 토스앱 안에서 파트너사의 서비스를 앱인앱 형태로 제공해요.
별도의 개발용 토스앱 대신, 개발·QA 전용 ‘샌드박스 앱’을 제공해 연동 테스트를 지원해요.
샌드박스 앱을 설치해 로그인 → 앱 선택 → 스킴 접속 순서로 바로 개발을 시작하세요.

구분	빌드번호	샌드박스 앱 다운로드
Android	2025-09-29/1615	다운로드
iOS	2025-09-15/1556	다운로드
iOS(실기기)	2025-09-11/1653	
참고하세요

App Transport Security(ATS) 위반 방지를 위해 샌드박스 앱에서는 http 통신을 허용해요.
라이브 환경은 https만 지원하므로, http 기반 기능은 샌드박스에서만 정상 동작해요.

최신 버전 샌드박스앱 이용가능 OS
이용 가능한 OS 최소 버전을 안내드려요.
OS 자체의 개선 사항을 적용하여 앱의 사용성을 개선함으로써 보다 안전하고 편리한 서비스를 제공하고 있어요.

구분	버전
Android	Android 7
iOS	iOS 16
샌드박스 앱 사용하기
1. 최신 버전 설치
샌드박스 앱은 수시로 업데이트돼요. 오류가 보이면 최신 버전으로 업데이트해 주세요.

2. 개발자 로그인
좌측 상단 로그인을 눌러, 콘솔에서 사용하는 토스 비즈니스 계정으로 로그인하세요.
토스 비즈니스 가입이 필요하다면 콘솔에서 개발 준비하기를 확인해 주세요.

샌드박스 로그인
3. 앱 선택
소속된 워크스페이스의 앱 목록이 노출돼요. 테스트할 앱을 선택하세요.

Checklist 0
4. 토스 인증
콘솔에 등록한 토스 계정으로 본인 인증을 진행해요.
해당 계정의 토스앱이 설치된 스마트폰에서 푸시를 열어 인증을 완료해 주세요.

Checklist 0Checklist 0
5. 앱 스킴(URL)로 접속
접속할 스킴을 입력하면 미니앱이 실행돼요.


intoss://{appName}
Checklist 0
샌드박스에서 테스트 가능한 기능
샌드박스에서 바로 확인 가능한 항목이에요.
샌드박스에서 미지원인 경우에는 콘솔 ‘출시하기’의 QR 코드로 토스앱에서 테스트해 주세요.

기능	테스트 가능 여부
토스 로그인	가능
분석	불가능
게임 프로필 & 리더보드	불가능
공유 리워드	불가능
인앱 광고	불가능
토스 페이	가능
인앱 결제	가능 (단, mock 데이터 내려감)
가로 버전 게임	불가능
내비게이션 바의 공유하기	불가능
자주 묻는 질문

샌드박스에서 테스트 진행이 잘 안돼요.



토스 로그인 테스트를 진행하는데 잘 안돼요.



토스 로그인 약관 화면이 뜨지 않아요.



샌드박스앱이 안돼요.

Pager
Previous page토스앱
샌드박스 앱에서 테스트를 마쳤다면, 콘솔에 앱 번들(.ait) 을 업로드하고 QR코드로 토스앱에서 최종 테스트한 뒤 출시할 수 있어요.

이미지

1. 앱 번들 업로드
먼저 앱 번들(.ait) 을 업로드하세요.
업로드가 완료되면 워크스페이스 멤버만 접근 가능한 테스트 스킴/QR을 생성할 수 있어요.

접속 방법: 워크스페이스 선택 → 앱 선택 → 좌측 메뉴에서 ‘앱 출시’ 선택
이미지

이미지

💡 앱 번들 정책

앱 번들은 압축 해제 기준 100MB 이하만 허용돼요.
빌드 파일에 모든 리소스(이미지, 사운드, 영상 등)을 포함하면 용량을 초과할 수 있어요.
리소스 다운로드를 빌드 파일과 반드시 분리해야 해요.

앱 실행에 꼭 필요한 최소 리소스만 빌드 파일에 포함하세요.
대용량 리소스는 외부 스토리지/CDN을 통해 다운로드하도록 구성해 주세요.
추가 리소스는 단계적 다운로드(Lazy Loading)을 적용하면 사용자 경험이 향상돼요.
2. 테스트 진행하기
앱 번들을 올린 후 '테스트하기' 버튼을 눌러 테스트를 진행해 주세요.

이미지

이미지

QR 코드를 카메라로 스캔하면 테스트 토스앱이 실행돼요.
워크스페이스 멤버 전체에게 푸시 메시지를 보내 테스트를 유도할 수도 있어요.
단, 토스앱에 로그인된 만 19세 이상만 테스트할 수 있어요.

앱 출시 전 테스트 방법
intoss:// 스킴은 앱이 출시된 이후에만 접근할 수 있어요.
앱 출시 전에 테스트를 하려면, 아래 방법으로 진행하세요.

업로드 후 생성된 QR 코드(앱 스킴) 를 통해 deploymentId를 확인해요.
deploymentId는 앱 번들을 업로드할 때마다 새로 발급돼요.

예시 :


intoss-private://intossbench?_deploymentId=0198c10b-68c3-7d2b-a0ab-2c9626b475ec
아래 예시를 참고해 테스트를 진행해요.
하위 path를 적용한 경우 :

intoss-private://intossbench/path/pathpath?_deploymentId=0198c10b-68c3-7d2b-a0ab-2c9626b475ec
쿼리 파라미터를 적용한 경우 :

intoss-private://intossbench?_deploymentId=0198c10b-68c3-7d2b-a0ab-2c9626b475ec&queryParams=%7B%22categoryKey%22%3A%22
3. 검토 요청하기
테스트를 진행했다면 ‘검토 요청하기’ 버튼을 눌러 주세요.
검토는 영업일 3일 소요돼요.

참고하세요

테스트를 1회 이상 완료해야 검토 요청하기 버튼이 활성화돼요.

검토가 반려된 경우
'반려사유 보기' 버튼을 눌러 사유를 확인한 뒤, 번들을 새로 등록해 다시 검토를 요청해 주세요.

이미지

4. 출시하기
번들이 승인되면 '출시하기' 버튼을 눌러 앱을 유저에게 공개해 보세요.

이미지

자주 묻는 질문

토스앱에서 미니앱이 열리지 않아요.


"잠시 문제가 생겼어요" 문구가 노출되고 있어요.


Pager
Previous page앱 내 기능 콘솔 가이드
앱 내 기능은 사용자가 검색이나 미니홈 화면에서 쉽게 찾아서 특정 기능(서비스)으로 바로 접속할 수 있는 기능이에요.

예) ‘식단 기록하기’ → 눌렀을 때 해당 서비스의 홈 화면을 거치지 않고 바로 식단을 기록하는 화면으로 이동할 수 있어요.
💡꼭 확인해 주세요

앱 내 기능은 비게임 앱은 필수로 1개 이상 설정해 주세요.
앱 내 기능의 검토는 영업일 기준 1~2일 소요될 수 있어요.


앱 내 기능 최초 등록하기 (신규 출시하는 앱)
미니앱을 최초로 출시하는 경우에는 앱을 출시할 때 앱 내 기능을 함께 등록할 수 있어요.
접속방법 : 앱인토스 콘솔 → 워크스페이스 선택 → 미니앱 선택 → 좌측 메뉴 ‘앱 출시’→ 미니앱 선택 → 좌측 메뉴 ‘앱 출시’ → ‘+ 등록하기 ‘ → ait 번들 업로드 후 입력 가능
1. 앱 출시 메뉴에서 ‘등록하기’ 를 눌러서 번들을 등록해 주세요.


2. 빌드한 ait 파일을 업로드 해주세요.


3. 출시하기 전에 앱 내 기능을 함께 등록해 주세요.


사용자가 바로 접속 할 수 있는 기능의 이름과 이동할 intoss:///pages 를 입력해 주세요.
토스 UX 라이팅을 기반으로 앱 내 기능은 ‘~하기’ 또는 ‘명사형’ 으로 작성해 주세요.
예) ‘송금 내역 확인하기’, ‘해외 송금하기’, ‘여행 예약 내역 확인하기’ 등
미니앱 서비스의 기능이 드러나게 작성해 주세요.
‘예약 확인하기’, ‘내역 확인’, ‘보러가기’, ‘시청하기’ 등으로만 작성할 경우 무슨 서비스의 기능인지 사용자가 알기 어려워요.
미니앱 출시 검토와 함께 앱 내 기능 검토가 진행돼요.
실제 미니앱이 출시 되었을 때, 설정한 앱 내 기능이 정상적으로 접속이 되는지 꼭 확인해 주세요.
4. 검토 결과는 ‘앱 내 기능’ 탭에서 확인할 수 있어요.


앱 내 기능 등록 및 수정하기 (이미 출시된 앱)
미니앱을 이미 출시한 경우라면 ‘앱 내 기능’ 탭에서 앱 내 기능만 따로 등록/수정을 할 수 있어요.
접속방법 : 앱인토스 콘솔 → 워크스페이스 선택 → 미니앱 선택 → 좌측 메뉴 ‘앱 출시’→ 미니앱 선택 → 좌측 메뉴 ‘앱 출시’ → ‘앱 내 기능’ 탭 선택
앱 내 기능만 따로 추가/수정하는 경우는 앱 내 기능만 검토하기 때문에 영업일 기준 1~2일이 소요 될수 있어요.
현재 운영 중인 미니앱에서도 새롭게 추가하거나 수정하는 경우, 앱 내 기능이 정상적으로 접속이 되는지 꼭 확인해 주세요.
1. [수정하기] 버튼을 눌러 앱 내 기능을 수정할 수 있어요.


2. 검토 결과는 ‘앱 내 기능’ 탭에서 확인할 수 있어요.




Pager
Previous page모니터링
앱에 Sentry를 연동하면 JavaScript에서 발생한 오류를 감지하고 모니터링할 수 있어요. 앱의 안정성을 높이고, 사용자에게 더 나은 경험을 제공할 수 있어요.

1. Sentry 초기 설정하기
Sentry 공식 가이드를 참고해서 앱에서 초기화 코드를 추가해야 해요.

네이티브 기능은 사용할 수 없어요

앱인토스 환경에서는 JavaScript에서 발생한 오류만 추적할 수 있어요. enableNative 옵션을 false로 설정해야해요.


import * as Sentry from '@sentry/react-native';

Sentry.init({
  // ...
  enableNative: false,
});
2. Sentry 플러그인 설치하기
프로젝트 루트 디렉터리에서 아래 명령어 중 사용하는 패키지 관리자에 맞는 명령어를 실행해서 플러그인을 설치하세요.


npm

pnpm

yarn

npm install @granite-js/plugin-sentry
3. 플러그인 구성하기
설치한 @granite-js/plugin-sentry를 granite.config.ts 파일의 plugins 항목에 추가하세요. useClient 옵션은 반드시 false로 설정해야 해요.

useClient 옵션을 false로 설정해야하는 이유

useClient를 false로 설정하면, 앱을 빌드할 때 Sentry에 소스맵이 자동으로 업로드되지 않아요.
앱인토스 환경에서는 빌드 후에 수동으로 소스맵을 업로드해야 하기 때문에, 이 옵션을 꺼야 해요.


import { defineConfig } from '@granite-js/react-native/config';
import { sentry } from '@granite-js/plugin-sentry'; 
import { appsInToss } from '@apps-in-toss/framework/plugins';

export default defineConfig({
  // ...,
  plugins: [
    sentry({ useClient: false }), 
    appsInToss({
      // ...
    }),
  ],
});
4. 앱 출시하기
앱을 출시하는 방법은 앱 출시하기문서를 참고하세요.

5. 센트리에 소스맵 배포하기
출시한 앱의 오류를 정확히 추적하려면 소스맵을 Sentry에 업로드해야 해요.

아래 명령어를 실행하면 소스맵이 업로드돼요.

참고하세요

명령어 실행 시 입력해야 할 값은 다음과 같아요.

<API_KEY>: 앱인토스 콘솔에서 발급받은 API 키예요.
<APP_NAME>: 센트리에 등록된 서비스 이름이에요.
<DEPLOYMENT_ID>: 앱을 배포할 때 사용한 배포 ID예요.

npm

pnpm

yarn

npx ait sentry upload-sourcemap \
  --api-key <API_KEY> \
  --app-name <APP_NAME> \
  --deployment-id <DEPLOYMENT_ID>
명령어 실행 후 Sentry의 조직(Org), 프로젝트(Project), 인증 토큰을 입력하라는 메시지가 나오면 알맞게 입력하세요. 입력이 완료되면 지정한 서비스의 소스맵이 Sentry에 업로드돼요.

Pager
Previous page이해하기
앱인토스에서 토스 회원을 한 번에 연동해 보세요.
동의 한 번으로 가입부터 로그인·정보 제공까지 이어져, 토스 회원 연동을 쉽게 할 수 있어요.

토스 로그인이 무엇인가요?
토스 계정으로 빠르고 안전하게 로그인할 수 있는 기능이에요.
로그인 시 사용자에게 표시될 동의 항목을 설정할 수 있어요.
그리고 앱인토스 서비스를 운영하기 위한 약관/동의문과 연결 끊기 콜백 정보를 등록할 수 있어요.



토스 로그인을 사용하면 무엇이 좋은가요?
별도 폼 작성 없이 바로 가입·로그인되어 매끄러운 회원가입 경험을 만들 수 있어요.
토스에서 직접 제공하는 신뢰도 높은 사용자 정보를 제공해요.
재방문 시 자동/원클릭 로그인을 할 수 있어요.
앱 재설치나 기기 변경에도 같은 사용자로 매칭되어 CS 부담이 줄어들어요.
참고해 주세요
아래 기능을 사용하기 위해서 토스 로그인을 필수로 연동해야 해요.
기능성 푸시, 알림
프로모션 (토스 로그인)
토스페이
Pager
Previous page콘솔 가이드
토스 로그인을 원활히 사용하려면 콘솔에서 계약 → 설정 순서로 진행해 주세요.

1. 약관 동의
토스 로그인 사용을 위해서는 약관에 동의해야 해요.
약관동의는 앱인토스 콘솔에서 진행이 가능하며, 대표관리자로 지정된 분의 계정에서만 가능해요.

약관 동의 방법
앱인토스 콘솔 접속 → 대표 관리자 계정 로그인 → 워크스페이스 선택 → 미니앱 선택 → 좌측 메뉴 중 ‘토스 로그인’ 선택 후 ‘약관 확인하기’ 를 클릭 하여 아래 화면에서 약관 동의 진행


2. 설정하기
로그인 연동을 위해 콘솔에서 사전 설정을 완료해 주세요.
입력한 정보를 기반으로 사용자 약관 동의 화면이 자동으로 구성됩니다.



① 연동할 서비스 : 기존 로그인과 연동하기
이미 토스 로그인을 사용 중인 서비스가 있을 경우 노출되는 영역이에요.
기존 서비스의 회원 식별자(userKey)를 앱인토스 토스 로그인과 동일하게 설정할 수 있어요.
목록에서 서비스 이름을 선택하면, 선택한 서비스의 userKey 값이 동일하게 매핑돼요.

회원을 관리해보세요

토스 로그인을 연동하면 회원 정보를 쉽게 조회할 수 있어요.
사용자 정보 받기 API를 통해 사용자 식별자 userKey를 전달받을 수 있으며, userKey는 회원별 유니크한 값으로 통합 회원 관리에 유용해요.
단, 미니앱(서비스)마다 userKey는 다를 수 있어요.

② 동의 항목 : 사용자 권한 범위 설정
토스 로그인을 통해 수집할 사용자 권한(스코프) 을 선택해 주세요.

꼭 확인해 주세요

이름, 이메일, 성별 외의 항목을 선택한 경우, 연결 끊기 콜백 정보를 반드시 입력해야 해요.

항목	설명
이름 (USER_NAME)	사용자의 이름이에요.
이메일 (USER_EMAIL)	사용자의 이메일이에요. (토스 가입 시 필수가 아니어서 값이 없을 수 있고, 이 경우 null로 전달돼요.)
성별 (USER_GENDER)	사용자의 성별이에요.
생일 (USER_BIRTHDAY)	사용자의 생년월일이에요.
국적 (USER_NATIONALITY)	사용자의 국적이에요.
전화번호 (USER_PHONE)	사용자의 전화번호예요.
CI (USER_CI)	사용자를 식별하는 고유한 KEY 값이에요. (Connection Information)
CI란?

CI(Connection Information)는 본인인증 기관에서 발급하는 고유 식별값이에요.
동일한 사용자가 여러 서비스에 가입하더라도, 같은 본인으로 식별할 수 있도록 생성되는 불변값이에요.
CI는 사용자 실명 인증이 필요한 서비스에서 중복가입 방지나 본인 식별 목적으로 자주 활용돼요.
개인정보보호법상 개인식별정보(PII) 에 해당하므로, 저장하거나 사용할 때 반드시 암호화 및 최소 수집 원칙을 지켜야 해요.

③ 약관 등록
주의해 주세요

이 영역은 법적 요건을 충족해야 하는 부분이에요.
서비스 성격에 따라 내용이 달라질 수 있으니 최신 법령과 가이드라인을 확인하고, 법률 자문을 받는 것을 권장해요.

앱인토스에서 서비스를 운영하려면 약관을 등록해야 해요.
토스 로그인 필수 약관(서비스 약관 / 개인정보 제3자 제공 동의) 은 자동으로 포함되며,
파트너사 서비스 약관 / 개인정보 수집·이용 동의 / 마케팅 정보 수신 동의(선택) 등은 직접 등록해야 해요.
서비스 목적에 맞는 정확한 약관 링크를 첨부해 주세요.

약관 유형은 기본 제공 예시 중에서 선택하거나 직접 입력할 수 있어요.
약관을 구분해서 관리하고 싶다면 직접 입력하는 걸 추천드려요.

등록 가능한 약관 예시

(1) 서비스 이용약관: 권리·의무, 책임 범위, 중단/종료, 분쟁 해결, 약관 변경 고지, (유료 시) 결제/환불 규정
(2) 개인정보 수집·이용 동의: 수집 항목, 이용 목적, 보유·이용 기간, 동의 거부 시 불이익
(3) 마케팅 정보 수신 동의(선택): 수집 항목, 이용 목적, 보유 기간, 거부 시 불이익, 전자적 전송매체 광고 수신 동의
(4) 야간 혜택 수신 동의(선택): 야간(21:00~08:00) 발송 여부 명시
모든 약관 링크가 정확히 연결되고, 화면에 명확하게 노출되는지 확인해 주세요.

④ 연결 끊기 콜백 정보
사용자가 토스앱에서 로그인 연결을 해제하면, 등록한 콜백 URL로 이벤트를 받을 수 있어요.

참고하세요

사용자가 연결 해제를 하면 토스는 동의 약관·로그인 정보를 모두 삭제해요.
서비스에서도 세션이나 토큰 정리 등 후처리를 꼭 해 주세요.

또한, 사용자가 토스앱에서 로그인 연결을 해제하면 서비스에서도 자동 로그아웃 처리 또는 재로그인 요청 안내를 제공하는 걸 권장해요.
예를 들어, "토스 연결이 해제되어 로그인이 필요합니다." 같은 문구를 노출해 주세요.

항목	설명
콜백 URL	사용자가 로그인연결을 해제했을 때 호출할 URL이에요.
HTTP 메서드	GET 또는 POST 중 하나를 선택해 주세요.
Basic Auth 헤더	호출 시 base64로 인코딩돼요. 디코딩 후 콘솔에 입력한 값과 일치하는지 검증해 주세요.
연결 끊기 이벤트 경로
사용자가 토스앱에서 로그인 연결을 해제하는 경로는 총 3가지예요.
콜백 요청 시 referrer값으로 구분할 수 있어요.

referrer	설명
UNLINK	사용자가 앱에서 직접 연결을 끊었을 때 호출돼요.
미니앱에서는 이 이벤트를 받으면 로그아웃 처리를 해 주세요.
(경로: 토스 앱 > 설정 > 인증 및 보안 > 토스로 로그인한 서비스 > '연결 끊기')
WITHDRAWAL_TERMS	사용자가 로그인 서비스 약관을 철회할 때 호출돼요.
(경로: 토스 앱 > 설정 > 법적 정보 및 기타 > 약관 및 개인정보 처리 동의 > '동의 철회하기')
WITHDRAWAL_TOSS	사용자가 토스 회원을 탈퇴할 때 호출돼요.
복호화 키 확인하기


토스 로그인 정보 등록이 완료되면 복호화 키를 확인할 수 있어요.
이 키는 토스 로그인 응답 데이터를 복호화할 때 사용돼요.
‘이메일로 복호화 키 받기’ 버튼을 눌러 안전하게 받아보세요.

유의사항

복호화 키는 민감한 보안 정보예요.

절대 외부에 노출하지 마세요.
안전한 내부 비밀 저장소(Secret Manager 등)에 보관해 주세요.
재발급이 필요한 경우, 채널톡으로 문의해 주세요.
Pager
Previous page개발하기


BaseURL

https://apps-in-toss-api.toss.im

1. 인가 코드 받기
SDK를 통해 연동해주세요.

사용자의 인증을 요청하고, 사용자가 인증에 성공하면 인가 코드를 메소드 응답으로 전달드려요.
appLogin 함수를 사용해서 인가 코드(authorizationCode)와 referrer를 받을 수 있어요.
appLogin를 확인해 주세요.

샌드박스앱에서는 referrer 가 sandbox가 반환돼요
토스앱에서는 referrer 가 DEFAULT 가 반환돼요
참고하세요

인가코드의 유효시간은 10분입니다.


토스 로그인을 처음 진행할 때
appLogin 함수를 호출하면 토스 로그인 창이 열리고, 앱인토스 콘솔에서 등록한 약관 동의 화면이 노출돼요.
사용자가 필수 약관에 동의하면 인가 코드가 반환돼요.

토스 로그인을 이미 진행했을 때
appLogin 함수를 호출하면 별도의 로그인 창 없이 바로 인가 코드가 반환돼요.


2. AccessToken 받기
사용자 정보 조회 API 호출을 위한 접근 토큰을 발급해요.

Content-Type: application/json
Method: POST
URL: /api-partner/v1/apps-in-toss/user/oauth2/generate-token
참고하세요

AccessToken의 유효시간은 1시간이에요.


요청

이름	타입	필수값 여부	설명
authorizationCode	string	Y	인가코드
referrer	string	Y	referrer
성공 응답

이름	타입	필수값 여부	설명
tokenType	string	Y	bearer 로 고정
accessToken	string	Y	accessToken
refreshToken	string	Y	refreshToken
expiresIn	string	Y	만료시간(초)
scope	string	Y	인가된 scope(구분)

{
   "resultType":"SUCCESS",
   "success":{
		    "accessToken":"eyJraWQiOiJjZXJ0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJtMHVmMmhaUmpJTnNEQTdLNHVuVHhMb3IwcWNSa2JNPSIsImF1ZCI6IjNlenQ2ZTF0aDg2b2RheTlwOWN1eTg0dTRvdm5nNnNzIiwibmJmIjoxNzE4MjU0ODM2LCJzY29wZSI6WyJ1c2VyX2NpIiwidXNlcl9iaXJ0aGRheSIsInVzZXJfbmF0aW9uYWxpdHkiLCJ1c2VyX25hbWUiLCJ1c2VyX3Bob25lIiwidXNlcl9nZW5kZXIiXSwiaXNzIjoiaHR0cHM6Ly9jZXJ0LnRvc3MuaW0iLCJleHAiOjE3MTgyNTg0MzYsImlhdCI6MTcxODI1NDgzNiwianRpIjoiMTJkYjYwZjYtMjEzYS00NWQ3LTllOTItODBjMzBdseY2JkMGQ3In0.W1cjoeMN8pd3Jqgh6h8YzSVQ1PUNldulJJgy6bgH1AoDbv5xFTlBLzz9Slb_u52zUpyZbhglwblQmNJs7GT6-us7XtfxSGxTUY3ORqIhF_PPGQ6soi_Qgsi-hmX165CCAilf8cltSTTuTt8xOiEbLuSTY-cecxo7SkPUonQ_0v4_Ik0kwOiOBuYZyuch3KmlYQZTqsJmxlwJAPB8M9tZTtDpLOv9MEPU35YS7CZyN0l7lwn1EKrDHJdzA5CnstqEdz2I0eREmMgZoG9mSEybgD4NtPmVJos6AJerUGgSmzP_TwwlybVATuGpnAUmH1idaZJ-MHZJhUhR82z4zTn3bw",
		    "refreshToken":"xNEYPASwWw0n1AxZUHU9KeGj8BitDyYo4wi8rpfkUcJwByVxpAdUzwtIaWGVL6vHdrXLCxIlHAQRPF9hHnFleTsHkqUXzc-_78sD_r1Uh5Ff9UCYfArx8LTn1Vk99dDb",
		    "scope":"user_ci user_birthday user_nationality user_name user_phone user_gender",
		    "tokenType":"Bearer",
		    "expiresIn":3599
    }
}

실패 응답
인가 코드가 만료되었거나 동일한 인가 코드로 AccessToken 을 중복으로 요청할 경우


{
    "error":"invalid_grant"
}

{
    "resultType":"FAIL",
    "error":{
        "errorCode":"INTERNAL_ERROR",
        "reason":"요청을 처리하는 도중에 문제가 발생했습니다."
    }
}

3. AccessToken 재발급 받기
사용자 정보 조회 API를 호출하기 위한 접근 토큰을 재발급해요.

Content-type : application/json
Method : POST
URL : /api-partner/v1/apps-in-toss/user/oauth2/refresh-token
참고하세요

refreshToken 유효시간은 14일이에요.


요청

이름	타입	필수값 여부	설명
refreshToken	string	Y	발급받은 RefreshToken
성공 응답

이름	타입	필수값 여부	설명
tokenType	string	Y	bearer 로 고정
accessToken	string	Y	accessToken
refreshToken	string	Y	refreshToken
expiresIn	string	Y	만료시간(초)
scope	string	Y	인가된 scope(구분)
실패 응답

이름	타입	필수값 여부	설명
errorCode	string	Y	에러 코드
reason	string	Y	에러 메시지

4. 사용자 정보 받기
사용자 정보를 조회해요.
DI는 null로 내려오며, 횟수 제한 없이 호출할 수 있어요.
개인정보 보호를 위해 모든 개인정보는 암호화된 형태로 제공돼요.

Content-type : application/json
Method : GET
URL : /api-partner/v1/apps-in-toss/user/oauth2/login-me

요청 헤더

이름	타입	필수값 여부	설명
Authorization	string	Y	AccessToken으로 인증 요청
Authorization: Bearer ${AccessToken}
성공 응답

이름	타입	필수값 여부	암호화 여부	설명
userKey	number	Y	N	사용자 식별자
scope	string	Y	N	인가된 scope(구분)
agreedTerms	list	Y	N	사용자가 동의한 약관 목록
policy	string	Y	N	OAuth 로그인 연동 동선 구분 = Login으로 값 고정 필요
ci	string	N	Y	사용자 CI
name	string	N	Y	사용자 이름
phone	string	N	Y	사용자 휴대전화번호
gender	string	N	Y	사용자 성별(MALE/FEMALE)
nationality	string	N	Y	사용자 내/외국인 여부(LOCAL/FOREIGNER)
birthday	string	N	Y	사용자 생년월일(yyyyMMdd)
email	string	N	Y	사용자 이메일(점유인증 하지 않은 이메일 정보)

{
    "resultType":"SUCCESS",
    "success":{
        "userKey":443731104,
        "scope":"user_ci,user_birthday,user_nationality,user_name,user_phone,user_gender",
        "agreedTerms":["terms_tag1","terms_tag2"],
        "policy":"AUTO_SELECT",
        "certTxId":"ad052b57-dc8f-4cdb-a6e2-7b494e28b5ec",
        "name":"ENCRYPTED_VALUE",
        "phone":"ENCRYPTED_VALUE",
        "birthday":"ENCRYPTED_VALUE",
        "ci":"ENCRYPTED_VALUE",
        "di":null,
        "gender":"ENCRYPTED_VALUE",
        "nationality":"ENCRYPTED_VALUE",
        "email":null
    }
}
실패 응답
유효하지 않은 토큰을 사용할 경우, 현재 사용 중인 access_token의 유효시간을 확인하고 재발급을 진행해주세요.


{
    "error":"invalid_grant"
}
서버 에러 응답 예시

errorCode	설명
INTERNAL_ERROR	내부 서버 에러
USER_KEY_NOT_FOUND	로그인 서비스에 접속한 유저 키 값을 찾을 수 없음
USER_NOT_FOUND	토스 유저 정보를 찾을 수 없음
BAD_REQUEST_RETRIEVE_CERT_RESULT_EXCEEDED_LIMIT	조회 가능 횟수 초과
동일한 토큰으로 /api/login/user/me/without-di API 조회하면 정상적으로 조회되나, di 필드는 null 값으로 내려감

{
    "resultType":"FAIL",
    "error":{
        "errorCode":"INTERNAL_ERROR",
        "reason":"요청을 처리하는 도중에 문제가 발생했습니다."
    }
}

5. 사용자 정보 복호화하기
콘솔을 통해 이메일로 받은 복호화 키와 AAD(Additional Authenticated DATA) 로 진행해주세요.

암호화 알고리즘

AES 대칭키 암호화
키 길이 : 256비트
모드 : GCM
AAD : 복호화 키와 함께 이메일로 전달드려요.
데이터 교환방식

암호화된 데이터의 앞 부분에는 IV(NONCE)가 포함돼 있어요.
복호화 시 암호문에서 IV를 추출해 사용해야 정상적으로 복호화돼요.
복호화 샘플 코드


6. 로그인 끊기
발급받은 AccessToken을 더 이상 사용하지 않거나 사용자의 요청으로 토큰을 만료시켜야 할 경우 토큰을 삭제(만료)해주세요.

Content-type : application/json
Method : POST
URL :
accessToken 으로 연결 끊기 : /api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token
userKey 로 연결 끊기 : /api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key
AccessToken 으로 로그인 연결 끊기


// 포맷
curl --request POST 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $access_token'

// 예시
curl --request POST 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJraWQiOiJjZXJ0IizzYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJtMHVmMmhaUmpJTnNEQTdLNHVuVHhMb3IwcWNSa2JNPSIsImF1ZCI6IjNlenQ2ZTF0aDg2b2RheTlwOWN1eTg0dTRvdm5nNnNzIiwibmJmIjoxNzE4MjU0ODM2LCJzY29wZSI6WyJ1c2VyX2NpIiwidXNlcl9iaXJ0aGRheSIsInVzZXJfbmF0aW9uYWxpdHkiLCJ1c2VyX25hbWUiLCJ1c2VyX3Bob25lIiwidXNlcl9nZW5kZXIiXSwiaXNzIjoiaHR0cHM6Ly9jZXJ0LnRvc3MuaW0iLCJleHAiOjE3MTgyNTg0MzYsImlhdCI6MTcxODI1NDgzNiwianRpIjoiMTJkYjYwZjYtMjEzYS00NWQ3LTllOTItODBjMzBmY2JkMGQ3In0.W1cjoeMN8pd3Jqgh6h8YzSVQ1PUNldulJJgy6bgH1AoDbv5xFTlBLwk9Slb_u52zUpyZbhglwblQmNJs7GT6-us7XtfxSGxTUY3ORqIhF_PPGQ6soi_Qgsi-hmX165CCAilf8cltSTTuTt8xOiEbLuSTY-cecxo7SkPUonQ_0v4_Ik0kwOiOBuYZyuch3KmlYQZTqsJmxlwJAPB8M9tZTtDpLOv9MEPU35YS7CZyN0l7lwn1EKrDHJdzA5CnstqEdz2I0eREmMgZoG9mSEybgD4NtPmVJos6AJerUGgSmzP_TwwlybVATuGpnAUmH1idaZJ-MHZJhUhR82z4zTn3bw'
userKey 로 로그인 연결 끊기

참고하세요

하나의 userKey에 연결된 AccessToken이 많을 경우 readTimeout(3초) 이 발생할 수 있어요.
이 경우 요청을 재시도하지 말고, 일정 시간 후 다시 시도해 주세요.


// 포맷
curl --request POST 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $access_token' \
--data '{"userKey": $user_key}'

// 예시
curl --request POST 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key' \
--header 'Content-Type: application/json' \
--data '{"userKey": 443731103}'

{
    "resultType": "SUCCESS",
    "success": {
        "userKey": 443731103
    }
}
7. 콜백을 통해 로그인 끊기
사용자가 토스앱 내에서 서비스와의 연결을 해제한 경우 가맹점 서버로 알려드려요.
서비스에서 연결이 끊긴 사용자에 대한 처리가 필요한 경우 활용할 수 있어요. 콜백을 받을 URL과 basic Auth 헤더는 콘솔에서 입력할 수 있어요.

꼭 확인해 주세요

서비스에서 직접 로그인 연결 끊기 API를 호출한 경우에는 콜백이 호출되지 않아요.

GET 방식

요청 requestParam에 userKey와 referrer을 포함합니다.

// 포맷
curl --request GET '$callback_url?userKey=$userKey&referrer=$referrer'

// 예시
curl --request GET '$callback_url?userKey=443731103&referrer=UNLINK'
POST 방식

요청 body에 userKey와 referrer을 포함합니다.

// 포맷
curl --request POST '$callback_url' \
--header 'Content-Type: application/json' \
--data '{"userKey": $user_key, "referrer": $referrer}'

// 예시
curl --request POST '$callback_url' \
--header 'Content-Type: application/json' \
--data '{"userKey": 443731103, "referrer": "UNLINK"}'
referrer 은 연결 끊기 요청 경로에요.

referrer	설명
UNLINK	사용자가 토스앱에서 직접 연결을 끊었을 때 호출돼요.
(경로: 토스앱 → 설정 → 인증 및 보안 → 토스로 로그인한 서비스 → ‘연결 끊기’)	
WITHDRAWAL_TERMS	사용자가 로그인 서비스 약관 동의를 철회할 때 호출돼요.
(경로: 토스앱 → 설정 → 법적 정보 및 기타 → 약관 및 개인정보 처리 동의 → ‘동의 철회하기’)	
WITHDRAWAL_TOSS	사용자가 토스 회원을 탈퇴할 때 호출돼요.
트러블슈팅
로컬 개발 중 인증 에러가 발생할 때
로컬에서 개발할 때 인증 에러가 발생하는 원인은 주로 두가지예요.

인증 토큰이 만료됨
기존에 발급받은 인증 토큰이 만료되었을 수 있어요. 새로운 토큰을 발급받아 다시 시도해보세요.

개발자 로그인이 되지 않음 샌드박스 환경에서 개발자 계정으로 로그인하지 않은 상태일 수 있어요. 샌드박스 앱 다운로드를 참고해 로그인을 진행한 뒤 다시 시도해보세요.

Pager
Previous pageQA 진행하기
토스 로그인 연동을 마쳤다면 아래 항목을 꼼꼼히 점검해 주세요.

항목	내용
사전 체크	콘솔 계약/설정이 승인 상태인지, 약관 링크가 정상 열리는지 확인해주세요.
최초 로그인	인가 코드 수신 → 서버 교환 → 사용자 정보 복호화/저장 후 홈으로 진입되는지 확인해주세요.
재로그인	약관 동의 없이 인가 코드를 즉시 수신하고 정상 진입하는지 확인해주세요.
토큰 만료 직전 호출	자동 리프레시로 토큰이 갱신되고 재시도가 성공하는지(실패 시 재로그인 요구) 확인해주세요.
로그인 끊기 콜백	서버에서 토큰이 즉시 폐기되고, 재진입 시 로그인 요구되는지 확인해주세요.
콜백을 수신·검증해 세션을 해제하고 사용자에게 안내 후 재로그인을 유도하는지 확인해주세요.
네트워크 장애	지수 백오프/재시도 적용, 사용자 안내 문구 노출, 복구 후 자동 재시도가 성공하는지 확인해주세요.
Pager
Previous page토스 인증
토스 인증은 사용자가 입력한 개인정보를 토스에 가입된 정보와 대조하고, 토스 앱 인증을 통해 신원을 확인하는 서비스예요.
로그인, 가입 조회 등 사용자 식별이 필요한 서비스에서 CI, 이름, 휴대전화번호 등을 안전하게 확인할 수 있어요.

웹보드 게임은 본인 확인이 필수예요

웹보드 게임은 관련 법령에 따라 본인 확인 절차가 반드시 필요해요.
토스 인증을 연동하면 간편하게 본인 확인을 진행할 수 있어요.

계약하기
토스 인증을 사용하려면 사전 계약이 필요해요.
계약 진행에는 영업일 기준 7~14일이 소요될 수 있어요.

콘솔에서 계약이 진행되지 않아요

토스 인증 계약은 인증팀에서 직접 진행하고 있어요.
콘솔을 통해 계약할 수 없으니, 아래 절차를 참고해 주세요.

1) 서류 다운로드 및 작성
아래 서류를 다운로드해 작성해 주세요.

토스 전자 인증 서비스 이용 신청서, 개인(신용)정보 보안관리 약정서
2) 어드민 권한 정보 준비
토스 전자 인증 서비스 제휴사 어드민을 통해 정산 금액을 확인할 수 있어요.
어드민 접속 권한이 필요한 담당자의 이메일 주소와 전화번호를 준비해 주세요.

3) 서류 제출
아래 항목을 모두 포함해 cert.support@toss.im 이메일로 제출해주세요.

작성 완료된 신청서 및 약정서
어드민 접속 권한이 필요한 담당자 이메일 주소와 전화번호
4) 검토 및 안내
담당 부서에서 서류를 검토한 후 진행 절차를 안내드려요.
토스 전자 인증 서비스 계약은 내부 규정에 따라 인감 날인된 하드카피 서류로 진행돼요.
서류 검토 및 우편 송부 과정을 포함하여, 영업일 기준 7~14일 정도 소요돼요.
계약서 내용 수정 요청이 있는 경우, 추가 검토로 인해 기간이 더 길어질 수 있어요.테스트하기
계약이 완료되지 않아도 토스인증 테스트 환경에서 인증 연동을 진행해 볼 수 있습니다. 연동 먼저 진행하세요.
테스트를 위해 앱 스토어에서 설치한 최신 버전의 토스를 이용하세요.

테스트 환경

client_id : test_a8e23336d673ca70922b485fe806eb2d
client_secret : test_418087247d66da09fda1964dc4734e453c7cf66a7a9e3
토스 앱 버전
토스앱 최소버전 : 5.233.0 에서 동작해요.

방화벽 설정
요청 서버의 아웃바운드에 아래 토스인증의 IP를 허용해주세요. 모든 통신은 443 포트(HTTPS) 를 사용해요.
토스 인증 서버는 인바운드가 제한 없이 오픈되어 있어, 별도 설정 없이 바로 통신 테스트가 가능해요.

본인확인, 간편인증, 전자서명 방화벽

117.52.3.222
117.52.3.235
211.115.96.222
211.115.96.235
라이브 환경과 차이점
인증 사용료 무료
인증을 성공적으로 완료하더라도 테스트 환경에서는 과금이 되지 않아요.

테스트 환경 정보
테스트 환경의 클라이언트 자격증명 정보는 test_로 시작해요. prefix로 운영환경 자격증명 정보를 구분해요.

AccessToken 유효기간
테스트 환경에서는 연동의 편의성을 위해 1년(31536000초) 유효기간이 적용된 AccessToken을 제공합니다.
라이브 환경에서는 사업자가 신청한 네트워크 통신 방법에 따라 유효기간이 변동될 수 있으니 연동에 참고해주세요.

가상의 개인정보 제공
토스 인증을 끝마치면 토스에 가입된 사용자의 암호화된 개인정보가 전달됩니다.
테스트 환경에서는 안전을 위해 실제 사용자의 정보가 아닌 토스가 생성한 가상 인물의 고유한 개인정보를 제공합니다.
정확한 사용자 정보가 필요하다면 토스로 부터 제공받은 이용기관 고유 키로 연동하세요.

테스트 환경에서 제공하는 가상의 개인정보

CI : CI0110000000001 ...
DI : DI0110000000001 ...
이름 : 김토스
생년월일 : 19930324
성별 : FEMALE
내외국인 : LOCAL개발하기
SDK 1.2.1, 토스앱 5.233.0 이상에서 동작해요.

SDK 1.2.1 버전 이상을 사용해주세요.
getTossAppVersion 함수를 사용하여 토스앱 버전을 체크해보세요.



① AccessToken 받기
토스 본인 인증을 위한 Access Token을 발급 받아요.
발급받은 토큰은 이후 모든 서비스 API 호출에서 인증(Authorization) 용도로 사용돼요.

토큰에는 만료 시간(expires_in) 이 있으며 만료되면 반드시 새 토큰을 발급받아야 해요.
이미 유효한 토큰이 있을 때 불필요하게 발급 API를 반복 호출하지 않도록 주의하세요.

BaseURL

https://oauth2.cert.toss.im
Content-Type : application/x-www-form-urlencoded
Method : POST
URL : /token

요청 헤더

이름	타입	필수값 여부	설명
Content-Type	string	Y	application/x-www-form-urlencoded
요청 파라미터

이름	타입	필수값 여부	설명
grant_type	string	Y	고정 값: client_credentials
scope	string	Y	인증 요청 범위 (예: ca)
client_id	string	Y	고객사에 발급된 클라이언트 아이디
client_secret	string	Y	고객사에 발급된 클라이언트 시크릿

Shell(curl)

java

php

curl --request POST 'https://oauth2.cert.toss.im/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=test_a8e23336d673ca70922b485fe806eb2d' \
--data-urlencode 'client_secret=test_418087247d66da09fda1964dc4734e453c7cf66a7a9e3' \
--data-urlencode 'scope=ca'

응답

이름	타입	설명
access_token	string	Access Token 값
scope	string	발급된 인증 범위
token_type	string	토큰 타입 (항상 Bearer)
expires_in	number	토큰 만료 시간(초 단위)

{
  "access_token": "eyJraWQiOiJjZXJ0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ0ZXN0X2E4ZTIzMzM2ZDY3M2NhNzA5MjJiNDg1ZmU4MDZlYjJkIiwiYXVkIjoidGVzdF9hOGUyMzMzNmQ2NzNjYTcwOTIyYjQ4NWZlODA2ZWIyZCIsIm5iZiI6MTY0OTIyMjk3OCwic2NvcGUiOlsiY2EiXSwiaXNzIjoiaHR0cHM6XC9cL2NlcnQudG9zcy5pbSIsImV4cCI6MTY4MDc1ODk3OCwiaWF0IjoxNjQ5MjIyOTc4LCJqdGkiOiI4MDNjNDBjOC1iMzUxLTRmOGItYTIxNC1iNjc5MmNjMzBhYTcifQ.cjDZ0lAXbuf-KAgi3FlG1YGxvgvT3xrOYKDTstfbUz6CoNQgvd9TqI6RmsGZuona9jIP6H12Z1Xb07RIfAVoTK-J9iC5_Yp8ZDdcalsMNj51pPP8wso86rn-mKsrx1J5Rdi3GU58iKt0zGr4KzqSxUJkul9G4rY03KInwvl692HU19kYA9y8uTI4bBX--UPfQ02G0QH9HGTPHs7lZsISDtyD8sB2ikz5p7roua7U467xWy4BnRleCEWO2uUaNNGnwd7SvbjhmsRZqohs9KzDUsFjVhSiRNdHL53XJQ5zFHwDF92inRZFLu6Dw8xttPtNHwAD1kT84uXJcVMfEHtwkQ",
  "scope": "ca",
  "token_type": "Bearer",
  "expires_in": 31536000
}

② 개인정보 암·복호화하기
일부 요청에서 고객의 개인정보가 포함될 수 있어요.
안전을 위해 고객사 서버와 토스 서버는 암호화된 데이터만 주고받아요.
평문 확인이 필요한 경우에만 데이터를 복호화해 확인해 주세요.

인증 요청 시 고객의 이름, 생년월일, 휴대폰번호 암호화 후 전송
전자서명 서비스 원문에 고객의 개인정보가 포함되는 경우 원문 암호화
인증 결과에서 제공되는 CI·DI 등 개인정보 암호화 상태로 제공
참고하세요

토스 테스트 환경에서는 실제 사용자의 개인정보가 아닌 토스가 생성한 가상 인물의 고정된 개인정보를 제공해요.

GitHub 예제 : https://github.com/toss/toss-cert-examples


세션 키 생성 및 암호화 예제


java

package im.toss.cert.sdk;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class TossCertSessionTest {

    @Test
    public void test() {

        // 1. 세션 생성기를 사전에 1회만 생성해 주세요.
        TossCertSessionGenerator tossCertSessionGenerator = new TossCertSessionGenerator();

        // 2. 개인정보가 포함되어 있는 인증요청 API 호출 전에 세션을 생성해 주세요.
        TossCertSession tossCertSession = tossCertSessionGenerator.generate();

        // 3. 개인정보를 암호화 해주세요.
        String userName = "김토스";
        String encryptedUserName = tossCertSession.encrypt(userName);
        System.out.println("encryptedUserName: " + encryptedUserName);

        // 4. 인증요청 API를 호출해 주세요.
        // 인증요청 API의 바디 파라미터에 생성된 sessionKey를 추가해 주세요.
        String sessionKey = tossCertSession.getSessionKey();
        String userName = encryptedUserName;

        // 5. 사용자의 인증이 끝나면 결과조회 API 호출 전에 새로운 세션을 생성해 주세요.
        TossCertSession tossCertSession = tossCertSessionGenerator.generate();

        // 6. 결과조회 API를 호출해주세요.
        // 결과조회 API의 바디 파라미터에 생성된 sessionKey를 추가해 주세요.
        String sessionKey = tossCertSession.getSessionKey();
        String txId = "a39c84d9-458d-47e4-acf7-c481e851f79b";

        // 7. 복호화를 위해 결과조회 요청에서 생성했던 tossCertSession를 가지고 있어야 합니다.
        // response.userName 을 응답받은 암호화된 userName 이라고 가정합니다.
        // decryptedUserName 은 무결성 검증까지 완료되어 있습니다.
        String decryptedUserName = tossCertSession.decrypt(response.userName);
    }
}

③ 인증 요청하기
토스 인증 서버에서 txId를 발급받아 본인 확인 절차를 시작해요.

BaseURL

https://cert.toss.im
참고하세요

이름, 휴대전화, 생년월일은 파트너사 서비스에서 수집 후 가이드에 따라 암호화해 인증 API로 전달해야 해요.

Content-type : application/json
Method : POST
URL : /api/v2/sign/user/auth/id/request

요청 헤더

이름	타입	필수값 여부	설명
Authorization	string	Y	Bearer {Access Token}
Content-Type	string	Y	application/json
요청 파라미터

이름	타입	필수값 여부	설명
requestUrl	string	Y	토스 본인확인 사용 시 돌아갈 고객사 앱스킴 또는 화면 URL
requestType	string	Y	USER_PERSONAL(개인정보 기반, userName·userPhone·userBirthday·sessionKey 필수)
triggerType	string	Y	USER_PERSONAL일 때만 전달: APP_SCHEME
userName	string	Y	USER_PERSONAL일 때 필수, 암호화 필수
userPhone	string	Y	USER_PERSONAL일 때 필수, 숫자만, 암호화 필수
userBirthday	string	Y	USER_PERSONAL일 때 필수, YYYYMMDD, 암호화 필수
sessionKey	string	Y	USER_PERSONAL일 때 필수, AES 암복호화용, 매 요청마다 신규 생성

Shell(curl)

java

php

curl --location --request POST 'https://cert.toss.im/api/v2/sign/user/auth/id/request' --header 'Authorization: Bearer eyJraWQiOiJjZXJ0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ0ZXN0X2E4ZTIzMzM2ZDY3M2NhNzA5MjJiNDg1ZmU4MDZlYjJkIiwiYXVkIjoidGVzdF9hOGUyMzMzNmQ2NzNjYTcwOTIyYjQ4NWZlODA2ZWIyZCIsIm5iZiI6MTY0OTIyMjk3OCwic2NvcGUiOlsiY2EiXSwiaXNzIjoiaHR0cHM6XC9cL2NlcnQudG9zcy5pbSIsImV4cCI6MTY4MDc1ODk3OCwiaWF0IjoxNjQ5MjIyOTc4LCJqdGkiOiI4MDNjNDBjOC1iMzUxLTRmOGItYTIxNC1iNjc5MmNjMzBhYTcifQ.cjDZ0lAXbuf-KAgi3FlG1YGxvgvT3xrOYKDTstfbUz6CoNQgvd9TqI6RmsGZuona9jIP6H12Z1Xb07RIfAVoTK-J9iC5_Yp8ZDdcalsMNj51pPP8wso86rn-mKsrx1J5Rdi3GU58iKt0zGr4KzqSxUJkul9G4rY03KInwvl692HU19kYA9y8uTI4bBX--UPfQ02G0QH9HGTPHs7lZsISDtyD8sB2ikz5p7roua7U467xWy4BnRleCEWO2uUaNNGnwd7SvbjhmsRZqohs9KzDUsFjVhSiRNdHL53XJQ5zFHwDF92inRZFLu6Dw8xttPtNHwAD1kT84uXJcVMfEHtwkQ' --header 'Content-Type: application/json' # 세션 키는 매 요청 시 새로 생성해야 합니다.
--data-raw '{
       "requestType" : "USER_PERSONAL",
       "requestUrl" : "https://cert.toss.im",
       "triggerType" : "APP_SCHEME",
       "userName" : "v1$cc575847-f549-4c1e-89c7-eff11743e05e$5AfwdVLSmDoxBERDIV8gDny2QLcOzYOqvgt1l4gqEA==",
       "userPhone" : "v1$cc575847-f549-4c1e-89c7-eff11743e05e$OKtwqMR/RI+N3vx0FNtcx8GAoejDq5lb3wIr",
       "userBirthday" : "v1$cc575847-f549-4c1e-89c7-eff11743e05e$OaNxoMR2RYaPiH7km5yJyZQ472+uWNEy",
       "sessionKey" : "v1$cc575847-f549-4c1e-89c7-eff11743e05e$XTTyBJntTja9NfUaTaO09bQCtEApnn3dd7lN8s+jPA6qn5q5kBbSJEptazpSMqGFyB7P0XhnJSkRwukAuunesbm+e0p5tdQ7wiOkauM44FvZj/IwETTA74iLZTNrwmE3aYXv8b1wbIfQx/oT8k9+XNEPkHA0foCFtjF8MRnyjwpzR4hoi2sFk33xhoJa46kLGxz7d3z6r/KYKMFbwkQFOm81Nk8W+oJkT0AjdlOD075QrJ4zm9VReVvE4fT4Q1jY/5VzROt4GkqVvrziYbWRp9/v1/ETVyi5Lf+MceWHLS1MGicqUXfrfnFdqvOcZZytUkvb0AAyg75Sr5tgja55ma3t5AEu65IrO1Cop4wS/XhIwKpWUrMav5JI5X1iZ1tRznE7VRT/dsRLjgIX/wtZajY2ATG+feld2mmxD/mP/ET3JXsYKfmN3DkO10fQZY9915eUyDYm7NMS/U3l+VP8wMzd5WpWVjfxUvYP5eRwPM83hG9wFhHXV4ykodiX0BLRoERXou416uKDJR61b8xFFX+iDPnOfaeROlFFWj6zbK4tPfjRzyaWVQMmSM8igq7iBglehFo+EyyQnAAcUeda+P/7fQmwFDE1a8bQuXFBCwxNOOyPiJLV2+29pzKELcHa+WCrvcbHkOgG4EwjHHWmd17vUVXZGXOERsRuLQMM3mM="
    }'

성공 응답

이름	타입	설명
resultType	string	요청 결과. 성공 시 SUCCESS
success.txId	string	인증 요청 트랜잭션 아이디로 거래를 고유할 수 있는 값. 특정 거래를 고유할 수 있는 값이므로 반드시 저장 관리해야 합니다.
success.requestedDt	string	최초 요청 시각(YYYY-MM-DDThh:mm:ss±hh:mm)
success.appScheme	string	토스 인증 화면을 띄울 수 있는 앱 스킴 정보 (triggerType=APP_SCHEME 일 경우만)
success.androidAppUri	string	안드로이드 인증 앱 스킴 값으로 appScheme과 같은 역할을 하지만, Chrome Intent를 사용하기 때문에 고객사의 추가 기능 구현없이 토스 앱 설치 유무를 판별할 수 있는 장점이 있습니다.
success.iosAppUri	string	iOS 인증 앱 스킴 값으로 appScheme과 같은 역할을 하지만, Universal Link를 사용하기 때문에 안드로이드와 마찬가지로 고객사의 추가 기능 구현 없이 토스 앱 설치 유무를 판별할 수 있는 장점이 있습니다.

{
    "resultType": "SUCCESS",
    "success": {
        "txId": "d7b7273b-407b-46be-a9d8-97d2e895b009",
        "appScheme": "null",
        "androidAppUri": "null",
        "iosAppUri": "null",
        "requestedDt": "2022-02-13T17:52:22+09:00"
    }
}
실패 응답

이름	타입	설명
resultType	string	실패 시 FAIL
error.errorType	number	에러 유형
error.errorCode	string	에러 코드(예: CE1000)
error.reason	string	에러 메시지
error.data	object	부가 데이터(있을 경우)
error.title	string | null	에러 제목(있을 경우)

{
  "resultType": "FAIL",
  "error": {
    "errorType": 0,
    "errorCode": "CE1000",
    "reason": "토큰이 유효하지 않습니다.",
    "data": {},
    "title": null
  },
  "success": null
}

④ 인증 화면 호출하기
SDK를 통해 연동해주세요.

appsInTossSignTossCert 함수를 사용해 토스앱 인증 화면을 호출하세요.
appsInTossSignTossCert를 확인해 주세요.

토스앱 최소 버전 5.233.0 버전 이상에서 작동해요.

getTossAppVersion 함수를 사용하여 토스앱 버전을 체크해보세요.


⑤ 본인확인 상태 조회하기
사용자의 인증 진행 상태를 조회해요.
txId를 사용해 현재의 인증 단계 (REQUESTED, IN_PROGRESS, COMPLETED, EXPIRED)를 확인할 수 있어요.

주의하세요

상태조회 API는 단순히 진행 상태 확인용이에요.
최종 인증 완료 여부는 결과조회 API로 판별해야 해요.

BaseURL

https://cert.toss.im
Content-type : application/json
Method : POST
URL : /api/v2/sign/user/auth/id/status

요청 헤더

이름	타입	필수값 여부	설명
Authorization	string	Y	Bearer {Access Token}
Content-Type	string	Y	application/json
요청 파라미터

이름	타입	필수값 여부	설명
txId	string	Y	상태 확인이 필요한 인증 요청 트랜잭션 아이디
요청 예시


Shell(curl)

java

php

curl --location --request POST 'https://cert.toss.im/api/v2/sign/user/auth/id/status' \
--header 'Authorization: Bearer eyJraWQiOiJjZXJ0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ0ZXN0X2E4ZTIzMzM2ZDY3M2NhNzA5MjJiNDg1ZmU4MDZlYjJkIiwiYXVkIjoidGVzdF9hOGUyMzMzNmQ2NzNjYTcwOTIyYjQ4NWZlODA2ZWIyZCIsIm5iZiI6MTY0OTIyMjk3OCwic2NvcGUiOlsiY2EiXSwiaXNzIjoiaHR0cHM6XC9cL2NlcnQudG9zcy5pbSIsImV4cCI6MTY4MDc1ODk3OCwiaWF0IjoxNjQ5MjIyOTc4LCJqdGkiOiI4MDNjNDBjOC1iMzUxLTRmOGItYTIxNC1iNjc5MmNjMzBhYTcifQ.cjDZ0lAXbuf-KAgi3FlG1YGxvgvT3xrOYKDTstfbUz6CoNQgvd9TqI6RmsGZuona9jIP6H12Z1Xb07RIfAVoTK-J9iC5_Yp8ZDdcalsMNj51pPP8wso86rn-mKsrx1J5Rdi3GU58iKt0zGr4KzqSxUJkul9G4rY03KInwvl692HU19kYA9y8uTI4bBX--UPfQ02G0QH9HGTPHs7lZsISDtyD8sB2ikz5p7roua7U467xWy4BnRleCEWO2uUaNNGnwd7SvbjhmsRZqohs9KzDUsFjVhSiRNdHL53XJQ5zFHwDF92inRZFLu6Dw8xttPtNHwAD1kT84uXJcVMfEHtwkQ' \
--header 'Content-Type: application/json' \
--data-raw '{
      "txId": "633f3e1b-1a11-4e7c-9b35-dd391f440be4"
    }'

성공 응답

이름	타입	설명
resultType	string	요청 결과. 성공 시 SUCCESS
success.txId	string	조회한 인증 트랜잭션 ID
success.status	string	인증 진행 상태 (아래 “status 값” 표 참고)
success.requestedDt	string	최초 인증 요청 시각 (YYYY-MM-DDThh:mm:ss±hh:mm, ISO 8601)

{
  "resultType": "SUCCESS",
  "success": {
    "txId": "633f3e1b-1a11-4e7c-9b35-dd391f440be4",
    "status": "REQUESTED",
    "requestedDt": "2022-02-13T18:00:26+09:00"
  }
}
실패 응답

이름	타입	설명
resultType	string	실패 시 FAIL
error.errorType	number	에러 유형
error.errorCode	string	에러 코드(예: CE3100)
error.reason	string	에러 메시지
error.data	object	부가 데이터(있을 경우)
error.title	string | null	에러 제목(있을 경우)

{
  "resultType": "FAIL",
  "error": {
    "errorType": 0,
    "errorCode": "CE3100",
    "reason": "존재하지 않는 요청입니다",
    "data": {},
    "title": null
  },
  "success": null
}
status 값

값	설명
REQUESTED	토스 인증서버에서 사용자의 토스 앱으로 인증이 요청된 상태
IN_PROGRESS	사용자가 인증을 진행 중인 상태
COMPLETED	고객이 인증을 완료한 상태 (최종 확정은 결과조회 API로 판단 해야해요)
EXPIRED	유효시간 만료로 인증 진행이 불가한 상태

⑥ 본인확인 결과 조회하기
인증이 완료된 사용자의 결과 정보를 조회해요.
조회는 반드시 서버-서버 통신으로 진행해 주세요.
본인확인 결과로 수집한 정보는 서버에 안전하게 저장하고, 이후 전자서명/간편인증 시 해당 정보와 비교·검증 해 주세요.

주의하세요

결과조회 API는 성공 기준으로 최대 2회까지만 조회가 가능해요.
사용자 인증을 끝마친 후 60분(1시간) 이내 결과 조회를 끝내야 해요.
60분을 초과하면 결과 조회가 제한되며 인증 요청 API부터 다시 시작해야 해요.

BaseURL

https://cert.toss.im
Content-type : application/json
Method : POST
URL : /api/v2/sign/user/auth/id/result

요청 헤더

이름	타입	필수값 여부	설명
Authorization	string	Y	Bearer {Access Token}
Content-Type	string	Y	application/json
요청 파라미터

이름	타입	필수값 여부	설명
txId	string	Y	결과 확인이 필요한 인증 요청 트랜잭션 아이디
sessionKey	string	Y	결과조회에서는 인증수단과 무관하게 txId와 함께 필수로 전달. 요청/응답 AES 암·복호화용 세션 키로, 매 요청마다 새로 생성하고 인증요청에서 사용한 세션키는 재사용 금지
요청 예시


Shell(curl)

java

php

curl --location --request POST 'https://cert.toss.im/api/v2/sign/user/auth/id/result' \
--header 'Authorization: Bearer eyJraWQiOiJjZXJ0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ0ZXN0X2E4ZTIzMzM2ZDY3M2NhNzA5MjJiNDg1ZmU4MDZlYjJkIiwiYXVkIjoidGVzdF9hOGUyMzMzNmQ2NzNjYTcwOTIyYjQ4NWZlODA2ZWIyZCIsIm5iZiI6MTY0OTIyMjk3OCwic2NvcGUiOlsiY2EiXSwiaXNzIjoiaHR0cHM6XC9cL2NlcnQudG9zcy5pbSIsImV4cCI6MTY4MDc1ODk3OCwiaWF0IjoxNjQ5MjIyOTc4LCJqdGkiOiI4MDNjNDBjOC1iMzUxLTRmOGItYTIxNC1iNjc5MmNjMzBhYTcifQ.cjDZ0lAXbuf-KAgi3FlG1YGxvgvT3xrOYKDTstfbUz6CoNQgvd9TqI6RmsGZuona9jIP6H12Z1Xb07RIfAVoTK-J9iC5_Yp8ZDdcalsMNj51pPP8wso86rn-mKsrx1J5Rdi3GU58iKt0zGr4KzqSxUJkul9G4rY03KInwvl692HU19kYA9y8uTI4bBX--UPfQ02G0QH9HGTPHs7lZsISDtyD8sB2ikz5p7roua7U467xWy4BnRleCEWO2uUaNNGnwd7SvbjhmsRZqohs9KzDUsFjVhSiRNdHL53XJQ5zFHwDF92inRZFLu6Dw8xttPtNHwAD1kT84uXJcVMfEHtwkQ' \
--header 'Content-Type: application/json' \
# 세션 키는 매 요청 시 새로 생성해야 합니다.
--data-raw '{
       "txId" : "c1ce9214-9878-4751-b433-0c96641b0e13",
       "sessionKey" : "v1$71c3d6cd-6a74-48a8-8ab2-b48e6133ae6f$Q0U7Bdg4dWd0XXucjsM/mda89bFU7eHnoUhgQ3k+cGQ9gv37jvWC+8isrkO2CR4+qgoPg+U+K7/tQH2m+uU7L8Ab0gzbQo6ASX39NpcP6RHpI+VBi323ssYnBmJL7n0z4aNm6raUEsMoNwrOaMDe0DqfalgOeZgZUztWew1pfZul2Q3/WIBMdp+npS4sFnBRoBrzLroVsuNRTLK0XT6m5hak+ys+vBg5vZFoI0JN7j7zsr8lqGi6piSkygl1PLPugnSC9cOezxMoVN5c/csEVQxMsfkwqTIASaZVECnP50dO70TydYhBFCqxw3DpEDBHcXNDucOtdVOPslCPNx3NZv1i0IH0r92ULb3w2Y0Fncy4/xL1dPSS+TbA5540u2Wb3cxqVNHib7WwSMHBwQtXAnFSFZmcvQQPXtTeQ7SCvNnhA8k3gbboSpbDBg60RWn/1zF/ogBYRldO1BFtq7KP+jOm6I2OSSVpagH1Wu5MXhEtiTmsx7M8j/IM8EfnXbD9axJnlW2fKHZVvAj+5KNhqy90PUimBCKiXqjvUwOqb9hGGEzJ4JVKbIIiy1EYOaRkPTK9GurZwQaqM4o4c8pzOYRQR/3XIPWHxLv/jwsaMcfUIQFyKE+w898g+l1zO0jcck59/R64kZcirT9AsGFnRUWrsHGIkM95jdYlpUsnCXw="
  }'

성공 응답

이름	타입	설명
resultType	string	성공 시 SUCCESS
success.txId	string	결과를 조회한 인증 트랜잭션 아이디
success.status	string	COMPLETED (결과 조회가 정상 처리된 상태)
success.userIdentifier	string | null	현재 버전 미사용 (null)
success.userCiToken	string | null	현재 버전 미사용 (null)
success.signature	string	사용자가 서명한 전자서명 값(Base64 인코딩된 DER). txId와 함께 저장 관리 필수
success.randomValue	string | null	현재 버전 미사용 (null)
success.completedDt	string	사용자 인증 완료 시각 (YYYY-MM-DDThh:mm:ss±hh:mm, ISO 8601)
success.requestedDt	string	최초 인증 요청 시각 (YYYY-MM-DDThh:mm:ss±hh:mm, ISO 8601)
success.personalData	object	인증에 사용된 개인정보(암호화 값). 하위 필드 표 참고
personalData(인증을 진행한 사용자 개인정보) Object

이름	타입	설명
ci	string	암호화된 사용자의 CI
name	string	암호화된 사용자의 이름
birthday	string	암호화된 생년월일 8자리
gender	string	암호화된 성별 정보 (MALE | FEMALE)
nationality	string	암호화된 국적 (LOCAL | FOREIGNER)
ci2	string | null	예측 불가 상황에서 ci 유출 대응을 위한 임시 파라미터, null 고정
di	string	암호화된 사용자의 DI
ciUpdate	string | null	예측 불가 상황에서 ci 유출 대응을 위한 임시 파라미터, null 고정
ageGroup	string	암호화된 성인여부 (ADULT | MINOR)

// 결과조회 응답에서는 인증을 호출하는 방식에 상관없이 동일한 바디 파라미터를 제공합니다.
{
  "resultType": "SUCCESS",
  "success": {
    "txId": "c1ce9214-9878-4751-b433-0c96641b0e13",
    "status": "COMPLETED",
    "userIdentifier": null,
    "userCiToken": null,
    "signature": "MIIJCAYJKoZIhvcN...(생략)...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",
    "randomValue": null,
    "completedDt": "2022-02-13T18:01:53+09:00",
    "requestedDt": "2022-02-13T18:00:26+09:00",
    "personalData": {
      "ci": "v1$b88f8717-8e76-4276-bed0-f769a8baf7be$X3g52aAyCBirz0UVp1oNRq0SfGtj66vGtUT3rp1aSdm1h//xmpm7vdf48fbGI2i7VTBj6TKG2rqanP6Yo9MiTQu63C8kLWayzWAMp+RLyXLovvnFb9SxxdblRtZbj5KRNlBWK9t2VXI=",
      "name": "v1$b88f8717-8e76-4276-bed0-f769a8baf7be$9oiJBRei1KI/SgXtXGmkfNHu+pdAUHXBxA==",
      "birthday": "v1$b88f8717-8e76-4276-bed0-f769a8baf7be$LQgw26ExChwWi8cQQz6GrdMAdMZGyaEI",
      "gender": "v1$b88f8717-8e76-4276-bed0-f769a8baf7be$WnREqd1HM/Ci7p+3KIqROusVkYeSAQ==",
      "nationality": "v1$b88f8717-8e76-4276-bed0-f769a8baf7be$UH5Kqd3dPV1daxw0i23eMWjeXcXC",
      "ci2": null,
      "di": "v1$2e161d9d-e620-443e-9a27-8db41cc96cf9$6GKr2zaUWWfI6rpJ6/AV9U4W0S4nhAMFIFLkt5CS6N8Gjb1Oc/dpitkMSSvLroDO5b6zdl9bufGSQ6SiVQdlYN2OWYFBr/Hb4e4AYwQpFxDbpi9ksYt52aFa3G2DwaNOQMUBkyQ1IWc=",
      "ciUpdate": null
    }
  }
}
실패 응답

이름	타입	설명
resultType	string	실패 시 FAIL
error.errorType	number	에러 유형
error.errorCode	string	에러 코드(예: CE3102)
error.reason	string	에러 메시지
error.data	object	부가 데이터(있을 경우)
error.title	string | null	에러 제목(있을 경우)

{
  "resultType": "FAIL",
  "error": {
    "errorType": 0,
    "errorCode": "CE3102",
    "reason": "요청이 아직 완료되지 않았습니다.",
    "data": {},
    "title": null
  },
  "success": null
}
Pager
