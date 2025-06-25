import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

const PreviousEdition: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);

  const stats: ConferenceStats = {
    participants: 450,
    countries: 42,
    papers: 186,
    sessions: 24
  };

  const plenaryHalfgfers: Speaker[] = [
    {
      name: "Prof. Huu Hao Ngo",
      affiliation: "University of Technology Sydney",
      country: "Australia",
      title: "Advanced Water Treatment Technologies for Sustainable Energy",
      image: "/src/images/Renewable-2025 Speaker/plenary/Huu Hao Ngo.jpg"
    },
    {
      name: "Prof. Jieshan Qiu",
      affiliation: "Beijing University of Chemical Technology",
      country: "China", 
      title: "Carbon Materials for Energy Storage and Conversion",
      image: "/src/images/Renewable-2025 Speaker/plenary/Jieshan Qiu.jpeg.jpg"
    },
    {
      name: "Prof. Kah-Wee ANG",
      affiliation: "National University of Singapore",
      country: "Singapore",
      title: "Semiconductor Technologies for Renewable Energy Applications",
      image: "/src/images/Renewable-2025 Speaker/plenary/Kah-Wee ANG.jpg"
    },
    {
      name: "Prof. Arif Hepbasli",
      affiliation: "Yasar University",
      country: "Turkey",
      title: "An Acrostic Approach to Renewable and Sustainable Energy/Exergy System",
      image: "/src/images/Renewable-2025 Speaker/plenary/Arif Hepbasli.jpg"
    },
    {
      name: "Prof. Badrul Chowdhury",
      affiliation: "University of North Carolina",
      country: "USA",
      title: "Sustainable and resilient operation of distribution systems during extreme weather events",
      image: "/src/images/Renewable-2025 Speaker/plenary/Badrul Chowdhury.jpeg.jpg"
    },
    {
      name: "Prof. Yuying Yan",
      affiliation: "University of Nottingham",
      country: "UK",
      title: "Thermal Management - The Important Culture and Technology for The Development of Renewable and Sustainable Energy",
      image: "/src/images/Renewable-2025 Speaker/plenary/Yuuing Yan.jpg"
    },
    {
      name: "Prof. Strbac Goran",
      affiliation: "Imperial College London",
      country: "UK",
      title: "Smart Grid Integration and Renewable Energy Systems",
      image: "/src/images/Renewable-2025 Speaker/plenary/Strbac Goran.jpg"
    },
    {
      name: "Prof. Yulong Ding",
      affiliation: "Birmingham University",
      country: "UK",
      title: "Energy Storage Technologies and Applications",
      image: "/src/images/Renewable-2025 Speaker/plenary/Yulong Ding.jpg"
    },
    {
      name: "Prof. Dai-Yeun Jeong",
      affiliation: "Asia Climate Change Education Center",
      country: "South Korea",
      title: "How to Overcome the Limitations Inherent in Sustainable Development",
      image: "/src/images/Renewable-2025 Speaker/plenary/dai-yeun-jeong.jpg"
    },
    {
      name: "Prof. Kenji Uchino",
      affiliation: "Pennsylvania State University",
      country: "USA",
      title: "Advanced Materials for Renewable Energy Applications",
      image: "/src/images/Renewable-2025 Speaker/plenary/Kenji Uchino.jpg"
    },
    {
      name: "Prof. Vladimir Strezov",
      affiliation: "Macquarie University",
      country: "Australia",
      title: "Sustainable Waste-to-Energy Technologies",
      image: "/src/images/Renewable-2025 Speaker/plenary/Vladimir Strezov.jpg"
    },
    {
      name: "Prof. Igor Zhitomirsky",
      affiliation: "McMaster University",
      country: "Canada",
      title: "Electrochemical Technologies for Energy Storage",
      image: "/src/images/Renewable-2025 Speaker/plenary/Igor Zhitomirsky.jpg"
    },
    {
      name: "Prof. Hwai Chyuan Ong",
      affiliation: "Sunway University",
      country: "Malaysia",
      title: "Biofuel Technologies and Sustainable Transportation",
      image: "/src/images/Renewable-2025 Speaker/plenary/Hwai Chyuan Ong.jpeg.jpg"
    },
    {
      name: "Prof. Soteris Kalogirou",
      affiliation: "Cyprus University of Technology",
      country: "Cyprus",
      title: "Solar Energy Technologies and Applications",
      image: "/src/images/Renewable-2025 Speaker/plenary/Soteris Kalogirou.jpeg.jpg"
    },
    {
      name: "Prof. Chu Fulei",
      affiliation: "Tsinghua University",
      country: "China",
      title: "Advanced Energy Systems and Technologies",
      image: "/src/images/Renewable-2025 Speaker/plenary/Fulei Chu.png"
    },
    {
      name: "Prof. Haofeng Chen",
      affiliation: "East China University",
      country: "China",
      title: "Renewable Energy Systems Integration",
      image: "/src/images/Renewable-2025 Speaker/plenary/Haofeng Chen.png"
    }
  ];

  const keynoteSpeakers: Speaker[] = [
    {
      name: "Prof. Kamiel Gabriel",
      affiliation: "Ontario Tech University",
      country: "Canada",
      title: "Advanced Control Systems for Renewable Energy Integration",
      image: "/src/images/Renewable-2025 Speaker/keynote/Kamiel S. Gabriel.jpeg.jpg"
    },
    {
      name: "Prof. Andreas Lemmer",
      affiliation: "University of Hohenheim",
      country: "Germany",
      title: "Biomethane - the most sustainable fuel for heavy goods transport and agriculture",
      image: "/src/images/Renewable-2025 Speaker/keynote/Andreas Lemmer.jpeg.jpg"
    },
    {
      name: "Dr. Alessia Vacca",
      affiliation: "University of Lincoln",
      country: "UK",
      title: "The Role of Public Involvement in The Implementation of EU Policies Related to Renewables and Sustainable Energy",
      image: "/src/images/Renewable-2025 Speaker/keynote/alessia vacca.webp"
    },
    {
      name: "Prof. Hanshen Li",
      affiliation: "Shanghai Jiao Tong University",
      country: "China",
      title: "Uncertainty Operation and Planning Method of Distribution Cyber-Physical System under Low-carbon Era",
      image: "/src/images/Renewable-2025 Speaker/keynote/Hanshen Li.png"
    },
    {
      name: "Dr. Adriana Greco",
      affiliation: "University of Naples Federico",
      country: "Italy",
      title: "The Project of the First Italian Elastocaloric Device for Air Conditioning",
      image: "/src/images/Renewable-2025 Speaker/keynote/adriana greco.jpeg.jpg"
    },
    {
      name: "Prof. Michael Patt",
      affiliation: "Kempten University of Applied Sciences",
      country: "Germany",
      title: "Sustainable Energy Systems and Environmental Impact",
      image: "/src/images/Renewable-2025 Speaker/keynote/micheal patt.jpg"
    },
    {
      name: "Dr. Gamze Karanfil Kaçmaz",
      affiliation: "GMZ Enerji (Founder/CEO)",
      country: "Turkey",
      title: "Innovative Hydrogen Energy Solutions for a Sustainable Future",
      image: "/src/images/Renewable-2025 Speaker/keynote/gamze karanfil.jpg"
    },
    {
      name: "Prof. Nihal Kularatna",
      affiliation: "University of Waikato",
      country: "New Zealand",
      title: "Power Electronics for Renewable Energy Systems",
      image: "/src/images/Renewable-2025 Speaker/keynote/nihal kularatna.jpg"
    },
    {
      name: "Dr. Barbara Marchetti",
      affiliation: "eCampus University",
      country: "Italy",
      title: "Digital Innovation in Renewable Energy Education",
      image: "/src/images/Renewable-2025 Speaker/keynote/barbara marchetti.jpg"
    },
    {
      name: "Prof. Suwen Chen",
      affiliation: "Tongji University",
      country: "China",
      title: "Safety of Power Transformer from Arc Fault Explosion",
      image: "/src/images/Renewable-2025 Speaker/keynote/Suwen Chen.png"
    },
    {
      name: "Prof. Hao Zeng",
      affiliation: "University at Buffalo",
      country: "USA",
      title: "Developing Chalcogenide Perovskite Thin Films for Optoelectronics",
      image: "/src/images/Renewable-2025 Speaker/keynote/hao zeng.jpeg.jpg"
    },
    {
      name: "Prof. Xi Jiang",
      affiliation: "Queen Mary University of London",
      country: "UK",
      title: "Insight Into Pollutant Formation of Ammonia-Hydrogen Combustion Utilisation",
      image: "/src/images/Renewable-2025 Speaker/keynote/Xi Jiang.png"
    },
    {
      name: "Prof. Xudong Zhao",
      affiliation: "University of Hull",
      country: "UK",
      title: "Advanced Solar Energy Technologies",
      image: "/src/images/Renewable-2025 Speaker/keynote/xudong zhao.webp"
    },
    {
      name: "Prof. Xinggang Yan",
      affiliation: "University of Kent",
      country: "UK",
      title: "Control Systems for Renewable Energy Applications",
      image: "/src/images/Renewable-2025 Speaker/keynote/Xinggang Yan.jpg"
    },
    {
      name: "Prof. Om Malik",
      affiliation: "University of Calgary",
      country: "Canada",
      title: "Power System Protection and Control in Renewable Energy Systems",
      image: "/src/images/Renewable-2025 Speaker/keynote/Om  Malik.jpeg.jpg"
    },
    {
      name: "Prof. Hongwei Wu",
      affiliation: "University of Hertfordshire",
      country: "UK",
      title: "Smart Grid Technologies and Applications",
      image: "/src/images/Renewable-2025 Speaker/keynote/hongwei wu.jpeg.jpg"
    },
    {
      name: "Prof. Gordon Huang",
      affiliation: "University of Regina",
      country: "Canada",
      title: "Environmental Systems Engineering for Renewable Energy",
      image: "/src/images/Renewable-2025 Speaker/keynote/Gordan Huang.jpg"
    }
  ];



  const conferenceTopics = [
    "Sustainable and Renewable Energy",
    "Solar Energy Systems and Materials", 
    "Wind Energy Technologies",
    "Biomass Conversion Technologies",
    "Hydroelectric Power Systems",
    "Green Hydrogen Production",
    "Energy Storage Solutions",
    "Smart Grid Technologies",
    "Electric Vehicles and Transportation",
    "Power Electronics and Systems",
    "Energy Efficiency and Management",
    "Biofuel Economics and Commercialization",
    "Photovoltaic Systems",
    "Geothermal Energy Applications",
    "Nuclear Energy Safety",
    "Distributed Generation",
    "Power Quality and Control",
    "Energy Harvesting Technologies",
    "Green Technology and Eco-Design",
    "Thermal Energy Systems"
  ];

  const SpeakerCard: React.FC<{ speaker: Speaker; type: 'plenary' | 'keynote' }> = ({ speaker, type }) => {
    const isExpanded = expandedSpeaker === `${type}-${speaker.name}`;
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-sm mx-auto">
        {/* Speaker Image */}
        {speaker.image && (
          <div className="w-full h-56 bg-gray-200 overflow-hidden relative">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
              }}
            />
            {/* Speaker Type Badge */}
            <div className="absolute top-3 right-3">
              {type === 'plenary' && (
                <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                  Plenary
                </span>
              )}
              {type === 'keynote' && (
                <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                  Keynote
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="p-5">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{speaker.name}</h3>
            <p className="text-amber-600 font-semibold text-sm mb-1 leading-snug">{speaker.affiliation}</p>
            <p className="text-gray-500 text-sm flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                <span className="text-xs">🌍</span>
              </span>
              {speaker.country}
            </p>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => setExpandedSpeaker(isExpanded ? null : `${type}-${speaker.name}`)}
              className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">View Presentation</span>
              <div className="flex items-center">
                {isExpanded ? 
                  <ChevronUp size={16} className="text-amber-500" /> : 
                  <ChevronDown size={16} className="text-amber-500" />
                }
              </div>
            </button>
            
            {isExpanded && (
              <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-400">
                <p className="text-sm text-gray-700 italic leading-relaxed">{speaker.title}</p>
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
            <RouterLink to="/" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center">
              ← Back to Home
            </RouterLink>
            <div className="text-sm text-gray-600">
              7th Edition - April 25-27, 2025 - Amsterdam, Netherlands
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            RENEWABLE-2025
          </h1>
          <p className="text-2xl text-amber-600 font-semibold mb-2">
            7th Edition of the largest European Conference & Exhibition
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            on Renewable and Sustainable Energy - Amsterdam, Netherlands
          </p>
          
          {/* Conference Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{stats.participants}+</div>
              <div className="text-gray-600">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{stats.countries}</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{stats.papers}</div>
              <div className="text-gray-600">Papers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{stats.sessions}</div>
              <div className="text-gray-600">Sessions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'plenary', label: 'Plenary Speakers' },
              { id: 'keynote', label: 'Keynote Speakers' },
              { id: 'topics', label: 'Conference Topics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === tab.id
                    ? 'border-amber-500 text-amber-600'
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
      <main className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Conference Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  RENEWABLE-2025, the 7th edition of the largest European Conference & Exhibition on Renewable 
                  and Sustainable Energy, was successfully held in Amsterdam, Netherlands from April 25-27, 2025. 
                  This cutting-edge international conference brought together world leaders, prominent researchers, 
                  and industry visionaries to explore and unlock the boundless potential of Renewable and Sustainable Energy.
                </p>
                <p className="text-gray-600 mb-6">
                  Over the past editions, the Renewable Energy Conference strengthened its position as the main 
                  in-person meeting point of the Renewable Energy community worldwide. The conference featured 
                  intellectual showdowns where each session concluded with debates on abstracts, leading to the 
                  selection of the best ideas.
                </p>
                <p className="text-gray-600 mb-6">
                  The event accelerated the transition to a sustainable energy future, bringing together experts 
                  to make a difference and ensure a greener, more resilient world for generations to come.
                </p>
              </div>
            </div>



            {/* Conference Schedule */}
            <div className="mt-12 bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Conference Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-amber-600 mb-4">Day 1</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>08:00 - 09:00</span>
                      <span>Registration</span>
                    </div>
                    <div className="flex justify-between">
                      <span>09:30 - 10:30</span>
                      <span>Session I</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10:30 - 11:00</span>
                      <span>Refreshment Break</span>
                    </div>
                    <div className="flex justify-between">
                      <span>11:00 - 12:30</span>
                      <span>Session II</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12:30 - 13:30</span>
                      <span>Lunch with Discussions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>13:30 - 15:00</span>
                      <span>Break Out Session I</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15:00 - 15:30</span>
                      <span>Refreshment Break</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15:30 - 18:00</span>
                      <span>Breakout Session II</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-amber-600 mb-4">Day 2</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>09:00 - 10:30</span>
                      <span>Plenary Sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10:30 - 11:00</span>
                      <span>Coffee Break</span>
                    </div>
                    <div className="flex justify-between">
                      <span>11:00 - 12:30</span>
                      <span>Keynote Presentations</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12:30 - 13:30</span>
                      <span>Networking Lunch</span>
                    </div>
                    <div className="flex justify-between">
                      <span>13:30 - 15:00</span>
                      <span>Technical Sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15:00 - 15:30</span>
                      <span>Coffee Break</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15:30 - 17:00</span>
                      <span>Workshop Sessions</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-amber-600 mb-4">Day 3</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>09:00 - 10:30</span>
                      <span>Final Presentations</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10:30 - 11:00</span>
                      <span>Coffee Break</span>
                    </div>
                    <div className="flex justify-between">
                      <span>11:00 - 12:30</span>
                      <span>Panel Discussions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12:30 - 13:30</span>
                      <span>Closing Lunch</span>
                    </div>
                    <div className="flex justify-between">
                      <span>13:30 - 15:00</span>
                      <span>Closing Ceremony</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15:00 - 16:00</span>
                      <span>Awards & Recognition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plenary Speakers Section */}
        {activeSection === 'plenary' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Plenary Speakers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Distinguished experts who delivered keynote presentations on cutting-edge renewable energy research and innovations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {plenaryHalfgfers.map((speaker, index) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
                Comprehensive coverage of renewable and sustainable energy technologies
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conferenceTopics.map((topic, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span className="text-gray-800 font-medium">{topic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Topics Info */}
            <div className="mt-12 bg-amber-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Additional Focus Areas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Energy Systems & Technology</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Nuclear, Wind, Solar, Geothermal, Hydropower and Biomass Energies</li>
                    <li>• Power Generation and Distribution Systems</li>
                    <li>• Insulation Technology and Lightning Protection</li>
                    <li>• Modern Energy Cooking Transitions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Innovation & Applications</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Smart Technologies for Power Generation</li>
                    <li>• Renewable Energy for IT Equipment</li>
                    <li>• Green Facilities and Industries</li>
                    <li>• Transportation and Sea Power Generation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Call to Action */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Us in 2026!</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't miss out on the next edition of the Renewable Energy Conference
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <RouterLink
              to="/registration"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Register for 2026
            </RouterLink>
            <RouterLink
              to="/abstract-submission"
              className="bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Submit Abstract
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreviousEdition;