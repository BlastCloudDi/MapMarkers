export interface MarkerObject {
    id: number;
    latitude: number;
    longitude: number;
    createdAt?: string; 
}

export interface MarkerImage {
    id: number;
    markerId: number;
    uri: string;
    createdAt?: string;
}