"use client";

import React from "react";
import { Sun } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Footer Content - Map section removed */}

      {/* Footer Columns */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Sun className="h-8 w-8 text-green-500" />
              <div className="ml-2">
                <h3 className="text-lg font-bold">Renewable</h3>
                <h4 className="text-base">Meet 2026</h4>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              The premier global conference for renewable energy leaders and
              innovators.
            </p>
            <div className="flex space-x-4">
              {["Facebook", "Twitter", "GitHub", "Dribbble"].map((label, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={label}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 
                      10 10 10-4.48 10-10S17.52 2 12 2z"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/speakers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Speakers
                </a>
              </li>
              <li>
                <a
                  href="/agenda"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Agenda
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/conference-topics"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Conference Topics
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/previous-edition"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Previous Edition
                </a>
              </li>
            </ul>
          </div>

          {/* Participate */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Participate</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/registration"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Register Now
                </a>
              </li>
              <li>
                <a
                  href="/abstract-submission"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Submit Abstract
                </a>
              </li>
              <li>
                <a
                  href="/partners"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Become a Partner
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-600 mt-12 pt-8 flex flex-col items-center space-y-3">
          <button
            onClick={() => window.location.href = "/admin-login"}
            className="text-sm text-gray-400 hover:text-white transition-colors underline"
          >
            Admin Login
          </button>
          {/* <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Developed and maintained by</span>
            <a 
              href="https://www.zynlogic.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/images/Zynlogic.png" 
                alt="Zynlogic Logo" 
                className="h-6 w-auto"
              />
            </a>
          </div> */}
          <p className="text-center text-gray-500 text-sm">
            © 2025 Renewable Meet 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;