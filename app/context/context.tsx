import { MarkerObject } from '@/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type MarkersContextType = {
  markers: MarkerObject[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerObject[]>>;
};

const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

// Хук для использования контекста
export const useMarkers = () => {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error('useMarkers должен использоваться внутри MarkersProvider');
  }
  return context;
};

// Провайдер контекста
export const MarkersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerObject[]>([
    { // Первый маркер на карте
      id: 1,
      latitude: 58.0105, 
      longitude: 56.2502,
      images: []
    },
  ]);

  return (
    <MarkersContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkersContext.Provider>
  );
};

export default MarkersProvider;