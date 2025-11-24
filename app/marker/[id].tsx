import MarkerDetails from '@/components/MarkerDetails';
import { useDatabase } from '@/context/DatabaseContext';
//import { deleteMarker, getMarkerByIdWithImages } from '@/database/operations';
import { MarkerImage, MarkerObject } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function MarkerDetailScreen() {
  const { id } = useLocalSearchParams();
  const markerId = Number(id);
  const router = useRouter();

  const { addImage, deleteImage, deleteMarker, getMarkerByIdWithImages } = useDatabase();
  
  const [images, setImages] = useState<MarkerImage[]>([]);
  const [marker, setMarker] = useState<MarkerObject>();

  // Загрузить данные маркера
  useEffect(() => {
    loadMarkerData();
  }, [markerId]);

  const loadMarkerData = async () => {
    try {
      const markerData = await getMarkerByIdWithImages(markerId);
      
      if (markerData) {
        setMarker(markerData);
        setImages(markerData.images);
      } else {
        Alert.alert('Ошибка', 'Маркер не найден');
        router.push({ pathname: '/'});
        return;
      }
    } catch (error) {
      console.error('Error loading marker data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные маркера');
    }
  };

  const checkMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (newStatus !== 'granted') {
        return false;
      }
    }
    return true;
  };

  const addImageAsync = async () => {
    if (!(await checkMediaLibraryPermissions())) {
      Alert.alert(
        'Доступ запрещён',
        'Добавьте разрешение на доступ к библиотеке изображений',
        [{ text: 'ОК' }]
      );
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await addImage(markerId, result.assets[0].uri);
        await loadMarkerData();
      }

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
        { text: 'Удалить', style: 'destructive', onPress: () => {deleteMarkerImage(id)} },
      ],
    );
  };

  const deleteMarkerImage = async (imageId: number) => {
    try {
      await deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить изображение')
    }
  };

  const handleDeleteMarker = (id: number) => {
    Alert.alert(
      'Подтверждение',
      'Вы действительно хотите удалить маркер со всеми изображениями?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {deleteMarkerAsync(id)} },
      ],
    );
  };

  const deleteMarkerAsync = async (markerId: number) => {
    try {
      await deleteMarker(markerId);
      router.push({ pathname: '/'});
    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить маркер')
    }
  };

  return (
    <MarkerDetails 
      images={images}
      markerId={markerId}
      marker={marker}
      addImageAsync={() => addImageAsync()}
      handleDeleteMarker={handleDeleteMarker}
      handleDeleteButton={handleDeleteButton}
    />
  );
}