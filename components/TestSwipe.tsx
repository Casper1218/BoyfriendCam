import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Image } from 'react-native';

/**
 * TestSwipe Component - Simple swipe detection test
 *
 * This is a debugging component to verify PanResponder works.
 * Now displays actual reference photos that change on swipe.
 */
export default function TestSwipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastGesture, setLastGesture] = useState('No swipe yet');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Sample photos from portrait-half-beach category
  const testPhotos = [
    require('@/assets/images/photos/portrait-half-beach/1.jpg'),
    require('@/assets/images/photos/portrait-half-beach/2.jpg'),
    require('@/assets/images/photos/portrait-half-beach/3.jpg'),
    require('@/assets/images/photos/portrait-half-beach/4.jpg'),
    require('@/assets/images/photos/portrait-half-beach/5.jpg'),
    require('@/assets/images/photos/portrait-half-beach/6.jpg'),
  ];
  const SWIPE_THRESHOLD = 50;

  // Handle swipe navigation
  const handleSwipe = (direction: 'left' | 'right') => {
    setLastGesture(`Swiped ${direction}!`);

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // Update index
      setCurrentIndex(prev => {
        if (direction === 'left') {
          return (prev + 1) % testPhotos.length;
        } else {
          return (prev - 1 + testPhotos.length) % testPhotos.length;
        }
      });

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  // PanResponder for swipe detection
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },

      onPanResponderGrant: () => {
        setLastGesture('Touch started...');
      },

      onPanResponderMove: (_, gestureState) => {
        setLastGesture(`Moving: dx=${Math.round(gestureState.dx)}px`);
      },

      onPanResponderRelease: (_, gestureState) => {
        const dx = gestureState.dx;

        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx > 0) {
            handleSwipe('right');
          } else {
            handleSwipe('left');
          }
        } else {
          setLastGesture(`Too short: ${Math.round(Math.abs(dx))}px (need ${SWIPE_THRESHOLD}px)`);
        }
      },

      onPanResponderTerminate: () => {
        setLastGesture('Gesture cancelled');
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SWIPE TEST WITH PHOTOS</Text>
      <Text style={styles.subtitle}>Swipe left or right on the photo</Text>

      <Animated.View
        style={[
          styles.swipeBox,
          { opacity: fadeAnim }
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={testPhotos[currentIndex]}
          style={styles.photoImage}
          resizeMode="cover"
        />
        <View style={styles.counter}>
          <Text style={styles.counterText}>{currentIndex + 1}/{testPhotos.length}</Text>
        </View>
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>← swipe →</Text>
        </View>
      </Animated.View>

      <View style={styles.debugBox}>
        <Text style={styles.debugText}>{lastGesture}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    paddingBottom: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 2,
    borderTopColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
  },
  swipeBox: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  counter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrow: {
    position: 'absolute',
    top: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  arrowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugBox: {
    backgroundColor: '#1a1a1a',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  debugText: {
    color: '#4ECDC4',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});
