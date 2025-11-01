// pages/register-dog/step1/index.tsx (Step 1: Name & Photo Input)
import React, { useState, useCallback } from 'react';
import { View, Alert, ScrollView, StyleSheet, Text, TextInput, Pressable, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Top,
  FixedBottomCTA,
  FixedBottomCTAProvider,
  Button,
  Asset, // Asset.Icon 사용을 위해 import
} from '@toss/tds-react-native';
import { createRoute } from '@granite-js/react-native';
import { 
  fetchAlbumPhotos, 
  FetchAlbumPhotosPermissionError,
  openCamera,
  OpenCameraPermissionError,
  type ImageResponse // 타입 import
} from '@apps-in-toss/framework'; // <--- Toss SDK 함수 import
import { useOnboarding } from '@/src/context/OnboardingContext'; // <--- (1) Context 훅 import

// Granite 라우트 정의
export const Route = createRoute('/register-dog/step1', {
  component: RegisterDogNameScreen,
});

// adaptive 색상 정의
const adaptive = {
  grey900: '#191F28',
  grey700: '#5B6371',
  grey100: '#F2F4F6',
  blue500: '#0064FF', // Primary
};

function RegisterDogNameScreen() {
  const navigation = useNavigation();
  const { formData, setFormData } = useOnboarding(); // <--- (2) Context에서 상태 가져오기
  const [isImageLoading, setIsImageLoading] = useState(false); // <--- (수정) 이미지 선택 로딩

  // (수정) 사진 선택 로직을 Context에 맞게 업데이트
  const handleSelectImage = useCallback(() => {
    console.log("=== Photo Selection Debug Info ===");
    console.log("Image selection started");
    console.log("Current image loading state:", isImageLoading);
    console.log("==================================");
    
    Alert.alert(
      "프로필 사진 선택",
      "사진을 가져올 방법을 선택하세요.",
      [
        { 
          text: "사진 촬영", 
          onPress: async () => {
            console.log("Camera option selected");
            setIsImageLoading(true);
            try {
              console.log("Opening camera...");
              // 1. 카메라 열기
              const response = await openCamera({ base64: true, maxWidth: 1024 });
              console.log("Camera response:", response);
              
              // (3) Context에 이미지 저장
              setFormData(prev => ({ 
                ...prev, 
                imageDataUri: response ? `data:image/jpeg;base64,${response.dataUri}` : null 
              }));
              
              console.log("Image set in context:", response ? "success" : "failed");
            } catch (error: any) {
              console.log("Camera error:", error);
              if (error instanceof OpenCameraPermissionError) {
                Alert.alert("카메라 권한", "카메라 접근 권한이 필요합니다.\n설정 > 앱에서 권한을 허용해주세요.");
              } else {
                Alert.alert("오류", "사진 촬영 중 오류가 발생했습니다.");
              }
            } finally {
              setIsImageLoading(false);
              console.log("Image loading state reset");
            }
          }
        },
        { 
          text: "앨범에서 선택",
          onPress: async () => {
            console.log("Album option selected");
            setIsImageLoading(true);
            try {
              console.log("Opening album...");
              // 2. 앨범 열기 (1장만 선택)
              const response = await fetchAlbumPhotos({ maxCount: 1, base64: true, maxWidth: 1024 });
              console.log("Album response length:", response.length);
              if (response.length > 0) {
                console.log("First image data received:", response[0]);
                
                // (3) Context에 이미지 저장
                setFormData(prev => ({ 
                  ...prev, 
                  imageDataUri: `data:image/jpeg;base64,${response[0].dataUri}` 
                }));
                
                console.log("Image set in context: success");
              } else {
                console.log("No images selected from album");
              }
            } catch (error: any) {
              console.log("Album error:", error);
              if (error instanceof FetchAlbumPhotosPermissionError) {
                Alert.alert("앨범 권한", "앨범 접근 권한이 필요합니다.\n설정 > 앱에서 권한을 허용해주세요.");
              } else {
                Alert.alert("오류", "사진을 가져오는 중 오류가 발생했습니다.");
              }
            } finally {
              setIsImageLoading(false);
              console.log("Image loading state reset");
            }
          }
        },
        { text: "취소", style: "cancel" }
      ]
    );
  }, [isImageLoading, setFormData]);

  // (수정) 다음 단계로 Context 데이터 전달
  const handleSubmit = useCallback(() => {
    console.log("=== Submit Debug Info ===");
    console.log("Dog name:", formData.dogName);
    console.log("Selected image exists:", !!formData.imageDataUri);
    console.log("Navigation object:", navigation);
    console.log("========================");
    
    // Validate required field
    if (!formData.dogName) {
      console.log("Validation failed: Dog name is required");
      Alert.alert("오류", "반려견 이름을 입력해주세요.");
      return;
    }
    
    // (5) DB 저장이 아닌, 다음 스텝으로 이동만 함
    try {
      navigation.navigate('/register-dog/step2'); // <-- params 필요 없음
    } catch (error: any) {
      console.log("Navigation error:", error);
      Alert.alert("오류", `다음 단계로 이동 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [navigation, formData.dogName]);

  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] });
  }, [navigation]);
  
  // (3) 상태 변경 시 Context에 저장
  const setDogName = (name: string) => {
    setFormData(prev => ({ ...prev, dogName: name }));
  };

  return (
    <FixedBottomCTAProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 16 }}>
          <Top
            title={<Top.TitleParagraph color={adaptive.grey900}>반려견 정보 등록</Top.TitleParagraph>}
            subtitle2={<Top.SubtitleParagraph>우리 아이 정보를 알려주세요. (1/4)</Top.SubtitleParagraph>} // <--- 스텝 표시
          />
        </View>

        <View style={styles.section}>
          {/* === (수정) 사진 업로드 UI: Context 데이터 사용 === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>프로필 사진 (선택)</Text>
            <Pressable style={styles.imageUploader} onPress={handleSelectImage} disabled={isImageLoading}>
              {isImageLoading ? (
                <ActivityIndicator size="large" color={adaptive.blue500} />
              ) : formData.imageDataUri ? (
                // (6) Context 데이터로 UI 표시
                <Image 
                  source={{ uri: formData.imageDataUri }} 
                  style={styles.profileImage}
                  resizeMode="cover" // Ensure proper image display
                />
              ) : (
                <Asset.Icon 
                  name="icon-camera-mono" 
                  size={40} 
                  color={adaptive.grey700} 
                />
              )}
            </Pressable>
          </View>

          {/* === 이름 입력 UI === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이름 *</Text>
            <TextInput
              style={styles.inputField}
              value={formData.dogName || ''}
              onChangeText={setDogName}
              placeholder="예: 바둑이"
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
            // Context에서 isLoading 상태를 가져올 수 있도록 확장할 수 있음
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
            // Context에서 isLoading 상태를 가져올 수 있도록 확장할 수 있음
            disabled={!formData.dogName} // (6) Context 데이터로 검증
          >
            다음
          </Button>
        }
      />
    </FixedBottomCTAProvider>
  );
}

// StyleSheet 업데이트
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 150,
  },
  section: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 24, // 간격 조정
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
  // (추가) 이미지 업로더 스타일
  imageUploader: {
    height: 120,
    width: 120,
    borderRadius: 60, // 원형
    backgroundColor: adaptive.grey100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // 가운데 정렬
    overflow: 'hidden', // 이미지가 둥근 모서리를 넘지 않도록
  },
  profileImage: {
    height: 120,
    width: 120,
  },
});

export default RegisterDogNameScreen;