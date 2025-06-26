// import React, { lazy, Suspense } from 'react';
// import Hero from '../components/Hero';
// import Sponsors from '../components/Sponsors';
// import About from '../components/About';
// import Features from '../components/Features';
// import Speakers from '../components/Speakers';
// import Agenda from '../components/Agenda';
// import FAQ from '../components/FAQ';
// import Register from '../components/Register';
// import Videos from '../components/videos';

// const Home: React.FC = () => {
//   return (
//     <>
//       <Hero />
//       <Sponsors />
//       <About />
//       <Features />
//       <Speakers />
//       <Agenda />
//       <Videos />
//       <FAQ />
//       <Register />
//     </>
//   );
// };

// export default Home;
import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Sponsors from '../components/Sponsors';
import About from '../components/About';
import Features from '../components/Features';
import Speakers from '../components/Speakers';
import Agenda from '../components/Agenda';
import FAQ from '../components/FAQ';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Sponsors />
      <About />
      <Features />
      <Speakers />
      <Agenda />
      <FAQ />
    </>
  );
};

export default Home;