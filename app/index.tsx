import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TestSwipe from '@/components/TestSwipe';
import DevControlPanel from '@/components/DevControlPanel';
import { useDevSettings } from '@/contexts/DevContext';

const scenarios = [
  { id: 'portrait-full', title: 'Portrait\nFull Body', icon: '🧍' },
  { id: 'portrait-half', title: 'Portrait\nHalf Body', icon: '👤' },
  { id: 'close-up', title: 'Close Up', icon: '😊' },
];

export default function ScenarioScreen() {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const { settings } = useDevSettings();

  const handleScenarioSelect = (scenarioId: string) => {
    router.push({ pathname: '/location', params: { scenario: scenarioId } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose Photo Type</Text>
        <View style={styles.grid}>
          {scenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={styles.button}
              onPress={() => handleScenarioSelect(scenario.id)}
            >
              <Text style={styles.icon}>{scenario.icon}</Text>
              <Text style={styles.buttonText}>{scenario.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dev button - small and subtle in bottom left */}
      <TouchableOpacity
        style={styles.devButton}
        onPress={() => setShowDevPanel(true)}
      >
        <Text style={styles.devButtonText}>DEV</Text>
      </TouchableOpacity>

      {/* Dev control panel */}
      <DevControlPanel
        visible={showDevPanel}
        onClose={() => setShowDevPanel(false)}
      />

      {/* Test swipe component - only shown if enabled */}
      {settings.showTestSwipe && <TestSwipe />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  grid: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#333',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  devButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    opacity: 0.6,
  },
  devButtonText: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
  },
});