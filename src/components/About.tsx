import React from "react";
import {
  Lightning,
  Sun,
  PlugsConnected,
  Scan,
  BatteryCharging,
  Car,
  Buildings,
  Coins,
  BookOpen,
  TestTube,
  Scales,
  Lightbulb,
} from "phosphor-react";
import { Calendar, MapPin, Clock, FileText, Users, Star } from "lucide-react";
import { useLucideDrawerAnimation } from "../components/ui/lucide-icon-drawer";
import { motion } from "framer-motion";
import Speakers from "../components/Speakers";
import ConferenceTopicsSection from "./ConferenceTopicsSection";

const industries = [
  { icon: <Lightning size={32} className="text-green-500" />, label: "Power Generation" },
  { icon: <Sun size={32} className="text-green-500" />, label: "Renewables" },
  { icon: <PlugsConnected size={32} className="text-green-500" />, label: "Transmission & Distribution" },
  { icon: <Scan size={32} className="text-green-500" />, label: "Green Hydrogen" },
  { icon: <BatteryCharging size={32} className="text-green-500" />, label: "Energy Storage" },
  { icon: <Car size={32} className="text-green-500" />, label: "EV Infrastructure" },
  { icon: <Buildings size={32} className="text-green-500" />, label: "C&I Consumers" },
  { icon: <Coins size={32} className="text-green-500" />, label: "Financing" },
  { icon: <BookOpen size={32} className="text-green-500" />, label: "Academia" },
  { icon: <TestTube size={32} className="text-green-500" />, label: "Researchers" },
  { icon: <Scales size={32} className="text-green-500" />, label: "Policymakers" },
  { icon: <Lightbulb size={32} className="text-green-500" />, label: "Entrepreneurs" },
];

// Introduction component with light background
const Introduction: React.FC = () => {
  return (
    <section className="pt-12 pb-16 bg-white">
      <div className="px-4 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
          Join Global Renewable Energy Leaders in Tokyo
        </h2>

        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            The <span className="font-semibold">RENEWABLE-2026 International Conference</span> is the 18th Edition of the world's largest Global Conference & Exhibition on Renewable and Sustainable Energy, held in person in Tokyo, Japan, from May 29-31, 2026. The conference will bring together <span className="font-semibold">world leaders, researchers, and industry experts</span> to explore how solar, wind, and electric vehicles (EVs) can support a sustainable future.
          </p>
        </div>
      </div>
    </section>
  );
};

// Conference Information component with gradient background
const ConferenceInfo: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="px-4 mx-auto">
        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Conference Details Card */}
          <motion.div
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 text-green-500 mr-2" />
              Conference Details
            </h3>
            <div className="space-y-3">
              {[{
                label: "Conference Date",
                value: "May 29-31, 2026",
                icon: <Calendar className="w-5 h-5 text-gray-500" />,
              },
              {
                label: "Venue",
                value: "DoubleTree by Hilton Tokyo Ariake",
                icon: <MapPin className="w-5 h-5 text-gray-500" />,
              },
              {
                label: "Earlybird Registration",
                value: "July 28, 2025",
                icon: <Clock className="w-5 h-5 text-gray-500" />,
              },
              {
                label: "Submission Deadline",
                value: "September 15, 2025",
                icon: <FileText className="w-5 h-5 text-gray-500" />,
              },
              {
                label: "Workshops",
                value: "10 Workshops",
                icon: <Users className="w-5 h-5 text-gray-500" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3 font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="text-gray-600">{item.value}</span>
              </div>
            ))}
            </div>
          </motion.div>

          {/* Highlights Card */}
          <motion.div
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Star className="w-6 h-6 text-green-500 mr-2" />
              Highlights
            </h3>
            <div className="space-y-3">
              {[
                "16 Plenary, Keynote & Invited Speakers",
                "Tentative Program Released",
                "24 Exhibitors Participating",
                "Multiple Sponsor Opportunities",
                "Global Media Coverage"
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 ${
                      item === "Seoul 2026 Edition Announced" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <span className={`${
                    item === "Seoul 2026 Edition Announced"
                      ? "text-green-600 font-semibold"
                      : "text-gray-600"
                  }`}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Featured Speakers section
const FeaturedSpeakers: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="px-4 mx-auto">
        {/* <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
          Featured Speakers 2026
        </h2> */}
        <Speakers />
      </div>
    </section>
  );
};

// Who Should Attend section with gradient background
const WhoShouldAttend: React.FC = () => {
  const root = useLucideDrawerAnimation();
  
  return (
    <section ref={root} className="py-16 bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="w-full px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Who Should Attend
        </h2>
        <div className="mx-auto px-4 max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            >
              {industry.icon}
              <p className="font-medium text-gray-700 text-sm mt-3">{industry.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main About component that combines all sections
const About: React.FC = () => {
  return (
    <>
      <Introduction />
      <FeaturedSpeakers />
      <ConferenceInfo />
      <WhoShouldAttend />
       <ConferenceTopicsSection />
       
    </>
  );
};

export default About;