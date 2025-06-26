// --- b/file:///c%3A/Users/ronte/OneDrive/Desktop/Zynlogic%20tast%201/Renawable%20meet/renewable-web/src/pages/Home.tsx
import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Sponsors from '../components/Sponsors';
import About from '../components/About';
import Features from '../components/Features';

import Agenda from '../components/Agenda';
import FAQ from '../components/FAQ';
import ConferenceTopicsSection from '../components/ConferenceTopicsSection';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Sponsors />
      <About />
      <Features />
      
      <Agenda />
      <ConferenceTopicsSection />
      <FAQ />
    </>
  );
};

export default Home;