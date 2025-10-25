import type { MarkerImage } from '@/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  images: MarkerImage[];
  handleDeleteButton: (e: any) => void;
};

export default function ImageList({ images, handleDeleteButton }: Props) {
  return (
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
  );
}

const styles = StyleSheet.create({
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