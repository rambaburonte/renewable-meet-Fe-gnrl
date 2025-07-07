import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useEnterpriseSession } from './Context/EnterpriseSessionContext';

import AdminLogin from './Admin/Adminlogin';
import AdminDashboard from './Admin/AdminDashboard';
import AdminPayments from './Admin/AdminPayments';
import AdminAccommodations from './Admin/AdminAccommodations';
import AdminBookings from './Admin/AdminBookings';
import AdminAbstractSubmissions from './Admin/AdminAbstractSubmissions';
import AdminManageEvents from './Admin/AdminManageEvents';
import AdminInterests from './Admin/AdminInterests';
import AdminRegistrationTypes from './Admin/AdminRegistrationTypes';

const AdminWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useEnterpriseSession();
  const [sessionCheckComplete, setSessionCheckComplete] = useState(false);

  // Simplified session check
  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionCheckComplete(true);
    }, 2000); // 2 second max wait

    return () => clearTimeout(timer);
  }, []);

  // Mark session as checked when loading completes
  useEffect(() => {
    if (!isLoading) {
      setSessionCheckComplete(true);
    }
  }, [isLoading]);

  // Handle navigation based on auth status
  useEffect(() => {
    if (!sessionCheckComplete) return;

    const isLoginPage = location.pathname === '/admin-login';
    
    if (!isLoginPage && !isAuthenticated) {
      navigate('/admin-login');
    } else if (isLoginPage && isAuthenticated) {
      navigate('/admin-dashboard');
    }
  }, [sessionCheckComplete, isAuthenticated, location.pathname, navigate]);

  // Show loading only for non-login pages while checking session
  if (!sessionCheckComplete && location.pathname !== '/admin-login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-payments" element={<AdminPayments />} />
          <Route path="/admin-accommodations" element={<AdminAccommodations />} />
          <Route path="/admin-bookings" element={<AdminBookings />} />
          <Route path="/admin-abstract-submissions" element={<AdminAbstractSubmissions />} />
          <Route path="/admin-manage-events" element={<AdminManageEvents />} />
          <Route path="/admin-interests" element={<AdminInterests />} />
          <Route path="/admin-registration-types" element={<AdminRegistrationTypes />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminWrapper;
