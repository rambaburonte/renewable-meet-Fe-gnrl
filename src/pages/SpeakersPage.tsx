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

const placeholder = '/images/Renewable-2026-Speaker/placeholder.jpg';

const keynoteSpeakers = [
  {
    name: 'Dr. Kenji UchinoThe',
    affiliation: 'Pennsylvania State University, USA',
    img: '/images/Renewable-2026 Speaker/Keynote/1/Kenji UchinoThe.jpg',
  },
  {
    name: 'Dr. Tina ShoaSimon',
    affiliation: 'Fraser University, Canada',
    img: '/images/Renewable-2026 Speaker/Keynote/2/Tina ShoaSimon.jpg',
  },
  {
    name: 'Dr. Jerry Zeyu Gao',
    affiliation: 'San Jose State University, USA',
    img: '/images/Renewable-2026 Speaker/Keynote/3/Jerry Zeyu Gao.jpg',
  },
  {
    name: 'Dr. Michael Patt',
    affiliation: 'Kempten University of Applied Sciences, Germany',
    img: '/images/Renewable-2026 Speaker/Keynote/4/Michael Patt.jpg',
  },
  {
    name: 'Dr. John Willian',
    affiliation: 'Sheffield Purdue University, USA',
    img: '/images/Renewable-2026 Speaker/Keynote/5/John Willian.jpg',
  },
  {
    name: 'Dr. Hanshen Li',
    affiliation: 'Shanghai Jiao Tong University, China',
    img: '/images/Renewable-2026 Speaker/Keynote/6/Hanshen Li.jpg',
  },
];

const plenarySpeakers = [
  {
    name: 'Dr. Demis Hassabis',
    affiliation: 'University of Cambridge, UK',
    img: '/images/Renewable-2026 Speaker/Plenary/1/Demis Hassabis.jpg',
    style: { objectPosition: 'top' },
  },
  {
    name: 'Dr. Yiguang Ju',
    affiliation: 'Princeton University, USA',
    img: '/images/Renewable-2026 Speaker/Plenary/2/Yinguang Ju.jpg',
  },
  {
    name: 'Dr. Benjamin Sovacool',
    affiliation: 'Aarhus University, Denmark',
    img: '/images/Renewable-2026 Speaker/Plenary/3/Benjamin Sovacool.jpg',
  },
  {
    name: 'Dr. Maurizo Acciarri',
    affiliation: 'University of Milano, Italy',
    img: '/images/Renewable-2026 Speaker/Plenary/4/Maurizo Acciarri.jpg',
  },
  {
    name: 'Dr. Yang Han',
    affiliation: 'University of Electronic Science Technology of China, China',
    img: '/images/Renewable-2026 Speaker/Plenary/5/Yang Han.jpg',
  },
  {
    name: 'Dr. Hwai Chyuan Ong',
    affiliation: 'Sunway University, Malaysia',
    img: '/images/Renewable-2026 Speaker/Plenary/6/Hwai Chyuan Ong.jpg',
  },
  {
    name: 'Dr. Wenye Lin',
    affiliation: 'Chinese Academy of Science, China',
    img: '/images/Renewable-2026 Speaker/Plenary/7/Wenye Lin.jpg',
  },
  {
    name: 'Dr. Alexander Baklanov',
    affiliation: 'University of Copenhagen, Denmark',
    img: '/images/Renewable-2026 Speaker/Plenary/8/Alexander Baklanov.jpg',
  },
  {
    name: 'Dr. Jieshan Qiu',
    affiliation: 'Beijing University of Chemical Technology, China',
    img: '/images/Renewable-2026 Speaker/Plenary/9/Jieshan Qiu.jpg',
  },
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
              <h3 className="text-2xl font-bold text-center text-amber-600 mb-8">
                Keynote Speakers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
                {keynoteSpeakers.map((spk) => (
                  <div key={spk.name} className="flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg">
                      <img
                        src={spk.img}
                        alt={spk.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={e => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{spk.name}</h3>
                    <p className="text-amber-600 font-semibold">{spk.affiliation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Plenary Speakers */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center text-amber-600 mb-8">
                Plenary Speakers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-16 gap-y-20">
                {plenarySpeakers.slice(0, 5).map((spk) => (
                  <div key={spk.name} className="flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 mb-10 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg">
                      <img
                        src={spk.img}
                        alt={spk.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={spk.style}
                        onError={e => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{spk.name}</h3>
                    <p className="text-amber-600 font-semibold">{spk.affiliation}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-x-16 gap-y-20 mt-12">
                {plenarySpeakers.slice(5).map((spk) => (
                  <div key={spk.name} className="flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 mb-10 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg">
                      <img
                        src={spk.img}
                        alt={spk.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={spk.style}
                        onError={e => (e.currentTarget.src = placeholder)}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{spk.name}</h3>
                    <p className="text-amber-600 font-semibold">{spk.affiliation}</p>
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
