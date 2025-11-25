import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, PanResponder, Animated } from 'react-native';
import { getReferencePhotos } from '@/utils/referencePhotos';

// TypeScript Interfaces
export interface ReferenceGalleryProps {
  scenario: string;  // 'portrait-full', 'portrait-half', 'close-up'
  location: string;  // 'outdoors', 'indoors', 'restaurant', 'beach'
  onReferenceChange?: (index: number) => void;
}

interface ReferenceGalleryState {
  references: any[];  // Array of loaded image references
  currentIndex: number;
  isExpanded: boolean;
  isLoading: boolean;
}

/**
 * ReferenceGallery Component
 *
 * Displays reference photos as a thumbnail overlay on the camera preview.
 * Supports swiping between references and tap-to-expand functionality.
 *
 * Performance target: Must not impact camera preview (maintain 30fps)
 */
export default function ReferenceGallery({
  scenario,
  location,
  onReferenceChange
}: ReferenceGalleryProps) {
  // Component state
  const [state, setState] = useState<ReferenceGalleryState>({
    references: [],
    currentIndex: 0,
    isExpanded: false,
    isLoading: true,
  });

  // Animation for fade effect (Phase 4)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Swipe gesture tracking (Phase 4)
  const swipeStart = useRef({ x: 0, y: 0 });
  const SWIPE_THRESHOLD = 50; // Minimum distance for swipe detection

  // Load reference photos based on scenario and location (Phase 2)
  useEffect(() => {
    try {
      const photos = getReferencePhotos(scenario, location);
      setState(prev => ({
        ...prev,
        references: photos,
        currentIndex: 0,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to load reference photos:', error);
      setState(prev => ({
        ...prev,
        references: [],
        isLoading: false,
      }));
    }
  }, [scenario, location]);

  // Notify parent when reference changes
  useEffect(() => {
    if (onReferenceChange && state.references.length > 0) {
      onReferenceChange(state.currentIndex);
    }
  }, [state.currentIndex, onReferenceChange, state.references.length]);

  // Navigate to next/previous reference with fade animation (Phase 4)
  const navigateReference = (direction: 'next' | 'prev') => {
    if (state.references.length <= 1) return;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // Update index with wrapping
      setState(prev => {
        const newIndex = direction === 'next'
          ? (prev.currentIndex + 1) % prev.references.length
          : (prev.currentIndex - 1 + prev.references.length) % prev.references.length;
        return { ...prev, currentIndex: newIndex };
      });

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  // PanResponder for swipe gestures (Phase 4)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        // Record starting position
        swipeStart.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
      },

      onPanResponderMove: (evt, gestureState) => {
        // Allow vertical camera movements, only track horizontal
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);

        // If horizontal movement dominates, prevent vertical scrolling
        if (dx > dy && dx > 10) {
          return true;
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        const dx = gestureState.dx;
        const dy = gestureState.dy;

        // Only process horizontal swipes
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx > 0) {
            // Swipe right - show previous
            navigateReference('prev');
          } else {
            // Swipe left - show next
            navigateReference('next');
          }
        }
      },

      onPanResponderTerminate: () => {
        // Gesture cancelled
      },
    })
  ).current;

  // Show loading state
  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Handle empty category gracefully
  if (state.references.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            No reference{'\n'}photos
          </Text>
        </View>
      </View>
    );
  }

  // Get current reference photo
  const currentPhoto = state.references[state.currentIndex];

  return (
    <View style={styles.container}>
      {/* Thumbnail view - Display actual photo with swipe gestures (Phase 4) */}
      <Animated.View
        style={[styles.thumbnail, { opacity: fadeAnim }]}
        {...panResponder.panHandlers}
      >
        <Image
          source={currentPhoto}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
        {/* Photo counter */}
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {state.currentIndex + 1}/{state.references.length}
          </Text>
        </View>
        {/* Swipe indicator */}
        {state.references.length > 1 && (
          <View style={styles.swipeIndicator}>
            <Text style={styles.swipeText}>← swipe →</Text>
          </View>
        )}
      </Animated.View>

      {/* Expanded view overlay (Phase 5) */}
      {state.isExpanded && (
        <View style={styles.expandedOverlay}>
          <Text style={styles.expandedText}>Expanded View</Text>
        </View>
      )}
    </View>
  );
}

// Styles following dark theme
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
  placeholder: {
    width: 80,
    height: 120,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  placeholderText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  thumbnail: {
    width: 80,
    height: 120,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  counter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  counterText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  expandedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedText: {
    color: '#fff',
    fontSize: 16,
  },
});
