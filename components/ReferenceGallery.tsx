import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
      {/* Thumbnail view - Display actual photo (Phase 2) */}
      <TouchableOpacity style={styles.thumbnail}>
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
      </TouchableOpacity>

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
