
 LOG  === Photo Selection Debug Info ===
 LOG  Image selection started
 LOG  Current image loading state: false
 LOG  ==================================
 LOG  Album option selected
 LOG  Opening album...
 LOG  Album error: [Error: 권한 없음]
 LOG  Image loading state reset
 LOG  === Photo Selection Debug Info ===
 LOG  Image selection started
 LOG  Current image loading state: false
 LOG  ==================================
 LOG  Camera option selected
 LOG  Opening camera...
 LOG  Camera error: [Error: 권한 없음]
 LOG  Image loading state reset





필요한 권한 설정하기
지원환경:
React Native
WebView
실행환경:
Toss App
Sandbox App
앱에서 클립보드, 위치 정보, 사진첩, 연락처 등의 기능을 사용하려면 권한을 설정해야 해요. 이러한 기능들을 토스앱에서 쓸 수 있도록 권한을 설정하는 방법을 안내해요.

권한 목록
아래는 권한 이름과 허용된 작업 목록이에요. 각 권한에 맞는 접근값도 확인해 보세요.

클립보드
권한 이름: clipboard
읽기(read): getClipboardText
쓰기(write): setClipboardText
연락처
권한 이름: contacts
읽기(read): fetchContacts
사진첩
권한 이름: photos
읽기(read): fetchAlbumPhotos
카메라
권한 이름: camera
접근(access): openCamera
위치
권한 이름: geolocation
접근(access): startUpdateLocation, getCurrentLocation, useGeolocation
권한 설정하기
앱에서 쓸 권한을 granite.config.ts에 정의할 수 있어요. 이는 앱을 검토할 때 쓰여요. 권한 목록을 참고해 설정해주세요.

아래는 클립보드와, 카메라, 사진첩을 쓰도록 설정한 예시예요.


granite.config.ts

import { appsInToss } from "@apps-in-toss/framework/plugins";
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  appName: "<my-service-name>",
  plugins: [
    appsInToss({
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
    }),
  ],
});