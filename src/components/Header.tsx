import React, { useState } from 'react';
import { Sun } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleAbstractClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/abstract-submission');
  };

  const handleSessionsClick = () => {
    console.log("Sessions link clicked, navigating to /conference-topics");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/conference-topics');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black py-4 shadow-lg transition-all duration-500 ease-in-out`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <RouterLink to="/" className="flex items-center space-x-3">
            <Sun className="h-10 w-10 text-green-500" />
            <div className="text-white select-none">
              <h1 className="text-xl font-bold leading-tight">Renewable</h1>
              <h2 className="text-lg leading-tight">Meet 2026</h2>
            </div>
          </RouterLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { to: '/', label: 'Home' },
            { to: '/speakers', label: 'Speakers' },
            { to: '/agenda', label: 'Agenda 2026' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <RouterLink
              key={to}
              to={to}
              className="text-white hover:text-green-400 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
            >
              {label}
            </RouterLink>
          ))}
        </nav>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Previous Edition Button (left-aligned) */}
          <RouterLink
            to="/previous-edition"
            className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-4 py-2 rounded transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 text-left"
          >
            Previous Edition
          </RouterLink>
          
          {/* Register Button */}
          <RouterLink
            to="/registration"
            className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-4 py-2 rounded transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Register
          </RouterLink>

          {/* Abstract Submission Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-4 py-2 rounded transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 flex items-center"
            >
              Abstract Submission
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 bg-gray-900 text-white rounded shadow-lg min-w-[180px]">
                <RouterLink
                  to="/abstract-submission"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                  onClick={handleAbstractClick}
                >
                  Abstract Submission
                </RouterLink>
                <RouterLink
                  to="/conference-topics"
                  className="block px-4 py-2 hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                  onClick={handleSessionsClick}
                >
                  Sessions
                </RouterLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-black overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out
          ${mobileMenuOpen ? 'max-h-screen opacity-100 py-4 px-4' : 'max-h-0 opacity-0 py-0 px-4'}`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="flex flex-col space-y-3">
          {[
            { to: '/', label: 'Home' },
            { to: '/speakers', label: 'Speakers' },
            { to: '/agenda', label: 'Agenda 2026' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <RouterLink
              key={to}
              to={to}
              className="text-white hover:text-green-400 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </RouterLink>
          ))}
        </nav>
        <div className="mt-4 flex flex-col space-y-2">
          {/* Previous Edition Button */}
          <RouterLink
            to="/previous-edition"
            className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-4 py-2 rounded text-center transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Previous Edition
          </RouterLink>

          {/* Register Button */}
          <RouterLink
            to="/registration"
            className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-4 py-2 rounded text-center transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Register
          </RouterLink>

          {/* Abstract Submission Dropdown */}
          <button
            onClick={toggleDropdown}
            className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold px-4 py-2 rounded text-center transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 flex justify-center items-center"
          >
            Abstract Submission
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="flex flex-col space-y-2 pl-4">
              <RouterLink
                to="/abstract-submission"
                className="text-white hover:text-green-400 transition-colors duration-300 ease-in-out text-left"
                onClick={handleAbstractClick}
              >
                Abstract Submission
              </RouterLink>
              <RouterLink
                to="/conference-topics"
                className="text-white hover:text-green-400 transition-colors duration-300 ease-in-out"
                onClick={handleSessionsClick}
              >
                Sessions
              </RouterLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;