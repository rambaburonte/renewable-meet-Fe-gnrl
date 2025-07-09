import React, { useState } from "react";

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  speaker?: string;
}

interface DaySchedule {
  date: string;
  day: string;
  items: AgendaItem[];
}

const Agenda: React.FC = () => {
  const schedule: DaySchedule[] = [
    {
      date: "May 29, 2026",
      day: "Day 1",
      items: [
        { time: "08:00 - 09:00", title: "Registration & Welcome Coffee", description: "Check-in and networking opportunity" },
        { time: "09:00 - 09:30", title: "Opening Remarks", description: "Welcome address and introduction to the conference themes", speaker: "Dr. Sarah Johnson, SolarTech Innovations" },
        { time: "09:30 - 10:30", title: "Keynote: The Future of Renewable Energy", description: "Exploring the latest trends and future outlook for renewable energy technologies", speaker: "Michael Chen, GreenEnergy Global" },
        { time: "10:30 - 11:00", title: "Coffee Break", description: "Networking opportunity" },
        { time: "11:00 - 12:30", title: "Panel: Policy Frameworks for Accelerating Renewables", description: "Policymakers discuss effective regulatory approaches", speaker: "Emma Rodriguez, EcoFuture Alliance" },
        { time: "12:30 - 13:30", title: "Lunch Break", description: "Networking lunch" },
        { time: "13:30 - 15:00", title: "Breakthrough in Energy Storage", description: "Innovations in battery tech and storage solutions", speaker: "Dr. James Wilson, HydroPower Innovations" },
        { time: "15:00 - 15:30", title: "Coffee Break", description: "Networking opportunity" },
        { time: "15:30 - 17:00", title: "Workshop: Solar Technology Implementation", description: "Hands-on workshop for solar energy solutions", speaker: "Technical experts" },
      ],
    },
    {
      date: "May 30, 2026",
      day: "Day 2",
      items: [
        { time: "09:00 - 10:00", title: "AI for Smart Grid Management", description: "How AI is transforming power grid operations", speaker: "Neha Reddy, GridAI Labs" },
        { time: "10:00 - 11:00", title: "Financing the Energy Transition", description: "Investment strategies for renewable projects", speaker: "Various industry experts" },
        { time: "11:00 - 11:30", title: "Coffee Break", description: "Networking opportunity" },
        { time: "11:30 - 12:30", title: "Renewable Integration: Challenges", description: "Operational challenges of high renewable penetration", speaker: "Panel of technical experts" },
        { time: "12:30 - 13:30", title: "Lunch Break", description: "Networking lunch" },
        { time: "13:30 - 15:00", title: "Hydrogen as a Clean Fuel", description: "Green hydrogen production and utilization", speaker: "Dr. Alan Fischer, H2Global" },
        { time: "15:00 - 15:30", title: "Coffee Break", description: "Networking opportunity" },
        { time: "15:30 - 17:00", title: "Wind Power Beyond 2030", description: "Designing scalable, efficient offshore wind farms", speaker: "Karen Smith, AeroWind Solutions" },
      ],
    },
    {
      date: "May 31, 2026",
      day: "Day 3",
      items: [
        { time: "09:00 - 10:00", title: "Community Solar Projects", description: "Empowering local communities with clean energy", speaker: "Rajeev Patel, SunTogether" },
        { time: "10:00 - 11:00", title: "Electric Mobility Ecosystems", description: "EV infrastructure, policy, and innovation", speaker: "Panel with AutoGreen and ChargeNow" },
        { time: "11:00 - 11:30", title: "Coffee Break", description: "Networking opportunity" },
        { time: "11:30 - 12:30", title: "Youth in Clean Energy", description: "Opportunities for young professionals and students", speaker: "Global Youth Energy Council" },
        { time: "12:30 - 13:30", title: "Lunch Break", description: "Networking lunch" },
        { time: "13:30 - 15:00", title: "Innovation Pitches", description: "Startups present cutting-edge renewable ideas", speaker: "Various Founders" },
        { time: "15:00 - 15:30", title: "Coffee Break", description: "Networking opportunity" },
        { time: "15:30 - 16:30", title: "Circular Economy in Renewables", description: "Sustainable production and recycling of energy tech", speaker: "Jessica Lee, EcoLoop" },
        { time: "16:30 - 17:00", title: "Closing Ceremony", description: "Summary and outlook for the future", speaker: "Organizing Committee" },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Conference Agenda
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {schedule.map((day, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-2 rounded-t-lg font-semibold transition-all ${
                activeTab === index
                  ? "bg-green-500 text-gray-900 shadow"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-b-lg shadow-lg overflow-hidden">
          <div className="bg-green-100 px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              {schedule[activeTab].day}: {schedule[activeTab].date}
            </h3>
          </div>

          {schedule[activeTab].items.map((item, index) => (
            <div
              key={index}
              className={`p-6 ${
                index !== schedule[activeTab].items.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="md:w-1/4 font-medium text-green-600 mb-2 md:mb-0">
                  {item.time}
                </div>
                <div className="md:w-3/4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  {item.speaker && <p className="text-gray-700 italic">Speaker: {item.speaker}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 italic mb-4">
            * The agenda is subject to change. More sessions and speakers will be announced soon.
          </p>
          <a
            href="#download-agenda"
            className="inline-block bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-6 py-3 rounded transition-colors"
          >
            Download Full Agenda
          </a>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
