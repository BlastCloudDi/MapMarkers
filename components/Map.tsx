import type { MarkerObject } from '@/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Props = {
  markers: MarkerObject[];
  onLongMapPress: (e: any) => void;
};

export default function Map({ markers, onLongMapPress }: Props) {
  const router = useRouter();

  return (
    <MapView style={styles.map} onLongPress={onLongMapPress}
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
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});