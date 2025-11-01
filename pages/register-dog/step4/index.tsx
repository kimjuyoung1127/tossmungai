// pages/register-dog/step4/index.tsx (Step 4: Confirmation)
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

// Granite 라우트 정의
export const Route = createRoute('/register-dog/step4', {
  component: RegisterDogConfirmationScreen,
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
  summaryCard: {
    backgroundColor: '#F2F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: adaptive.grey900,
  },
  summaryText: {
    fontSize: 14,
    color: adaptive.grey700,
    lineHeight: 20,
  },
});

function RegisterDogConfirmationScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    
    // Complete the registration process
    setTimeout(() => {
      try {
        Alert.alert("축하합니다!", "반려견 정보가 성공적으로 등록되었습니다!");
        navigation.reset({ index: 0, routes: [{ name: '/home' }] }); // Go to home
      } catch (error: any) {
        Alert.alert(
          "오류",
          `처리 중 문제가 발생했습니다: ${error.message || '알 수 없는 오류'}`
        );
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [navigation]);

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
                등록 정보를 확인해주세요.
              </Top.SubtitleParagraph>
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>등록 정보 요약</Text>
            <Text style={styles.summaryText}>이름: 바둑이</Text>
            <Text style={styles.summaryText}>품종: 골든 리트리버</Text>
            <Text style={styles.summaryText}>나이: 12개월</Text>
            <Text style={styles.summaryText}>성격: 활발하고 친근함</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>개인정보 처리방침</Text>
            <Text style={styles.summaryText}>
              귀하의 개인정보는 안전하게 보호되며, 서비스 제공을 위한 목적으로만 사용됩니다.
            </Text>
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
            disabled={isLoading}
          >
            등록 완료
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default RegisterDogConfirmationScreen;