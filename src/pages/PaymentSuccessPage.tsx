import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BASE_URL } from '../config';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get session_id from URL parameters
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      setPaymentData({ sessionId });
      
      // Check if there's a pending registration to complete
      const pendingRegistration = localStorage.getItem('pendingRegistration');
      if (pendingRegistration) {
        
        // Try to complete the registration
        fetch(`${BASE_URL}/api/registration/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: pendingRegistration,
        })
        .then(response => {
          if (response.ok) {
            localStorage.removeItem('pendingRegistration');
          } 
        })
        .catch(error => {
        });
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-b from-green-50 to-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for your registration! Your payment has been processed successfully 
            and you're now registered for the Renewable Energy Summit 2026.
          </p>

          {/* Payment Details */}
          {paymentData?.sessionId && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Session ID:</strong> {paymentData.sessionId}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-medium">Completed</span></p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="text-blue-700 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                You will receive a confirmation email with your registration details
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Check your email for conference updates and agenda information
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                If you have any questions, please contact our support team
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
            <Link 
              to="/contact" 
              className="bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          {/* Conference Info Reminder */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Conference Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong className="block text-gray-900">Date:</strong>
                May 29 - 31, 2026
              </div>
              <div>
                <strong className="block text-gray-900">Location:</strong>
                DoubleTree by Hilton Tokyo Ariake - Deira Tokyo Japan
              </div>
              <div>
                <strong className="block text-gray-900">Type:</strong>
                Renewable Energy Summit
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentSuccessPage;
