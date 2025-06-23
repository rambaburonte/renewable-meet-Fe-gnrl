import React, { useState, useEffect } from 'react';
import Sidebar from './AdminSidebar';
import { fetchWithAuth } from '../lib/fetchWithAuth';

const AdminInterests = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch interests on component mount
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/form-submission/get-interested-in-options`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Response is not an array');
        }

        setInterests(data.map(item => item.option_name).filter(Boolean));
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(`Failed to fetch interests: ${err.message}`);
      }
    };
    fetchInterests();
  }, []);

  const addInterest = async () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_BASE_URL}/admin/interested-in`, {
          method: 'POST',
          body: JSON.stringify({ interestedInOption: newInterest.trim() }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setInterests([...interests, newInterest.trim()]);
        setNewInterest('');
        setShowModal(true); // Show confirmation modal
      } catch (err: any) {
        console.error('Add interest error:', err);
        setError(`Failed to add interest: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 ml-[250px]">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Manage Interests</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Add interest */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="New Interest (e.g. Renewable Storage)"
            className="bg-[#1a1a1a] border border-yellow-600 px-4 py-2 rounded-md text-white flex-grow"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
          />
          <button
            onClick={addInterest}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>

        {/* Interest list */}
        <ul className="space-y-3">
          {interests.map((interest, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-[#1a1a1a] border border-yellow-700 p-4 rounded-lg"
            >
              <span>{interest}</span>
              {/* Uncomment if you want remove functionality */}
              {/* <button
                onClick={() => removeInterest(interest)}
                className="text-red-400 hover:text-red-600"
              >
                Remove
              </button> */}
            </li>
          ))}
        </ul>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-lg border border-yellow-600 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Interest Added</h2>
            <p className="mb-4">The new interest has been successfully added.</p>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInterests;
