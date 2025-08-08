// --- AdminSessions page ---
import { useEffect, useState, useContext } from 'react';
import Sidebar from './AdminSidebar';
import { WebsiteContext } from '../Context/WebsiteContext';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { BASE_URL } from '../config';
import { isAdmin } from '../lib/authUtils';
import { FaClipboardList, FaEdit, FaTrash } from 'react-icons/fa';

interface SessionOption {
  id: number;
  sessionName: string;
}

const getApiSuffix = (website: string) => {
  if (website === 'optics') return 'optics';
  if (website === 'renewable') return 'renewable';
  if (website === 'nursing') return 'nursing';
  if (website === 'polymers') return 'polymers';
  return 'optics';
};

const AdminSessions = () => {
  const websiteContext = useContext(WebsiteContext);
  const website = websiteContext?.website || 'optics';
  const [sessions, setSessions] = useState<SessionOption[]>([]);
  const [newSession, setNewSession] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const apiSuffix = getApiSuffix(website);

  // Fetch session options (admin endpoint)
  const fetchSessions = async () => {
    try {
      const res = await fetchWithAuth(
        `${BASE_URL}/admin/api/admin/session-options/${apiSuffix}`,
        { method: 'GET' }
      );
      if (!res.ok) throw new Error('Failed to fetch session options');
      const data = await res.json();
      // Normalize to SessionOption[] with id and sessionName
      setSessions(Array.isArray(data) ? data.map((item: any) => ({ id: item.id, sessionName: item.sessionName || item.sessionOption || item.name || '' })) : []);
    } catch (err: any) {
      setError(err.message || 'Error fetching session options');
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line
  }, [website]);

  // Add a new session option (admin endpoint)
  const addSession = async () => {
    if (!newSession.trim()) return;
    setError(null);
    try {
      // Add session option
      const res = await fetchWithAuth(
        `${BASE_URL}/admin/sessions/${apiSuffix}`,
         {
           method: 'POST',
           body: JSON.stringify({ sessionOption: newSession }),
           headers: { 'Content-Type': 'application/json' },
         }
       );
      if (!res.ok) throw new Error('Failed to add session option');
      setNewSession('');
      fetchSessions();
    } catch (err: any) {
      setError(err.message || 'Error adding session option');
    }
  };


  // Edit session option (admin endpoint)
  const startEdit = (session: SessionOption) => {
    setEditId(session.id);
    setEditValue(session.sessionName);
  };

  const saveEdit = async () => {
    if (editId === null) return;
    setError(null);
    try {
      if (!editValue.trim()) {
        setError('Session option cannot be empty');
        return;
      }
      // Update session option
      const res = await fetchWithAuth(
        `${BASE_URL}/admin/api/admin/sessions/${apiSuffix}/${editId}/edit`,
         {
           method: 'POST',
           body: JSON.stringify({ sessionOption: editValue }),
           headers: { 'Content-Type': 'application/json' },
         },
       );
      if (!res.ok) throw new Error('Failed to update session option');
      setEditId(null);
      setEditValue('');
      fetchSessions();
    } catch (err: any) {
      setError(err.message || 'Error editing session option');
    }
  };

  // Delete session option (admin endpoint)
  const deleteSession = async (id: number) => {
    setError(null);
    try {
      // Remove session option
      const res = await fetchWithAuth(
        `${BASE_URL}/admin/api/admin/sessions/${apiSuffix}/${id}/delete`,
        {
          method: 'POST',
        }
      );
      if (!res.ok) throw new Error('Failed to delete session option');
      fetchSessions();
    } catch (err: any) {
      setError('Error deleting session option');
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
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#0e0e0e] border-r border-green-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-6">Session Options Management</h1>

        {/* Add Session Option Form */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-green-700 mb-8">
          <h2 className="text-xl text-green-300 font-semibold mb-4">Add New Session Option</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Session Option Title"
              className="bg-black border border-green-600 px-4 py-2 rounded-md text-white"
              value={newSession}
              onChange={(e) => setNewSession(e.target.value)}
            />
          </div>
          <button
            onClick={addSession}
            className="mt-4 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md"
          >
            Add Session Option
          </button>
          {error && <div className="text-red-400 mt-2">{error}</div>}
        </div>

        {/* Session Options List */}
        <div className="space-y-4">
          {Array.isArray(sessions) && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#1a1a1a] border border-green-700 p-4 rounded-lg flex justify-between items-center"
              >
                {editId === session.id ? (
                  <>
                    <input
                      type="text"
                      className="bg-black border border-green-600 px-2 py-1 rounded-md text-white mr-2"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button
                      className="bg-green-500 hover:bg-green-600 text-black px-2 py-1 rounded-md mr-2"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-md"
                      onClick={() => { setEditId(null); setEditValue(''); }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2">
                      <FaClipboardList className="inline-block" />
                      {session.sessionName}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        className="text-yellow-400 hover:text-yellow-500"
                        onClick={() => startEdit(session)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteSession(session.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No session options available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSessions;
