import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useDevSettings } from '@/contexts/DevContext';

interface DevControlPanelProps {
  visible: boolean;
  onClose: () => void;
}

export default function DevControlPanel({ visible, onClose }: DevControlPanelProps) {
  const { settings, updateSetting } = useDevSettings();

  const toggleSetting = (key: keyof typeof settings) => {
    updateSetting(key, !settings[key]);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <Text style={styles.title}>Development Controls</Text>

          <ScrollView style={styles.checkboxContainer}>
            {/* Test Swipe Component */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleSetting('showTestSwipe')}
            >
              <View style={[styles.checkbox, settings.showTestSwipe && styles.checkboxChecked]}>
                {settings.showTestSwipe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Test Swipe Component</Text>
                <Text style={styles.description}>Show swipe test on first screen</Text>
              </View>
            </TouchableOpacity>

            {/* Test Button on Camera */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleSetting('showTestButton')}
            >
              <View style={[styles.checkbox, settings.showTestButton && styles.checkboxChecked]}>
                {settings.showTestButton && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Test Button (Camera)</Text>
                <Text style={styles.description}>Show test button on camera screen</Text>
              </View>
            </TouchableOpacity>

            {/* Debug Info for Reference Gallery */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleSetting('showDebugInfo')}
            >
              <View style={[styles.checkbox, settings.showDebugInfo && styles.checkboxChecked]}>
                {settings.showDebugInfo && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Debug Info (Gallery)</Text>
                <Text style={styles.description}>Show debug logs and info boxes</Text>
              </View>
            </TouchableOpacity>

            {/* Grid Overlay */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleSetting('showGridOverlay')}
            >
              <View style={[styles.checkbox, settings.showGridOverlay && styles.checkboxChecked]}>
                {settings.showGridOverlay && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Grid Overlay</Text>
                <Text style={styles.description}>Show rule of thirds grid</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
    borderWidth: 2,
    borderColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  checkmark: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: '#888',
    fontSize: 13,
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
