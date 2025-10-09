
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











// import React, { useState } from 'react';

// const placeholder = 'https://via.placeholder.com/150';

// interface Speaker {
//   id?: string | number;
//   name: string;
//   title?: string;
//   university?: string;
//   imageUrl?: string;
//   type?: string;
//   bio?: string;
//   category?: 'keynote' | 'plenary';
// }

// // ✅ Static data from your MySQL dump
// const staticSpeakers: Speaker[] = [
//   {
//     id: 2,
//     name: "Shuji Nakamura",
//     type: "Plenary Speaker",
//     university: "Nobel Prize in Chemistry",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Shuji_Nakamura.jpg?t=1757303838600",
//     bio: ""
//   },
//   {
//     id: 11,
//     name: "Soteris Kalogirou",
//     type: "Plenary Speaker",
//     university: "Cyprus University of Technology",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Soteris_Kalogirou.jpg?t=1757304011612",
//     bio: ""
//   },
//   {
//     id: 12,
//     name: "Rebecca J. Barthelmie",
//     type: "Plenary Speaker",
//     university: "Cornell University, USA",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Rebecca_J__Barthelmie.jpg?t=1757849132289",
//     bio: ""
//   },
//   {
//     id: 13,
//     name: "Daniel MacDonald",
//     type: "Plenary Speaker",
//     university: "Australian National University",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Daniel_MacDonald.jpg?t=1757922839659",
//     bio: ""
//   },
//   {
//     id: 14,
//     name: "Yulong Ding",
//     type: "Keynote Speaker",
//     university: "University of Birmingham, UK",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Yulong_Ding.jpg?t=1757313018353",
//     bio: ""
//   },
//   {
//     id: 15,
//     name: "Jieshan Qiu",
//     type: "Keynote Speaker",
//     university: "Beijing University of Chemical Technology, China",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Jieshan_Qiu.jpg?t=1757313272334",
//     bio: ""
//   },
//   {
//     id: 16,
//     name: "Sara Pryor",
//     type: "Plenary Speaker",
//     university: "Cornell University",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Sara_Pryor.jpg?t=1757849418745",
//     bio: ""
//   },
//   {
//     id: 17,
//     name: "Om Prakash Malik",
//     type: "Keynote Speaker",
//     university: "University of Calgary, Canada",
//     imageUrl: "https://globalrenewablemeet.com/uploads/Om_Prakash_Malik.jpg?t=1757313475062",
//     bio: ""
//   }
// ];

// const SpeakersPage: React.FC = () => {
//   const [speakers] = useState<Speaker[]>(staticSpeakers);

//   return (
//     <div className="pt-20 scroll-smooth">
//       {/* Header */}
//       <div className="bg-gray-900 py-16">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl md:text-5xl font-bold text-white text-center animate-fadeIn">
//             Conference Speakers
//           </h1>
//           <p
//             className="text-xl text-gray-300 text-center mt-4 animate-fadeIn"
//             style={{ animationDelay: '0.3s' }}
//           >
//             Meet our distinguished lineup of industry experts and thought leaders
//           </p>
//         </div>
//       </div>

//       {/* Speakers Grid */}
//       <div className="mt-12">
//         <section className="pt-8 pb-8 md:pt-12 md:pb-16 bg-white">
//           <div className="container mx-auto px-4">
//             <div className="mb-16">
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
//                 {speakers.map((spk) => (
//                   <div key={spk.id || spk.name} className="flex flex-col items-center text-center">
//                     <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
//                       {spk.imageUrl && (
//                         <img
//                           src={spk.imageUrl}
//                           alt={spk.name}
//                           className="w-full h-full object-cover"
//                           loading="lazy"
//                           onError={e => (e.currentTarget.src = placeholder)}
//                         />
//                       )}
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">{spk.name}</h3>
//                     {spk.title && <p className="text-gray-600 mb-1">{spk.title}</p>}
//                     {spk.university && <p className="text-gray-900 font-semibold">{spk.university}</p>}
//                     {spk.type && <p className="text-green-700 font-medium mb-1">{spk.type}</p>}
//                     {spk.bio && <p className="text-gray-500 text-sm mt-1">{spk.bio}</p>}
//                   </div>
//                 ))}
//               </div>
//             </div>  
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default SpeakersPage;
