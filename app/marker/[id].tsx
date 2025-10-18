import { MarkerImage } from '@/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MarkerDetailScreen() {
  const { id } = useLocalSearchParams()
  const [images, setImages] = useState<MarkerImage[]>([])

  const addImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImage: MarkerImage = {
          id: images.length + 1,
          markerId: Number(id),
          uri: result.assets[0].uri,
        };
        setImages(prev => [...prev, newImage])
      }

      // TODO Добавление изображения в бд во 2 лабе

    } catch {
      Alert.alert('Ошибка', 'Не удалось добавить изображение')
    }
  };
  
  const handleDeleteButton = (id: number) => {
    Alert.alert(
      'Подтверждение',
      'Вы действительно хотите удалить изображение?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {deleteImage(id)} },
      ],
    );
  };

  const deleteImage = (id: number) => {
    try {
      setImages(prev => prev.filter(img => img.id !== id))

      // TODO Удаление изображения из бд во 2 лабе

    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить изображение')
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.markerHeader}>
        <Text style={styles.headerText}>Marker №{ id }</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={addImageAsync}>
          <Text style={styles.headerText}>Добавить фото</Text>
          <Ionicons name={'camera-outline'} size={25} color={'#fff'} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
      {images.length === 0 ? (
        <Text style={styles.noPhotoText}>Нет фотографий</Text>
      ) : (
        <FlatList
          data={images}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.imgContainer}>
              <Image source={{ uri: item.uri}} style={styles.image} />
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteButton(item.id)}>
                <Ionicons name={'close'} size={25} color={'rgba(169,169,169,0.7)'}/>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  markerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10
  },
  headerText: {
    fontSize: 20,
    color: '#fff'
  },
  addButton: {
    flexDirection: 'row',
    gap: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 50
  },
  noPhotoText: {
    color: '#fff',
  },
  imgContainer: {
    margin: 5
  },
  image: {
    width: 100,
    height: 100
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});