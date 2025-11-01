// pages/register-dog/step2/index.tsx (Step 2: Breed Selection)
import React, { useState, useCallback } from 'react';
import { View, Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';

// Granite 라우트 정의
export const Route = createRoute('/register-dog/step2', {
  component: RegisterDogBreedScreen,
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
  breedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breedOption: {
    backgroundColor: '#F2F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedBreedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  breedOptionText: {
    fontSize: 14,
  },
});

function RegisterDogBreedScreen() {
  const navigation = useNavigation();
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const commonBreeds = [
    '골든 리트리버', '래브라도 리트리버', '시츄', '요크셔 테리어',
    '진도 개', '푸들', '비숑 프리제', '웰시 코기', '보더 콜리', '치와와'
  ];

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed);
  };

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    
    // Validate required field
    if (!selectedBreed) {
      Alert.alert("오류", "품종을 선택해주세요.");
      setIsLoading(false);
      return;
    }
    
    // Navigate to next step
    setTimeout(() => {
      try {
        navigation.reset({ index: 0, routes: [{ name: '/register-dog/step3' }] }); // Go to step 3
      } catch (error: any) {
        Alert.alert(
          "오류",
          `처리 중 문제가 발생했습니다: ${error.message || '알 수 없는 오류'}`
        );
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [navigation, selectedBreed]);

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
                우리 아이 품종을 선택해주세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: adaptive.grey900 }}>
            품종 선택
          </Text>
          <View style={styles.breedOptions}>
            {commonBreeds.map((breed) => (
              <View
                key={breed}
                style={[
                  styles.breedOption,
                  selectedBreed === breed ? styles.selectedBreedOption : null
                ]}
                onTouchStart={() => handleBreedSelect(breed)}
              >
                <Text style={styles.breedOptionText}>{breed}</Text>
              </View>
            ))}
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
            disabled={isLoading || !selectedBreed}
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default RegisterDogBreedScreen;