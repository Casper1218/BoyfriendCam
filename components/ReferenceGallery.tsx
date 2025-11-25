import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, PanResponder, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { getReferencePhotos } from '@/utils/referencePhotos';

// TypeScript Interfaces
export interface ReferenceGalleryProps {
  scenario: string;  // 'portrait-full', 'portrait-half', 'close-up'
  location: string;  // 'outdoors', 'indoors', 'restaurant', 'beach'
  onReferenceChange?: (index: number) => void;
  showDebugInfo?: boolean; // Show debug info and logs
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
  onReferenceChange,
  showDebugInfo = false
}: ReferenceGalleryProps) {
  // Component state
  const [state, setState] = useState<ReferenceGalleryState>({
    references: [],
    currentIndex: 0,
    isExpanded: false,
    isLoading: true,
  });

  // Debug logging state
  const [debugText, setDebugText] = useState('Waiting for touch...');

  // Animation for fade effect (Phase 4)
  // Performance: Uses native driver for 60fps animations without blocking JS thread
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // CRITICAL FIX: Use ref to store references so panResponder can access current value
  // PanResponder is created once and captures stale state - refs solve this!
  const referencesRef = useRef<any[]>([]);
  const currentIndexRef = useRef<number>(0);

  // Swipe gesture configuration (Phase 4)
  const SWIPE_THRESHOLD = 50; // Minimum distance for swipe detection
  const TAP_THRESHOLD = 10; // Maximum movement for tap detection (Phase 5)

  // Load reference photos based on scenario and location (Phase 2)
  useEffect(() => {
    if (showDebugInfo) {
      console.log('[LOAD] useEffect triggered');
      console.log('[LOAD] Scenario:', scenario, 'Location:', location);
      console.log('[LOAD] Scenario type:', typeof scenario, 'Location type:', typeof location);
    }

    try {
      const photos = getReferencePhotos(scenario, location);
      if (showDebugInfo) {
        console.log('[LOAD] getReferencePhotos returned:', photos);
        console.log('[LOAD] Photos count:', photos.length);
      }

      setState(prev => ({
        ...prev,
        references: photos,
        currentIndex: 0,
        isLoading: false,
      }));

      // CRITICAL: Update refs so panResponder can access current values
      referencesRef.current = photos;
      currentIndexRef.current = 0;

      if (showDebugInfo) {
        setDebugText(`[LOAD] Loaded ${photos.length} photos for ${scenario}-${location}`);
        console.log('[LOAD] State updated successfully');
        console.log('[LOAD] Refs updated - referencesRef.current.length:', referencesRef.current.length);
      }
    } catch (error) {
      console.error('[LOAD] Failed to load reference photos:', error);
      setState(prev => ({
        ...prev,
        references: [],
        isLoading: false,
      }));
      if (showDebugInfo) {
        setDebugText(`[LOAD] ERROR: ${error}`);
      }
    }
  }, [scenario, location, showDebugInfo]);

  // Notify parent when reference changes
  useEffect(() => {
    if (onReferenceChange && state.references.length > 0) {
      onReferenceChange(state.currentIndex);
    }
  }, [state.currentIndex, onReferenceChange, state.references.length]);

  // Navigate to next/previous reference with fade animation (Phase 4)
  // Performance: Fast transitions (200ms total) minimize impact on camera preview
  const navigateReference = (direction: 'next' | 'prev') => {
    // CRITICAL FIX: Use refs instead of state - panResponder has closure over stale state!
    if (showDebugInfo) {
      console.log('[NAV] Called with direction:', direction);
      console.log('[NAV] Current index (ref):', currentIndexRef.current);
      console.log('[NAV] Total references (ref):', referencesRef.current.length);
    }

    if (referencesRef.current.length <= 1) {
      if (showDebugInfo) {
        setDebugText(`[NAV] Only ${referencesRef.current.length} photo(s), can't swipe`);
      }
      return;
    }

    if (showDebugInfo) {
      setDebugText(`[NAV] Swiping ${direction}...`);
    }

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      if (showDebugInfo) {
        console.log('[NAV] Fade out complete, updating index');
      }

      // Calculate new index using refs
      const newIndex = direction === 'next'
        ? (currentIndexRef.current + 1) % referencesRef.current.length
        : (currentIndexRef.current - 1 + referencesRef.current.length) % referencesRef.current.length;

      if (showDebugInfo) {
        console.log('[NAV] Changing from', currentIndexRef.current, 'to', newIndex);
      }

      // Update BOTH ref and state
      currentIndexRef.current = newIndex;
      setState(prev => {
        if (showDebugInfo) {
          setDebugText(`[NAV] Changed to ${newIndex + 1}/${referencesRef.current.length}`);
        }
        return { ...prev, currentIndex: newIndex };
      });

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        if (showDebugInfo) {
          console.log('[NAV] Fade in complete');
        }
      });
    });
  };

  // Toggle expanded view (Phase 5)
  const toggleExpanded = () => {
    setState(prev => ({
      ...prev,
      isExpanded: !prev.isExpanded,
    }));
    if (showDebugInfo) {
      console.log('[EXPAND] Toggled to:', !state.isExpanded);
    }
  };

  // PanResponder for swipe gestures (Phase 4)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (showDebugInfo) setDebugText('[START] Should set responder');
        return true;
      },
      onStartShouldSetPanResponderCapture: () => {
        if (showDebugInfo) setDebugText('[START CAPTURE] Capturing touch');
        return true;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const shouldSet = Math.abs(gestureState.dx) > 5;
        if (showDebugInfo) setDebugText(`[MOVE] dx=${Math.round(gestureState.dx)}, shouldSet=${shouldSet}`);
        return shouldSet;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderReject: () => {
        if (showDebugInfo) setDebugText('[REJECTED] Another responder claimed');
      },
      onShouldBlockNativeResponder: () => {
        // Block native components from stealing
        return true;
      },

      onPanResponderGrant: (_, gestureState) => {
        if (showDebugInfo) setDebugText(`[GRANT] Touch started at dx=${gestureState.dx}`);
      },

      onPanResponderMove: (_, gestureState) => {
        if (showDebugInfo) setDebugText(`[MOVE] Dragging: dx=${Math.round(gestureState.dx)}px`);
      },

      onPanResponderRelease: (_, gestureState) => {
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        const totalMovement = Math.sqrt(dx * dx + dy * dy);

        if (showDebugInfo) {
          console.log('[RELEASE] dx:', dx, 'dy:', dy, 'total movement:', totalMovement);
          console.log('[RELEASE] Tap threshold:', TAP_THRESHOLD, 'Swipe threshold:', SWIPE_THRESHOLD);
        }

        // Detect tap (minimal movement) - now ignored in overlay, only swipes matter
        if (totalMovement < TAP_THRESHOLD) {
          if (showDebugInfo) {
            console.log('[RELEASE] TAP detected - ignored (use background or X button to close)');
            setDebugText(`[RELEASE] Tap ignored: ${Math.round(totalMovement)}px`);
          }
          // Do nothing - background and X button handle dismissal
          return;
        }

        // Only process horizontal swipes that exceed threshold
        if (absDx > absDy && absDx > SWIPE_THRESHOLD) {
          if (showDebugInfo) {
            console.log('[RELEASE] VALID SWIPE! Direction:', dx > 0 ? 'RIGHT (prev)' : 'LEFT (next)');
            setDebugText(`[RELEASE] Valid ${absDx}px swipe! Calling navigate...`);
          }

          if (dx > 0) {
            navigateReference('prev');
          } else {
            navigateReference('next');
          }
        } else {
          if (showDebugInfo) {
            console.log('[RELEASE] REJECTED - Too short or not horizontal');
            setDebugText(`[RELEASE] Too short: ${Math.round(absDx)}px (need ${SWIPE_THRESHOLD}px)`);
          }
        }
      },

      onPanResponderTerminate: (_, gestureState) => {
        if (showDebugInfo) setDebugText(`[TERMINATED] Gesture stolen at dx=${Math.round(gestureState.dx)}px`);
      },

      onPanResponderTerminationRequest: () => {
        if (showDebugInfo) setDebugText('[TERMINATION REQUEST] Blocking!');
        return false; // Don't let others steal our gesture!
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
    <>
      {/* Main thumbnail container */}
      <View style={styles.container}>
        {/* DEBUG: Title - only shown if debug enabled */}
        {showDebugInfo && <Text style={styles.debugTitle}>REFERENCE GALLERY DEBUG</Text>}

        {/* DEBUG: Props and State - only shown if debug enabled */}
        {showDebugInfo && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugInfoText}>Props: {scenario} + {location}</Text>
            <Text style={styles.debugInfoText}>State: {state.references.length} photos loaded</Text>
            <Text style={styles.debugInfoText}>Current: {state.currentIndex + 1}/{state.references.length}</Text>
          </View>
        )}

        {/* Thumbnail view - Tap-only to open overlay (Phase 4 updated) */}
        <TouchableWithoutFeedback onPress={toggleExpanded}>
          <Animated.View style={[styles.thumbnail, { opacity: fadeAnim }]}>
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
            {/* Tap indicator */}
            <View style={styles.tapIndicator}>
              <Text style={styles.tapText}>tap to view</Text>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* DEBUG: Gesture logging - only shown if debug enabled */}
        {showDebugInfo && (
          <View style={styles.debugBox}>
            <Text style={styles.debugText}>{debugText}</Text>
          </View>
        )}
      </View>

      {/* Expanded view overlay (Phase 5) - Rendered outside container for full-screen coverage */}
      {/* Performance: Overlay only renders when expanded, no performance impact when collapsed */}
      {state.isExpanded && (
        <View style={styles.expandedOverlay}>
          {/* Dark background overlay - tap to dismiss */}
          <TouchableWithoutFeedback onPress={toggleExpanded}>
            <View style={styles.expandedBackground} />
          </TouchableWithoutFeedback>

          {/* Centered image container with swipe gestures */}
          <Animated.View
            style={[styles.expandedImageContainer, { opacity: fadeAnim }]}
            {...panResponder.panHandlers}
          >
            <Image
              source={currentPhoto}
              style={styles.expandedImage}
              resizeMode="contain"
            />

            {/* Close button as backup */}
            <TouchableWithoutFeedback onPress={toggleExpanded}>
              <View style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </View>
            </TouchableWithoutFeedback>

            {/* Swipe indicator - moved from thumbnail */}
            {state.references.length > 1 && (
              <View style={styles.expandedSwipeIndicator}>
                <Text style={styles.expandedSwipeText}>← swipe →</Text>
              </View>
            )}

            {/* Photo counter in expanded view */}
            <View style={styles.expandedCounter}>
              <Text style={styles.expandedCounterText}>
                {state.currentIndex + 1} / {state.references.length}
              </Text>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
}

// Styles following dark theme
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 180, // Moved up to avoid overlapping camera flip button
    right: 16, // Right margin
    zIndex: 10,
    alignItems: 'center',
  },
  debugTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  debugInfo: {
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  debugInfoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  placeholder: {
    width: 100,
    height: 150,
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
    width: 100,
    height: 150,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 10,
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
    fontSize: 12,
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
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tapIndicator: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  debugBox: {
    marginTop: 12,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    minWidth: 250,
  },
  debugText: {
    color: '#4ECDC4',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  expandedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  expandedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  expandedImageContainer: {
    width: Dimensions.get('window').width * 0.85, // 85% of screen width for better aspect ratio
    maxHeight: Dimensions.get('window').height * 0.75, // Max 75% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 20,
  },
  expandedImage: {
    width: '100%',
    height: '100%',
    minHeight: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  expandedCounter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  expandedCounterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  expandedSwipeIndicator: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  expandedSwipeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
