import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

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

  // Placeholder for photo loading (Phase 2)
  useEffect(() => {
    // TODO: Load references based on scenario and location
    setState(prev => ({ ...prev, isLoading: false }));
  }, [scenario, location]);

  // Notify parent when reference changes
  useEffect(() => {
    if (onReferenceChange && state.references.length > 0) {
      onReferenceChange(state.currentIndex);
    }
  }, [state.currentIndex, onReferenceChange, state.references.length]);

  // Don't render if no references loaded (will be implemented in Phase 2)
  if (state.isLoading || state.references.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Phase 1: Component Structure
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Thumbnail view (Phase 3) */}
      <TouchableOpacity style={styles.thumbnail}>
        <Text style={styles.thumbnailText}>Thumbnail</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbnailText: {
    color: '#fff',
    fontSize: 12,
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
