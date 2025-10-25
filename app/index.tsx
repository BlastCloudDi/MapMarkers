import Map from '@/components/Map';
import type { MarkerObject } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMarkers } from './context/context';

export default function App() {

  const { markers, setMarkers } = useMarkers();

  const onLongMapPress = (e: any) => {
    //console.log(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)

    const { latitude, longitude } = e.nativeEvent.coordinate

    const newMarker: MarkerObject = {
      id: markers.length + 1,
      latitude: latitude, 
      longitude: longitude,
      images: []
    };

    setMarkers(prev => [...prev, newMarker]);
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
});