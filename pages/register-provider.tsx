// pages/register-provider.tsx
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
export const Route = createRoute('/register-provider', {
  component: RegisterProviderScreen,
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
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    backgroundColor: '#F2F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedCategoryOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  categoryOptionText: {
    fontSize: 14,
  },
  experienceOptions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  experienceOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  selectedExperienceOption: {
    borderColor: '#2196F3',
    backgroundColor: '#F5F9FF',
  },
});

function RegisterProviderScreen() {
  const navigation = useNavigation();
  const [providerInfo, setProviderInfo] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    specialties: [] as string[],
    description: '',
  });
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const specialties = [
    '기초 훈련', '배변 훈련', '공격성 개선', '분리불안', 
    '사회화 훈련', '고급 훈련', '아이와 함께하는 훈련', '산책 예절'
  ];

  const experienceOptions = [
    { id: '0-2', label: '0~2년' },
    { id: '3-5', label: '3~5년' },
    { id: '6-10', label: '6~10년' },
    { id: '10+', label: '10년 이상' },
  ];

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
    
    setProviderInfo(prev => ({
      ...prev,
      specialties: [...selectedSpecialties, specialty]
    }));
  };

  const handleExperienceSelect = (id: string) => {
    setSelectedExperience(id);
    setProviderInfo(prev => ({
      ...prev,
      experience: id
    }));
  };

  const handleChange = (field: string, value: string) => {
    setProviderInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    
    // Validate required fields
    if (!providerInfo.name || !providerInfo.businessName || !providerInfo.email || 
        !providerInfo.phone || !providerInfo.experience || selectedSpecialties.length === 0) {
      Alert.alert("오류", "모든 필수 정보를 입력해주세요.");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Navigate to next step after successful registration
        Alert.alert("완료", "훈련사 정보가 등록되었습니다!");
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
  }, [navigation, providerInfo, selectedSpecialties]);

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
                훈련사 정보 등록
              </Top.TitleParagraph>
            }
            subtitle2={
              <Top.SubtitleParagraph>
                훈련사님의 정보를 입력해주세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이름 *</Text>
            <TextInput
              style={styles.inputField}
              value={providerInfo.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="예: 홍길동"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>사업장명 *</Text>
            <TextInput
              style={styles.inputField}
              value={providerInfo.businessName}
              onChangeText={(value) => handleChange('businessName', value)}
              placeholder="예: 멍멍이 훈련소"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이메일 *</Text>
            <TextInput
              style={styles.inputField}
              value={providerInfo.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="예: trainer@example.com"
              placeholderTextColor="#9E9E9E"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>전화번호 *</Text>
            <TextInput
              style={styles.inputField}
              value={providerInfo.phone}
              onChangeText={(value) => handleChange('phone', value)}
              placeholder="예: 010-1234-5678"
              placeholderTextColor="#9E9E9E"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>주소</Text>
            <TextInput
              style={styles.inputField}
              value={providerInfo.address}
              onChangeText={(value) => handleChange('address', value)}
              placeholder="예: 서울시 강남구 훈련로 123"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>경력 *</Text>
            <View style={styles.experienceOptions}>
              {experienceOptions.map((option) => (
                <View
                  key={option.id}
                  style={[
                    styles.experienceOption,
                    selectedExperience === option.id ? styles.selectedExperienceOption : null
                  ]}
                  onTouchStart={() => handleExperienceSelect(option.id)}
                >
                  <Text style={styles.breedOptionText}>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>전문 분야 * (복수 선택 가능)</Text>
            <View style={styles.categoryOptions}>
              {specialties.map((specialty) => (
                <View
                  key={specialty}
                  style={[
                    styles.categoryOption,
                    selectedSpecialties.includes(specialty) ? styles.selectedCategoryOption : null
                  ]}
                  onTouchStart={() => toggleSpecialty(specialty)}
                >
                  <Text style={styles.categoryOptionText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>소개</Text>
            <TextInput
              style={[styles.inputField, { height: 100, textAlignVertical: 'top' }]}
              value={providerInfo.description}
              onChangeText={(value) => handleChange('description', value)}
              placeholder="자신과 훈련소를 소개해주세요"
              placeholderTextColor="#9E9E9E"
              multiline
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
            disabled={isLoading || !providerInfo.name || !providerInfo.businessName || 
                     !providerInfo.email || !providerInfo.phone || !selectedExperience || 
                     selectedSpecialties.length === 0}
          >
            등록 완료
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default RegisterProviderScreen;