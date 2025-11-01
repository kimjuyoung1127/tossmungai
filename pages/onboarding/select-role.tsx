// pages/onboarding/select-role.tsx
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
import { appLogin } from '@apps-in-toss/framework';
import { loginWithToss } from '@/supabase/auth';

// Granite 라우트 정의
export const Route = createRoute('/onboarding/select-role', {
  component: SelectRoleScreen,
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
  },
  roleDescription: {
    fontSize: 14,
    color: adaptive.grey700,
    lineHeight: 20,
  },
  selectedRoleCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
});

function SelectRoleScreen() {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const roles = [
    {
      id: 'owner',
      title: '반려견 보호자',
      description: '나의 반려견을 위한 훈련을 찾고 예약해요',
    },
    {
      id: 'trainer',
      title: '전문 훈련사',
      description: '나의 훈련 서비스를 등록하고 관리해요',
    },
  ];

  const handleNext = useCallback(() => {
    if (!selectedRole) {
      Alert.alert("오류", "역할을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 선택된 역할에 따라 다른 페이지로 이동
      let nextPage = '';
      switch(selectedRole) {
        case 'owner':
          nextPage = '/register-dog';
          break;
        case 'trainer':
          nextPage = '/register-provider';
          break;
        default:
          nextPage = '/register-dog';
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
            <View
              key={role.id}
              style={[
                styles.roleCard,
                selectedRole === role.id ? styles.selectedRoleCard : null
              ]}
              onTouchStart={() => setSelectedRole(role.id)}
            >
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
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