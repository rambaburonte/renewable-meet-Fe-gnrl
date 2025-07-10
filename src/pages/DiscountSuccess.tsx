import React from "react";

const DiscountSuccess: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
    <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-6">Thank you for your payment. Your discount registration is confirmed.</p>
      <a href="/" className="inline-block bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">Back to Home</a>
    </div>
  </div>
);

export default DiscountSuccess;
