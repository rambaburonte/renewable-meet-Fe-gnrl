import React from 'react';
import AppWrapper from './AppWrapper';
import ScrollToHash from './components/ScrollToHash';
// import './lib/sessionDebug'; // Disabled for better performance
import './lib/crossTabTest'; // Load cross-tab testing utility

const App = () => {
  // Only apply ScrollToHash if not on /register route
  const isRegisterPage = window.location.pathname === '/register';
  
  return (
    <>
      {!isRegisterPage && <ScrollToHash />}
      <AppWrapper />
    </>
  );
};

export default App;
