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
  const [dogAge, setDogAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    
    // Validate required field
    if (!dogAge) {
      Alert.alert("오류", "나이를 입력해주세요.");
      setIsLoading(false);
      return;
    }
    
    // Navigate to next step
    setTimeout(() => {
      try {
        navigation.reset({ index: 0, routes: [{ name: '/register-dog/step4' }] }); // Go to step 4
      } catch (error: any) {
        Alert.alert(
          "오류",
          `처리 중 문제가 발생했습니다: ${error.message || '알 수 없는 오류'}`
        );
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [navigation, dogAge]);

  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
  }, [navigation]);

  return (
    <FixedBottomCTAProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 16 }}>
          {/* === 메인 콘텐츠 === */}
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                반려견 정보 등록
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
              value={dogAge}
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
            disabled={isLoading}
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
            disabled={isLoading || !dogAge}
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default RegisterDogAgeScreen;