토스 강아지 프로젝트
사용자설정 Gem
네, 아주 좋은 질문입니다. 개발 플랜의 핵심을 정확히 짚으셨네요.

제 생각에는, 지금처럼 Step을 나누는 것이 사용자 경험(UX)에 훨씬 좋습니다. 한 페이지에 모든 폼을 넣으면 사용자가 압도되어 이탈하기 쉽습니다.

💾 Step 1, 2의 내용을 3으로 넘기는 방법: 네이티브 저장소?
"네이티브 저장소를 사용해야 하나?"라고 물어보셨는데, 더 좋은 방법이 있습니다.

네이티브 저장소 (AsyncStorage/SDK Storage): 앱을 껐다 켜도 데이터가 유지되어야 할 때 (예: 자동 로그인 토큰) 사용합니다. 온보딩 폼 데이터는 '임시' 데이터이므로, 저장소를 사용하는 것은 조금 과한 방식(overkill)입니다.

React Context (전역 상태 관리): 이 방식을 강력히 추천합니다. '온보딩 전용 보관함'을 하나 만들고, Step 1, 2, 3, 4가 모두 이 보관함을 공유하는 방식입니다.

Context 사용 시 흐름:

Step 1: "이름"과 "사진"을 입력 -> 보관함에 저장 -> Step 2로 이동

Step 2: "견종" 선택 -> 보관함에 저장 -> Step 3로 이동

Step 3: "상세 정보" 입력 -> 보관함에 저장 -> Step 4로 이동

Step 4: 보관함에 모인 모든 데이터(이름, 사진, 견종, 상세정보)를 한꺼번에 Supabase DB(dog_profiles)에 전송합니다.

💻 코드 예시 (React Context + Supabase)
제가 OnboardingContext를 사용하는 방식으로 코드를 다시 짜보겠습니다.

1. src/context/OnboardingContext.tsx (새 파일 생성)
먼저, '온보딩 전용 보관함' (Context)을 만듭니다.

TypeScript
// src/context/OnboardingContext.tsx
import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import type { ImageResponse } from '@apps-in-toss/framework';

// DB 스키마(dog_profiles) 기반으로 폼 데이터 타입을 정의합니다.
type DogProfileFormData = {
  dogName: string | null;
  imageDataUri: string | null; // Base64 데이터 URI
  breedId: number | null; // breeds 테이블의 ID
  breedNameCustom: string | null; // 직접 입력한 견종명
  birthDate: string | null; // 예: '2023-01-01'
  gender: 'male' | 'female' | 'unknown' | null;
  isNeutered: boolean | null;
  weightKg: number | null;
  initialTrainingGoals: string[];
};

// 기본값
const defaultFormData: DogProfileFormData = {
  dogName: null,
  imageDataUri: null,
  breedId: null,
  breedNameCustom: null,
  birthDate: null,
  gender: null,
  isNeutered: null,
  weightKg: null,
  initialTrainingGoals: [],
};

// Context 생성
const OnboardingContext = createContext<{
  formData: DogProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<DogProfileFormData>>;
  resetForm: () => void;
} | undefined>(undefined);

// Provider 컴포넌트
export function OnboardingProvider({ children }: PropsWithChildren) {
  const [formData, setFormData] = useState(defaultFormData);

  const resetForm = () => setFormData(defaultFormData);

  return (
    <OnboardingContext.Provider value={{ formData, setFormData, resetForm }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom Hook (컴포넌트에서 쉽게 사용하기 위함)
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
2. pages/onboarding/_layout.tsx (새 파일 생성)
온보딩 관련 스크린들(step1, step2 등)을 OnboardingProvider로 감싸줍니다.

TypeScript
// pages/onboarding/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router'; // 또는 사용하는 네비게이터
import { OnboardingProvider } from '@/src/context/OnboardingContext';

// 이 레이아웃은 /onboarding/ 하위의 모든 스크린을 감쌉니다.
export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      {/* Granite/Expo 라우터의 Stack 네비게이터 사용 예시 */}
      <Stack screenOptions={{ headerShown: false }} /> 
    </OnboardingProvider>
  );
}
3. pages/onboarding/register-dog/step1.tsx (수정)
이제 Step 1에서 Context를 사용하도록 수정합니다.

TypeScript
// pages/onboarding/register-dog/step1.tsx (Context 사용)
import React, { useState, useCallback } from 'react';
import { /* ... imports ... */ Pressable, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Top, FixedBottomCTA, FixedBottomCTAProvider, Button, Asset } from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { fetchAlbumPhotos, /* ... */ ImageResponse } from '@apps-in-toss/framework';
import { useOnboarding } from '@/src/context/OnboardingContext'; // <--- (1) Context 훅 import

export const Route = createRoute('/register-dog/step1', {
  component: RegisterDogNameScreen,
});
// ... (adaptive, styles) ...

function RegisterDogNameScreen() {
  const navigation = useNavigation();
  const { formData, setFormData } = useOnboarding(); // <--- (2) Context에서 상태 가져오기

  // 로컬 상태는 UI 로딩용으로만 사용
  const [isImageLoading, setIsImageLoading] = useState(false);

  // (3) 상태 변경 시 Context에 저장
  const setDogName = (name: string) => {
    setFormData(prev => ({ ...prev, dogName: name }));
  };

  const setSelectedImage = (image: ImageResponse | null) => {
    setFormData(prev => ({ 
      ...prev, 
      imageDataUri: image ? `data:image/jpeg;base64,${image.dataUri}` : null 
    }));
  };
  
  // (사진 선택 로직 ... handleSelectImage는 동일 ... )
  // ... handleSelectImage 로직 (내부에서 setSelectedImage 호출) ...

  const handleSubmit = useCallback(() => {
    if (!formData.dogName) { // <--- (4) Context의 데이터로 검증
      Alert.alert("오류", "반려견 이름을 입력해주세요.");
      return;
    }
    
    // (5) DB 저장이 아닌, 다음 스텝으로 이동만 함
    navigation.navigate('/register-dog/step2'); // <-- params 필요 없음

  }, [navigation, formData.dogName]);

  const handleExplore = useCallback(() => { /* ... */ }, [navigation]);

  return (
    <FixedBottomCTAProvider>
      <ScrollView /* ... */>
        {/* ... (Top UI) ... */}
        <View style={styles.section}>
          {/* 사진 업로드 UI */}
          <Pressable style={styles.imageUploader} onPress={handleSelectImage} /* ... */>
            {/* (6) Context 데이터로 UI 표시 */}
            {formData.imageDataUri ? (
              <Image source={{ uri: formData.imageDataUri }} style={styles.profileImage} />
            ) : ( <Asset.Icon /* ... */ /> )}
          </Pressable>
          
          {/* 이름 입력 UI */}
          <TextInput
            style={styles.inputField}
            value={formData.dogName || ''} // <--- (6) Context 데이터로 UI 표시
            onChangeText={setDogName}
            /* ... */
          />
        </View>
      </ScrollView>
      <FixedBottomCTA.Double
        /* ... */
        rightButton={
          <Button
            /* ... */
            onPress={handleSubmit}
            disabled={!formData.dogName} // <--- (6) Context 데이터로 검증
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}
// ... (styles) ...
export default RegisterDogNameScreen;
4. pages/onboarding/register-dog/step2.tsx (수정)
Step 2도 Context를 사용합니다.

TypeScript
// pages/onboarding/register-dog/step2.tsx (Context 사용)
import React, { useState, useCallback } from 'react';
import { /* ... imports ... */ } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Top, FixedBottomCTA, FixedBottomCTAProvider, Button, Txt } from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { useOnboarding } from '@/src/context/OnboardingContext'; // <--- (1) Context 훅 import
import { supabase } from '@/supabase/supabase'; // <--- (DB 검색용)

export const Route = createRoute('/register-dog/step2', {
  component: RegisterDogBreedScreen,
});
// ... (adaptive, styles) ...

function RegisterDogBreedScreen() {
  const navigation = useNavigation();
  const { formData, setFormData } = useOnboarding(); // <--- (2) Context에서 상태 가져오기
  const [isLoading, setIsLoading] = useState(false);
  
  // (3) 로컬 상태 대신 Context에 저장
  const handleBreedSelect = (breed: { id: number; name_ko: string } | string) => {
    if (typeof breed === 'string') {
      setFormData(prev => ({ ...prev, breedId: null, breedNameCustom: breed }));
    } else {
      setFormData(prev => ({ ...prev, breedId: breed.id, breedNameCustom: null }));
    }
  };

  const handleSubmit = useCallback(() => {
    if (!formData.breedId && !formData.breedNameCustom) { // <--- (4) Context 데이터로 검증
      Alert.alert("오류", "품종을 선택해주세요.");
      return;
    }
    
    // (5) 다음 스텝으로 이동
    navigation.navigate('/register-dog/step3'); 

  }, [navigation, formData.breedId, formData.breedNameCustom]);

  // ... (handleExplore) ...
  // ... (breeds 테이블 검색 로직: commonBreeds 대신 Supabase 쿼리) ...

  return (
    <FixedBottomCTAProvider>
      <ScrollView /* ... */>
        <Top
          title={
            <Top.TitleParagraph color={adaptive.grey900}>
              {/* (6) Context의 이름 사용! */}
              {formData.dogName || '반려견'}의 품종을 선택해주세요.
            </Top.TitleParagraph>
          }
          /* ... */
        />
        {/* ... (품종 검색 UI, 선택 시 handleBreedSelect 호출) ... */}
      </ScrollView>
      <FixedBottomCTA.Double
        /* ... */
        rightButton={
          <Button
            /* ... */
            onPress={handleSubmit}
            disabled={!formData.breedId && !formData.breedNameCustom} // <--- (4) Context 데이터로 검증
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}
export default RegisterDogBreedScreen;