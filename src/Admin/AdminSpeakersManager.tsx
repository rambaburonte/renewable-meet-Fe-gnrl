import { useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';
import { FaUserEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { BASE_URL } from '../config';
type Speaker = {
  id?: string | number;
  name: string;
  university?: string;
  bio?: string;
  imageUrl?: string;
  type?: string;
};
import axios from 'axios';

const WEBSITES = [
  { key: 'optics', label: 'Optics' },
  { key: 'renewable', label: 'Renewable' },
  { key: 'nursing', label: 'Nursing' },
  { key: 'polymers', label: 'Polymers' },
];

const API_BASE = `${BASE_URL}/api/speakers`;

const AdminSpeakersManager = () => {
  const [website, setWebsite] = useState('optics');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editSpeaker, setEditSpeaker] = useState<Speaker | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSpeakers();
  }, [website]);

  const fetchSpeakers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const config = token && token !== 'null' && token !== ''
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      if (!token || token === 'null' || token === '') {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE}/${website}`, config);
      setSpeakers(res.data);
    } catch (e) {
      setError('Failed to fetch speakers');
    }
    setLoading(false);
  };

  const handleEdit = (speaker: Speaker) => {
    setEditSpeaker(speaker);
    setShowForm(true);
  };

  const handleDelete = async (speaker: Speaker) => {
    if (!window.confirm('Delete this speaker?')) return;
    try {
      const token = localStorage.getItem('jwt');
      const config = token && token !== 'null' && token !== ''
        ? { headers: { Authorization: `Bearer ${token}` }, data: speaker }
        : { data: speaker };
      if (!token || token === 'null' || token === '') {
        setError('Session expired. Please log in again.');
        return;
      }
      await axios.delete(`${API_BASE}/${website}/delete`, config);
      fetchSpeakers();
    } catch (e) {
      setError('Delete failed');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = e.currentTarget;
    const token = localStorage.getItem('jwt');
    if (!token || token === 'null' || token === '') {
      setError('Session expired. Please log in again.');
      setLoading(false);
      return;
    }
    // Unified logic for Add and Edit
    const formData = new FormData();
    let apiUrl = '';
    let method = '';
    let speakerObj: Speaker | null = null;
    if (editSpeaker) {
      // Edit mode
      apiUrl = `${API_BASE}/${website}/edit`;
      method = 'put';
      speakerObj = {
        id: editSpeaker.id,
        name: (form.elements.namedItem('name') as HTMLInputElement)?.value || '',
        university: (form.elements.namedItem('university') as HTMLInputElement)?.value || '',
        bio: (form.elements.namedItem('bio') as HTMLTextAreaElement)?.value || '',
        type: (form.elements.namedItem('type') as HTMLInputElement)?.value || ''
      };
      formData.append('speaker', JSON.stringify(speakerObj));
    } else {
      // Add mode
      apiUrl = `${API_BASE}/${website}/add`;
      method = 'post';
      formData.append('name', (form.elements.namedItem('name') as HTMLInputElement)?.value || '');
      formData.append('university', (form.elements.namedItem('university') as HTMLInputElement)?.value || '');
      formData.append('bio', (form.elements.namedItem('bio') as HTMLTextAreaElement)?.value || '');
      formData.append('type', (form.elements.namedItem('type') as HTMLInputElement)?.value || '');
    }
    const imageInput = form.elements.namedItem('image') as HTMLInputElement;
    if (imageInput && imageInput.files && imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (method === 'put') {
        await axios.put(apiUrl, formData, config);
      } else {
        await axios.post(apiUrl, formData, config);
      }
      setShowForm(false);
      setEditSpeaker(null);
      fetchSpeakers();
    } catch (e) {
      setError('Save failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <main className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6 text-green-400">Manage All Speakers</h1>
        <div className="mb-6 flex gap-4">
          {WEBSITES.map(w => (
            <button
              key={w.key}
              className={`px-4 py-2 rounded ${website === w.key ? 'bg-green-600 text-white' : 'bg-gray-800 text-green-300'}`}
              onClick={() => setWebsite(w.key)}
            >
              {w.label}
            </button>
          ))}
          <button
            className="ml-auto bg-blue-600 px-4 py-2 rounded text-white flex items-center gap-2"
            onClick={() => { setEditSpeaker(null); setShowForm(true); }}
          >
            <FaPlus /> Add Speaker
          </button>
        </div>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map(speaker => (
              <div key={speaker.id} className="bg-[#1a1a1a] p-6 rounded-xl shadow border border-green-700">
                <img src={speaker.imageUrl} alt={speaker.name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-green-400" />
                <h2 className="text-xl font-bold text-green-300 mb-1">{speaker.name}</h2>
                <div className="text-gray-300 mb-2">{speaker.university}</div>
                <div className="text-gray-400 text-sm mb-2">{speaker.bio}</div>
                <div className="flex gap-2 mt-4">
                  <button className="bg-blue-600 px-3 py-1 rounded text-white flex items-center gap-1" onClick={() => handleEdit(speaker)}><FaUserEdit /> Edit</button>
                  <button className="bg-red-600 px-3 py-1 rounded text-white flex items-center gap-1" onClick={() => handleDelete(speaker)}><FaTrash /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <form className="bg-[#222] p-8 rounded-xl w-full max-w-lg shadow-xl" onSubmit={handleFormSubmit} encType="multipart/form-data">
              <h2 className="text-2xl font-bold text-green-400 mb-4">{editSpeaker ? 'Edit Speaker' : 'Add Speaker'}</h2>
              <div className="mb-4">
                <label className="block mb-1 text-green-300">Name</label>
                <input name="name" defaultValue={editSpeaker?.name || ''} required className="w-full px-3 py-2 rounded bg-black text-white border border-green-600" />
              </div>
              <div className="mb-4">
              <label className="block mb-1 text-green-300">University</label>
              <input name="university" defaultValue={editSpeaker?.university || ''} className="w-full px-3 py-2 rounded bg-black text-white border border-green-600" />
            <div className="mb-4">
              <label className="block mb-1 text-green-300">Type</label>
              <input name="type" defaultValue={editSpeaker?.type || ''} className="w-full px-3 py-2 rounded bg-black text-white border border-green-600" />
            </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-green-300">Bio</label>
                <textarea name="bio" defaultValue={editSpeaker?.bio || ''} className="w-full px-3 py-2 rounded bg-black text-white border border-green-600" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-green-300">Image</label>
                <input name="image" type="file" accept="image/*" className="w-full px-3 py-2 rounded bg-black text-white border border-green-600" />
                {editSpeaker?.imageUrl && (
                  <img src={editSpeaker.imageUrl} alt="Current" className="w-24 h-24 rounded-full mt-2 border-2 border-green-400" />
                )}
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-green-600 px-6 py-2 rounded text-white font-bold">{editSpeaker ? 'Update' : 'Add'}</button>
                <button type="button" className="bg-gray-700 px-6 py-2 rounded text-white" onClick={() => { setShowForm(false); setEditSpeaker(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSpeakersManager;
