import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DevProvider } from '@/contexts/DevContext';
import DevControlPanel from '@/components/DevControlPanel';

export default function RootLayout() {
  const [showDevPanel, setShowDevPanel] = useState(false);

  return (
    <DevProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="scenario" options={{ headerShown: false }} />
        <Stack.Screen name="location" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
        <Stack.Screen name="album" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />

      {/* Floating DEV button - visible on all screens */}
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
    </DevProvider>
  );
}

const styles = StyleSheet.create({
  devButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    opacity: 0.6,
    zIndex: 9999, // Always on top
    elevation: 9999, // Android elevation
  },
  devButtonText: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
  },
});
