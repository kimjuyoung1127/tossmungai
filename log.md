// pages/onboarding/select-role.tsx
import React, { useCallback, useState } from 'react';
import { View, Alert, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  Txt,
  Asset,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { supabase } from '@/supabase/supabase'; // Supabase 클라이언트 import

// Granite 라우트 정의
export const Route = createRoute('/onboarding/select-role', {
  component: SelectRoleScreen,
});

// adaptive 색상 정의 (어두운 테마 기준)
const adaptive = {
  grey900: '#191F28', // 어두운 배경
  grey800: '#333A46', // 카드 배경
  grey700: '#5B6371', // 부제목
  white: '#FFFFFF',   // 기본 텍스트
  blue500: '#0064FF', // Primary 색상
};

function SelectRoleScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  
  // (선택된 카드 하이라이트를 위한 상태)
  const [selectedRole, setSelectedRole] = useState<'user' | 'trainer' | null>(null);

  const handleSelectRole = useCallback(async (role: 'user' | 'trainer') => {
    if (isLoading) return;
    
    setSelectedRole(role); // (1) UI상 선택됨을 표시
    setIsLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error(userError?.message || '로그인된 사용자 정보를 찾을 수 없습니다.');
      }

      const { error }_ = await supabase
        .from('users')
        .update({ role: role })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      console.log(`Role updated to: ${role}`);

      if (role === 'user') {
        navigation.reset({ index: 0, routes: [{ name: '/onboarding/register-dog' }] });
      } else if (role === 'trainer') {
        navigation.reset({ index: 0, routes: [{ name: '/onboarding/register-provider' }] });
      }

    } catch (error: any) {
      console.error("역할 업데이트 실패:", error);
      Alert.alert(
        "오류 발생",
        `역할을 저장하는 중 문제가 발생했어요: ${error.message || '알 수 없는 오류'}`
      );
      setIsLoading(false);
      setSelectedRole(null); // (2) 오류 시 선택 상태 초기화
    }
  }, [navigation, isLoading]);

  return (
    // (3) 기존 온보딩과 유사하게 어두운 배경 적용
    <View style={styles.container}> 
      <Top
        title={
          <Top.TitleParagraph color={adaptive.white}> {/* (4) 텍스트 흰색으로 */}
            멍멍AI를 어떤 목적으로
            {'\n'}
            이용하시나요?
          </Top.TitleParagraph>
        }
        subtitle2={
          <Top.SubtitleParagraph color={adaptive.grey700}> {/* (4) 텍스트 회색으로 */}
            하나를 선택해주세요.
          </Top.SubtitleParagraph>
        }
      />

      <View style={styles.cardContainer}>
        {/* === 일반 사용자 카드 === */}
        <Pressable 
          style={({ pressed }) => [
            styles.card,
            // (5) Primary 색상 적용: 선택 시 Primary 테두리
            selectedRole === 'user' ? styles.cardSelectedPrimary : (pressed && styles.cardPressed)
          ]}
          onPress={() => handleSelectRole('user')}
          disabled={isLoading}
        >
          <Asset.Icon name="icon-user-dog-mono" size={40} style={styles.icon} color={adaptive.white} />
          <Txt typography="t4" fontWeight="bold" style={styles.cardTitle}>
            반려견 훈련/돌봄이 필요해요
          </Txt>
          <Txt typography="t7" style={styles.cardSubtitle}>
            AI 맞춤 훈련과 검증된 전문가를 찾아보세요.
          </Txt>
        </Pressable>

        {/* === 전문가(제공자) 카드 === */}
        <Pressable 
          style={({ pressed }) => [
            styles.card,
            // (5) Primary 색상 적용: 선택 시 Primary 테두리
            selectedRole === 'trainer' ? styles.cardSelectedPrimary : (pressed && styles.cardPressed)
          ]}
          onPress={() => handleSelectRole('trainer')}
          disabled={isLoading}
        >
          <Asset.Icon name="icon-badge-mono" size={40} style={styles.icon} color={adaptive.white} />
          <Txt typography="t4" fontWeight="bold" style={styles.cardTitle}>
            전문가로 활동하고 싶어요
          </Txt>
          <Txt typography="t7" style={styles.cardSubtitle}>
            훈련사, 펫시터, 도그워커로 등록하세요.
          </Txt>
        </Pressable>
      </View>

      {/* 로딩 표시기 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={adaptive.blue500} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adaptive.grey900, // (3) 어두운 배경색 적용
    padding: 16,
  },
  cardContainer: {
    marginTop: 32,
    gap: 16,
  },
  card: {
    backgroundColor: adaptive.grey800, // (4) 카드 배경 어둡게
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent', // 기본 테두리 투명
  },
  cardPressed: { // (5) 클릭 시 임시 하이라이트 (선택 사항)
    borderColor: adaptive.grey700, 
  },
  cardSelectedPrimary: { // (5) Primary 색상 적용 (선택됨)
    borderColor: adaptive.blue500, 
  },
  icon: {
    marginBottom: 12,
  },
  cardTitle: {
    color: adaptive.white, // (4) 텍스트 흰색으로
    marginBottom: 4,
  },
  cardSubtitle: {
    color: adaptive.grey700, // (4) 텍스트 회색으로
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 31, 40, 0.7)', // (3) 어두운 배경에 맞춘 오버레이
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectRoleScreen;