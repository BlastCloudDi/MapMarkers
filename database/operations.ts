import type { MarkerObject } from '@/types';
import { db } from './schema';

// Добавить маркер
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

// Удалить маркер
export const deleteMarker = async (id: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM markers WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting marker:', error);
    throw error;
  }
};

// Получить маркеры
export const getMarkers = async (): Promise<MarkerObject[]> => {
  try {
    return await db.getAllAsync<MarkerObject>('SELECT id, latitude, longitude FROM markers ORDER BY created_at DESC;');
  } catch (error) {
    console.error('Error getting markers:', error);
    throw error;
  }
};

// Получить маркер по id вместе с изображениями
export const getMarkerByIdWithImages = async (markerId: number): Promise<MarkerObject | null> => {
  try {
    const result = await db.getAllAsync<any>(
      `SELECT 
        m.id,
        m.latitude, 
        m.longitude,
        mi.id as image_id,
        mi.uri as image_uri
       FROM markers m
       LEFT JOIN marker_images mi ON m.id = mi.marker_id
       WHERE m.id = ?
       ORDER BY mi.created_at ASC;`,
      [markerId]
    );
    
    if (result.length === 0) {
      return null;
    }
    
    // Преобразование результата в MarkerObject
    const marker: MarkerObject = {
      id: result[0].id,
      latitude: result[0].latitude,
      longitude: result[0].longitude,
      images: result
        .filter(row => row.image_id !== null)
        .map(row => ({
          id: row.image_id,
          markerId: row.id,
          uri: row.image_uri
        }))
    };
    
    return marker;
  } catch (error) {
    console.error('Error getting marker with images:', error);
    throw error;
  }
};

// Добавить изображение
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

// Удалить изображение
export const deleteImage = async (id: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM marker_images WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/*export const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
  try {
    return await db.getAllAsync<MarkerImage>(
      'SELECT id, marker_id, uri FROM marker_images WHERE marker_id = ? ORDER BY created_at ASC;',
      [markerId]
    );
  } catch (error) {
    console.error('Error getting marker images:', error);
    throw error;
  }
};*/