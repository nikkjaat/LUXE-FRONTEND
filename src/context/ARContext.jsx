import React, { createContext, useContext, useState } from 'react';

const ARContext = createContext(undefined);

export const useAR = () => {
  const context = useContext(ARContext);
  if (context === undefined) {
    throw new Error('useAR must be used within an ARProvider');
  }
  return context;
};

export const ARProvider = ({ children }) => {
  const [arSupported, setArSupported] = useState(true); // Simulate AR support
  const [arSession, setArSession] = useState(null);
  const [virtualTryOns, setVirtualTryOns] = useState([]);

  const startARSession = async (productId, type = 'try-on') => {
    // Simulate AR session start
    const session = {
      id: Date.now().toString(),
      productId,
      type,
      startTime: new Date(),
      active: true
    };
    
    setArSession(session);
    return session;
  };

  const endARSession = () => {
    setArSession(null);
  };

  const captureARPhoto = (productId) => {
    const photo = {
      id: Date.now().toString(),
      productId,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
      timestamp: new Date().toISOString(),
      filters: ['original', 'vintage', 'modern']
    };
    
    setVirtualTryOns(prev => [...prev, photo]);
    return photo;
  };

  const getARCompatibleProducts = () => {
    // Return products that support AR try-on
    return [
      { id: '1', type: 'accessory', arType: 'overlay' },
      { id: '2', type: 'watch', arType: 'wrist-tracking' },
      { id: '3', type: 'jewelry', arType: 'face-tracking' }
    ];
  };

  const measureWithAR = (productId) => {
    // Simulate AR measurement
    return {
      dimensions: { width: 25, height: 15, depth: 8 },
      unit: 'cm',
      accuracy: 0.95,
      confidence: 'high'
    };
  };

  return (
    <ARContext.Provider value={{
      arSupported,
      arSession,
      virtualTryOns,
      startARSession,
      endARSession,
      captureARPhoto,
      getARCompatibleProducts,
      measureWithAR
    }}>
      {children}
    </ARContext.Provider>
  );
};