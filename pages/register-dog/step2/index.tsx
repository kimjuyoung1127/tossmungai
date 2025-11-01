// pages/onboarding/register-dog/step2.tsx (Step 2: Breed Search - DB Linked)
import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text,
  TextInput,         // (1) TextInput 추가
  FlatList,          // (1) FlatList 추가
  Pressable,         // (1) Pressable 추가
  ActivityIndicator  // (1) ActivityIndicator 추가
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
  ListRow,             // (1) ListRow 추가
  Txt,                 // (1) Txt 추가
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { useOnboarding } from '@/src/context/OnboardingContext';
import { supabase } from '@/supabase/supabase'; // (1) Supabase 클라이언트 추가

// Granite 라우트 정의
export const Route = createRoute('/register-dog/step2', {
  component: RegisterDogBreedScreen,
});

// DB에서 가져온 견종 타입
type Breed = {
  id: number;
  name_ko: string;
};

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
  grey700: '#5B6371',
  grey100: '#F2F4F6',
  blue500: '#0064FF',
  white: '#FFFFFF',
};

function RegisterDogBreedScreen() {
  const navigation = useNavigation();
  const { formData, setFormData } = useOnboarding();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Breed[]>([]);

  // (3) Supabase 견종 검색 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 0) {
        fetchBreeds();
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // (3) Supabase 쿼리 함수
  const fetchBreeds = async () => {
    setIsLoadingSearch(true);
    try {
      // 이제 DB에 데이터가 있으므로 검색이 작동합니다.
      const { data, error } = await supabase
        .from('breeds') //
        .select('id, name_ko')
        .ilike('name_ko', `${searchQuery}%`) // '푸'로 시작하는 견종 검색
        .limit(5); // 최대 5개

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: any) {
      Alert.alert("검색 오류", error.message);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // (4) 견종 선택 핸들러 (DB 견종)
  const handleBreedSelect = (breed: Breed) => {
    setFormData(prev => ({
      ...prev,
      breedId: breed.id, // DB ID 저장
      breedNameCustom: null
    }));
    setSearchQuery(breed.name_ko); // 검색창에 선택한 이름 표시
    setSearchResults([]); // 목록 닫기
  };

  // (4) 견종 선택 핸들러 (커스텀, 예: 믹스견, 직접입력)
  const handleCustomBreedSelect = (customName: string) => {
    setFormData(prev => ({
      ...prev,
      breedId: null,
      breedNameCustom: customName // Custom 이름 저장
    }));
    setSearchQuery(customName);
    setSearchResults([]);
  };

  // (5) 다음 단계로 이동
  const handleSubmit = useCallback(() => {
    if (!formData.breedId && !formData.breedNameCustom) { 
      Alert.alert("오류", "품종을 선택하거나 직접 입력해주세요.");
      return;
    }
    
    // 다음 스텝으로 이동
    navigation.navigate('/register-dog/step3'); // (step3.tsx 파일 생성 필요)

  }, [navigation, formData]);

  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] });
  }, [navigation]);

  return (
    <FixedBottomCTAProvider>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // 검색 결과 클릭이 가능하도록 설정
        nestedScrollEnabled={true}
      >
        <View style={{ padding: 16 }}>
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                {/* Context의 이름 사용 */}
                {formData.dogName || '반려견'}의 품종을 선택해주세요. (2/4)
              </Top.TitleParagraph>
            }
          />
        </View>

        {/* (6) '품종 선택' 섹션을 '검색 UI'로 대체 */}
        <View style={styles.section}>
          <TextInput
            style={styles.inputField}
            placeholder="견종 이름 검색 (예: 푸들, 포메...)"
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {isLoadingSearch && <ActivityIndicator style={{ marginVertical: 10 }} />}
          
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ListRow
                contents={
                  <Txt>{item.name_ko}</Txt>
                }
                onPress={() => handleBreedSelect(item)}
              />
            )}
            // 검색어가 있고, 로딩이 아닐 때 "직접 입력" 옵션 표시
            ListFooterComponent={() => 
              searchQuery.length > 0 && !isLoadingSearch ? (
                <>
                  <ListRow
                    contents={
                      <Txt>" {searchQuery} " 직접 입력</Txt>
                    }
                    onPress={() => handleCustomBreedSelect(searchQuery)}
                  />
                  <ListRow
                    contents={
                      <Txt>믹스견</Txt>
                    }
                    onPress={() => handleCustomBreedSelect("믹스견")}
                  />
                  <ListRow
                    contents={
                      <Txt>잘 모르겠어요</Txt>
                    }
                    onPress={() => handleCustomBreedSelect("모름")}
                  />
                </>
              ) : null
            }
          />
          
          {/* 검색어가 없을 때 보여주는 기본 옵션 */}
          {searchQuery.length === 0 && !isLoadingSearch && (
            <View style={styles.staticOptions}>
              <Pressable style={styles.chip} onPress={() => handleCustomBreedSelect("믹스견")}>
                <Txt style={styles.chipText}>믹스견</Txt>
              </Pressable>
              <Pressable style={styles.chip} onPress={() => handleCustomBreedSelect("모름")}>
                <Txt style={styles.chipText}>잘 모르겠어요</Txt>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* === 하단 고정 버튼 === */}
      <FixedBottomCTA.Double
        leftButton={
          <Button
            type="dark" style="weak" display="block"
            onPress={handleExplore} disabled={isLoadingSubmit}
          >
            나중에 할래요
          </Button>
        }
        rightButton={
          <Button
            type="primary" style="fill" display="block"
            onPress={handleSubmit}
            loading={isLoadingSubmit}
            disabled={isLoadingSubmit || (!formData.breedId && !formData.breedNameCustom)} 
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

// (7) StyleSheet 업데이트
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 150,
  },
  section: {
    paddingHorizontal: 16,
  },
  inputField: { 
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: adaptive.white,
    marginBottom: 8,
    color: adaptive.grey900,
  },
  staticOptions: { 
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    backgroundColor: adaptive.grey100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    color: adaptive.grey900,
  },
});

export default RegisterDogBreedScreen;