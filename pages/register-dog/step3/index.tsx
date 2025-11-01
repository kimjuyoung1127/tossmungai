// pages/onboarding/register-dog/step3/index.tsx (Step 3: Details - Modal 사용)
import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text,
  TextInput,
  Pressable,
  Modal // <--- (1) Modal import (React Native 기본)
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
  Txt,
  // BottomSheet 제거
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { useOnboarding } from '@/src/context/OnboardingContext';

// [✨ 해결] adaptive 객체 정의 추가
const adaptive = {
  grey900: '#191F28',
  grey800: '#333A46',
  grey700: '#5B6371',
  grey100: '#F2F4F6',
  blue500: '#0064FF',
  white: '#FFFFFF',
};



// ... (Route, adaptive, formatDate 함수는 동일) ...

function RegisterDogDetailsScreen() {
  const navigation = useNavigation();
  const { formData, setFormData } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const [knowsBirthDate, setKnowsBirthDate] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false); // Modal 표시 상태
  const [approxAge, setApproxAge] = useState('');
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    formData.birthDate ? parseInt(formData.birthDate.split('-')[0]) : currentYear
  );
  const [selectedMonth, setSelectedMonth] = useState(
    formData.birthDate ? parseInt(formData.birthDate.split('-')[1]) : new Date().getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState(
    formData.birthDate ? parseInt(formData.birthDate.split('-')[2]) : new Date().getDate()
  );
  
  const years = Array.from({ length: 26 }, (_, i) => currentYear + 1 - i); // 최근 25년 + @
  
  // Calculate number of days in the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // useEffect to handle day validation when month/year changes
  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(1); // 유효하지 않은 날짜이면 1일로 리셋
    }
  }, [selectedYear, selectedMonth, selectedDay, daysInMonth]);

  // Modal '확인' 버튼 핸들러
  const handleDateConfirm = () => {
    const dateString = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, birthDate: dateString }));
    setShowDatePicker(false);
  };

  // [✨ 해결] 이 함수 정의가 누락되었습니다.
  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // '/home' 경로 확인 필요
  }, [navigation]);

  // (4) Context에 데이터 저장 핸들러
  const handleGenderSelect = (gender: 'male' | 'female' | 'unknown') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleNeuteredSelect = (neutered: boolean | null) => {
    setFormData(prev => ({ ...prev, isNeutered: neutered }));
  };

  // (handleSubmit의 setIsLoading(true) 및 Alert 후 setIsLoading(false) 추가 확인)
  const handleSubmit = useCallback(() => {
    setIsLoading(true); // 로딩 시작

    if (knowsBirthDate && !formData.birthDate) {
      Alert.alert("오류", "생년월일을 선택해주세요.");
      setIsLoading(false); // 로딩 중지
      return;
    }
    if (!knowsBirthDate && !approxAge) {
      Alert.alert("오류", "추정 나이(O살)를 입력해주세요.");
      setIsLoading(false); // 로딩 중지
      return;
    }
    
    // 성별만 필수 체크 (isNeutered는 null을 허용하므로 검증 제거)
    if (!formData.gender) {
      Alert.alert("오류", "성별을 선택해주세요.");
      setIsLoading(false); // 로딩 중지
      return;
    }
    
    if (!knowsBirthDate) {
       setFormData(prev => ({ ...prev, birthDate: null }));
    }

    try {
      navigation.navigate('/register-dog/step4');
    } catch (error: any) {
      Alert.alert("오류", `처리 중 문제가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false); 
    }

  }, [navigation, formData, knowsBirthDate, approxAge, setIsLoading, setFormData]);

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
          {/* === 나이 입력 === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>생년월일</Text>
            {knowsBirthDate ? (
              <Pressable onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={styles.inputField}
                  value={(formData && formData.birthDate) ? `${formData.birthDate.split('-')[0]}년 ${parseInt(formData.birthDate.split('-')[1])}월 ${parseInt(formData.birthDate.split('-')[2])}일` : ''}
                  placeholder="YYYY년 MM월 DD일 (여기를 눌러 선택)"
                  placeholderTextColor="#9E9E9E"
                  editable={false}
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
            {/* "잘 모름" 체크박스 */}
            <Pressable style={styles.checkboxContainer} onPress={() => setKnowsBirthDate(!knowsBirthDate)}>
              <View style={[styles.checkbox, !knowsBirthDate && styles.checkboxChecked]} />
              <Txt style={styles.checkboxLabel}>정확한 생년월일을 몰라요</Txt>
            </Pressable>
          </View>

          {/* === 성별 입력 === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>성별 *</Text>
            <View style={styles.chipGroup}>
              {/* '남' Chip */}
              <Pressable 
                style={[styles.chip, formData.gender === 'male' && styles.chipSelected]} 
                onPress={() => handleGenderSelect('male')}
              >
                <Txt style={[styles.chipText, formData.gender === 'male' && styles.chipTextSelected]}>남</Txt>
              </Pressable>
              {/* '여' Chip */}
              <Pressable 
                style={[styles.chip, formData.gender === 'female' && styles.chipSelected]} 
                onPress={() => handleGenderSelect('female')}
              >
                <Txt style={[styles.chipText, formData.gender === 'female' && styles.chipTextSelected]}>여</Txt>
              </Pressable>
              {/* '모름' Chip */}
              <Pressable 
                style={[styles.chip, formData.gender === 'unknown' && styles.chipSelected]} 
                onPress={() => handleGenderSelect('unknown')}
              >
                <Txt style={[styles.chipText, formData.gender === 'unknown' && styles.chipTextSelected]}>모름</Txt>
              </Pressable>
            </View>
          </View>
          
          {/* === 중성화 입력 === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>중성화 여부 *</Text>
            <View style={styles.chipGroup}>
              {/* '했어요' Chip */}
              <Pressable 
                style={[styles.chip, formData.isNeutered === true && styles.chipSelected]} 
                onPress={() => handleNeuteredSelect(true)}
              >
                <Txt style={[styles.chipText, formData.isNeutered === true && styles.chipTextSelected]}>했어요</Txt>
              </Pressable>
              {/* '안했어요' Chip */}
              <Pressable 
                style={[styles.chip, formData.isNeutered === false && styles.chipSelected]} 
                onPress={() => handleNeuteredSelect(false)}
              >
                <Txt style={[styles.chipText, formData.isNeutered === false && styles.chipTextSelected]}>안했어요</Txt>
              </Pressable>
              {/* '모름' Chip */}
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

      {/* (2) Date Picker Modal (React Native 기본 Modal 사용) */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Txt style={styles.datePickerTitle}>생년월일 선택</Txt>
            
            <View style={styles.pickerRow}>
              {/* 년도 선택 ScrollView */}
              <ScrollView 
                style={styles.pickerColumn} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" // 터치 이벤트
              >
                {years.map((year) => (
                  <Pressable
                    key={year}
                    style={[styles.pickerOption, selectedYear === year && styles.pickerOptionSelected]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Txt style={[styles.pickerText, selectedYear === year && styles.pickerTextSelected]}>
                      {year}년
                    </Txt>
                  </Pressable>
                ))}
              </ScrollView>

              {/* 월 선택 ScrollView */}
              <ScrollView 
                style={styles.pickerColumn} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" // 터치 이벤트
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Pressable
                    key={month}
                    style={[styles.pickerOption, selectedMonth === month && styles.pickerOptionSelected]}
                    onPress={() => setSelectedMonth(month)}
                  >
                    <Txt style={[styles.pickerText, selectedMonth === month && styles.pickerTextSelected]}>
                      {month}월
                    </Txt>
                  </Pressable>
                ))}
              </ScrollView>
              
              {/* 일 선택 ScrollView */}
              <ScrollView 
                style={styles.pickerColumn} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" // 터치 이벤트
              >
                {days.map((day) => (
                  <Pressable
                    key={day}
                    style={[styles.pickerOption, selectedDay === day && styles.pickerOptionSelected]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Txt style={[styles.pickerText, selectedDay === day && styles.pickerTextSelected]}>
                      {day}일
                    </Txt>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            
            {/* (3) UX 문제 해결: Modal 하단에 버튼용 컨테이너 추가 */}
            <View style={styles.modalButtonContainer}>
              <Button
                type="dark"
                style="weak"
                display="block"
                onPress={() => setShowDatePicker(false)}
                style={{ flex: 1 }} // (3) flex: 1
              >
                취소
              </Button>
              <Button
                type="primary"
                style="fill"
                display="block"
                onPress={handleDateConfirm}
                style={{ flex: 1 }} // (3) flex: 1
              >
                확인
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* === 하단 고정 버튼 (페이지 메인 버튼) === */}
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

// (4) StyleSheet 수정 (Modal 버튼 영역 패딩 추가)
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
    color: adaptive.grey900,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: adaptive.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 450, // (수정) 고정 높이 지정
    flexDirection: 'column', // (수정) 수직 정렬
  },
  datePickerContainer: { // (수정) 남은 공간 모두 차지
    flex: 1, 
    paddingVertical: 16,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: adaptive.grey900,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    flex: 1,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerOption: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: adaptive.grey100,
    borderRadius: 8,
  },
  pickerText: {
    fontSize: 16,
    color: adaptive.grey700,
  },
  pickerTextSelected: {
    fontSize: 16,
    color: adaptive.blue500,
    fontWeight: 'bold',
  },
  // (4) UX 문제 해결: Modal 버튼 컨테이너 스타일 추가
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 16, // 좌우 패딩
    paddingBottom: 24, // (중요) 하단 여백 추가
    borderTopWidth: 1,
    borderTopColor: adaptive.grey100,
  },
});

export default RegisterDogDetailsScreen;