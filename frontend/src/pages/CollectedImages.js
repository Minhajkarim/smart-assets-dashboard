import React, { useEffect, useState } from "react";

const CollectedImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch images from the backend
    fetch("/api/images") // Replace with your actual API endpoint
      .then((res) => res.json())
      .then((data) => {
        setImages(data); // Set images data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Images Here</h2>

      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={image.url}
                alt={image.name}
                className="w-32 h-40 object-cover rounded-lg shadow-md"
              />
              <p className="mt-2 text-sm">{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectedImages;
