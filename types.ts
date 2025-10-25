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