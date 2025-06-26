import React from 'react';
import { InfiniteSlider } from '../components/ui/infinite-slider';
import psu from '../images/psu.png';
import sfu from '../images/Renewable-2026 Speaker/Keynote/2/sfu.png';
import sjs from '../images/Renewable-2026 Speaker/Keynote/3/sjs.png';
import hku from '../images/Renewable-2026 Speaker/Keynote/4/hku.jpg';
import pu from '../images/Renewable-2026 Speaker/Keynote/5/pu.png';
import sjtu from '../images/Renewable-2026 Speaker/Keynote/6/sjtu.png';
import uc from '../images/Renewable-2026 Speaker/Plenary/1/uc.png';
import pcu from '../images/Renewable-2026 Speaker/Plenary/2/pcu.png';
import au from '../images/Renewable-2026 Speaker/Plenary/3/au.png';
import udsm from '../images/Renewable-2026 Speaker/Plenary/4/udsm.png';
import uestc from '../images/Renewable-2026 Speaker/Plenary/5/uestc.jpg';
import snu from '../images/Renewable-2026 Speaker/Plenary/6/snu.png';
import cas from '../images/Renewable-2026 Speaker/Plenary/7/cas.png';
import uoc from '../images/Renewable-2026 Speaker/Plenary/8/uoc.png';
import buct from '../images/Renewable-2026 Speaker/Plenary/9/buct.jpg';
const Sponsors: React.FC = () => {
  const sponsors = [
    { name: 'PSU', logo: psu },
    { name: 'SFU', logo: sfu },
    { name: 'SJS', logo: sjs },
    { name: 'HKU', logo: hku },
    { name: 'PU', logo: pu },
    { name: 'SJTU', logo: sjtu },
    { name: 'UC', logo: uc },
    { name: 'PCC', logo: pcu },
    { name: 'AU', logo: au },
    { name: 'UDSM', logo: udsm },
    { name: 'UESTC', logo: uestc },
    { name: 'SNU', logo: snu },
    { name: 'CAS', logo: cas },
    { name: 'UOC', logo: uoc },
    { name: 'BUCT', logo: buct },
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
