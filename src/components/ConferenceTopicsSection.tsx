import React from "react";
import { 
  Sun, Wind, Zap, Battery, Droplets, Settings, Car, Lightbulb, 
  Shield, Leaf, Flame, Network, DollarSign, Mountain, Home as HomeIcon, Activity
} from "lucide-react";

const conferenceTopics = [
  { name: "Sustainable and Renewable Energy", icon: Leaf },
  { name: "Solar Energy Systems and Materials", icon: Sun }, 
  { name: "Wind Energy Technologies", icon: Wind },
  { name: "Biomass Conversion Technologies", icon: Leaf },
  { name: "Hydroelectric Power Systems", icon: Droplets },
  { name: "Green Hydrogen Production", icon: Flame },
  { name: "Energy Storage Solutions", icon: Battery },
  { name: "Smart Grid Technologies", icon: Network },
  { name: "Electric Vehicles and Transportation", icon: Car },
  { name: "Power Electronics and Systems", icon: Zap },
  { name: "Energy Efficiency and Management", icon: Settings },
  { name: "Biofuel Economics and Commercialization", icon: DollarSign },
  { name: "Photovoltaic Systems", icon: Sun },
  { name: "Geothermal Energy Applications", icon: Mountain },
  { name: "Nuclear Energy Safety", icon: Shield },
  { name: "Distributed Generation", icon: HomeIcon },
  { name: "Power Quality and Control", icon: Activity },
  { name: "Energy Harvesting Technologies", icon: Lightbulb },
  { name: "Green Technology and Eco-Design", icon: Leaf },
  { name: "Thermal Energy Systems", icon: Flame }
];

const ConferenceTopicsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Conference Topics</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the diverse range of topics to be covered at RENEWABLE-2026
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {conferenceTopics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow flex flex-col items-center justify-center">
                <IconComponent className="h-8 w-8 text-green-500 mb-3" />
                <p className="font-medium text-gray-700 text-sm">{topic.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
    
  );
};

export default ConferenceTopicsSection;
