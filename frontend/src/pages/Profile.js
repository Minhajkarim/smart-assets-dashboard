// Profile.js
import React, { useState, useEffect } from "react";
import { FaSave, FaEdit } from "react-icons/fa";

const Profile = ({ role }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/${role}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/${role}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Profile</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>

        <div className="mb-4">
          <label className="block text-gray-400">Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
            />
          ) : (
            <p className="w-full p-3 bg-gray-700 text-white rounded-lg">{name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-400">Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
            />
          ) : (
            <p className="w-full p-3 bg-gray-700 text-white rounded-lg">{email}</p>
          )}
        </div>

        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-all duration-300"
        >
          {isEditing ? <FaSave /> : <FaEdit />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
