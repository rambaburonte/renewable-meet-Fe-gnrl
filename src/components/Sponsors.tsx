import React from 'react';
import { InfiniteSlider } from '../components/ui/infinite-slider';
import c from '@/assets/images/c.png';
import amazon from '@/assets/images/amazon.png';
import apple from '@/assets/images/apple.png';
import ibm from '@/assets/images/ibm.png';
import Microsoft from '@/assets/images/Microsoft.png';

const Sponsors: React.FC = () => {
  const sponsors = [
    { name: 'Energy Corp', logo: c },
    { name: 'Green Future', logo: amazon },
    { name: 'Sustainable Power', logo: apple },
    { name: 'EcoEnergy', logo: ibm },
    { name: 'Microsoft', logo: Microsoft },
  ];

  return (
    <section className="flex items-center justify-center bg-white pt-24 pb-20" style={{ height: 'auto' }}>
      <div className="w-full px-4 max-w-6xl mx-auto">
        <InfiniteSlider duration={25} durationOnHover={75} gap={8}>
          {sponsors.map((sponsor, index) => (
            <img
              key={index}
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              className="object-contain transition-all duration-300 mx-auto"
              style={{
                width: '220px',
                height: '110px',
                display: 'block',
              }}
            />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};

export default Sponsors;
