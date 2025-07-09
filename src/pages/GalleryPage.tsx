// import React from 'react';

// const GalleryPage: React.FC = () => {
//   const images = [
//     {
//       url: "https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg",
//       caption: "Conference Keynote"
//     },
//     {
//       url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
//       caption: "Networking Session"
//     },
//     {
//       url: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
//       caption: "Panel Discussion"
//     },
//     {
//       url: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
//       caption: "Workshop Session"
//     }
//   ];

//   return (
//     <div className="pt-20">
//       <div className="bg-gray-900 py-16">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
//             Event Gallery
//           </h1>
//           <p className="text-xl text-gray-300 text-center mt-4">
//             Highlights from previous conferences
//           </p>
//         </div>
//       </div>
//       <div className="container mx-auto px-4 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {images.map((image, index) => (
//             <div key={index} className="overflow-hidden rounded-lg shadow-lg">
//               <img
//                 src={image.url}
//                 alt={image.caption}
//                 className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
//               />
//               <div className="p-4 bg-white">
//                 <p className="text-gray-800 font-medium">{image.caption}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GalleryPage;