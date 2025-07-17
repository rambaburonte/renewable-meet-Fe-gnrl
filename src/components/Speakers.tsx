import React from 'react';
import KenjiUchino from '../images/Renewable-2026 Speaker/Keynote/1/Kenji UchinoThe.jpg';
import TinaShoa from '../images/Renewable-2026 Speaker/Keynote/2/Tina ShoaSimon.jpg';
import JerryZeyuGao from '../images/Renewable-2026 Speaker/Keynote/3/Jerry Zeyu Gao.jpg';
import MichaelPatt from '../images/Renewable-2026 Speaker/Keynote/4/Michael Patt.jpg';
import DemisHassabis from '../images/Renewable-2026 Speaker/Plenary/1/Demis Hassabis.jpg';
import YinguangJu from '../images/Renewable-2026 Speaker/Plenary/2/Yinguang Ju.jpg';
import BenjaminSovacool from '../images/Renewable-2026 Speaker/Plenary/3/Benjamin Sovacool.jpg';
import MaurizoAcciarri from '../images/Renewable-2026 Speaker/Plenary/4/Maurizo Acciarri.jpg';
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
     }
    ];
    const Speakers: React.FC = () => {
          const keynoteOrder = [
            speakers.find(s => s.name === "Dr. Demis Hassabis")!,
            ...speakers.filter(s => s.category === "keynote" && s.name !== "Dr. Kenji Uchino"),
          ];
        
          const plenaryOrder = [
            speakers.find(s => s.name === "Dr. Kenji Uchino")!,
            ...speakers.filter(s => s.category === "plenary" && s.name !== "Dr. Demis Hassabis"),
          ];
           return (
              <section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
                <div className="container mx-auto px-4">

                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
   </h2>

        {/* Keynote Speakers */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {keynoteOrder.map((speaker) => (
              <div key={speaker.name} className="flex flex-col items-center text-center">
                <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name} 
                    className="w-full h-full object-cover"
                    loading="lazy" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                {speaker.name === "Dr. Demis Hassabis" && (
                  <p className="text-black-600 font-medium text-sm mb-1">Nobel Prize Winner</p>
                )}
                <p className="text-gray-600 mb-1">{speaker.title}</p>
                <p className="text-gray-900 font-semibold">{speaker.university}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plenary Speakers */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {plenaryOrder.map((speaker) => (
              <div key={speaker.name} className="flex flex-col items-center text-center">
                <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                <p className="text-gray-600 mb-1">{speaker.title}</p>
                <p className="text-gray-900 font-semibold">{speaker.university}</p>
              </div>
            ))}
          </div>
        </div>

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
