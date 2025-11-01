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