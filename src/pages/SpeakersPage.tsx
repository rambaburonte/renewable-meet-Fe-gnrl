
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';


const placeholder = '';

interface Speaker {
  id?: string | number;
  name: string;
  title?: string;
  university?: string;
  imageUrl?: string;
  type?: string;
  category?: 'keynote' | 'plenary';
}

// import React from 'react';



const SpeakersPage: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpeakers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${BASE_URL}/api/speakers/renewable`);
        setSpeakers(res.data);
      } catch (e) {
        setError('Failed to fetch speakers');
      }
      setLoading(false);
    };
    fetchSpeakers();
  }, []);

// Duplicate SpeakersPage removed to fix errors
  return (
    <div className="pt-20 scroll-smooth">
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center animate-fadeIn">
            Conference Speakers
          </h1>
          <p
            className="text-xl text-gray-300 text-center mt-4 animate-fadeIn"
            style={{ animationDelay: '0.3s' }}
          >
            Meet our distinguished lineup of industry experts and thought leaders
          </p>
        </div>
      </div>

      <div className="mt-12">
        <section className="pt-8 pb-8 md:pt-12 md:pb-16 bg-white">
          <div className="container mx-auto px-4">
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {loading && <div className="text-center">Loading...</div>}

            {/* Speakers Grid */}
            <div className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
                {speakers.map((spk) => (
                  <div key={spk.id || spk.name} className="flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
                      {spk.imageUrl && (
                        <img
                          src={spk.imageUrl}
                          alt={spk.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={e => (e.currentTarget.src = placeholder)}
                        />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{spk.name}</h3>
                    {spk.title && <p className="text-gray-600 mb-1">{spk.title}</p>}
                    {spk.university && <p className="text-gray-900 font-semibold">{spk.university}</p>}
                    {spk.type && <p className="text-green-700 font-medium mb-1">{spk.type}</p>}
                    {spk.bio && <p className="text-gray-500 text-sm mt-1">{spk.bio}</p>}
                  </div>
                ))}
              </div>
            </div>  

          </div>
        </section>
      </div>
    </div>
  );
};

export default SpeakersPage;


