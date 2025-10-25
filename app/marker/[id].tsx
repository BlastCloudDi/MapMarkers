import MarkerDetails from '@/components/MarkerDetails';
import { MarkerImage } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useMarkers } from '../context/context';

export default function MarkerDetailScreen() {
  const { id } = useLocalSearchParams()
  const markerId = Number(id)
  const { markers, setMarkers } = useMarkers()
  const thisMarker = markers.find(m => m.id === markerId);
  const images = thisMarker ? thisMarker.images : [];

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
        const newImage: MarkerImage = {
          id: images.length + 1,
          markerId: markerId,
          uri: result.assets[0].uri,
        };
        setMarkers(prev => 
          prev.map(marker =>
            marker.id === markerId
              ? { ...marker, images: [...marker.images, newImage] }
              : marker
          )
        );
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
        { text: 'Удалить', style: 'destructive', onPress: () => {deleteImage(markerId, id)} },
      ],
    );
  };

  const deleteImage = (markerId: number, imageId: number) => {
    try {
      setMarkers(prevMarkers =>
        prevMarkers.map(marker => {
          if (marker.id === markerId) {
            const updatedImages = marker.images.filter(img => img.id !== imageId);
            return { ...marker, images: updatedImages };
          }
          return marker;
        })
      );

    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить изображение')
    }
  };

  return (
    <MarkerDetails images={images} markerId={markerId} addImageAsync={() => addImageAsync()} handleDeleteButton={handleDeleteButton}/>
  );
}