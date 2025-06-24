import React from 'react';
import Sidebar from './AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-yellow-400">Admin Dashboard</h1>
          <p className="text-gray-400">Manage bookings, events, and more.</p>
        </header>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
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
              className="bg-[#1a1a1a] border border-yellow-600 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-yellow-300">{panel.title}</h2>
              <p className="text-gray-300 mb-4">{panel.desc}</p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md transition-all"
                onClick={() => (window.location.href = panel.href)}
              >
                {panel.title.includes('Manage') ? 'Manage' : 'View'} {panel.title.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
