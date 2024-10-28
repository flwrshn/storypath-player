// contexts/LocationContext.js
import React, { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [visitedLocations, setVisitedLocations] = useState(new Set());
  const markLocationVisited = (locationId) => {
    setVisitedLocations((prevVisited) => new Set(prevVisited).add(locationId));
  };

  return (
    <LocationContext.Provider
      value={{ locations, setLocations, visitedLocations, markLocationVisited }}
    >
      {children}
    </LocationContext.Provider>
  );
};
