import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { referencePhotos } from '@/utils/referencePhotos';

const { width } = Dimensions.get('window');
const COLUMNS = 3;
const SPACING = 2;
const IMAGE_SIZE = (width - SPACING * (COLUMNS + 1)) / COLUMNS;

interface Photo {
  id: string;
  source: any;
  category: string;
}

export default function AlbumScreen() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Flatten all reference photos into a single array
  const allPhotos: Photo[] = [];
  Object.keys(referencePhotos).forEach((category) => {
    referencePhotos[category].forEach((photo, index) => {
      allPhotos.push({
        id: `${category}-${index}`,
        source: photo,
        category: category,
      });
    });
  });

  const renderPhoto = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => setSelectedPhoto(item)}
    >
      <Image
        source={item.source}
        style={styles.photo}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reference Album</Text>
        <View style={styles.placeholder}>
          <Text style={styles.count}>{allPhotos.length}</Text>
        </View>
      </View>

      <FlatList
        data={allPhotos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
      />

      {/* Full screen photo viewer modal */}
      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedPhoto(null)}
          >
            {selectedPhoto && (
              <>
                <Image
                  source={selectedPhoto.source}
                  style={styles.fullPhoto}
                  resizeMode="contain"
                />
                <View style={styles.categoryLabel}>
                  <Text style={styles.categoryText}>
                    {selectedPhoto.category.replace(/-/g, ' ').toUpperCase()}
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 60,
    alignItems: 'flex-end',
  },
  count: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  grid: {
    padding: SPACING,
  },
  row: {
    marginBottom: SPACING,
  },
  photoContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginHorizontal: SPACING / 2,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullPhoto: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
