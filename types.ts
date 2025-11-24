import { SQLiteDatabase } from "expo-sqlite";

export interface MarkerObject {
  id: number;
  latitude: number;
  longitude: number;
  images: MarkerImage[];
}

export interface MarkerImage {
  id: number;
  markerId: number;
  uri: string;
}

export interface DatabaseContextType {
  db: SQLiteDatabase | null
  isLoading: boolean;
  error: Error | null;
  // Операции с базой данных
  addMarker: (latitude: number, longitude: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<MarkerObject[]>;
  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerByIdWithImages: (markerId: number) => Promise<MarkerObject | null>;
}