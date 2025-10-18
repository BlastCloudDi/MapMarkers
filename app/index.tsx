import type { MarkerObject } from '@/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {

  const router = useRouter();

  const [markers, setMarkers] = useState<MarkerObject[]>([
    {
      id: 1,
      latitude: 58.0105, 
      longitude: 56.2502,
    },
  ]);

  const onLongMapPress = (e: any) => {
    //console.log(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)

    const { latitude, longitude } = e.nativeEvent.coordinate

    const newMarker: MarkerObject = {
      id: markers.length + 1,
      latitude: latitude, 
      longitude: longitude,
    };

    setMarkers(prev => [...prev, newMarker]);
  }

  const mapView = <MapView style={styles.map} onLongPress={onLongMapPress}
    initialRegion={{
      latitude: 58.0105,
      longitude: 56.2502,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
    {markers.map(marker => (
      <Marker 
        key={marker.id} 
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        onPress={() => router.push({ pathname: '/marker/[id]', params: { id: marker.id } })}
      />
    ))}
  </MapView>

  return (
    <View style={styles.container}>
      {mapView}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});