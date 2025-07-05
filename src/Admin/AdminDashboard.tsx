import React from 'react';
import Sidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../lib/authUtils';
import { FaCreditCard, FaClipboardList, FaCalendarAlt, FaListAlt, FaBed, FaFileAlt } from 'react-icons/fa';

const panelIcons = {
  'Payment Records': <FaCreditCard className="text-2xl mr-3 text-green-300" />,
  'Bookings': <FaClipboardList className="text-2xl mr-3 text-green-300" />,
  'Manage Events': <FaCalendarAlt className="text-2xl mr-3 text-green-300" />,
  'Interest Options': <FaListAlt className="text-2xl mr-3 text-green-300" />,
  'Accommodation Combinations': <FaBed className="text-2xl mr-3 text-green-300" />,
  'Abstract Submissions': <FaFileAlt className="text-2xl mr-3 text-green-300" />,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  
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
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-green-400">Admin Dashboard</h1>
          <p className="text-gray-400">Manage bookings, events, and more.</p>
        </header>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Payment Records',
              desc: 'View and manage all payment transactions, statuses, and analytics.',
              href: '/admin-payments',
            },
            {
              title: 'Bookings',
              desc: 'View and manage user bookings.',
              href: '/admin-bookings',
            },
            {
              title: 'Manage Events',
              desc: 'Add, edit, or remove event sessions.',
              href: '/admin-manage-events',
            },
            {
              title: 'Interest Options',
              desc: 'Add, update, or delete “Interested In” categories shown on registration.',
              href: '/admin-interests',
            },
            {
              title: 'Accommodation Combinations',
              desc: 'Manage room types and stay durations available for attendees.',
              href: '/admin-accommodations',
            },
            {
              title: 'Abstract Submissions',
              desc: 'View all submitted abstracts for review and processing.',
              href: '/admin-abstract-submissions',
            },
          ].map((panel, idx) => (
            <div
              key={idx}
              className="bg-[#1a1a1a] border border-green-600 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-center mb-4">
                {panelIcons[panel.title] || <FaClipboardList className="text-2xl mr-3 text-green-300" />}
                <h2 className="text-xl font-semibold text-green-300">{panel.title}</h2>
              </div>
              <p className="text-gray-300 mb-4">{panel.desc}</p>
              <button
                className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md transition-all"
                onClick={() => navigate(panel.href)}
              >
                {panel.title.includes('Manage') ? 'Manage' : panel.title === 'Payment Records' ? 'View Payments' : 'View'} {panel.title.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
