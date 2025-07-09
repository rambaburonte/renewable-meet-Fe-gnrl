import React, { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronDown, ChevronUp, Globe, Sun, Wind, Zap, Battery, Droplets, Settings, Car, Lightbulb, Shield, Recycle, Leaf, Flame, Network, DollarSign, Mountain, Home, Activity } from 'lucide-react';
import Footer from '../components/Footer';

interface Speaker {
  name: string;
  affiliation: string;
  country: string;
  title: string;
  image?: string;
}

interface ConferenceStats {
  participants: number;
  countries: number;
  papers: number;
  sessions: number;
}

type Section = 'plenary' | 'keynote' | 'topics';

const PreviousEdition: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('plenary');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stats: ConferenceStats = {
    participants: 450,
    countries: 42,
    papers: 186,
    sessions: 24
  };

  const plenarySpeakers: Speaker[] = [
    {
      name: "Prof. Huu Hao Ngo",
      affiliation: "University of Technology Sydney",
      country: "Australia",
      title: "Advanced Water Treatment Technologies for Sustainable Energy",
      image: "/images/Renewable-2025-Speaker/plenary/Huu Hao Ngo.jpg"
    },
    {
      name: "Prof. Jieshan Qiu",
      affiliation: "Beijing University of Chemical Technology",
      country: "China", 
      title: "Carbon Materials for Energy Storage and Conversion",
      image: "/images/Renewable-2025-Speaker/plenary/Jieshan Qiu.jpeg.jpg"
    },
    {
      name: "Prof. Kah-Wee ANG",
      affiliation: "National University of Singapore",
      country: "Singapore",
      title: "Semiconductor Technologies for Renewable Energy Applications",
      image: "/images/Renewable-2025-Speaker/plenary/Kah-Wee ANG.jpg"
    },
    {
      name: "Prof. Arif Hepbasli",
      affiliation: "Yasar University",
      country: "Turkey",
      title: "An Acrostic Approach to Renewable and Sustainable Energy/Exergy System",
      image: "/images/Renewable-2025-Speaker/plenary/Arif Hepbasli.jpg"
    },
    {
      name: "Prof. Badrul Chowdhury",
      affiliation: "University of North Carolina",
      country: "USA",
      title: "Sustainable and resilient operation of distribution systems during extreme weather events",
      image: "/images/Renewable-2025-Speaker/plenary/Badrul Chowdhury.jpeg.jpg"
    },
    {
      name: "Prof. Yuying Yan",
      affiliation: "University of Nottingham",
      country: "UK",
      title: "Thermal Management - The Important Culture and Technology for The Development of Renewable and Sustainable Energy",
      image: "/images/Renewable-2025-Speaker/plenary/Yuuing Yan.jpg"
    },
    {
      name: "Prof. Strbac Goran",
      affiliation: "Imperial College London",
      country: "UK",
      title: "Smart Grid Integration and Renewable Energy Systems",
      image: "/images/Renewable-2025-Speaker/plenary/Strbac Goran.jpg"
    },
    {
      name: "Prof. Yulong Ding",
      affiliation: "Birmingham University",
      country: "UK",
      title: "Energy Storage Technologies and Applications",
      image: "/images/Renewable-2025-Speaker/plenary/Yulong Ding.jpg"
    },
    {
      name: "Prof. Dai-Yeun Jeong",
      affiliation: "Asia Climate Change Education Center",
      country: "South Korea",
      title: "How to Overcome the Limitations Inherent in Sustainable Development",
      image: "/images/Renewable-2025-Speaker/plenary/dai-yeun-jeong.jpg"
    },
    {
      name: "Prof. Kenji Uchino",
      affiliation: "Pennsylvania State University",
      country: "USA",
      title: "Advanced Materials for Renewable Energy Applications",
      image: "/images/Renewable-2025-Speaker/plenary/Kenji Uchino.jpg"
    },
    {
      name: "Prof. Vladimir Strezov",
      affiliation: "Macquarie University",
      country: "Australia",
      title: "Sustainable Waste-to-Energy Technologies",
      image: "/images/Renewable-2025-Speaker/plenary/Vladimir Strezov.jpg"
    },
    {
      name: "Prof. Igor Zhitomirsky",
      affiliation: "McMaster University",
      country: "Canada",
      title: "Electrochemical Technologies for Energy Storage",
      image: "/images/Renewable-2025-Speaker/plenary/Igor Zhitomirsky.jpg"
    },
    {
      name: "Prof. Hwai Chyuan Ong",
      affiliation: "Sunway University",
      country: "Malaysia",
      title: "Biofuel Technologies and Sustainable Transportation",
      image: "/images/Renewable-2025-Speaker/plenary/Hwai Chyuan Ong.jpeg.jpg"
    },
    {
      name: "Prof. Soteris Kalogirou",
      affiliation: "Cyprus University of Technology",
      country: "Cyprus",
      title: "Solar Energy Technologies and Applications",
      image: "/images/Renewable-2025-Speaker/plenary/Soteris Kalogirou.jpeg.jpg"
    },
    {
      name: "Prof. Chu Fulei",
      affiliation: "Tsinghua University",
      country: "China",
      title: "Advanced Energy Systems and Technologies",
      image: "/images/Renewable-2025-Speaker/plenary/Fulei Chu.png"
    },
    {
      name: "Prof. Haofeng Chen",
      affiliation: "East China University",
      country: "China",
      title: "Renewable Energy Systems Integration",
      image: "/images/Renewable-2025-Speaker/plenary/Haofeng Chen.png"
    }
  ];

  const keynoteSpeakers: Speaker[] = [
    {
      name: "Prof. Kamiel Gabriel",
      affiliation: "Ontario Tech University",
      country: "Canada",
      title: "Advanced Control Systems for Renewable Energy Integration",
      image: "/images/Renewable-2025-Speaker/keynote/Kamiel S. Gabriel.jpeg.jpg"
    },
    {
      name: "Prof. Andreas Lemmer",
      affiliation: "University of Hohenheim",
      country: "Germany",
      title: "Biomethane - the most sustainable fuel for heavy goods transport and agriculture",
      image: "/images/Renewable-2025-Speaker/keynote/Andreas Lemmer.jpeg.jpg"
    },
    {
      name: "Dr. Alessia Vacca",
      affiliation: "University of Lincoln",
      country: "UK",
      title: "The Role of Public Involvement in The Implementation of EU Policies Related to Renewables and Sustainable Energy",
      image: "/images/Renewable-2025-Speaker/keynote/alessia vacca.webp"
    },
    {
      name: "Prof. Hanshen Li",
      affiliation: "Shanghai Jiao Tong University",
      country: "China",
      title: "Uncertainty Operation and Planning Method of Distribution Cyber-Physical System under Low-carbon Era",
      image: "/images/Renewable-2025-Speaker/keynote/Hanshen Li.png"
    },
    {
      name: "Dr. Adriana Greco",
      affiliation: "University of Naples Federico",
      country: "Italy",
      title: "The Project of the First Italian Elastocaloric Device for Air Conditioning",
      image: "/images/Renewable-2025-Speaker/keynote/adriana greco.jpeg.jpg"
    },
    {
      name: "Prof. Michael Patt",
      affiliation: "Kempten University of Applied Sciences",
      country: "Germany",
      title: "Sustainable Energy Systems and Environmental Impact",
      image: "/images/Renewable-2025-Speaker/keynote/micheal patt.jpg"
    },
    {
      name: "Dr. Gamze Karanfil Kaçmaz",
      affiliation: "GMZ Enerji (Founder/CEO)",
      country: "Turkey",
      title: "Innovative Hydrogen Energy Solutions for a Sustainable Future",
      image: "/images/Renewable-2025-Speaker/keynote/gamze karanfil.jpg"
    },
    {
      name: "Prof. Nihal Kularatna",
      affiliation: "University of Waikato",
      country: "New Zealand",
      title: "Power Electronics for Renewable Energy Systems",
      image: "/images/Renewable-2025-Speaker/keynote/nihal kularatna.jpg"
    },
    {
      name: "Dr. Barbara Marchetti",
      affiliation: "eCampus University",
      country: "Italy",
      title: "Digital Innovation in Renewable Energy Education",
      image: "/images/Renewable-2025-Speaker/keynote/barbara marchetti.jpg"
    },
    {
      name: "Prof. Suwen Chen",
      affiliation: "Tongji University",
      country: "China",
      title: "Safety of Power Transformer from Arc Fault Explosion",
      image: "/images/Renewable-2025-Speaker/keynote/Suwen Chen.png"
    },
    {
      name: "Prof. Hao Zeng",
      affiliation: "University at Buffalo",
      country: "USA",
      title: "Developing Chalcogenide Perovskite Thin Films for Optoelectronics",
      image: "/images/Renewable-2025-Speaker/keynote/hao zeng.jpeg.jpg"
    },
    {
      name: "Prof. Xi Jiang",
      affiliation: "Queen Mary University of London",
      country: "UK",
      title: "Insight Into Pollutant Formation of Ammonia-Hydrogen Combustion Utilisation",
      image: "/images/Renewable-2025-Speaker/keynote/Xi Jiang.png"
    },
    {
      name: "Prof. Xudong Zhao",
      affiliation: "University of Hull",
      country: "UK",
      title: "Advanced Solar Energy Technologies",
      image: "/images/Renewable-2025-Speaker/keynote/xudong zhao.webp"
    },
    {
      name: "Prof. Xinggang Yan",
      affiliation: "University of Kent",
      country: "UK",
      title: "Control Systems for Renewable Energy Applications",
      image: "/images/Renewable-2025-Speaker/keynote/Xinggang Yan.jpg"
    },
    {
      name: "Prof. Om Malik",
      affiliation: "University of Calgary",
      country: "Canada",
      title: "Power System Protection and Control in Renewable Energy Systems",
      image: "/images/Renewable-2025-Speaker/keynote/om malik.jpeg.jpg"
    },
    {
      name: "Prof. Hongwei Wu",
      affiliation: "University of Hertfordshire",
      country: "UK",
      title: "Smart Grid Technologies and Applications",
      image: "/images/Renewable-2025-Speaker/keynote/hongwei wu.jpeg.jpg"
    },
    {
      name: "Prof. Gordon Huang",
      affiliation: "University of Regina",
      country: "Canada",
      title: "Environmental Systems Engineering for Renewable Energy",
      image: "/images/Renewable-2025-Speaker/keynote/Gordan Huang.jpg"
    }
  ];



  const conferenceTopics = [
    { name: "Sustainable and Renewable Energy", icon: Leaf },
    { name: "Solar Energy Systems and Materials", icon: Sun }, 
    { name: "Wind Energy Technologies", icon: Wind },
    { name: "Biomass Conversion Technologies", icon: Recycle },
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
    { name: "Distributed Generation", icon: Home },
    { name: "Power Quality and Control", icon: Activity },
    { name: "Energy Harvesting Technologies", icon: Lightbulb },
    { name: "Green Technology and Eco-Design", icon: Leaf },
    { name: "Thermal Energy Systems", icon: Flame }
  ];

  const SpeakerCard: React.FC<{ speaker: Speaker; type: 'plenary' | 'keynote' }> = ({ speaker, type }) => {
    const isExpanded = expandedSpeaker === `${type}-${speaker.name}`;
    
    return (
      <div className="group relative flex flex-col rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200/50">
        {/* Speaker Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
          <img
            src={speaker.image}
            alt={speaker.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/speaker-placeholder.png"; // Local placeholder
            }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Speaker Info */}
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-xl font-bold leading-tight tracking-tight">{speaker.name}</h3>
            <p className="text-sm font-medium text-green-200">{speaker.affiliation}</p>
            <p className="text-xs text-gray-300 flex items-center mt-1">
              <Globe size={14} className="mr-1.5" />
              {speaker.country}
            </p>
          </div>
        </div>

        {/* Presentation Details */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex-1">
            <button
              onClick={() => setExpandedSpeaker(isExpanded ? null : `${type}-${speaker.name}`)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors group-hover:text-green-600"
              aria-expanded={isExpanded}
              aria-controls={`speaker-title-${type}-${speaker.name.replace(/\s+/g, '-')}`}>
              <span>Presentation Title</span>
              {isExpanded ? <ChevronUp size={18} className="text-green-600" /> : <ChevronDown size={18} className="text-gray-500 group-hover:text-green-500" />}
            </button>
            {isExpanded && (
              <div id={`speaker-title-${type}-${speaker.name.replace(/\s+/g, '-')}`} className="mt-3 space-y-2 border-l-2 border-green-500 pl-4">
                <p className="text-sm italic text-gray-700 leading-relaxed">{speaker.title}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <RouterLink to="/" className="text-green-600 hover:text-green-700 font-semibold flex items-center">
              ← Back to Home
            </RouterLink>
            <div className="text-sm text-gray-600">
              17th Edition - April 25-27, 2025 - Amsterdam, Netherlands
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            RENEWABLE-2025
          </h1>
          <p className="text-2xl text-green-600 font-semibold mb-2">
            17th Edition of the largest European Conference & Exhibition
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            on Renewable and Sustainable Energy - Amsterdam, Netherlands
          </p>
          
          {/* Conference Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.participants}+</div>
              <div className="text-gray-600">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.countries}</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.papers}</div>
              <div className="text-gray-600">Papers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.sessions}</div>
              <div className="text-gray-600">Sessions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'plenary', label: 'Plenary Speakers' },
              { id: 'keynote', label: 'Keynote Speakers' },
              { id: 'topics', label: 'Conference Topics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSectionChange(tab.id as Section)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <main ref={contentRef} className="container mx-auto px-4 py-12">
        {/* Plenary Speakers Section */}
        {activeSection === 'plenary' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Plenary Speakers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Distinguished experts who delivered keynote presentations on cutting-edge renewable energy research and innovations
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {plenarySpeakers.map((speaker, index) => (
                <SpeakerCard key={index} speaker={speaker} type="plenary" />
              ))}
            </div>
          </div>
        )}

        {/* Keynote Speakers Section */}
        {activeSection === 'keynote' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Keynote Speakers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Renowned researchers and industry leaders who shared their expertise and insights
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {keynoteSpeakers.map((speaker, index) => (
                <SpeakerCard key={index} speaker={speaker} type="keynote" />
              ))}
            </div>
          </div>
        )}

        {/* Conference Topics Section */}
        {activeSection === 'topics' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Conference Topics</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore the diverse range of topics covered at RENEWABLE-2025
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
        )}
      </main>
      
    </div>
  );
};

export default PreviousEdition;