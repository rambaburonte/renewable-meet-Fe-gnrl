import React, { useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';
import { fetchWithAuth } from '../lib/fetchWithAuth';

const AdminCombos = () => {
  const [combos, setCombos] = useState([]);
  const [nights, setNights] = useState('');
  const [guests, setGuests] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch all combos
  const fetchCombos = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/registration/get-all-accommodation-options`);
      if (!response.ok) throw new Error('Failed to fetch combos');
      const data = await response.json();
      setCombos(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const addCombo = async () => {
    if (!nights || !guests || !price) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetchWithAuth(`${baseUrl}/admin/api/admin/accommodation`, {
        method: 'POST',
        body: JSON.stringify({
          nights: parseInt(nights),
          guests: parseInt(guests),
          price: parseFloat(price)
        })
      });

      if (!response.ok) throw new Error('Failed to add combo');

      setNights('');
      setGuests('');
      setPrice('');
      setShowModal(true);
      fetchCombos(); // refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <div className="flex-1 p-6 ml-[250px]">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Manage Accommodation Combos</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Add combo form */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <input
            type="number"
            placeholder="Nights"
            value={nights}
            onChange={(e) => setNights(e.target.value)}
            className="bg-[#1a1a1a] border border-yellow-600 px-4 py-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="bg-[#1a1a1a] border border-yellow-600 px-4 py-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-[#1a1a1a] border border-yellow-600 px-4 py-2 rounded-md"
          />
          <button
            onClick={addCombo}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md"
          >
            Add Combo
          </button>
        </div>

        {/* Combo list */}
        <table className="w-full table-auto border border-yellow-800 text-sm">
  <thead className="bg-yellow-900 text-yellow-300">
    <tr>
      <th className="p-2 border">ID</th>
      <th className="p-2 border">Nights</th>
      <th className="p-2 border">Guests</th>
      <th className="p-2 border">Price</th>
    </tr>
  </thead>
  <tbody>
    {combos.map((combo: any) => (
      <tr key={combo.id} className="text-center border-t border-yellow-800">
        <td className="p-2">{combo.id}</td>
        <td className="p-2">{combo.nights}</td>
        <td className="p-2">{combo.guests}</td>
        <td className="p-2">${combo.price.toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-lg border border-yellow-600 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Combo Added</h2>
            <p className="mb-4">The new accommodation combo has been successfully added.</p>
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

export default AdminCombos;
