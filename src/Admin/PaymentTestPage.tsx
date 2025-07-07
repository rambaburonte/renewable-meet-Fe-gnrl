// import React, { useState } from 'react';
// import AdminPaymentService from '../services/AdminPaymentService';

// const PaymentTestPage: React.FC = () => {
//   const [testResult, setTestResult] = useState<string>('');
//   const [loading, setLoading] = useState(false);

//   const testAuthToken = () => {
//     // Check for token in various places
//     const token1 = localStorage.getItem('authToken');
//     const token2 = sessionStorage.getItem('authToken');
    
//     let enterpriseToken = null;
//     try {
//       const enterpriseSession = sessionStorage.getItem('enterprise_session');
//       if (enterpriseSession) {
//         const session = JSON.parse(enterpriseSession);
//         enterpriseToken = session.accessToken;
//       }
//     } catch (error) {
      
//     }
    
//     let cookieToken = null;
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; admin_jwt=`);
//     if (parts.length === 2) {
//       cookieToken = parts.pop()!.split(';').shift() || null;
//     }

//     setTestResult(`
// Token Check Results:
// - localStorage authToken: ${token1 ? 'Found ✓' : 'Not found ✗'}
// - sessionStorage authToken: ${token2 ? 'Found ✓' : 'Not found ✗'}
// - enterprise_session token: ${enterpriseToken ? 'Found ✓' : 'Not found ✗'}
// - admin_jwt cookie: ${cookieToken ? 'Found ✓' : 'Not found ✗'}

// Active Token: ${token1 || token2 || enterpriseToken || cookieToken || 'None'}
//     `);
//   };

//   const testPaymentAuth = async () => {
//     setLoading(true);
//     try {
//       const result = await AdminPaymentService.testAdminAuth();
//       setTestResult(`Payment Auth Test: SUCCESS ✓\n${JSON.stringify(result, null, 2)}`);
//     } catch (error) {
//       setTestResult(`Payment Auth Test: FAILED ✗\nError: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testHealthCheck = async () => {
//     setLoading(true);
//     try {
//       const result = await AdminPaymentService.healthCheck();
//       setTestResult(`Health Check: SUCCESS ✓\n${JSON.stringify(result, null, 2)}`);
//     } catch (error) {
//       setTestResult(`Health Check: FAILED ✗\nError: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testGetAllPayments = async () => {
//     setLoading(true);
//     try {
//       const result = await AdminPaymentService.getAllPayments();
//       setTestResult(`Get All Payments: SUCCESS ✓\nCount: ${result.length}\n${JSON.stringify(result.slice(0, 2), null, 2)}`);
//     } catch (error) {
//       setTestResult(`Get All Payments: FAILED ✗\nError: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testGetStats = async () => {
//     setLoading(true);
//     try {
//       const result = await AdminPaymentService.getPaymentStats();
//       setTestResult(`Get Payment Stats: SUCCESS ✓\n${JSON.stringify(result, null, 2)}`);
//     } catch (error) {
//       setTestResult(`Get Payment Stats: FAILED ✗\nError: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-green-400 mb-8">🧪 Payment API Test</h1>
        
//         <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-6 mb-8">
//           <h2 className="text-2xl font-bold text-green-300 mb-6">API Tests</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//             <button
//               onClick={testAuthToken}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               Check Auth Tokens
//             </button>
            
//             <button
//               onClick={testHealthCheck}
//               disabled={loading}
//               className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Health Check
//             </button>
            
//             <button
//               onClick={testPaymentAuth}
//               disabled={loading}
//               className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Test Payment Auth
//             </button>
            
//             <button
//               onClick={testGetStats}
//               disabled={loading}
//               className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Get Payment Stats
//             </button>
            
//             <button
//               onClick={testGetAllPayments}
//               disabled={loading}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Get All Payments
//             </button>
//           </div>
          
//           {loading && (
//             <div className="text-center text-green-400 mb-4">
//               🔄 Testing API...
//             </div>
//           )}
          
//           <div className="bg-[#2a2a2a] rounded-lg p-4">
//             <h3 className="text-green-300 font-semibold mb-2">Test Results:</h3>
//             <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
//               {testResult || 'Click a test button to see results...'}
//             </pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentTestPage;
