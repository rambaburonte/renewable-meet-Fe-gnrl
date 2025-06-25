// Cross-tab session test utility
// Add this to browser console to test cross-tab sync

declare global {
  interface Window {
    testLogin: () => void;
    testLogout: () => void;
    testCrossTabSync: () => void;
  }
}

export const testCrossTabSync = () => {
  console.log('=== Cross-Tab Session Sync Test ===');
  
  // Test 1: Check if storage events work
  console.log('Test 1: Storage Event Test');
  window.addEventListener('storage', (event) => {
    console.log('📡 Storage event received:', {
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      url: event.url
    });
  });
  
  // Test 2: Manual broadcast test
  console.log('Test 2: Manual Broadcast Test');
  const testData = {
    type: 'test',
    timestamp: Date.now(),
    message: 'Hello from tab ' + Math.random().toString(36).substr(2, 5)
  };
  
  localStorage.setItem('test_sync_' + Date.now(), JSON.stringify(testData));
  
  // Test 3: Check current session
  console.log('Test 3: Current Session Check');
  const currentSession = sessionStorage.getItem('enterprise_session');
  console.log('Current session:', currentSession ? JSON.parse(currentSession) : 'No session');
  
  // Test 4: Simulate login
  window.testLogin = () => {
    console.log('🔑 Simulating login...');
    const fakeSession = {
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'ADMIN' },
      accessToken: 'fake_token_' + Date.now(),
      sessionId: 'test_session_' + Date.now(),
      expiresAt: Date.now() + 3600000,
      issuedAt: Date.now()
    };
    
    sessionStorage.setItem('enterprise_session', JSON.stringify(fakeSession));
    
    const syncData = {
      type: 'login',
      timestamp: Date.now(),
      session: fakeSession
    };
    
    localStorage.setItem('admin_session_sync_' + Date.now(), JSON.stringify(syncData));
    console.log('Login broadcasted!');
  };
  
  // Test 5: Simulate logout
  window.testLogout = () => {
    console.log('🚪 Simulating logout...');
    sessionStorage.removeItem('enterprise_session');
    
    const syncData = {
      type: 'logout',
      timestamp: Date.now(),
      session: null
    };
    
    localStorage.setItem('admin_session_sync_' + Date.now(), JSON.stringify(syncData));
    console.log('Logout broadcasted!');
  };
  
  console.log('✅ Test setup complete!');
  console.log('📝 Available commands:');
  console.log('  - testLogin() - Simulate login');
  console.log('  - testLogout() - Simulate logout');
  console.log('🔍 Open multiple tabs and run these commands to test cross-tab sync');
};

// Auto-run test if in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.testCrossTabSync = testCrossTabSync;
  console.log('🧪 Cross-tab sync test utility loaded! Run testCrossTabSync() to start testing.');
}
