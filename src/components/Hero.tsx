
"use client";


import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Card from "./ui/globe"; // Assuming this is the same globe component
import { MapPin } from "lucide-react"; // Only import MapPin icon
import Typewriter from 'typewriter-effect';

const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <Helmet>
        <title>World Renewable Energy Conference 2026 - New York</title>
      </Helmet>

      <section className="relative h-screen min-h-[600px] flex items-center justify-start overflow-hidden bg-black w-full">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-0" />

        {/* Main Content */}
        <div className="w-full relative z-10 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center w-full px-4 md:px-0">
            {/* Text Content */}
            <div className="w-full animate-fadeIn will-change-opacity will-change-transform z-10 pl-4 md:pl-12 pr-4">
               {/* <div className="w-full animate-fadeIn will-change-opacity will-change-transform z-10 pl-8 md:pl-32 pr-4"></div> */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                The World's Premier
                <br className="hidden md:block" />
                Renewable Energy
                <br className="hidden md:block" />
                Conference
              </h1>

              {/* Location and Venue Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8 max-w-md shadow-lg border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <p className="text-xl font-medium text-white">
                    Dubai, UAE
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-medium text-white">
                    Crowne Plaza Dubai - Deira
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="/registration"
                  className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Register for the conference"
                >
                  Register Now
                </a>
                <a
                  href="/abstract-submission"
                  className="bg-transparent border-2 border-green-500 hover:bg-green-500 hover:text-gray-900 text-green-500 font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Submit an abstract"
                >
                  Abstract Submission
                </a>
              </div>
            </div>

            {/* Globe Component */}
            <div className="relative h-full w-full">
              <div className="absolute bottom-[80px] md:bottom-[100px] right-4 md:right-20 flex justify-end pr-4">
                {!isMobile && <Card />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inline Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Hero;