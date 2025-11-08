import Map from '@/components/Map';
import type { MarkerObject } from '@/types';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useDatabase } from './context/DatabaseContext';

export default function App() {
  const { addMarker, getMarkers, isLoading } = useDatabase();
  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  // Загрузить маркеры из базы данных
  useEffect(() => {
    if (!isLoading) {
      loadMarkers();
    }
  }, [isLoading]); // Зависит от переменной isLoading

  const loadMarkers = async () => {
    try {
      const updatedMarkes = await getMarkers();
      setMarkers(updatedMarkes);
    } catch (error) {
      console.error('Error loading markers from database:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить маркеры');
    }
  };

  const onLongMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate

    try {
      const newMarkerId = await addMarker(latitude, longitude);
      await loadMarkers();
      console.log(`New marker added with ID: ${newMarkerId}`);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  }

  // Показать во время загрузки базы данных
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Map markers={markers} onLongMapPress={onLongMapPress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});