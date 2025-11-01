// pages/register-dog.tsx
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
export const Route = createRoute('/register-dog', {
  component: RegisterDogScreen,
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
  sectionTitle: {
    color: adaptive.grey900,
    marginBottom: 16,
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

function RegisterDogScreen() {
  const navigation = useNavigation();
  const [dogInfo, setDogInfo] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    personality: '',
  });
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const commonBreeds = [
    '골든 리트리버', '래브라도 리트리버', '시츄', '요크셔 테리어',
    '진도 개', '푸들', '비숑 프리제', '웰시 코기', '보더 콜리', '치와와'
  ];

  const handleChange = (field: string, value: string) => {
    setDogInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed);
    handleChange('breed', breed);
  };

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    
    // Validate required fields
    if (!dogInfo.name || !dogInfo.breed || !dogInfo.age) {
      Alert.alert("오류", "모든 필수 정보를 입력해주세요.");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Navigate to next step after successful registration
        Alert.alert("완료", "반려견 정보가 등록되었습니다!");
        navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // 예: '/home'
      } catch (error: any) {
        Alert.alert(
          "오류",
          `처리 중 문제가 발생했습니다: ${error.message || '알 수 없는 오류'}`
        );
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [navigation, dogInfo]);

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
                우리 아이 정보를 입력해주세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이름 *</Text>
            <TextInput
              style={styles.inputField}
              value={dogInfo.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="예: 바둑이"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>품종 *</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>나이 (개월 단위) *</Text>
            <TextInput
              style={styles.inputField}
              value={dogInfo.age}
              onChangeText={(value) => handleChange('age', value)}
              placeholder="예: 12"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>체중 (kg)</Text>
            <TextInput
              style={styles.inputField}
              value={dogInfo.weight}
              onChangeText={(value) => handleChange('weight', value)}
              placeholder="예: 15.5"
              placeholderTextColor="#9E9E9E"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>성격</Text>
            <TextInput
              style={styles.inputField}
              value={dogInfo.personality}
              onChangeText={(value) => handleChange('personality', value)}
              placeholder="예: 활발하고 친근함"
              placeholderTextColor="#9E9E9E"
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
            disabled={isLoading || !dogInfo.name || !dogInfo.breed || !dogInfo.age}
          >
            등록 완료
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default RegisterDogScreen;