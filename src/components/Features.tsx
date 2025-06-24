import React from 'react';

// Use correct local imports (adjust path if needed)
import feature1 from '@/assets/images/feature1.jpg';
import feature2 from '@/assets/images/feature2.jpg';
import feature3 from '@/assets/images/feature3.jpg';

const Features: React.FC = () => {
  return (
    <section className="pt-0 pb-16 md:pb-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-start text-left">
            <img
              src={feature1}
              alt="Highly Commended"
              className="w-full h-80 object-cover mb-4 rounded"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Highly Commended
            </h3>
            <p className="text-gray-700 mb-6 flex-grow">
              A highly commended program featuring global renewable energy sector's most dynamic energy investors, independents, finance, legal and service companies and Governments and NGO's seeking investors.
            </p>
            <a
              href="#learn-more"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded transition-colors mt-auto self-start"
            >
              Learn More
            </a>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start text-left">
            <img
              src={feature2}
              alt="Pioneering Content"
              className="w-full h-80 object-cover mb-4 rounded"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pioneering Content
            </h3>
            <p className="text-gray-700 mb-6 flex-grow">
              Leading the way with new and thought-provoking content, the Renewable Meet 2026 pioneers ideas and speakers never seen before by the industry, focusing on the latest innovations in sustainable energy solutions.
            </p>
            <a
              href="#learn-more"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded transition-colors mt-auto self-start"
            >
              Learn More
            </a>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start text-left">
            <img
              src={feature3}
              alt="Passionate about Energy"
              className="w-full h-80 object-cover mb-4 rounded"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Passionate about Energy
            </h3>
            <p className="text-gray-700 mb-6 flex-grow">
              Our team has extensive experience in the renewable energy sector and is 100% committed to promoting opportunities in the clean energy industry globally, with a focus on accelerating the transition to sustainable power sources.
            </p>
            <a
              href="#learn-more"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded transition-colors mt-auto self-start"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;