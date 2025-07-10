import React from "react";

const PaymentCancel: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
    <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mb-6">Your payment was cancelled. If you wish to try again, please return to the registration page.</p>
      <a href="/" className="inline-block bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition">Back to Home</a>
    </div>
  </div>
);

export default PaymentCancel;
