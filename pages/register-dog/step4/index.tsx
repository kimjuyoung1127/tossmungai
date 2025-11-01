// pages/register-dog/step4/index.tsx (Step 4: Confirmation)
import React, { useCallback } from 'react';
import { View, Alert, ScrollView, StyleSheet, Text } from 'react-native';
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
export const Route = createRoute('/register-dog/step4', {
  component: RegisterDogConfirmationScreen,
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
  summaryCard: {
    backgroundColor: '#F2F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: adaptive.grey900,
  },
  summaryText: {
    fontSize: 14,
    color: adaptive.grey700,
    lineHeight: 20,
  },
});

function RegisterDogConfirmationScreen() {
  const navigation = useNavigation();
  const { formData, resetForm } = useOnboarding(); // <--- (2) Context에서 상태 가져오기
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    
    // Complete the registration process
    setTimeout(() => {
      try {
        // Log the registration data for verification
        console.log("=== 반려견 등록 정보 ===");
        console.log("이름:", formData.dogName);
        console.log("품종:", formData.breedNameCustom);
        console.log("나이:", formData.birthDate);
        console.log("성별:", formData.gender);
        console.log("중성화 여부:", formData.isNeutered);
        console.log("체중:", formData.weightKg, "kg");
        console.log("훈련 목표:", formData.initialTrainingGoals.join(", "));
        console.log("등록 완료 시간:", new Date().toISOString());
        console.log("=====================");
        
        Alert.alert("축하합니다!", "반려견 정보가 성공적으로 등록되었습니다!");
        
        // Reset form after successful registration
        resetForm();
        
        navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // Go to home
      } catch (error: any) {
        Alert.alert(
          "오류",
          `처리 중 문제가 발생했습니다: ${error.message || '알 수 없는 오류'}`
        );
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [navigation, formData, resetForm]);

  const handleExplore = useCallback(() => {
    // Reset form when user decides to explore later
    resetForm();
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
  }, [navigation, resetForm]);

  return (
    <FixedBottomCTAProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 16 }}>
          {/* === 메인 콘텐츠 === */}
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                {/* (6) Context의 이름 사용! */}
                {formData.dogName || '반려견'} 정보 등록
              </Top.TitleParagraph>
            }
            subtitle2={
              <Top.SubtitleParagraph>
                등록 정보를 확인해주세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>등록 정보 요약</Text>
            <Text style={styles.summaryText}>이름: {formData.dogName || '미입력'}</Text>
            <Text style={styles.summaryText}>품종: {formData.breedNameCustom || '미선택'}</Text>
            <Text style={styles.summaryText}>나이: {formData.birthDate ? calculateAgeString(formData.birthDate) : '미입력'} ({formData.birthDate || '미입력'})</Text>
            <Text style={styles.summaryText}>성별: {formData.gender || '미선택'}</Text>
            <Text style={styles.summaryText}>중성화 여부: {formData.isNeutered === true ? '예' : formData.isNeutered === false ? '아니오' : '미선택'}</Text>
            <Text style={styles.summaryText}>체중: {formData.weightKg ? `${formData.weightKg} kg` : '미입력'}</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>개인정보 처리방침</Text>
            <Text style={styles.summaryText}>
              귀하의 개인정보는 안전하게 보호되며, 서비스 제공을 위한 목적으로만 사용됩니다.
            </Text>
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
            loading={isLoading}
          >
            등록 완료
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

// Helper function to convert birth date to age string
const calculateAgeString = (birthDateString: string): string => {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  
  const totalMonths = years * 12 + months;
  
  if (totalMonths < 12) {
    return `${totalMonths}개월`;
  } else {
    const yearsDisplay = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    return remainingMonths > 0 ? `${yearsDisplay}세 ${remainingMonths}개월` : `${yearsDisplay}세`;
  }
};

export default RegisterDogConfirmationScreen;