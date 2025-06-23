import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import SpeakersPage from './pages/SpeakersPage';
import AgendaPage from './pages/AgendaPage';
import GalleryPage from './pages/GalleryPage';
import PartnersPage from './pages/PartnersPage';
import ContactPage from './pages/ContactPage';
import ConferenceTopics from './pages/ConferenceTopics';
import AdminLogin from './Admin/Adminlogin';
import AdminDashboard from './Admin/AdminDashboard';
import AdminAccommodations from './Admin/AdminAccommodations';
import AdminBookings from './Admin/AdminBookings';
import AdminAbstractSubmissions from './Admin/AdminAbstractSubmissions';
import AdminManageEvents from './Admin/AdminManageEvents';
import AdminInterests from './Admin/AdminInterests';
import PreviousEdition from './pages/PreviousEdition';
import Register from './components/Register';
import { useAdminUserContext } from './Context/AdminUserContext';

const AppWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const { adminUser } = useAdminUserContext();

  // Redirect if admin route accessed without login, except /admin-login
  useEffect(() => {
    const isProtectedAdminRoute = isAdminRoute && location.pathname !== '/admin-login';
    if (isProtectedAdminRoute && !adminUser) {
      navigate('/admin-login');
    }
  }, [location.pathname, adminUser, isAdminRoute, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/conference-topics" element={<ConferenceTopics />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register#abstract" element={<Register />} />
       \
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-accommodations" element={<AdminAccommodations />} />
          <Route path="/admin-bookings" element={<AdminBookings />} />
          <Route path="/admin-abstract-submissions" element={<AdminAbstractSubmissions />} />
          <Route path="/admin-manage-events" element={<AdminManageEvents />} />
          <Route path="/previous-edition" element={<PreviousEdition />} />
          <Route path="/admin-interests" element={<AdminInterests />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};
export default AppWrapper;
