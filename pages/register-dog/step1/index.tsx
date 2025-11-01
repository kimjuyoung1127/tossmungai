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
  const [dogName, setDogName] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageResponse | null>(null); // <--- (추가) 선택된 이미지 상태
  const [isLoading, setIsLoading] = useState(false); // <--- (수정) 전체 로딩
  const [isImageLoading, setIsImageLoading] = useState(false); // <--- (추가) 이미지 선택 로딩

  // (추가) 사진 선택 로직
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
              setSelectedImage(response);
              console.log("Image set in state:", response ? "success" : "failed");
            } catch (error: any) {
              console.log("Camera error:", error);
              if (error instanceof OpenCameraPermissionError) {
                Alert.alert("카메라 권한", "카메라 접근 권한이 필요합니다.");
                // (Optional) openPermissionDialog() 호출
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
                setSelectedImage(response[0]);
                console.log("Image set in state: success");
              } else {
                console.log("No images selected from album");
              }
            } catch (error: any) {
              console.log("Album error:", error);
              if (error instanceof FetchAlbumPhotosPermissionError) {
                Alert.alert("앨범 권한", "앨범 접근 권한이 필요합니다.");
                // (Optional) openPermissionDialog() 호출
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
  }, [isImageLoading]);

  // (수정) 다음 단계로 데이터 전달
  const handleSubmit = useCallback(() => {
    console.log("=== Submit Debug Info ===");
    console.log("Dog name:", dogName);
    console.log("Selected image exists:", !!selectedImage);
    console.log("Image data URI exists:", selectedImage && !!selectedImage.dataUri);
    console.log("Navigation object:", navigation);
    console.log("========================");
    
    // Validate required field
    if (!dogName) {
      console.log("Validation failed: Dog name is required");
      Alert.alert("오류", "반려견 이름을 입력해주세요.");
      return;
    }
    
    // (로직 변경) DB 저장이 아닌, 다음 스텝으로 데이터 전달
    try {
      const dataToPass = {
        dogName: dogName,
        // base64 문자열만 전달 (ImageResponse 객체 전체 전달은 비권장)
        imageDataUri: selectedImage ? `data:image/jpeg;base64,${selectedImage.dataUri}` : null, 
      };
      
      console.log("Data being passed to next step:", dataToPass);
      
      navigation.navigate('/register-dog/step2', dataToPass);
    } catch (error: any) {
      console.log("Navigation error:", error);
      Alert.alert("오류", `다음 단계로 이동 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [navigation, dogName, selectedImage]);

  const handleExplore = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: '/home' }] });
  }, [navigation]);

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
          {/* === (추가) 사진 업로드 UI === */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>프로필 사진 (선택)</Text>
            <Pressable style={styles.imageUploader} onPress={handleSelectImage} disabled={isImageLoading}>
              {isImageLoading ? (
                <ActivityIndicator size="large" color={adaptive.blue500} />
              ) : selectedImage ? (
                // (수정) 선택된 이미지 표시 (base64)
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${selectedImage.dataUri}` }} 
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
              value={dogName}
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
            disabled={isLoading || !dogName} // 이름은 필수로
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