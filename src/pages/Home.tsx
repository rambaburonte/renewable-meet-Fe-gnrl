// --- b/file:///c%3A/Users/ronte/OneDrive/Desktop/Zynlogic%20tast%201/Renawable%20meet/renewable-web/src/pages/Home.tsx
import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import PostponedModal from '../components/PostponedModal';
import Sponsors from '../components/Sponsors';
import About from '../components/About';
import Features from '../components/Features';
import Stats from '../components/Stats';

import Agenda from '../components/Agenda';
import FAQ from '../components/FAQ';
import ConferenceTopicsSection from '../components/ConferenceTopicsSection';

const Home: React.FC = () => {
  return (
    <>
      <PostponedModal />
      <Hero />
      <Stats />
      <Sponsors />
      <About />
      <Features />
      
      <Agenda />
     
      <FAQ />
    </>
  );
};

export default Home;