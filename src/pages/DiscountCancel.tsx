import React from "react";

const DiscountCancel: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
    <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mb-6">Your discount registration payment was cancelled. If this was a mistake, you can try again.</p>
      <a href="/" className="inline-block bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 transition">Back to Home</a>
    </div>
  </div>
);

export default DiscountCancel;
