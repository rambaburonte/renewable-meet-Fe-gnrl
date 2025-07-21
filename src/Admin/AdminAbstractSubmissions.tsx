import React, { useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { BASE_URL } from '../config';
import { isAdmin } from '../lib/authUtils';


interface AbstractSubmission {
  id: number;
  titlePrefix: string;
  name: string;
  email: string;
  phone: string;
  organizationName: string;
  interestedIn: { id: number; option_name: string };
  session: { id: number; sessionName: string };
  country: string;
  abstractFilePath: string;
}


const AdminAbstractSubmissions = () => {
  const [website, setWebsite] = useState(() => localStorage.getItem('adminWebsite') || 'optics');

  const [submissions, setSubmissions] = useState<AbstractSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        let endpoint = '';
        if (website === 'optics') {
          endpoint = '/admin/api/admin/abstract-submissions/optics';
        } else if (website === 'renewable') {
          endpoint = '/admin/api/admin/abstract-submissions/renewable';
        } else if (website === 'nursing') {
          endpoint = '/admin/api/admin/abstract-submissions/nursing';
        } else {
          throw new Error('Invalid website selection');
        }
        const response = await fetchWithAuth(`${BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setSubmissions(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchSubmissions();
  }, [website]);

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
      <div className="w-[250px] fixed top-0 left-0 h-full">
        <Sidebar website={website} setWebsite={setWebsite} />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[250px] p-6">
        <h1 className="text-3xl font-bold text-green-400 mb-6">Abstract Submissions</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4">{error}</div>
        )}

        {submissions.length === 0 ? (
          <p className="text-gray-400">No submissions found.</p>
        ) : (
          <div className="overflow-x-auto bg-[#1a1a1a] border border-green-600 rounded-xl">
            <table className="min-w-full table-auto text-left text-sm">
              <thead>
                <tr className="bg-green-800 text-black">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Interested In</th>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">PDF</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-t border-green-700 hover:bg-green-900/10"
                  >
                    <td className="px-4 py-3">{sub.titlePrefix}</td>
                    <td className="px-4 py-3">{sub.name}</td>
                    <td className="px-4 py-3">{sub.email}</td>
                    <td className="px-4 py-3">{sub.phone}</td>
                    <td className="px-4 py-3">{sub.organizationName}</td>
                    <td className="px-4 py-3">{sub.interestedIn?.option_name}</td>
                    <td className="px-4 py-3">{sub.session?.sessionName}</td>
                    <td className="px-4 py-3 capitalize">{sub.country}</td>
                    <td className="px-4 py-3">
                      <a
                        href={sub.abstractFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        View PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

}
export default AdminAbstractSubmissions;
