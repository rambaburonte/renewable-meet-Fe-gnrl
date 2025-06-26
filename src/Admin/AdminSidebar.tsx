import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEnterpriseSession } from '../Context/EnterpriseSessionContext';
import { BASE_URL } from '../config';

const navItems = [
  { label: 'Dashboard', path: '/admin-dashboard' },
  { label: 'Bookings', path: '/admin-bookings' },
  { label: 'Manage Events', path: '/admin-manage-events' },
  { label: 'Interest Options', path: '/admin-interests' },
  { label: 'Accommodation Combos', path: '/admin-accommodations' },
  { label: 'Abstract Submissions', path: '/admin-abstract-submissions' },

];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user: adminUser, sessionInfo } = useEnterpriseSession();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/admin-login');
    }
  };

  return (
    <aside className="w-64 bg-gray-900 p-6 flex flex-col justify-between min-h-screen border-r border-green-700">
      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map(({ label, path }) => (
            <button
              key={path}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium ${
                location.pathname === path
                  ? 'bg-green-600 text-black'
                  : 'text-white hover:bg-green-500 hover:text-black'
              }`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </nav>      </div>      {/* User Info */}
      <div className="mt-auto">
        {adminUser && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-green-400 font-semibold text-sm">Logged in as:</p>
            <p className="text-white text-sm">{adminUser.name || adminUser.email}</p>
            <p className="text-gray-400 text-xs">{adminUser.role}</p>
            {sessionInfo && (
              <p className="text-blue-400 text-xs mt-1">
                Session: {Math.round(sessionInfo.timeUntilExpiry / 60)}m left
              </p>
            )}
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
