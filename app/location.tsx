import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const locations = [
  { id: 'outdoors', title: 'Outdoors', icon: '🌳' },
  { id: 'indoors', title: 'Indoors', icon: '🏠' },
  { id: 'restaurant', title: 'Restaurant', icon: '🍽️' },
  { id: 'beach', title: 'Beach', icon: '🏖️' },
];

export default function LocationScreen() {
  const { scenario } = useLocalSearchParams();

  const handleLocationSelect = (locationId: string) => {
    router.push({ 
      pathname: '/camera', 
      params: { scenario: scenario as string, location: locationId } 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose Location</Text>
        <View style={styles.grid}>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.button}
              onPress={() => handleLocationSelect(location.id)}
            >
              <Text style={styles.icon}>{location.icon}</Text>
              <Text style={styles.buttonText}>{location.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  grid: {
    gap: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    borderWidth: 2,
    borderColor: '#333',
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});