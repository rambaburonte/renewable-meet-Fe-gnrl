// // // // ...existing code...
// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import { BASE_URL } from '../config';

// // // const placeholder = '';

// // // interface Speaker {
// // //   id?: string | number;
// // //   name: string;
// // //   title?: string;
// // //   university?: string;
// // //   imageUrl?: string;
// // //   type?: string;
// // //   bio?: string;
// // //   category?: 'keynote' | 'plenary';
// // // }

// // // const Speakers: React.FC = () => {
// // //   const [speakers, setSpeakers] = useState<Speaker[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');

// // //   useEffect(() => {
// // //     const fetchSpeakers = async () => {
// // //       setLoading(true);
// // //       setError('');
// // //       try {
// // //         const res = await axios.get(`${BASE_URL}/api/speakers/renewable`);
// // //         setSpeakers(res.data);
// // //       } catch (e) {
// // //         setError('Failed to fetch speakers');
// // //       }
// // //       setLoading(false);
// // //     };
// // //     fetchSpeakers();
// // //   }, []);

// // //   return (
// // //     <section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
// // //       <div className="container mx-auto px-4">
// // //         <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16"></h2>
// // //         {/* Speakers Grid */}
// // //         {error && <div className="text-red-500 text-center mb-4">{error}</div>}
// // //         {loading ? (
// // //           <div className="text-center">Loading...</div>
// // //         ) : (
// // //           <div className="mb-16">
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// // //               {speakers.map((speaker) => (
// // //                 <div key={speaker.id || speaker.name} className="flex flex-col items-center text-center">
// // //                   <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transform transition-transform duration-300 hover:scale-105">
// // //                     {speaker.imageUrl && (
// // //                       <img
// // //                         src={speaker.imageUrl}
// // //                         alt={speaker.name}
// // //                         className="w-full h-full object-cover"
// // //                         loading="lazy"
// // //                         onError={e => (e.currentTarget.src = placeholder)}
// // //                       />
// // //                     )}
// // //                   </div>
// // //                   <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
// // //                   {speaker.title && <p className="text-gray-600 mb-1">{speaker.title}</p>}
// // //                   {speaker.university && <p className="text-gray-900 font-semibold">{speaker.university}</p>}
// // //                   {speaker.type && <p className="text-green-700 font-medium mb-1">{speaker.type}</p>}
// // //                   {speaker.bio && <p className="text-gray-500 text-sm mt-1">{speaker.bio}</p>}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default Speakers;






// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { BASE_URL } from '../config';

// // // A placeholder for broken image links
// // const placeholder = 'https://via.placeholder.com/150';

// // // Define the structure of a Speaker object
// // interface Speaker {
// //   id?: string | number;
// //   name: string;
// //   title?: string;
// //   university?: string;
// //   imageUrl?: string;
// //   type?: string;
// //   bio?: string;
// //   category?: 'keynote' | 'plenary';
// // }

// // const Speakers: React.FC = () => {
// //   // ## State for displaying the list of speakers
// //   const [speakers, setSpeakers] = useState<Speaker[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [listError, setListError] = useState('');

// //   // ## State for the editing modal/form
// //   const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
// //   const [formData, setFormData] = useState<Partial<Speaker>>({});
// //   const [imageFile, setImageFile] = useState<File | null>(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [formError, setFormError] = useState('');

// //   // ## Data Fetching
// //   useEffect(() => {
// //     const fetchSpeakers = async () => {
// //       setLoading(true);
// //       setListError('');
// //       try {
// //         const res = await axios.get(`${BASE_URL}/api/speakers/renewable`);
// //         setSpeakers(res.data);
// //       } catch (e) {
// //         setListError('Failed to fetch speakers. Please refresh the page.');
// //         console.error(e);
// //       }
// //       setLoading(false);
// //     };
// //     fetchSpeakers();
// //   }, []);

// //   // ## Form Handling Functions

// //   // Opens the edit modal and pre-fills it with speaker data
// //   const handleEditClick = (speaker: Speaker) => {
// //     setEditingSpeaker(speaker);
// //     setFormData(speaker);
// //     setFormError(''); // Clear previous errors
// //   };

// //   // Closes the modal and resets form state
// //   const handleCancel = () => {
// //     setEditingSpeaker(null);
// //     setImageFile(null);
// //     setFormData({});
// //   };

// //   // Updates form state on text input changes
// //   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   // Updates state when a new image file is selected
// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setImageFile(e.target.files[0]);
// //     }
// //   };

// //   // Handles the form submission to the PUT endpoint
// //   const handleFormSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!editingSpeaker) return;

// //     setIsSubmitting(true);
// //     setFormError('');

// //     const submissionData = new FormData();
// //     submissionData.append('id', String(editingSpeaker.id));
// //     submissionData.append('name', formData.name || '');
// //     submissionData.append('university', formData.university || '');
// //     submissionData.append('bio', formData.bio || '');
// //     submissionData.append('type', formData.type || '');
    
// //     if (imageFile) {
// //       submissionData.append('image', imageFile);
// //     }

// //     try {
// //       // ✅ CORRECTED: Removed the headers object to let Axios handle it.
// //       await axios.put(`${BASE_URL}/api/speakers/renewable/edit`, submissionData);

// //       // Update the speaker in the local state to show changes immediately
// //       const updatedSpeakerList = speakers.map(s => {
// //         if (s.id === editingSpeaker.id) {
// //           const newImageUrl = imageFile ? URL.createObjectURL(imageFile) : s.imageUrl;
// //           return { ...s, ...formData, imageUrl: newImageUrl };
// //         }
// //         return s;
// //       });
// //       setSpeakers(updatedSpeakerList);
      
// //       handleCancel(); // Close the modal on success

// //     } catch (err) {
// //       setFormError('Failed to update speaker. Please try again.');
// //       console.error(err);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };


// //   // ## JSX Rendering
// //   return (
// //     <section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
// //       <div className="container mx-auto px-4">
// //         <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Speakers</h2>
        
// //         {listError && <div className="text-red-500 text-center mb-4">{listError}</div>}
// //         {loading ? (
// //           <div className="text-center">Loading speakers...</div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// //             {speakers.map((speaker) => (
// //               <div key={speaker.id || speaker.name} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md">
// //                 <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
// //                   <img
// //                     src={speaker.imageUrl || placeholder}
// //                     alt={speaker.name}
// //                     className="w-full h-full object-cover"
// //                     loading="lazy"
// //                     onError={e => (e.currentTarget.src = placeholder)}
// //                   />
// //                 </div>
// //                 <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
// //                 {speaker.university && <p className="text-gray-900 font-semibold">{speaker.university}</p>}
// //                 {speaker.type && <p className="text-green-700 font-medium mb-1">{speaker.type}</p>}
                
// //                 <button 
// //                   onClick={() => handleEditClick(speaker)}
// //                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
// //                 >
// //                   Edit
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}
        
// //         {/* --- Edit Form Modal (conditionally rendered) --- */}
// //         {editingSpeaker && (
// //           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
// //             <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
// //               <h2 className="text-2xl font-bold mb-4">Edit Speaker</h2>
// //               <form onSubmit={handleFormSubmit}>
// //                 <div className="mb-4">
// //                   <label className="block text-gray-700">Name</label>
// //                   <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-gray-700">University</label>
// //                   <input type="text" name="university" value={formData.university || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-gray-700">Bio</label>
// //                   <textarea name="bio" value={formData.bio || ''} onChange={handleFormChange} className="w-full p-2 border rounded" rows={3} />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-gray-700">Type (e.g., Keynote Speaker)</label>
// //                   <input type="text" name="type" value={formData.type || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-gray-700">Change Image</label>
// //                   <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border rounded" accept="image/*" />
// //                 </div>

// //                 {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

// //                 <div className="flex justify-end gap-4">
// //                   <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
// //                   <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300">
// //                     {isSubmitting ? 'Saving...' : 'Save Changes'}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </section>
// //   );
// // };

// // export default Speakers;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../config';

// // A placeholder for broken image links
// const placeholder = 'https://via.placeholder.com/150';

// // Define the structure of a Speaker object
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

// const Speakers: React.FC = () => {
//   // ## State for displaying the list of speakers
//   const [speakers, setSpeakers] = useState<Speaker[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [listError, setListError] = useState('');

//   // ## State for the editing modal/form
//   const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
//   const [formData, setFormData] = useState<Partial<Speaker>>({});
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formError, setFormError] = useState('');

//   // ## Data Fetching
//   useEffect(() => {
//     const fetchSpeakers = async () => {
//       setLoading(true);
//       setListError('');
//       try {
//         const res = await axios.get(`${BASE_URL}/api/speakers/renewable`);
//         setSpeakers(res.data);
//       } catch (e) {
//         setListError('Failed to fetch speakers. Please refresh the page.');
//         console.error(e);
//       }
//       setLoading(false);
//     };
//     fetchSpeakers();
//   }, []);

//   // ## Form Handling Functions

//   // Opens the edit modal and pre-fills it with speaker data
//   const handleEditClick = (speaker: Speaker) => {
//     setEditingSpeaker(speaker);
//     setFormData(speaker);
//     setFormError(''); // Clear previous errors
//   };

//   // Closes the modal and resets form state
//   const handleCancel = () => {
//     setEditingSpeaker(null);
//     setImageFile(null);
//     setFormData({});
//   };

//   // Updates form state on text input changes
//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Updates state when a new image file is selected
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };

//   // Handles the form submission to the PUT endpoint
//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingSpeaker) return;

//     // 1. Get the token from localStorage
//     const token = localStorage.getItem('authToken'); // Make sure 'authToken' is the key you use
//     if (!token) {
//       setFormError("Authentication error: You are not logged in.");
//       return;
//     }

//     setIsSubmitting(true);
//     setFormError('');

//     const submissionData = new FormData();
//     submissionData.append('id', String(editingSpeaker.id));
//     submissionData.append('name', formData.name || '');
//     submissionData.append('university', formData.university || '');
//     submissionData.append('bio', formData.bio || '');
//     submissionData.append('type', formData.type || '');
    
//     if (imageFile) {
//       submissionData.append('image', imageFile);
//     }

//     try {
//       // 2. Add the Authorization header to the request
//       await axios.put(
//         `${BASE_URL}/api/speakers/renewable/edit`,
//         submissionData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       // Update the speaker in the local state to show changes immediately
//       const updatedSpeakerList = speakers.map(s => {
//         if (s.id === editingSpeaker.id) {
//           const newImageUrl = imageFile ? URL.createObjectURL(imageFile) : s.imageUrl;
//           return { ...s, ...formData, imageUrl: newImageUrl };
//         }
//         return s;
//       });
//       setSpeakers(updatedSpeakerList);
      
//       handleCancel(); // Close the modal on success

//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 403) {
//           setFormError("Permission Denied: You are not authorized to perform this action.");
//       } else {
//           setFormError('Failed to update speaker. Please try again.');
//       }
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // ## JSX Rendering
//   return (
//     <section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Speakers</h2>
        
//         {listError && <div className="text-red-500 text-center mb-4">{listError}</div>}
//         {loading ? (
//           <div className="text-center">Loading speakers...</div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {speakers.map((speaker) => (
//               <div key={speaker.id || speaker.name} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md">
//                 <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
//                   <img
//                     src={speaker.imageUrl || placeholder}
//                     alt={speaker.name}
//                     className="w-full h-full object-cover"
//                     loading="lazy"
//                     onError={e => (e.currentTarget.src = placeholder)}
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
//                 {speaker.university && <p className="text-gray-900 font-semibold">{speaker.university}</p>}
//                 {speaker.type && <p className="text-green-700 font-medium mb-1">{speaker.type}</p>}
                
//                 <button 
//                   onClick={() => handleEditClick(speaker)}
//                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                 >
//                   Edit
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
        
//         {/* --- Edit Form Modal (conditionally rendered) --- */}
//         {editingSpeaker && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
//               <h2 className="text-2xl font-bold mb-4">Edit Speaker</h2>
//               <form onSubmit={handleFormSubmit}>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Name</label>
//                   <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">University</label>
//                   <input type="text" name="university" value={formData.university || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Bio</label>
//                   <textarea name="bio" value={formData.bio || ''} onChange={handleFormChange} className="w-full p-2 border rounded" rows={3} />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Type (e.g., Keynote Speaker)</label>
//                   <input type="text" name="type" value={formData.type || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Change Image</label>
//                   <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border rounded" accept="image/*" />
//                 </div>

//                 {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

//                 <div className="flex justify-end gap-4">
//                   <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
//                   <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300">
//                     {isSubmitting ? 'Saving...' : 'Save Changes'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Speakers;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

// A placeholder for broken image links
const placeholder = 'https://via.placeholder.com/150';

// Define the structure of a Speaker object
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
  // ## State for displaying the list of speakers
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  // ## State for the editing modal/form
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [formData, setFormData] = useState<Partial<Speaker>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // ## Data Fetching
  useEffect(() => {
    const fetchSpeakers = async () => {
      setLoading(true);
      setListError('');
      try {
        const res = await axios.get(`${BASE_URL}/api/speakers/renewable`);
        setSpeakers(res.data);
      } catch (e) {
        setListError('Failed to fetch speakers. Please refresh the page.');
        console.error(e);
      }
      setLoading(false);
    };
    fetchSpeakers();
  }, []);

  // ## Form Handling Functions

  // Opens the edit modal and pre-fills it with speaker data
  const handleEditClick = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setFormData(speaker);
    setFormError(''); // Clear previous errors
  };

  // Closes the modal and resets form state
  const handleCancel = () => {
    setEditingSpeaker(null);
    setImageFile(null);
    setFormData({});
  };

  // Updates form state on text input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Updates state when a new image file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handles the form submission to the PUT endpoint
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeaker) return;

    // ✅ FINAL FIX: Use the correct 'jwt' key to get the token
    const token = localStorage.getItem('jwt'); 
    
    if (!token) {
      setFormError("Authentication error: You are not logged in.");
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const submissionData = new FormData();
    submissionData.append('id', String(editingSpeaker.id));
    submissionData.append('name', formData.name || '');
    submissionData.append('university', formData.university || '');
    submissionData.append('bio', formData.bio || '');
    submissionData.append('type', formData.type || '');
    
    if (imageFile) {
      submissionData.append('image', imageFile);
    }

    try {
      // Add the Authorization header to the request
      await axios.put(
        `${BASE_URL}/api/speakers/renewable/edit`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the speaker in the local state to show changes immediately
      const updatedSpeakerList = speakers.map(s => {
        if (s.id === editingSpeaker.id) {
          const newImageUrl = imageFile ? URL.createObjectURL(imageFile) : s.imageUrl;
          return { ...s, ...formData, imageUrl: newImageUrl };
        }
        return s;
      });
      setSpeakers(updatedSpeakerList);
      
      handleCancel(); // Close the modal on success

    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
          setFormError("Permission Denied: You are not authorized to perform this action.");
      } else {
          setFormError('Failed to update speaker. Please try again.');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  // ## JSX Rendering
  return (
    <section className="pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Speakers</h2>
        
        {listError && <div className="text-red-500 text-center mb-4">{listError}</div>}
        {loading ? (
          <div className="text-center">Loading speakers...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {speakers.map((speaker) => (
              <div key={speaker.id || speaker.name} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md">
                <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
                  <img
                    src={speaker.imageUrl || placeholder}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={e => (e.currentTarget.src = placeholder)}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                {speaker.university && <p className="text-gray-900 font-semibold">{speaker.university}</p>}
                {speaker.type && <p className="text-green-700 font-medium mb-1">{speaker.type}</p>}
                
                <button 
                  onClick={() => handleEditClick(speaker)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* --- Edit Form Modal (conditionally rendered) --- */}
        {editingSpeaker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Edit Speaker</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">University</label>
                  <input type="text" name="university" value={formData.university || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Bio</label>
                  <textarea name="bio" value={formData.bio || ''} onChange={handleFormChange} className="w-full p-2 border rounded" rows={3} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Type (e.g., Keynote Speaker)</label>
                  <input type="text" name="type" value={formData.type || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Change Image</label>
                  <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border rounded" accept="image/*" />
                </div>

                {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

                <div className="flex justify-end gap-4">
                  <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Speakers;