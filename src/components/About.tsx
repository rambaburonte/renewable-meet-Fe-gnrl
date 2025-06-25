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

const industries = [
  { icon: <Lightning size={40} color="#00a3ff" />, label: "Power Generation" },
  { icon: <Sun size={40} color="#fc5c65" />, label: "Renewables" },
  { icon: <PlugsConnected size={40} color="#ff7f50" />, label: "Transmission & Distribution" },
  { icon: <Scan size={40} color="#fc5c65" />, label: "Green Hydrogen" },
  { icon: <BatteryCharging size={40} color="#1e90ff" />, label: "Energy Storage" },
  { icon: <Car size={40} color="#ff4757" />, label: "EV Infrastructure" },
  { icon: <Buildings size={40} color="#1abc9c" />, label: "C&I Consumers" },
  { icon: <Coins size={40} color="#576574" />, label: "Financing" },
  { icon: <BookOpen size={40} color="#ffa502" />, label: "Academia" },
  { icon: <TestTube size={40} color="#747d8c" />, label: "Researchers" },
  { icon: <Scales size={40} color="#f1c40f" />, label: "Policymakers" },
  { icon: <Lightbulb size={40} color="#3742fa" />, label: "Entrepreneurs" },
];

const About: React.FC = () => {
  const root = useLucideDrawerAnimation();

  return (
    <>
      {/* Description Section */}
      <section className="pt-10 pb-14 bg-white">
        <div className="px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Join Global Renewable Energy Leaders in Seoul
          </h2>

          <div className="max-w-4xl mx-auto text-center mb-10">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              The <span className="font-semibold">RENEWABLE-2026 International Conference</span> is the 8th Edition of the world’s largest Global Conference & Exhibition on Renewable and Sustainable Energy, held in person in Seoul, South Korea, from April 24–26, 2026. The conference will bring together <span className="font-semibold">world leaders, researchers, and industry experts</span> to explore how solar, wind, and electric vehicles (EVs) can support a sustainable future.
            </p>
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Conference Details Card */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-6 h-6 text-amber-500 mr-2" />
                Conference Details
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Conference Date",
                    value: "April 24–26, 2026",
                    icon: <Calendar className="w-5 h-5 text-gray-500" />,
                  },
                  {
                    label: "Venue",
                    value: "Crowne Plaza-Deira, Dubai, UAE",
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
                <Star className="w-6 h-6 text-amber-500 mr-2" />
                Highlights
              </h3>
              <ul className="space-y-8">
                {[
                  "76 Plenary, Keynote & Invited Speakers",
                  "Tentative Program Released",
                  "24 Exhibitors Participating",
                  "Multiple Sponsor Opportunities",
                  "Global Media Coverage",
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-start ${
                      item === "Seoul 2026 Edition Announced"
                        ? "text-amber-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 ${
                        item === "Seoul 2026 Edition Announced" ? "bg-amber-500" : "bg-gray-400"
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who Should Attend Section */}
      <section ref={root} className="bg-gray-100 py-12">
        <div className="w-full px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Who Should Attend
          </h2>
          <div className="mx-auto px-4 max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-2 bg-black rounded-md shadow hover:shadow-md transition transform hover:scale-105"
              >
                <div className="p-2 rounded-full shadow">{industry.icon}</div>
                <p className="text-xs font-medium text-white mt-1 text-center">
                  {industry.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;