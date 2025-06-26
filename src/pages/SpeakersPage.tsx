// import React from 'react';
// import Speakers from '../components/Speakers';

// const SpeakersPage: React.FC = () => {
//   return (
//     <div className="pt-20">
//       <div className="bg-gray-900 py-16">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
//             Conference Speakers
//           </h1>
//           <p className="text-xl text-gray-300 text-center mt-4">
//             Meet our distinguished lineup of industry experts and thought leaders
//           </p>
//         </div>
//       </div>
//       <Speakers />
//     </div>
//   );
// };

// export default SpeakersPage;

import React from 'react';

// Import all speaker images
import KenjiUchino from '../images/Renewable-2026 Speaker/Keynote/1/Kenji UchinoThe.jpg';
import TinaShoa from '../images/Renewable-2026 Speaker/Keynote/2/Tina ShoaSimon.jpg';
import JerryZeyuGao from '../images/Renewable-2026 Speaker/Keynote/3/Jerry Zeyu Gao.jpg';
import MichaelPatt from '../images/Renewable-2026 Speaker/Keynote/4/Michael Patt.jpg';
import JohnWillian from '../images/Renewable-2026 Speaker/Keynote/5/John Willian.jpg';
import HanshenLi from '../images/Renewable-2026 Speaker/Keynote/6/Hanshen Li.jpg';
import DemisHassabis from '../images/Renewable-2026 Speaker/Plenary/1/Demis Hassabis.jpg';
import YinguangJu from '../images/Renewable-2026 Speaker/Plenary/2/Yinguang Ju.jpg';
import BenjaminSovacool from '../images/Renewable-2026 Speaker/Plenary/3/Benjamin Sovacool.jpg';
import MaurizoAcciarri from '../images/Renewable-2026 Speaker/Plenary/4/Maurizo Acciarri.jpg';
import YangHan from '../images/Renewable-2026 Speaker/Plenary/5/Yang Han.jpg';
import HwaiChyuanOng from '../images/Renewable-2026 Speaker/Plenary/6/Hwai Chyuan Ong.jpg';
import WenyeLin from '../images/Renewable-2026 Speaker/Plenary/7/Wenye Lin.jpg';
import AlexanderBaklanov from '../images/Renewable-2026 Speaker/Plenary/8/Alexander Baklanov.jpg';
import JieshanQiu from '../images/Renewable-2026 Speaker/Plenary/9/Jieshan Qiu.jpg';

const placeholder = '';

// Move Demis to Keynote and Kenji to Plenary
const keynoteSpeakers = [
  { name: 'Dr. Demis Hassabis', affiliation: 'University of Cambridge, UK', img: DemisHassabis, isNobel: true },
  { name: 'Dr. Tina ShoaSimon', affiliation: 'Fraser University, Canada', img: TinaShoa },
  { name: 'Dr. Jerry Zeyu Gao', affiliation: 'San Jose State University, USA', img: JerryZeyuGao },
  { name: 'Dr. Michael Patt', affiliation: 'Kempten University of Applied Sciences, Germany', img: MichaelPatt },
  { name: 'Dr. John Willian', affiliation: 'Sheffield Purdue University, USA', img: JohnWillian },
  { name: 'Dr. Hanshen Li', affiliation: 'Shanghai Jiao Tong University, China', img: HanshenLi },
];

const plenarySpeakers = [
  { name: 'Dr. Kenji UchinoThe', affiliation: 'Pennsylvania State University, USA', img: KenjiUchino },
  { name: 'Dr. Yiguang Ju', affiliation: 'Princeton University, USA', img: YinguangJu },
  { name: 'Dr. Benjamin Sovacool', affiliation: 'Aarhus University, Denmark', img: BenjaminSovacool },
  { name: 'Dr. Maurizo Acciarri', affiliation: 'University of Milano, Italy', img: MaurizoAcciarri },
  { name: 'Dr. Yang Han', affiliation: 'University of Electronic Science Technology of China, China', img: YangHan },
  { name: 'Dr. Hwai Chyuan Ong', affiliation: 'Sunway University, Malaysia', img: HwaiChyuanOng },
  { name: 'Dr. Wenye Lin', affiliation: 'Chinese Academy of Science, China', img: WenyeLin },
  { name: 'Dr. Alexander Baklanov', affiliation: 'University of Copenhagen, Denmark', img: AlexanderBaklanov },
  { name: 'Dr. Jieshan Qiu', affiliation: 'Beijing University of Chemical Technology, China', img: JieshanQiu },
];

const SpeakersPage: React.FC = () => {
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

            {/* Keynote Speakers */}
            <div className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
                {keynoteSpeakers.map((spk) => (
                  <div key={spk.name} className="flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
                      <img
                        src={spk.img}
                        alt={spk.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={e => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{spk.name}</h3>
                    {spk.isNobel && (
                      <p className="text-black-1000 text-sm font-medium mb-1">Nobel Prize Winner</p>
                    )}
                    <p className="text-gray-900 font-semibold">{spk.affiliation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Plenary Speakers */}
            <div className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-16 gap-y-20">
                {plenarySpeakers.slice(0, 5).map((spk) => (
                  <div key={spk.name} className="flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 mb-10 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
                      <img
                        src={spk.img}
                        alt={spk.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={e => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{spk.name}</h3>
                    <p className="text-gray-900 font-semibold">{spk.affiliation}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-x-16 gap-y-20 mt-12">
                {plenarySpeakers.slice(5).map((spk) => (
                  <div key={spk.name} className="flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 mb-10 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
                      <img
                        src={spk.img}
                        alt={spk.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={e => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{spk.name}</h3>
                    <p className="text-gray-900 font-semibold">{spk.affiliation}</p>
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


