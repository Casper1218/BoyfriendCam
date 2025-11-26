import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import ReferenceGallery from '@/components/ReferenceGallery';
import { useDevSettings } from '@/contexts/DevContext';

const tips = {
  'portrait-full': {
    outdoors: 'Step back until feet to head visible. Camera at chest height.',
    indoors: 'Use window light. Step back for full body shot.',
    restaurant: 'Stand up for full body. Use ambient lighting.',
    beach: 'Golden hour lighting. Step back for full frame.',
  },
  'portrait-half': {
    outdoors: 'Waist up shot. Natural light from side.',
    indoors: 'Waist up. Position near window for good light.',
    restaurant: 'Sit or stand. Waist up composition.',
    beach: 'Waist up. Avoid harsh shadows.',
  },
  'close-up': {
    outdoors: 'Get closer. Focus on eyes. Natural side lighting.',
    indoors: 'Move closer. Focus on face. Use soft window light.',
    restaurant: 'Close portrait. Use warm ambient light.',
    beach: 'Close up face. Avoid squinting in bright sun.',
  },
};

export default function CameraScreen() {
  const { scenario, location } = useLocalSearchParams();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const { settings } = useDevSettings();

  // Test button state
  const [testButtonColor, setTestButtonColor] = useState('#FF6B6B');
  const [testButtonText, setTestButtonText] = useState('TEST BUTTON');
  const [testClickCount, setTestClickCount] = useState(0);

  const handleTestButtonClick = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const texts = ['WORKS!', 'CLICKED!', 'TESTING', 'SUCCESS', 'BUTTON OK', 'INTERACTIVE'];
    setTestClickCount(prev => {
      const newCount = prev + 1;
      setTestButtonColor(colors[newCount % colors.length]);
      setTestButtonText(texts[newCount % texts.length]);
      return newCount;
    });
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // Request media library permission if not granted
        if (mediaLibraryPermission?.status !== 'granted') {
          const { status } = await requestMediaLibraryPermission();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need access to your photo library to save photos');
            return;
          }
        }

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        // Save to device photo library
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        
        Alert.alert(
          'Photo Saved! 📸', 
          'Your photo has been saved to your camera roll',
          [
            { text: 'Take Another', style: 'default' },
            { text: 'Back to Home', onPress: () => router.push('/') }
          ]
        );
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const currentTip = tips[scenario as keyof typeof tips]?.[location as keyof typeof tips['portrait-full']] 
    || 'Position your subject and tap to capture';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>{currentTip}</Text>
        </View>
      </SafeAreaView>
      
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      />

      {/* Grid overlay - only shown if enabled in dev settings */}
      {settings.showGridOverlay && (
        <View style={styles.gridOverlay} pointerEvents="none">
          <View style={[styles.gridLine, styles.verticalLine1]} />
          <View style={[styles.gridLine, styles.verticalLine2]} />
          <View style={[styles.gridLine, styles.horizontalLine1]} />
          <View style={[styles.gridLine, styles.horizontalLine2]} />
        </View>
      )}

      {/* Test Button - only shown if enabled in dev settings */}
      {settings.showTestButton && (
        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: testButtonColor }]}
          onPress={handleTestButtonClick}
        >
          <Text style={styles.testButtonText}>{testButtonText}</Text>
          <Text style={styles.testButtonCount}>Clicks: {testClickCount}</Text>
        </TouchableOpacity>
      )}

      {/* Reference Gallery - moved outside CameraView to fix warning */}
      <ReferenceGallery
        scenario={scenario as string}
        location={location as string}
        showDebugInfo={settings.showDebugInfo}
        showOverlayDebug={settings.showOverlayDebug}
      />

      <SafeAreaView style={styles.controlsContainer}>
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.controlText}>← Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.controlText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: '#fff',
    fontSize: 18,
  },
  safeArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  camera: {
    flex: 1,
    position: 'relative',
  },
  tipContainer: {
    padding: 16,
  },
  controlsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  tipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  testButton: {
    position: 'absolute',
    top: 100,
    left: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 100,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testButtonCount: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  verticalLine1: {
    left: '33.33%',
    top: 0,
    bottom: 0,
    width: 1,
  },
  verticalLine2: {
    left: '66.66%',
    top: 0,
    bottom: 0,
    width: 1,
  },
  horizontalLine1: {
    top: '33.33%',
    left: 0,
    right: 0,
    height: 1,
  },
  horizontalLine2: {
    top: '66.66%',
    left: 0,
    right: 0,
    height: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    padding: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
  },
  flipButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    padding: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});