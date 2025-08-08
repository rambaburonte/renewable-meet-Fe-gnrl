import { useState, useEffect, useContext } from 'react';
import Sidebar from './AdminSidebar';
import { WebsiteContext } from '../Context/WebsiteContext';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { BASE_URL } from '../config';
import { isAdmin } from '../lib/authUtils';

const AdminInterests = () => {
  const websiteContext = useContext(WebsiteContext);
  const website = websiteContext?.website || 'optics';
  // Store interests as objects for future edit/delete
  const [interests, setInterests] = useState<{id: number, name: string}[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<{id: number, name: string} | null>(null);
  const [editInterest, setEditInterest] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch interests (admin endpoint)
  const fetchInterests = async () => {
    try {
      // GET all interested-in options
      const res = await fetchWithAuth(
        `${BASE_URL}/admin/api/admin/interested-in/${website}`,
        { method: 'GET' }
      );
      if (!res.ok) throw new Error(`Failed to fetch interests: ${res.status}`);
      const data = await res.json();
      setInterests(
        data.map((item: any) => ({ id: item.id, name: item.option_name || item.interestedInOption || '' }))
      );
    } catch (err: any) {
      setError(`Failed to fetch interests: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [website]);

  const addInterest = async () => {
    if (newInterest.trim() && !interests.some(i => i.name === newInterest.trim())) {
      try {
        const res = await fetchWithAuth(
          `${BASE_URL}/admin/interested-in/${website}`,
           {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ interestedInOption: newInterest.trim() }),
           }
         );
        if (!res.ok) throw new Error(`Failed to add interest: ${res.status}`);
        await fetchInterests();
        setNewInterest('');
        setShowModal(true);
      } catch (err: any) {
        setError(`Failed to add interest: ${err.message}`);
      }
    }
  };

  // Edit interest
  const handleEdit = (interest: {id: number, name: string}) => {
    setSelectedInterest(interest);
    setEditInterest(interest.name);
    setError(null);
    setEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editInterest.trim()) {
      setError('Interest name cannot be empty.');
      return;
    }
    setEditLoading(true);
    try {
      const res = await fetchWithAuth(
        `${BASE_URL}/admin/api/admin/interested-in/edit/${website}/${selectedInterest?.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interestedInOption: editInterest.trim() }),
        }
      );
      if (!res.ok) throw new Error(`Failed to update interest: ${res.status}`);
      await fetchInterests();
      setEditModalOpen(false);
      setSelectedInterest(null);
      setEditInterest('');
      setError(null);
    } catch (err: any) {
      setError(`Failed to update interest: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete interest
  const handleDelete = (interest: {id: number, name: string}) => {
    setSelectedInterest(interest);
    setError(null);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetchWithAuth(
        `${BASE_URL}/admin/api/admin/interested-in/delete/${website}/${selectedInterest?.id}`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(`Failed to delete interest: ${res.status}`);
      await fetchInterests();
      setDeleteModalOpen(false);
      setSelectedInterest(null);
      setError(null);
    } catch (err: any) {
      setError(`Failed to delete interest: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Role check: block access if not admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-[#1a1a1a] p-8 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Unauthorized</h2>
          <p className="text-gray-300">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 ml-[250px]">
        {/* Website/vertical selector */}
        {/* Website/vertical selector removed, now handled by sidebar */}
        <h1 className="text-3xl font-bold text-green-400 mb-6">Manage Interests</h1>

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
            className="bg-[#1a1a1a] border border-green-600 px-4 py-2 rounded-md text-white flex-grow"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
          />
          <button
            onClick={addInterest}
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>

        {/* Admin API Interests */}
     
        <ul className="space-y-3 mb-6">
          {interests.map((interest) => (
            <li
              key={interest.id}
              className="flex justify-between items-center bg-[#1a1a1a] border border-green-700 p-4 rounded-lg"
            >
              <span>{interest.name}</span>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-xs"
                  onClick={() => handleEdit(interest)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => handleDelete(interest)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Public API Interests removed: now only using admin API */}


      {/* Edit Modal */}
      {editModalOpen && selectedInterest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-lg border border-yellow-600 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Edit Interest</h2>
            <input
              type="text"
              className="bg-[#222] border border-yellow-600 rounded-lg px-4 py-2 text-white w-full mb-4"
              value={editInterest}
              onChange={e => setEditInterest(e.target.value)}
              disabled={editLoading}
            />
            {error && (
              <div className="bg-red-600 text-white p-2 rounded mb-2 text-sm">{error}</div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                onClick={() => { setEditModalOpen(false); setSelectedInterest(null); setEditInterest(''); setError(null); }}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                className={`bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md ${editLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={saveEdit}
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedInterest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-lg border border-red-600 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-4">Delete Interest</h2>
            <p>Are you sure you want to delete "{selectedInterest.name}"?</p>
            {error && (
              <div className="bg-red-600 text-white p-2 rounded mb-2 text-sm">{error}</div>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                onClick={() => { setDeleteModalOpen(false); setSelectedInterest(null); setError(null); }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ${deleteLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-lg border border-green-600 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-green-400 mb-4">Interest Added</h2>
            <p className="mb-4">The new interest has been successfully added.</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md"
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
