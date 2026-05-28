"use client";


import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Card from "./ui/globe"; // Assuming this is the same globe component
// removed MapPin and venue display per request
import Typewriter from 'typewriter-effect';
import { GradientButton } from "./ui/gradient-button";
import { StarBorder } from "@/components/ui/star-border";

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
        <title>World Renewable Energy Conference 2026</title>
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

              {/* Location removed - display intentionally left blank per site update */}

              {/* Be Part Heading */}
              <StarBorder as="div" className="w-full max-w-2xl mx-auto mb-6">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white/90 text-center whitespace-normal">
                  Be Part of World Renewable Energy Conference
                </h2>
              </StarBorder>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <GradientButton
                  asChild
                  aria-label="Register for the conference"
                >
                  <a href="/registration">
                    Register Now
                  </a>
                </GradientButton>
                <GradientButton
                  asChild
                  variant="variant"
                  aria-label="Submit an abstract"
                >
                  <a href="/abstract-submission">
                    Abstract Submission
                  </a>
                </GradientButton>
              </div>
            </div>

            {/* Globe Component */}
            <div className="relative h-full w-full flex items-center justify-end">
              <div className="pr-4 md:pr-20">
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