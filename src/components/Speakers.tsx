import React, { useEffect, useRef } from 'react';
import { InfiniteSlider } from '../components/ui/infinite-slider';

// Import speaker images using correct relative paths
import KenjiUchino from '../images/Renewable-2026 Speaker/Keynote/1/Kenji UchinoThe.jpg';
import TinaShoa from '../images/Renewable-2026 Speaker/Keynote/2/Tina ShoaSimon.jpg';
import JerryZeyuGao from '../images/Renewable-2026 Speaker/Keynote/3/Jerry Zeyu Gao.jpg';
import MichaelPatt from '../images/Renewable-2026 Speaker/Keynote/4/Michael Patt.jpg';
import DemisHassabis from '../images/Renewable-2026 Speaker/Plenary/1/Demis Hassabis.jpg';
import YinguangJu from '../images/Renewable-2026 Speaker/Plenary/2/Yinguang Ju.jpg';
import BenjaminSovacool from '../images/Renewable-2026 Speaker/Plenary/3/Benjamin Sovacool.jpg';
import MaurizoAcciarri from '../images/Renewable-2026 Speaker/Plenary/4/Maurizo Acciarri.jpg';
import JohnWillian from '../images/Renewable-2026 Speaker/Keynote/5/John Willian.jpg';
import HanshenLi from '../images/Renewable-2026 Speaker/Keynote/6/Hanshen Li.jpg';
import YangHan from '../images/Renewable-2026 Speaker/Plenary/5/Yang Han.jpg';
import HwaiChyuanOng from '../images/Renewable-2026 Speaker/Plenary/6/Hwai Chyuan Ong.jpg';
import WenyeLin from '../images/Renewable-2026 Speaker/Plenary/7/Wenye Lin.jpg';
import AlexanderBaklanov from '../images/Renewable-2026 Speaker/Plenary/8/Alexander Baklanov.jpg';
import JieshanQiu from '../images/Renewable-2026 Speaker/Plenary/9/Jieshan Qiu.jpg';
interface Speaker {
  name: string;
  title: string;
  university: string;
  image: string;
  category: 'keynote' | 'plenary';
}

const speakers: Speaker[] = [
  {
    name: "Dr. Kenji Uchino",
    title: "Keynote Speaker",
    university: "Pennsylvania State University",
    image: KenjiUchino,
    category: "keynote"
  },
  {
    name: "Dr. Tina Shoa",
    title: "Keynote Speaker",
    university: "Fraser University, Canada",
    image: TinaShoa,
    category: "keynote"
  },
  {
    name: "Dr. Jerry Zeyu Gao",
    title: "Keynote Speaker",
    university: "San Jose State University",
    image: JerryZeyuGao,
    category: "keynote"
  },
  {
    name: "Dr. Michael Patt",
    title: "Keynote Speaker",
    university: "Kempten University of Applied Sciences",
    image: MichaelPatt,
    category: "keynote"
  },
  {
    name: "Dr. John Willian",
    title: "Keynote Speaker",
    university: "Sheffield Purdue University, USA",
    image: JohnWillian,
    category: "keynote"
  },
  {
    name: "Dr. Hanshen Li",
    title: "Keynote Speaker",
    university: "Shanghai Jiao Tong University, China",
    image: HanshenLi,
    category: "keynote"
  },
  {
    name: "Dr. Demis Hassabis",
    title: "Plenary Speaker",
    university: "University of Cambridge",
    image: DemisHassabis,
    category: "plenary"
  },
  {
    name: "Dr. Yinguang Ju",
    title: "Plenary Speaker",
    university: "Princeton University",
    image: YinguangJu,
    category: "plenary"
  },
  {
    name: "Dr. Benjamin Sovacool",
    title: "Plenary Speaker",
    university: "Aarhus University",
    image: BenjaminSovacool,
    category: "plenary"
  },
  {
    name: "Dr. Maurizo Acciarri",
    title: "Plenary Speaker",
    university: "University of Milano",
    image: MaurizoAcciarri,
    category: "plenary"
  },
  {
    name: "Dr. Yang Han",
    title: "Plenary Speaker",
    university: "University of Electronic Science Technology of China, China",
    image: YangHan,
    category: "plenary"
  },
  {
    name: "Dr. Hwai Chyuan Ong",
    title: "Plenary Speaker",
    university: "Sunway University, Malaysia",
    image: HwaiChyuanOng,
    category: "plenary"
  },
  {
    name: "Dr. Wenye Lin",
    title: "Plenary Speaker",
    university: "Chinese Academy of Science, China",
    image: WenyeLin,
    category: "plenary"
  },
  {
    name: "Dr. Alexander Baklanov",
    title: "Plenary Speaker",
    university: "University of Copenhagen, Denmark",
    image: AlexanderBaklanov,
    category: "plenary"
  },
  {
    name: "Dr. Jieshan Qiu",
    title: "Plenary Speaker",
    university: "Beijing University of Chemical Technology, China",
    image: JieshanQiu,
    category: "plenary"
  }
];

const Speakers: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let animationFrame: number;
    let direction = 1;
    const scrollStep = () => {
      if (!container) return;
      if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
        direction = -1;
      } else if (container.scrollLeft <= 0) {
        direction = 1;
      }
      container.scrollLeft += direction * 1.2;
      animationFrame = requestAnimationFrame(scrollStep);
    };
    animationFrame = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const keynoteOrder = [
    speakers.find(s => s.name === "Dr. Demis Hassabis")!,
    ...speakers.filter(s => s.category === "keynote" && s.name !== "Dr. Kenji Uchino"),
  ];

  const plenaryOrder = [
    speakers.find(s => s.name === "Dr. Kenji Uchino")!,
    ...speakers.filter(s => s.category === "plenary" && s.name !== "Dr. Demis Hassabis"),
  ];

  const allSpeakers = [
    ...keynoteOrder,
    ...plenaryOrder
  ];

  return (
    <section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
      <div className="container mx-auto px-4">
      
        {/* All Speakers Infinite Slider */}
        <InfiniteSlider duration={70} durationOnHover={75} gap={16}>
          {allSpeakers.map((speaker) => (
            <div key={speaker.name} className="flex flex-col items-center text-center min-w-[240px] mx-2">
              <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transform transition-transform duration-300 hover:scale-105">
                <img 
                  src={speaker.image} 
                  alt={speaker.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ width: '192px', height: '192px', display: 'block' }}
                />
              </div>
              {/* Fixed height for text block to ensure equal spacing */}
              <div className="flex flex-col h-40 w-full gap-0">
                <h3 className="text-xl font-bold text-gray-900 min-h-[3.2rem] max-h-[3.2rem] flex items-center justify-center text-center leading-tight break-words overflow-hidden">
                  {speaker.name}
                </h3>
                {speaker.name === "Dr. Demis Hassabis" && (
                  <p className="text-black-600 font-medium text-sm">Nobel Prize Winner</p>
                )}
                <p className="text-gray-600 min-h-[1.3rem] flex items-center justify-center">{speaker.title}</p>
                <p className="text-gray-900 font-semibold min-h-[2.2rem] max-h-[2.8rem] flex items-center justify-center text-center break-words">
                  {speaker.university}
                </p>
              </div>
            </div>
          ))}
        </InfiniteSlider>
        <div className="mt-16 text-center">
          <a 
            href="/speakers" 
            className="inline-block bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-8 py-3 rounded-md text-lg transition-colors"
          >
            View All Speakers
          </a>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
