import { useMarkers } from '@/app/context/context';
import ImageList from '@/components/ImageList';
import { MarkerImage } from '@/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  images: MarkerImage[];
  markerId: number;
  addImageAsync: (e: any) => void;
  handleDeleteButton: (e: any) => void;
};

export default function MarkerDetails({ images, markerId, addImageAsync, handleDeleteButton }: Props) {
  const { markers} = useMarkers()
  const thisMarker = markers.find(m => m.id === markerId);

  return (
    <View style={styles.container}>
      
      <View style={styles.markerHeader}>
        <Text style={styles.headerText}>Marker №{ markerId }</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={addImageAsync}>
          <Text style={styles.headerText}>Добавить фото</Text>
          <Ionicons name={'camera-outline'} size={25} color={'#fff'} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
      {images.length === 0 ? (
        <Text style={styles.noPhotoText}>Нет фотографий</Text>
      ) : (
        <ImageList images={images} handleDeleteButton={handleDeleteButton} />
      )}
      </View>

      <View style={styles.markerFooter}>
        <Text style={styles.noPhotoText}>Местоположение маркера</Text>
        <Text style={styles.noPhotoText}>{ thisMarker?.latitude }, {thisMarker?.longitude}</Text>
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
    marginBottom: 60
  },
  noPhotoText: {
    color: '#fff',
  },
  markerFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
  }
});