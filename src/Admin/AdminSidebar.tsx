
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEnterpriseSession } from '../Context/EnterpriseSessionContext';
import { WebsiteContext, Website } from '../Context/WebsiteContext';


const navItems = [
  { label: 'Dashboard', path: '/admin-dashboard' },
  { label: 'Bookings', path: '/admin-bookings' },
  { label: 'Payments', path: '/admin-payments' },
  { label: 'Discounts', path: '/admin-discounts' },
  { label: 'Sessions', path: '/admin-sessions' },
  { label: 'Interest Options', path: '/admin-interests' },
  { label: 'Accommodation Combos', path: '/admin-accommodations' },
  { label: 'Abstract Submissions', path: '/admin-abstract-submissions' },
  { label: 'Registration Types', path: '/admin-registration-types' },
  { label: 'Manage Speakers', path: '/admin-speakers-manager' },
  // { label: 'Payment API Test', path: '/admin-payment-test' },
];






const WEBSITE_OPTIONS = [
  { label: 'Optics', value: 'optics' },
  { label: 'Renewable', value: 'renewable' },
  { label: 'Nursing', value: 'nursing' },
  { label: 'Polymers', value: 'polymers' },
  { label: 'Aqua', value: 'aqua' },
];

const AdminSidebar: React.FC = () => {
  const { website, setWebsite } = useContext(WebsiteContext)!;
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user: adminUser, sessionInfo } = useEnterpriseSession();

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWebsite = e.target.value as Website;
    setWebsite(newWebsite);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      navigate('/admin-login');
    }
  };

  return (
    <aside className="fixed left-0 top-0 w-64 bg-gray-900 p-6 flex flex-col justify-between h-screen border-r border-green-700 overflow-y-auto z-40">
      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-6">Admin Panel</h2>
        {/* Website Selection Dropdown */}
        <div className="mb-6">
          <label htmlFor="sidebar-website-select" className="text-green-300 font-semibold block mb-2">Website:</label>
          <select
            id="sidebar-website-select"
            value={website}
            onChange={handleWebsiteChange}
            className="bg-[#1a1a1a] border border-green-600 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {WEBSITE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ label, path }) => (
            <button
              key={path}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium ${
                location.pathname === path
                  ? 'bg-green-600 text-black'
                  : 'text-white hover:bg-green-500 hover:text-black'
              }`}
              onClick={() => window.location.href = path}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      {/* User Info */}
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
