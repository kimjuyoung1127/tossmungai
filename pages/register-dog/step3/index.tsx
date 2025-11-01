// pages/register-dog/step3/index.tsx (Step 3: Age Input)
import React, { useState, useCallback } from 'react';
import { View, Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { useOnboarding } from '@/src/context/OnboardingContext'; // <--- (1) Context 훅 import

// Granite 라우트 정의
export const Route = createRoute('/register-dog/step3', {
  component: RegisterDogAgeScreen,
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: adaptive.grey900,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
});

function RegisterDogAgeScreen() {
  const navigation = useNavigation();
  const { formData, setFormData } = useOnboarding(); // <--- (2) Context에서 상태 가져오기
  const [isLoading, setIsLoading] = useState(false);

  // (3) 상태 변경 시 Context에 저장
  const setDogAge = (age: string) => {
    // Convert to number and store in context
    const ageInMonths = parseInt(age) || null;
    setFormData(prev => ({ ...prev, birthDate: ageInMonths ? calculateBirthDate(ageInMonths) : null }));
  };

  const handleSubmit = useCallback(() => {
    // Validate required field - checking if age is valid
    if (!formData.birthDate) {
      Alert.alert("오류", "나이를 입력해주세요.");
      return;
    }
    
    // (5) 다음 스텝으로 이동
    try {
      navigation.navigate('/register-dog/step4'); 
    } catch (error: any) {
      Alert.alert(
        "오류",
        `처리 중 문제가 발생했습니다: ${error.message || '알 수 없는 오류'}`
      );
    }
  }, [navigation, formData.birthDate]);

  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
  }, [navigation]);

  // Helper function to calculate birth date from age in months
  const calculateBirthDate = (ageInMonths: number): string => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear(), today.getMonth() - ageInMonths, today.getDate());
    return birthDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <FixedBottomCTAProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 16 }}>
          {/* === 메인 콘텐츠 === */}
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                {/* (6) Context의 이름 사용! */}
                {formData.dogName || '반려견'}의 나이를 입력해주세요.
              </Top.TitleParagraph>
            }
            subtitle2={
              <Top.SubtitleParagraph>
                우리 아이 나이를 입력해주세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>나이 (개월 단위) *</Text>
            <TextInput
              style={styles.inputField}
              value={formData.birthDate ? calculateAgeInMonths(formData.birthDate).toString() : ''}
              onChangeText={setDogAge}
              placeholder="예: 12"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      {/* === 하단 고정 버튼 === */}
      <FixedBottomCTA.Double
        leftButton={
          <Button
            type="dark"
            style="weak"
            display="block"
            onPress={handleExplore}
          >
            나중에 할래요
          </Button>
        }
        rightButton={
          <Button
            type="primary"
            style="fill"
            display="block"
            onPress={handleSubmit}
            disabled={!formData.birthDate} // <--- (4) Context 데이터로 검증
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

// Helper function to calculate age in months from birth date
const calculateAgeInMonths = (birthDateString: string): number => {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  
  return years * 12 + months;
};

export default RegisterDogAgeScreen;