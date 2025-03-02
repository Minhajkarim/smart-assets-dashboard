import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import * as XLSX from "xlsx";


const MapObjects = ({ userId, role }) => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [metadata, setMetadata] = useState(null);
  
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const downloadReport = () => {
    if (!objects.length) {
      alert("No data available to download.");
      return;
    }

    const worksheetData = objects.map((obj) => ({
      Label: obj.label,
      Name: obj.name,
      Latitude: obj.x,
      Longitude: obj.y,
      Width: obj.width,
      Height: obj.height,
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filter?.label || "Objects");

    // Save file
    XLSX.writeFile(wb, `Objects_Report_${filter.label}.xlsx`);
  };
  const switchFilter = (filter) => {
    setFilter((prevFilter) => {
      return filter;
    })
  };
  const deduplicateObjects = (objects) => {
    const uniqueObjects = [];
    const uniqueIds = new Set();
    objects.forEach((object) => {
      let key = `${object.x}-${object.y}`;
      if (!uniqueIds.has(key)) {
        uniqueObjects.push(object);
        uniqueIds.add(key);
      }
    });
    return uniqueObjects
  }
  const fetchFilter = async () => {
    let response;
    try {

        // get filers using metadata
        response = await fetch(
          `${backendUrl}/api/objectmetadata`,
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch metadata");
        
        }
        const data = await response.json();
        setMetadata(data);

        
        setFilter(data[0]);
  }
  catch (err) {
      setError(err.message);
  }

  }

  const fetchObjects = async () => {
    if (!filter) {
      return;
    }
    let response;
    try {

        response = await fetch(
            `${backendUrl}/api/videos/consolidated?filter=${filter.name}`,
              {
                  headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
              }
          );
          if (!response.ok) {
              throw new Error("Failed to fetch metadata");
          
          }
          const consolidated_data = await response.json();
          const depupedObjects = deduplicateObjects(consolidated_data);
          setCurrentCount(depupedObjects.length);
         setObjects((prevObjects) => {
          return depupedObjects;
         });

        setLoading(false);
    }
    catch (err) {
        setError(err.message);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchFilter();
  }, []);

  useEffect(() => {
    fetchObjects();
  }, [filter]); // Re-fetch videos when page or limit changes

  useEffect(() => {
    console.log("Objects: ", objects);

    if (objects.length > 0) {
      mapboxgl.accessToken = "pk.eyJ1IjoibWluaGFqa2FyaW0wNzgiLCJhIjoiY20zdWZjdGJ6MGo4YzJqcHhqM255eWYyciJ9.JgEUYXKrpFOrHU0WyXuzug";

      // Destroy existing map instance before creating a new one
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Initialize Mapbox map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0], // Default center (adjusted later)
        zoom: 3,
      });

      // Add markers for detected objects
      if (objects.length > 0) {
        // Center the map on the first detected object
        const { x, y } = objects[0];
        mapRef.current.setCenter([y, x]);
        mapRef.current.setZoom(12);
        // 
          objects.forEach(object => {
            if (!object.x || !object.y) return;
            new mapboxgl.Marker()
              .setLngLat([object.y, object.x])
              .setPopup(new mapboxgl.Popup().setHTML(`
                <div style="text-align: center;">
                  <p>${object.label}</p>
                  <img src="${backendUrl}/${object.image_path}" alt="${object.label}" width="300" height="100" style="border-radius: 8px;"/>
                </div>
              `))
              .addTo(mapRef.current);
          });
        
      }
    }
  }, [objects]); // Runs when selected video changes

  
  if (loading) return <div>Loading...</div>;

  return (
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Consolidated Map</h1>
        {/* Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="filterSelect" className="block font-semibold mb-2">
            Filter by object type:
          </label>
          <select
            id="filterSelect"
            className="border rounded-md p-2"
            value={filter.name}
            onChange={(e) => switchFilter(metadata.find((m) => m.name === e.target.value))}
          >
            {metadata.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
                </option>
            ))}
          </select>
        </div>
        
              <div className="mb-6">
              <p className="text-lg text-gray-500  my-2">Total Objects: {currentCount}</p>

                {/* <h2 className="text-xl font-semibold mb-2">{filter}</h2> */}
                <div id="map-container" key={filter.label} ref={mapContainerRef} className="w-full h-[400px] rounded-lg shadow-lg" />
              </div>

              <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    onClick={() => downloadReport()}
                  >
                    Download Report
              </button>
              <p className="text-xs my-1 text-gray-500 mt-2">For {filter.name}</p>

      </div>
  );
};


export default MapObjects;
