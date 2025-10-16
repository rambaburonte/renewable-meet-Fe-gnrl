import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Sidebar from './AdminSidebar';


interface PresentationType {
  id: number;
  type: string;
  price: number;
}




const AdminRegistrationTypes: React.FC = () => {
  const [website] = useState(() => localStorage.getItem('adminWebsite') || 'optics');

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
  }, [website]);

  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError('No admin token found. Please log in as admin.');
      setLoading(false);
      return;
    }
    try {
      let endpoint = '';
      if (website === 'optics') {
        endpoint = '/admin/api/admin/presentation-types/optics';
      } else if (website === 'renewable') {
        endpoint = '/admin/api/admin/presentation-types/renewable';
      } else if (website === 'nursing') {
        endpoint = '/admin/api/admin/presentation-types/nursing';
      } else if (website === 'polymers') {
        endpoint = '/admin/api/admin/presentation-types/polymers';
      } else if (website === 'aqua') {
        endpoint = '/admin/api/admin/presentation-types/aqua';
      } else {
        throw new Error('Invalid website selection');
      }
      const res = await axios.get(`${BASE_URL}${endpoint}`, {
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
      let endpoint = '';
      if (website === 'optics') {
        endpoint = `/admin/api/admin/presentation-type/edit/optics/${id}/${editPrice}`;
      } else if (website === 'renewable') {
        endpoint = `/admin/api/admin/presentation-type/edit/renewable/${id}/${editPrice}`;
      } else if (website === 'nursing') {
        endpoint = `/admin/api/admin/presentation-type/edit/nursing/${id}/${editPrice}`;
      } else if (website === 'polymers') {
        endpoint = `/admin/api/admin/presentation-type/edit/polymers/${id}/${editPrice}`;
      } else if (website === 'aqua') {
        endpoint = `/admin/api/admin/presentation-type/edit/aqua/${id}/${editPrice}`;
      } else {
        throw new Error('Invalid website selection');
      }
      await axios.post(
        `${BASE_URL}${endpoint}`,
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
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />
      <main className="ml-64 p-8 w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-2">Registration Types</h1>
        <p className="text-gray-400 mb-8">Manage and update the prices for all available registration/presentation types.</p>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mr-3"></div>
            <span className="text-green-300 text-lg">Loading registration types...</span>
          </div>
        ) : error ? (
          <div className="bg-red-700 text-white p-4 rounded-lg text-center mb-4">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-green-300 text-lg">ID</th>
                  <th className="py-3 px-4 text-left text-green-300 text-lg">Type</th>
                  <th className="py-3 px-4 text-left text-green-300 text-lg">Price (€)</th>
                  <th className="py-3 px-4 text-left text-green-300 text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type, idx) => (
                  <tr key={type.id} className={`border-b border-green-700 ${idx % 2 === 0 ? 'bg-[#181f1a]' : 'bg-[#1a1a1a]'}`}> 
                    <td className="py-2 px-4 font-semibold">{type.id}</td>
                    <td className="py-2 px-4 font-medium">{type.type}</td>
                    <td className="py-2 px-4">
                      {editId === type.id ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="bg-gray-800 text-white px-3 py-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 w-32"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-green-200 font-bold">€{type.price}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editId === type.id ? (
                        <div className="flex gap-2">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md font-semibold transition-all"
                            onClick={() => handleSave(type.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-semibold transition-all"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-md font-semibold transition-all"
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
        {successMsg && <div className="bg-green-700 text-white p-3 rounded-lg mt-6 text-center font-semibold shadow">{successMsg}</div>}
      </main>
    </div>
  );
};

export default AdminRegistrationTypes;
