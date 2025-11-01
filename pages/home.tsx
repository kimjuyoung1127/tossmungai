// pages/index.tsx (Home screen)
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';

// Granite 라우트 정의
export const Route = createRoute('/home', {
  component: HomeScreen,
});

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
  grey700: '#5B6371',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#F2F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: adaptive.grey900,
  },
  cardText: {
    fontSize: 14,
    color: adaptive.grey700,
  },
});

function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Handle logout logic here
    navigation.reset({ index: 0, routes: [{ name: '/' }] }); // Onboarding is at root route
  };

  return (
    <FixedBottomCTAProvider>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Top
            title={
              <Top.TitleParagraph color={adaptive.grey900}>
                멍멍AI 홈
              </Top.TitleParagraph>
            }
            subtitle2={
              <Top.SubtitleParagraph>
                반려견 훈련을 스마트하게
              </Top.SubtitleParagraph>
            }
          />
          
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>AI 맞춤 훈련 루틴</Text>
              <Text style={styles.cardText}>성향 분석 기반 훈련 추천</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>전문 훈련사 연결</Text>
              <Text style={styles.cardText}>검증된 훈련사와 예약</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>기록 관리</Text>
              <Text style={styles.cardText}>훈련 진행 상황 확인</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <FixedBottomCTA.Double
        leftButton={
          <Button
            type="dark"
            style="weak"
            display="block"
            onPress={() => {}}
          >
            설정
          </Button>
        }
        rightButton={
          <Button
            type="primary"
            style="fill"
            display="block"
            onPress={handleLogout}
          >
            로그아웃
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

export default HomeScreen;