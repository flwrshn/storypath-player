// contexts/LocationContext.js
import React, { createContext, useState } from "react";

// Create the context
export const LocationContext = createContext();

// Create the provider component
export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);

  return (
    <LocationContext.Provider value={{ locations, setLocations }}>
      {children}
    </LocationContext.Provider>
  );
};
