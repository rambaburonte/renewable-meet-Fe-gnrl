import { useEffect, useState, useContext } from 'react';
import { WebsiteContext, Website } from '../Context/WebsiteContext';
import Sidebar from './AdminSidebar';
import { BASE_URL } from '../config';

const API_BASE = `${BASE_URL}/admin/api/admin/discounts`;

const columns: Record<Website, string[]> = {
optics: ["id", "name", "customerEmail", "amountTotal", "status", "createdAt"],
renewable: ["id", "name", "customerEmail", "amountTotal", "status", "createdAt"],
nursing: ["id", "name", "customerEmail", "amountTotal", "status", "createdAt"],
polymers: ["id", "name", "customerEmail", "amountTotal", "status", "createdAt"],
aqua: ["id", "name", "customerEmail", "amountTotal", "status", "createdAt"],
};

const AdminDiscounts: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const websiteContext = useContext(WebsiteContext);
  const website = websiteContext?.website || 'optics';
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('jwt');
    if (!token || token === 'null' || token === '') {
      setError('Session expired. Please log in again.');
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/${website}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch discounts');
        return res.json();
      })
      .then(data => setRecords(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [website]);

  const cols = columns[website] || columns.optics;

  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <main className="ml-64 p-8 w-full">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 flex items-center gap-3">
            <span>🎟️</span> Discount Records ({website.charAt(0).toUpperCase() + website.slice(1)})
          </h1>
          <p className="text-gray-400">View all discount codes and details for the selected event vertical.</p>
        </header>
        {loading ? (
          <div className="text-green-400 text-lg flex items-center gap-2"><span className="animate-spin">⏳</span> Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#181818] border border-green-700 rounded-lg shadow-lg">
              <thead>
                <tr>
                  {cols.map((col: string) => (
                    <th key={col} className="px-4 py-3 border-b border-green-700 text-green-300 text-left text-base font-semibold bg-[#222]">
                      {col === 'status' ? 'Status 🟢' : col.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={cols.length} className="text-center py-6 text-gray-400">No discount records found.</td></tr>
                ) : (
                  records.map((rec, idx) => (
                    <tr key={rec.id || idx} className="hover:bg-green-900/20 cursor-pointer transition-all" onClick={() => { setSelectedRecord(rec); setShowModal(true); }}>
                      {cols.map((col: string) => (
                        <td key={col} className={`px-4 py-2 border-b border-green-800 ${col === 'status' ? 'font-bold' : ''}`}>
                          {col === 'status' ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.status === 'COMPLETED' ? 'bg-green-500 text-green-900' : rec.status === 'PENDING' ? 'bg-yellow-500 text-yellow-900' : rec.status === 'FAILED' ? 'bg-red-500 text-red-900' : 'bg-gray-700 text-gray-200'}`}>
                              {rec.status || '-'}
                            </span>
                          ) : col === 'amountTotal' ? (
                            <span className="font-bold text-purple-300">€{rec.amountTotal?.toString() || '-'}</span>
                          ) : col === 'createdAt' ? (
                            <span className="text-xs text-gray-400">{rec.createdAt?.toString().slice(0, 19).replace('T', ' ') || '-'}</span>
                          ) : (
                            rec[col]?.toString() || '-'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Modal for full details */}
        {showModal && selectedRecord && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-[#181818] p-8 rounded-xl border-2 border-green-600 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
                <h2 className="text-3xl font-bold text-green-400 flex items-center gap-2">🎟️ Discount Record Details</h2>
                <button
                  onClick={() => { setShowModal(false); setSelectedRecord(null); }}
                  className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
                  title="Close modal"
                >×</button>
              </div>
              <div className="space-y-2">
                {Object.entries(selectedRecord).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-700 py-2">
                    <span className="font-semibold text-green-300">
                      {key === 'status' ? 'Status 🟢'
                        : key === 'sessionId' ? 'Session ID 🔑'
                        : key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                    </span>
                    <span
                      className={
                        key === 'status'
                          ? `px-3 py-1 rounded-full text-xs font-bold ${value === 'COMPLETED' ? 'bg-green-500 text-green-900' : value === 'PENDING' ? 'bg-yellow-500 text-yellow-900' : value === 'FAILED' ? 'bg-red-500 text-red-900' : 'bg-gray-700 text-gray-200'}`
                          : key === 'amountTotal'
                          ? 'font-bold text-purple-300'
                          : key === 'createdAt'
                          ? 'text-xs text-gray-400'
                          : key === 'sessionId'
                          ? 'font-mono text-blue-300 bg-blue-900/30 px-2 py-1 rounded'
                          : 'text-white'
                      }
                    >
                      {key === 'status'
                        ? value?.toString() || '-'
                        : key === 'amountTotal'
                        ? `€${value?.toString() || '-'}`
                        : key === 'createdAt'
                        ? value?.toString().slice(0, 19).replace('T', ' ') || '-'
                        : key === 'sessionId'
                        ? value?.toString() || '-'
                        : value?.toString() || '-'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => { setShowModal(false); setSelectedRecord(null); }}
                  className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-bold text-lg"
                >Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDiscounts;
