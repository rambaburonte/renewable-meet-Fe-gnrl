import React from 'react';
import Sponsors from '../components/Sponsors';

const PartnersPage: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Our Partners
          </h1>
          <p className="text-xl text-gray-300 text-center mt-4">
            Meet the organizations helping make this conference possible
          </p>
        </div>
      </div>
      <div className="py-16">
        <Sponsors />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Become a Partner
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join us in shaping the future of renewable energy. Partner with Renewable Meet 2026 and connect with industry leaders, innovators, and decision-makers.
          </p>
          <a
            href="#partner"
            className="inline-block bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-8 py-3 rounded-md text-lg transition-colors"
          >
            Partner With Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;