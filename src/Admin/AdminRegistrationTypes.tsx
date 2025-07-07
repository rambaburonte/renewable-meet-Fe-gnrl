import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

interface PresentationType {
  id: number;
  type: string;
  price: number;
}

const AdminRegistrationTypes: React.FC = () => {
  const [types, setTypes] = useState<PresentationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Get JWT token from localStorage (or your auth context)
  const token = localStorage.getItem('adminToken') || localStorage.getItem('jwt');

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError('No admin token found. Please log in as admin.');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/admin/api/admin/presentation-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setTypes(res.data);
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setError('Forbidden: You do not have permission to view registration types.');
      } else {
        setError('Failed to load presentation types.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number, price: number) => {
    setEditId(id);
    setEditPrice(price.toString());
  };

  const handleSave = async (id: number) => {
    setError(null);
    setSuccessMsg(null);
    if (!token) {
      setError('No admin token found. Please log in as admin.');
      return;
    }
    try {
      await axios.post(
        `https://api.zynmarketing.xyz/admin/api/admin/presentation-type/edit/${id}/${editPrice}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setSuccessMsg('Price updated successfully.');
      setEditId(null);
      fetchTypes();
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setError('Forbidden: You do not have permission to edit registration types.');
      } else {
        setError('Failed to update price.');
      }
    }
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Registration Types</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type.id} className="border-b border-green-700">
                  <td className="py-2 px-4">{type.id}</td>
                  <td className="py-2 px-4">{type.type}</td>
                  <td className="py-2 px-4">
                    {editId === type.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      `€${type.price}`
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editId === type.id ? (
                      <>
                        <button
                          className="bg-green-500 text-black px-3 py-1 rounded mr-2"
                          onClick={() => handleSave(type.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-600 text-white px-3 py-1 rounded"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-blue-500 text-black px-3 py-1 rounded"
                        onClick={() => handleEdit(type.id, type.price)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {successMsg && <p className="text-green-400 mt-4">{successMsg}</p>}
    </div>
  );
};

export default AdminRegistrationTypes;
