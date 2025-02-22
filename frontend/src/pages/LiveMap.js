import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const LiveMap = () => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoibWluaGFqa2FyaW0wNzgiLCJhIjoiY20zdWZjdGJ6MGo4YzJqcHhqM255eWYyciJ9.JgEUYXKrpFOrHU0WyXuzug";

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0], // Default center, will update with live location
      zoom: 15,
    });

    // Create marker
    markerRef.current = new mapboxgl.Marker().setLngLat([0, 0]).addTo(mapRef.current);

    // Track user location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          mapRef.current.setCenter([longitude, latitude]);
          markerRef.current.setLngLat([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }

    return () => mapRef.current.remove(); // Cleanup on unmount
  }, []);

  return <div ref={mapContainerRef} className="w-full h-[400px]" />;
};

export default LiveMap;
