"use client";

import React from "react";
import { Sun } from "lucide-react";
import { WorldMap } from "./ui/world-map";
import { motion } from "framer-motion";

const FooterWithMap: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* World Map Section */}
      <section className="py-1 bg-gray-700 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-xl md:text-4xl text-white/70">
            Meet Experts from All Over The {" "}
            <span className="text-neutral-80">
              {"Globe".split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </p>
          <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
            Engage with renowned experts and pioneers in renewable energy.
Collaborate globally to drive innovation and sustainable solutions.
          </p>
        </div>
        <WorldMap
          dots={[
            {
              start: { lat: 64.2008, lng: -149.4937 },
              end: { lat: 34.0522, lng: -118.2437 },
            },
            {
              start: { lat: 64.2008, lng: -149.4937 },
              end: { lat: -15.7975, lng: -47.8919 },
            },
            {
              start: { lat: -15.7975, lng: -47.8919 },
              end: { lat: 38.7223, lng: -9.1393 },
            },
            {
              start: { lat: 51.5074, lng: -0.1278 },
              end: { lat: 28.6139, lng: 77.209 },
            },
            {
              start: { lat: 28.6139, lng: 77.209 },
              end: { lat: 43.1332, lng: 131.9113 },
            },
            {
              start: { lat: 28.6139, lng: 77.209 },
              end: { lat: -1.2921, lng: 36.8219 },
            },
          ]}
        />
      </section>

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

export default FooterWithMap;
