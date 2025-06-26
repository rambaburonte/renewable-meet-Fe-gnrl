import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 text-center mt-4">
            Get in touch with our team
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Address:</span>
                  123 Renewable Way, Boston, MA 02110, United States
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Email:</span>
                  <a href="mailto:info@renewablemeet2026.org" className="text-green-600 hover:underline">
                    info@renewablemeet2026.org
                  </a>
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Phone:</span>
                  <a href="tel:+12345678900" className="text-green-600 hover:underline">
                    +1 (234) 567-8900
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-6 py-3 rounded transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;