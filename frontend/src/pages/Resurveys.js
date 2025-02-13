import React, { useState, useEffect } from "react";

const Resurveys = () => {
  const [resurveys, setResurveys] = useState([]);

  useEffect(() => {
    // Simulated API call to fetch resurveys
    const fetchResurveys = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/resurveys"); // Example API
        const data = await response.json();
        setResurveys(data);
      } catch (error) {
        console.error("Error fetching resurveys:", error);
      }
    };

    fetchResurveys();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resurveys</h1>
      {resurveys.length === 0 ? (
        <p>No resurveys available.</p>
      ) : (
        <ul className="space-y-4">
          {resurveys.map((resurvey) => (
            <li key={resurvey.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{resurvey.title}</h2>
              <p>{resurvey.description}</p>
              <p className="text-sm text-gray-500">Date: {resurvey.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Resurveys;
