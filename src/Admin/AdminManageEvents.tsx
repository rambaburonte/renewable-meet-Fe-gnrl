import React, { useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';
import { fetchWithAuth } from '../lib/fetchWithAuth';

interface Session {
  id: number;
  title: string;
  speaker: string;
  time: string;
  description: string;
}

const AdminManageEvents = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/form-submission/get-session-options`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const addSession = async () => {
  if (!title.trim()) return;

  try {
    const res = await fetchWithAuth(`${import.meta.env.VITE_BASE_URL}/admin/sessions`, {
      method: 'POST',
      body: JSON.stringify({ sessionOption: title }), // send only the sessionOption
    });

    if (res.ok) {
      setTitle('');
      fetchSessions(); // refresh sessions list if needed
    } else {
      const errText = await res.text();
      console.error('Failed to add session:', errText);
    }
  } catch (err) {
    console.error('Network error:', err);
  }
};


  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#0e0e0e] border-r border-yellow-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Manage Event Sessions</h1>

        {/* Add Session Form */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-yellow-700 mb-8">
          <h2 className="text-xl text-yellow-300 font-semibold mb-4">Add New Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Session Title"
              className="bg-black border border-yellow-600 px-4 py-2 rounded-md text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Speaker Name"
              className="bg-black border border-yellow-600 px-4 py-2 rounded-md text-white"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
            />
            <input
              type="text"
              placeholder="Time (e.g. 10:00 AM - 11:00 AM)"
              className="bg-black border border-yellow-600 px-4 py-2 rounded-md text-white"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <textarea
              placeholder="Description (optional)"
              className="bg-black border border-yellow-600 px-4 py-2 rounded-md text-white md:col-span-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button
            onClick={addSession}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md"
          >
            Add Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {Array.isArray(sessions) && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#1a1a1a] border border-yellow-700 p-4 rounded-lg flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-semibold text-yellow-300">{session.sessionName}</h3>
                  <p className="text-gray-300">Speaker: {session.speaker}</p>
                  <p className="text-gray-400 text-sm">Time: {session.time}</p>
                  {session.description && (
                    <p className="text-gray-500 text-sm mt-1">{session.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No sessions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageEvents;
