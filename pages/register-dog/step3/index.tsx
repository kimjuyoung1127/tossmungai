// pages/onboarding/register-dog/step3.tsx (Step 3: Details)
import React, { useState, useCallback } from 'react';
import { 
  View, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text,
  TextInput,
  Pressable 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
  Txt,
  // DatePicker, // (1) TDS에 DatePicker가 있는지 확인 필요
  // Checkbox, // (1) TDS에 Checkbox가 있는지 확인 필요
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { useOnboarding } from '@/src/context/OnboardingContext';
// (1) 네이티브 DatePicker 사용 예시 (TDS에 없다면)
// import DateTimePicker from '@react-native-community/datetimepicker'; 

// Granite 라우트 정의
export const Route = createRoute('/register-dog/step3', {
  component: RegisterDogDetailsScreen,
});

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
  grey700: '#5B6371',
  grey100: '#F2F4F6',
  blue500: '#0064FF',
  white: '#FFFFFF',
};

// (2) 날짜를 'YYYY-MM-DD' 형식으로 변환하는 헬퍼 함수
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

function RegisterDogDetailsScreen() {
  const navigation = useNavigation();
  const { formData, setFormData } = useOnboarding(); // <--- (2) Context에서 상태 가져오기
  const [isLoading, setIsLoading] = useState(false);

  // (3) 로컬 상태: UI 제어용
  const [knowsBirthDate, setKnowsBirthDate] = useState(true); // "잘 모름" 체크 여부
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePicker 표시 여부
  const [approxAge, setApproxAge] = useState(''); // "잘 모름" 선택 시 입력 시 입력할 나이

  // (4) Context에 데이터 저장 핸들러
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthDate: formatDate(selectedDate) }));
    }
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'unknown') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleNeuteredSelect = (neutered: boolean | null) => {
    setFormData(prev => ({ ...prev, isNeutered: neutered }));
  };

  // (5) 다음 단계로 이동
  const handleSubmit = useCallback(() => {
    // (검증) 생년월일 또는 추정 나이 둘 중 하나는 입력되어야 함 (선택적)
    if (knowsBirthDate && !formData.birthDate) {
      Alert.alert("오류", "생년월일을 선택해주세요.");
      return;
    }
    if (!knowsBirthDate && !approxAge) {
      Alert.alert("오류", "추정 나이(O살)를 입력해주세요.");
      return;
    }
    // (검증) 성별, 중성화 선택 (필수)
    if (!formData.gender || formData.isNeutered === null) {
      Alert.alert("오류", "성별과 중성화 여부를 선택해주세요.");
      return;
    }
    
    // (저장) 추정 나이를 birthDate 대용으로 Context에 임시 저장 (필요시)
    // 여기서는 birthDate: null로 두고, AI가 추후 활용하도록 함
    if (!knowsBirthDate) {
       setFormData(prev => ({ ...prev, birthDate: null }));
       // (선택적) AI 추천용 추정 나이(approxAge)를 별도 필드(예: formData.approxAge)에 저장
    }

    // 다음 스텝으로 이동
    navigation.navigate('/register-dog/step4'); // (step4.tsx 파일 생성 필요)

  }, [navigation, formData, knowsBirthDate, approxAge]);

  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] });
  }, [navigation]);

  return (
    <FixedBottomCTAProvider>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ padding: 16 }}>
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                {(formData && formData.dogName) ? formData.dogName : '반려견'}에 대해
                {'\n'}
                조금 더 알려주세요. (3/4)
              </Top.TitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          {/* === (6) 나이 입력 === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>생년월일</Text>
            {knowsBirthDate ? (
              <Pressable onPress={() => Alert.alert("생년월일 선택", "날짜 선택 기능은 현재 구현되지 않았습니다.", [{text: "확인"}])}>
                <TextInput
                  style={styles.inputField}
                  value={(formData && formData.birthDate) ? formData.birthDate : ''}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9E9E9E"
                  editable={false} // 사용자가 직접 입력하지 않음
                />
              </Pressable>
            ) : (
              <TextInput
                style={styles.inputField}
                value={approxAge}
                onChangeText={setApproxAge}
                placeholder="추정 나이 (예: 2살)"
                placeholderTextColor="#9E9E9E"
                keyboardType="number-pad"
              />
            )}
            {/* (7) "잘 모름" 체크박스 (TDS Checkbox 또는 Pressable로 구현) */}
            <Pressable style={styles.checkboxContainer} onPress={() => setKnowsBirthDate(!knowsBirthDate)}>
              {/* <Checkbox checked={!knowsBirthDate} /> */}
              <View style={[styles.checkbox, !knowsBirthDate && styles.checkboxChecked]} />
              <Txt style={styles.checkboxLabel}>정확한 생년월일을 몰라요</Txt>
            </Pressable>
          </View>

          {/* === (9) 성별 입력 === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>성별 *</Text>
            <View style={styles.chipGroup}>
              <Pressable 
                style={[styles.chip, formData.gender === 'male' && styles.chipSelected]} 
                onPress={() => handleGenderSelect('male')}
              >
                <Txt style={[styles.chipText, formData.gender === 'male' && styles.chipTextSelected]}>남</Txt>
              </Pressable>
              <Pressable 
                style={[styles.chip, formData.gender === 'female' && styles.chipSelected]} 
                onPress={() => handleGenderSelect('female')}
              >
                <Txt style={[styles.chipText, formData.gender === 'female' && styles.chipTextSelected]}>여</Txt>
              </Pressable>
              <Pressable 
                style={[styles.chip, formData.gender === 'unknown' && styles.chipSelected]} 
                onPress={() => handleGenderSelect('unknown')}
              >
                <Txt style={[styles.chipText, formData.gender === 'unknown' && styles.chipTextSelected]}>모름</Txt>
              </Pressable>
            </View>
          </View>
          
          {/* === (9) 중성화 입력 === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>중성화 여부 *</Text>
            <View style={styles.chipGroup}>
              <Pressable 
                style={[styles.chip, formData.isNeutered === true && styles.chipSelected]} 
                onPress={() => handleNeuteredSelect(true)}
              >
                <Txt style={[styles.chipText, formData.isNeutered === true && styles.chipTextSelected]}>했어요</Txt>
              </Pressable>
              <Pressable 
                style={[styles.chip, formData.isNeutered === false && styles.chipSelected]} 
                onPress={() => handleNeuteredSelect(false)}
              >
                <Txt style={[styles.chipText, formData.isNeutered === false && styles.chipTextSelected]}>안했어요</Txt>
              </Pressable>
              <Pressable 
                style={[styles.chip, formData.isNeutered === null && styles.chipSelected]} 
                onPress={() => handleNeuteredSelect(null)}
              >
                <Txt style={[styles.chipText, formData.isNeutered === null && styles.chipTextSelected]}>모름</Txt>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* === 하단 고정 버튼 === */}
      <FixedBottomCTA.Double
        leftButton={
          <Button
            type="dark" style="weak" display="block"
            onPress={handleExplore} disabled={isLoading}
          >
            나중에 할래요
          </Button>
        }
        rightButton={
          <Button
            type="primary" style="fill" display="block"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading} 
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

// (10) StyleSheet 업데이트
const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 150 },
  section: { paddingHorizontal: 16 },
  inputContainer: { marginBottom: 24 },
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
    backgroundColor: adaptive.white,
    color: adaptive.grey900, // 입력 텍스트 색상
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: adaptive.grey700,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: adaptive.blue500,
    borderColor: adaptive.blue500,
  },
  checkboxLabel: {
    fontSize: 14,
    color: adaptive.grey700,
  },
  chipGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: adaptive.grey100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: adaptive.grey100,
  },
  chipSelected: {
    backgroundColor: adaptive.blue500,
    borderColor: adaptive.blue500,
  },
  chipText: {
    fontSize: 14,
    color: adaptive.grey700,
  },
  chipTextSelected: {
    color: adaptive.white,
  },
});

export default RegisterDogDetailsScreen;