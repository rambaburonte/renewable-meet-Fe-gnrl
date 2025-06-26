import React from 'react';
import { useLocation } from 'react-router-dom';
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
import PreviousEdition from './pages/PreviousEdition';
import RegistrationPage from './pages/RegistrationPage';
import AbstractSubmissionPage from './pages/AbstractSubmissionPage';
import AdminWrapper from './AdminWrapper';
import { EnterpriseSessionProvider } from './Context/EnterpriseSessionContext';
import SessionMonitor from './components/SessionMonitor';

const AppWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // For admin routes, wrap with session provider and use AdminWrapper
  if (isAdminRoute) {
    return (
      <EnterpriseSessionProvider>
        <AdminWrapper />
        <SessionMonitor position="bottom-right" compact={true} />
      </EnterpriseSessionProvider>
    );
  }

  // For public routes, use simple routing without session management
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/conference-topics" element={<ConferenceTopics />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/abstract-submission" element={<AbstractSubmissionPage />} />
          <Route path="/previous-edition" element={<PreviousEdition />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppWrapper;
