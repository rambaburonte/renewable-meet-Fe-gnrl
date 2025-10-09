import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, Mail, Calendar, Users, ArrowRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BASE_URL } from '../config';

const PAYMENT_API_URL = BASE_URL; // Using BASE_URL as PAYMENT_API_URL

const PaymentSuccessPage = () => {
    const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'success' | 'error' | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [pollCount, setPollCount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        // Get session_id and type from query params
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        const paymentType = params.get('type'); // Check for type=discount parameter

        if (!sessionId) {
            setRegistrationStatus('error');
            setErrorMsg('Invalid payment link. Please complete your registration through the proper payment process.');
            return;
        }

        const checkAndUpdatePayment = async () => {
            setRegistrationStatus('pending');
            const maxPolls = 10; // Maximum 10 attempts (about 30 seconds)
            const pollInterval = 3000; // 3 seconds between polls
            
            const pollPaymentStatus = async (attempt: number): Promise<void> => {
                try {
                    setPollCount(attempt);
                    console.log(`Poll attempt ${attempt}/${maxPolls} - Checking payment status for session:`, sessionId);
                    
                    // Determine if this is a discount payment from URL parameter
                    const isDiscountFromUrl = paymentType === 'discount';
                    
                    // Choose the appropriate status endpoint based on discount detection
                    const statusEndpoint = isDiscountFromUrl ? '/api/discounts/status' : '/api/payment/status';
                    
                    // 1. Check payment status using appropriate endpoint
                    let statusRes;
                    if (isDiscountFromUrl) {
                        // For discount payments, use GET with path parameter (real-time from payment gateway)
                        statusRes = await fetch(`${PAYMENT_API_URL}${statusEndpoint}/${sessionId}`);
                    } else {
                        // For regular payments, use GET with path parameter
                        statusRes = await fetch(`${PAYMENT_API_URL}${statusEndpoint}/${sessionId}`);
                    }
                    
                    console.log(`Using ${isDiscountFromUrl ? 'DISCOUNT' : 'REGULAR'} status endpoint: ${statusEndpoint}`);
                    console.log('Status API response status:', statusRes.status);
                    
                    if (!statusRes.ok) {
                        const errorText = await statusRes.text();
                        console.error('Status API error:', errorText);
                        
                        if (attempt >= maxPolls) {
                            setRegistrationStatus('error');
                            setErrorMsg(`Could not verify payment status after ${maxPolls} attempts. Please contact support if payment was deducted.`);
                            return;
                        }
                        
                        // Retry after interval
                        setTimeout(() => pollPaymentStatus(attempt + 1), pollInterval);
                        return;
                    }
                    
                    const statusData = await statusRes.json();
                    console.log(`Poll ${attempt} - Status API response data:`, statusData);
                    setDebugInfo(`Poll ${attempt}/${maxPolls} - Status API Response: ${JSON.stringify(statusData, null, 2)}`);
                    
                    // Check if payment is successful
                    const isPaymentSuccessful = 
                        statusData.paymentStatus === 'paid' || 
                        statusData.status === 'COMPLETED' ||
                        statusData.paymentStatus === 'no_payment_required';
                    
                    if (isPaymentSuccessful) {
                        console.log('Payment status confirmed as successful, calling update API...');
                        
                        // Check if this is a discount payment by URL parameter OR by looking for "discount" in description/name
                        const isDiscountFromData = 
                            (statusData.description && statusData.description.toLowerCase().includes('discount')) ||
                            (statusData.name && statusData.name.toLowerCase().includes('discount')) ||
                            (statusData.productName && statusData.productName.toLowerCase().includes('discount')) ||
                            (statusData.metadata && statusData.metadata.productName && statusData.metadata.productName.toLowerCase().includes('discount'));
                        
                        // Prioritize URL parameter, then fall back to data detection
                        const isDiscountPayment = isDiscountFromUrl || isDiscountFromData;
                        
                        const updateEndpoint = isDiscountPayment ? '/api/discounts/update' : '/api/payment/update';
                        console.log(`Detected ${isDiscountPayment ? 'DISCOUNT' : 'REGULAR'} payment (URL: ${isDiscountFromUrl}, Data: ${isDiscountFromData}). Using endpoint: ${updateEndpoint}`);
                        
                        // 2. Update payment status in DB
                        const updateRes = await fetch(`${PAYMENT_API_URL}${updateEndpoint}?sessionId=${encodeURIComponent(sessionId)}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        });
                        console.log('Update API response status:', updateRes.status);
                        
                        if (!updateRes.ok) {
                            const errorText = await updateRes.text();
                            console.error('Update API error:', errorText);
                            setRegistrationStatus('error');
                            setErrorMsg(`Payment verified but failed to update database. Please contact support.`);
                            return;
                        }
                        
                        const updateData = await updateRes.json();
                        console.log('Update API response data:', updateData);
                        
                        // Success - payment verified and database updated
                        setRegistrationStatus('success');
                        return;
                    }
                    
                    // Payment not ready yet, check if we should continue polling
                    if (attempt >= maxPolls) {
                        setRegistrationStatus('error');
                        setErrorMsg(`Payment verification timed out. Please contact support if payment was deducted.`);
                        return;
                    }
                    
                    // Continue polling
                    console.log(`Payment not ready yet (Status: ${statusData.paymentStatus}, DB Status: ${statusData.status}), retrying in ${pollInterval/1000} seconds...`);
                    setTimeout(() => pollPaymentStatus(attempt + 1), pollInterval);
                    
                } catch (err) {
                    console.error(`Error in poll attempt ${attempt}:`, err);
                    
                    if (attempt >= maxPolls) {
                        setRegistrationStatus('error');
                        setErrorMsg(`Error processing payment status. Please contact support if payment was deducted.`);
                        return;
                    }
                    
                    // Retry on error
                    setTimeout(() => pollPaymentStatus(attempt + 1), pollInterval);
                }
            };
            
            // Start polling
            pollPaymentStatus(1);
        };
        checkAndUpdatePayment();
    }, []);

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center space-x-2">
            <Loader className="animate-spin text-green-600 w-6 h-6" />
            <span className="text-green-700 font-medium">Processing your registration...</span>
        </div>
    );

    const SuccessContent = () => (
        <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 w-16 h-16" />
            </div>

            {/* Main Success Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Registration Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Welcome to the Renewable Energy Summit 2026
            </p>

            {/* Success Features */}
            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-3 text-green-700">
                    <Mail className="w-5 h-5" />
                    <span>Confirmation email sent to your inbox</span>
                </div>
              
                <div className="flex items-center justify-center space-x-3 text-green-700">
                    <Users className="w-5 h-5" />
                    <span>Access to exclusive networking platform</span>
                </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-green-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-green-800 mb-3">What's Next?</h3>
                <div className="text-left space-y-2 text-green-700">
                    <p>• Check your email for detailed summit information</p>
                    <p>• Add the event dates to your calendar</p>
                    <p>• Join our exclusive participant community</p>
                    <p>• Prepare for an inspiring learning experience</p>
                </div>
            </div>
        </div>
    );

    const PendingContent = () => (
        <div className="text-center">
            <div className="mx-auto mb-6 w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader className="animate-spin text-blue-600 w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Finalizing Your Registration
            </h2>
            <p className="text-gray-600 mb-6">
                Please wait while we confirm your payment and complete your registration.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
                <LoadingSpinner />
                {pollCount > 0 && (
                    <p className="text-sm text-blue-600 mt-2">
                        Step {pollCount} of 10 - Verifying payment details...
                    </p>
                )}
            </div>
        </div>
    );

    const ErrorContent = () => (
        <div className="text-center">
            <div className="mx-auto mb-6 w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Registration Issue
            </h2>
            <p className="text-gray-600 mb-6">
                We encountered an issue while processing your registration.
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
            <div className="space-y-3">
                <p className="text-sm text-gray-600">
                    Don't worry! Our support team will help you resolve this quickly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                        href="mailto:support@globalrenewablemeet.com"
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                    >
                        <Mail className="w-4 h-4" />
                        <span>Contact Support</span>
                    </a>
                    <Link
                        to="/register"
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-50">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl shadow-2xl border border-green-100 max-w-2xl w-full p-10">
                    {registrationStatus === 'pending' && <PendingContent />}
                    {registrationStatus === 'success' && <SuccessContent />}
                    {registrationStatus === 'error' && <ErrorContent />}
                    
                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center space-x-2 font-medium"
                        >
                            <span>Back to Home</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        {registrationStatus === 'success' && (
                            <a
                                href="/agenda"
                                className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-xl hover:bg-green-50 transition flex items-center justify-center space-x-2 font-medium"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>View Program</span>
                            </a>
                        )}
                    </div>

                    {/* Debug Info - Only show in development/error cases */}
                    {registrationStatus === 'error' && debugInfo && (
                        <details className="mt-6 text-xs">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                                Technical Details (for support)
                            </summary>
                            <pre className="whitespace-pre-wrap mt-2 p-3 bg-gray-100 rounded-lg text-left text-gray-600 text-xs max-h-40 overflow-y-auto">
                                {debugInfo}
                            </pre>
                        </details>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentSuccessPage;
