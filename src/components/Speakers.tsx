// ...existing code...
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
  bio?: string;
  category?: 'keynote' | 'plenary';
}

const Speakers: React.FC = () => {
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

  return (
    <section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16"></h2>
        {/* Speakers Grid */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {speakers.map((speaker) => (
                <div key={speaker.id || speaker.name} className="flex flex-col items-center text-center">
                  <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transform transition-transform duration-300 hover:scale-105">
                    {speaker.imageUrl && (
                      <img
                        src={speaker.imageUrl}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={e => (e.currentTarget.src = placeholder)}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                  {speaker.title && <p className="text-gray-600 mb-1">{speaker.title}</p>}
                  {speaker.university && <p className="text-gray-900 font-semibold">{speaker.university}</p>}
                  {speaker.type && <p className="text-green-700 font-medium mb-1">{speaker.type}</p>}
                  {speaker.bio && <p className="text-gray-500 text-sm mt-1">{speaker.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Speakers;
