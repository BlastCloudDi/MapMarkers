import { addImage, addMarker, deleteImage, deleteMarker, getMarkerByIdWithImages, getMarkers } from '@/database/operations';
import { initDatabase } from '@/database/schema';
import { DatabaseContextType, MarkerObject } from '@/types';
import { SQLiteDatabase } from 'expo-sqlite';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Хук для использования контекста
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase должен использоваться внутри DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeDb = async () => {
      try {
        setIsLoading(true);
        const database = await initDatabase();
        setDb(database);
        console.log('Database initialized successfully');
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err instanceof Error ? err : new Error('Database initialization failed'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeDb();
    
    return () => {
      if (db) {
        db.closeSync();
        setDb(null);
      }
    };
  }, []);


  // Методы для работы с базой данных
  const addMarkerHandler = async (latitude: number, longitude: number): Promise<number> => {
    if (!db) throw new Error('Database not initialized');
    try {
      return await addMarker(latitude, longitude);
    } catch (err) {
      console.error('Error in addMarker:', err);
      throw err;
    }
  };

  const deleteMarkerHandler = async (id: number): Promise<void> => {
    if (!db) throw new Error('Database not initialized');
    try {
      await deleteMarker(id);
    } catch (err) {
      console.error('Error in deleteMarker:', err);
      throw err;
    }
  };

  const getMarkersHandler = async (): Promise<MarkerObject[]> => {
    if (!db) throw new Error('Database not initialized');
    try {
      return await getMarkers();
    } catch (err) {
      console.error('Error in getMarkers:', err);
      throw err;
    }
  };

  const addImageHandler = async (markerId: number, uri: string): Promise<void> => {
    if (!db) throw new Error('Database not initialized');
    try {
      await addImage(markerId, uri);
    } catch (err) {
      console.error('Error in addImage:', err);
      throw err;
    }
  };

  const deleteImageHandler = async (id: number): Promise<void> => {
    if (!db) throw new Error('Database not initialized');
    try {
      await deleteImage(id);
    } catch (err) {
      console.error('Error in deleteImage:', err);
      throw err;
    }
  };

  const getMarkerByIdWithImagesHandler = async (markerId: number): Promise<MarkerObject | null> => {
    if (!db) throw new Error('Database not initialized');
    try {
      return await getMarkerByIdWithImages(markerId);
    } catch (err) {
      console.error('Error in getMarkerImages:', err);
      throw err;
    }
  };

   const contextValue: DatabaseContextType = {
    db,
    isLoading,
    error,
    addMarker: addMarkerHandler,
    deleteMarker: deleteMarkerHandler,
    getMarkers: getMarkersHandler,
    addImage: addImageHandler,
    deleteImage: deleteImageHandler,
    getMarkerByIdWithImages: getMarkerByIdWithImagesHandler
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;