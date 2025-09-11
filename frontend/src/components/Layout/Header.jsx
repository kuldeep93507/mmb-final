import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - 3D MMB */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative group">
              {/* 3D Container */}
              <div className="w-12 h-12 relative transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                {/* Shadow Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl transform translate-x-1 translate-y-1 opacity-30"></div>
                
                {/* Main 3D Logo */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25">
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  
                  {/* 3D Text */}
                  <span className="relative text-white font-bold text-lg tracking-tight drop-shadow-lg">
                    MMB
                  </span>
                  
                  {/* Top highlight */}
                  <div className="absolute top-1 left-1 w-6 h-2 bg-white/30 rounded-full blur-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Company Name with 3D effect */}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 drop-shadow-sm">
                MMB
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Web Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                  isActive(item.path) 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button onClick={() => handleNavigation('/contact')}>Hire Me</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 text-left ${
                    isActive(item.path) ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <Button onClick={() => handleNavigation('/contact')} className="w-full mt-4">
                Hire Me
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;