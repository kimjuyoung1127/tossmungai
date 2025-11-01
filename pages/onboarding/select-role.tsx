// pages/onboarding/select-role.tsx
import React, { useCallback, useState } from 'react';
import { View, Alert, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
// import { appLogin } from '@apps-in-toss/framework'; // 이 페이지에서는 로그인 로직이 필요 없음
// import { loginWithToss } from '@/supabase/auth'; // 이 페이지에서는 로그인 로직이 필요 없음
import { supabase } from '@/supabase/supabase'; // <--- Supabase 클라이언트 import

// Granite 라우트 정의
export const Route = createRoute('/onboarding/select-role', {
  component: SelectRoleScreen,
});

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
  grey700: '#5B6371',
  blue500: '#0064FF', // Primary 색상
};

// StyleSheet (기존과 동일하게 유지)
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 150,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  roleCard: {
    backgroundColor: '#F2F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  roleTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: adaptive.grey900, // <--- 텍스트 색상 명시
  },
  roleDescription: {
    fontSize: 14,
    color: adaptive.grey700,
    lineHeight: 20,
  },
  selectedRoleCard: {
    backgroundColor: '#E3F2FD', // <--- 스키마와 일치하도록 수정
    borderColor: adaptive.blue500, // <--- 스키마와 일치하도록 수정
    borderWidth: 1,
  },
});

function SelectRoleScreen() {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = React.useState<'user' | 'trainer' | null>(null); // <--- 타입 명시
  const [isLoading, setIsLoading] = React.useState(false);

  // [수정 1] roles 배열의 id를 DB 스키마(users.role)와 일치시킴
  const roles = [
    {
      id: 'user', // 'owner' -> 'user' (DB 스키마 기준)
      title: '반려견 보호자',
      description: '나의 반려견을 위한 훈련을 찾고 예약해요',
    },
    {
      id: 'trainer',
      title: '전문 훈련사',
      description: '나의 훈련 서비스를 등록하고 관리해요',
    },
  ];

  // [수정 2] handleNext 함수에 Supabase 업데이트 로직 추가
  const handleNext = useCallback(async () => {
    if (!selectedRole) {
      Alert.alert("오류", "역할을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. 현재 로그인된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error(userError?.message || '로그인된 사용자 정보를 찾을 수 없습니다.');
      }

      // 2. Supabase의 public.users 테이블에 역할(role) 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: selectedRole }) // 선택한 role('user' 또는 'trainer')을 저장
        .eq('id', user.id); // 현재 로그인한 사용자의 id 기준

      if (updateError) {
        throw updateError;
      }

      console.log(`Supabase users.role 업데이트 성공: ${selectedRole}`);

      // 3. 선택된 역할에 따라 다른 페이지로 이동
      let nextPage = '';
      switch(selectedRole) {
        case 'user':
          nextPage = '/register-dog'; // (이 파일이 pages/onboarding/에 있어야 함)
          break;
        case 'trainer':
          nextPage = '/register-provider'; // (이 파일이 pages/onboarding/에 있어야 함)
          break;
      }
      
      navigation.reset({ index: 0, routes: [{ name: nextPage }] });

    } catch (error: any) {
      Alert.alert(
        "오류",
        `처리 중 문제가 발생했습니다: ${error.message || '알 수 없는 오류'}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigation, selectedRole]);

  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // '/home' 파일이 pages/에 있어야 함
  }, [navigation]);

  return (
    <FixedBottomCTAProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 16 }}>
          {/* === 메인 콘텐츠 === */}
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                어떤 용도로 사용하시나요?
              </Top.TitleParagraph>
            }
            subtitle2={
              <Top.SubtitleParagraph>
                아래 역할 중 하나를 선택해주세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          {roles.map((role) => (
            <Pressable // <--- View 대신 Pressable 사용
              key={role.id}
              style={[
                styles.roleCard,
                selectedRole === role.id ? styles.selectedRoleCard : null
              ]}
              onPress={() => setSelectedRole(role.id as 'user' | 'trainer')} // <--- onTouchStart 대신 onPress, 타입 캐스팅
              disabled={isLoading} // <--- 로딩 중 비활성화
            >
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </Pressable>
          ))}
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
            onPress={handleNext}
            loading={isLoading}
            disabled={!selectedRole || isLoading}
          >
            선택 완료
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default SelectRoleScreen;