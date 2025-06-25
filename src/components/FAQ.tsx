import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQ: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is the main focus of the Renewable Energy Conference?",
      answer: "The conference focuses on the latest developments in renewable energy technologies, policy frameworks, and sustainable solutions for a greener future.",
      category: "General"
    },
    {
      question: "Who should attend this conference?",
      answer: "Energy professionals, researchers, policymakers, investors, entrepreneurs, and anyone interested in renewable energy are welcome.",
      category: "Attendance"
    },
    {
      question: "Are there networking opportunities?",
      answer: "Yes, including dedicated networking sessions, coffee breaks, and social events with industry professionals.",
      category: "Events"
    },
    {
      question: "What are the registration fees?",
      answer: "Fees vary based on attendance type and category. Visit the registration page for detailed information.",
      category: "Registration"
    },
    {
      question: "Is virtual attendance possible?",
      answer: "Yes, virtual attendance includes live streaming, interactive Q&As, and networking features.",
      category: "Attendance"
    },
    {
      question: "Will session recordings be available?",
      answer: "Yes, all registered participants will have access to session recordings post-conference.",
      category: "General"
    },
    {
      question: "How do I become a speaker?",
      answer: "Submit your proposal via our 'Call for Speakers' page. The organizing committee will review and confirm.",
      category: "Speaking"
    },
    {
      question: "Are meals provided during the conference?",
      answer: "Yes, lunch and refreshments are included for all in-person attendees.",
      category: "Logistics"
    },
    {
      question: "Can I sponsor the event?",
      answer: "Absolutely. We offer multiple sponsorship packages. Please visit our Sponsorship section for more info.",
      category: "Sponsorship"
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>

        {/* Professional Image Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <img
            src="https://media.gettyimages.com/id/1408304047/photo/cheerful-female-presenter-interacting-with-the-audience.jpg?s=2048x2048&w=gi&k=20&c=wMPgaORmqxlwEZ6I3lxoTd-Hm94G3GWUi2-QNTWZAXM="
            alt="Renewable Energy"
            className="rounded-xl shadow-md w-full h-auto object-cover"
          />
          <img
            src="https://media.gettyimages.com/id/1382269943/photo/group-of-diverse-business-people-on-panel-discussion.jpg?s=612x612&w=gi&k=20&c=LhEGjfA0-soR_nfGKiU6c2NR5jPZT0AJrZyxwHGk2rU="
            alt="Conference"
            className="rounded-xl shadow-md w-full h-auto object-cover"
          />
          <img
            src="https://media.gettyimages.com/id/1039606566/photo/business-people-listening-to-the-speaker-at-a-conference.jpg?s=2048x2048&w=gi&k=20&c=ZX8Tbafg3Oxy8QCipEPwL6OBejcvqyOLpAxy6FUNAOw="
            alt="Networking"
            className="rounded-xl shadow-md w-full h-auto object-cover"
          />
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
              <button
                className="w-full text-left"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <span
                    className={`transform transition-transform duration-300 ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                  >
                    ↓
                  </span>
                </div>
                {activeIndex === index && (
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
