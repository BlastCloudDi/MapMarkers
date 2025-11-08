import type { MarkerImage, MarkerObject } from '@/types';
import { db } from './schema';

// Маркеры
export const addMarker = async (latitude: number, longitude: number): Promise<number> => {
  try {
    const result = await db.runAsync(
      'INSERT INTO markers (latitude, longitude) VALUES (?, ?);',
      [latitude, longitude]
    );
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error('Error adding marker:', error);
    throw error;
  }
};

export const deleteMarker = async (id: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM markers WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting marker:', error);
    throw error;
  }
};

export const getMarkers = async (): Promise<MarkerObject[]> => {
  try {
    return await db.getAllAsync<MarkerObject>('SELECT id, latitude, longitude FROM markers ORDER BY created_at DESC;');
  } catch (error) {
    console.error('Error getting markers:', error);
    throw error;
  }
};

// Изображения маркеров
export const addImage = async (markerId: number, uri: string): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?);',
      [markerId, uri]
    );
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
};

export const deleteImage = async (id: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM marker_images WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
  try {
    return await db.getAllAsync<MarkerImage>(
      'SELECT id, marker_id, uri FROM marker_images WHERE marker_id = ? ORDER BY created_at ASC;',
      [markerId]
    );
  } catch (error) {
    console.error('Error getting marker images:', error);
    throw error;
  }
};