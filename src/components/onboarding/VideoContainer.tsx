import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Video } from '@granite-js/react-native';

interface VideoContainerProps {
  videoUri: string;
  containerStyle?: ViewStyle;
  videoStyle?: ViewStyle;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ 
  videoUri, 
  containerStyle = { marginVertical: 16, alignItems: 'center' },
  videoStyle = { width: 375, height: 300 }
}) => {
  const videoRef = React.useRef<any>(null);

  return (
    <View style={containerStyle}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={videoStyle}
        muted={true}
        paused={false}
        isLooping={true}
        resizeMode="cover"
        onError={(error) => {
          // Handle video error silently
        }}
        onLoad={() => {
          // Video loaded successfully
        }}
        onPlaybackStateChanged={(state) => {
          // Monitor playback state but avoid unnecessary intervention
        }}
        onEnd={() => {
          // With isLooping=true, onEnd shouldn't normally fire
          // But if it does, restart the video with minimal delay
          setTimeout(() => {
            if (videoRef.current && videoRef.current.seek) {
              videoRef.current.seek(0);
            }
          }, 50);
        }}
      />
    </View>
  );
};

export default VideoContainer;