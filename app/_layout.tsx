import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DevProvider } from '@/contexts/DevContext';

export default function RootLayout() {
  return (
    <DevProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="location" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </DevProvider>
  );
}
