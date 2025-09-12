import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import OfferBanner from '../Common/OfferBanner';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { siteSettings, getNavLinks, getLogoUrl, getThemeColors } = useSiteSettings();

  const navItems = getNavLinks();

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
    <>
      {/* Offer Banner */}
      <OfferBanner />
      
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Dynamic Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {getLogoUrl() ? (
              /* Custom Uploaded Logo */
              <div className="relative group">
                <div className="w-12 h-12 relative transform transition-all duration-300 hover:scale-110">
                  <img 
                    src={getLogoUrl()} 
                    alt={siteSettings?.site_title || 'Logo'}
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                </div>
              </div>
            ) : (
              /* Default 3D Logo */
              <div className="relative group">
                <div className="w-12 h-12 relative transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                  {/* Shadow Layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl transform translate-x-1 translate-y-1 opacity-30"></div>
                  
                  {/* Main 3D Logo with Dynamic Colors */}
                  <div 
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:shadow-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${getThemeColors().primary}, ${getThemeColors().secondary})`,
                      boxShadow: `0 20px 25px -5px ${getThemeColors().primary}25`
                    }}
                  >
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                    
                    {/* Dynamic Logo Text */}
                    <span className="relative text-white font-bold text-lg tracking-tight drop-shadow-lg">
                      {siteSettings?.site_title?.substring(0, 3).toUpperCase() || 'MMB'}
                    </span>
                    
                    {/* Top highlight */}
                    <div className="absolute top-1 left-1 w-6 h-2 bg-white/30 rounded-full blur-sm"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Dynamic Company Name */}
            <div className="flex flex-col">
              <span 
                className="text-xl font-bold text-transparent bg-clip-text drop-shadow-sm"
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${getThemeColors().primary}, ${getThemeColors().secondary})`
                }}
              >
                {siteSettings?.site_title || 'MMB'}
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                {siteSettings?.header_tagline || 'Web Solutions'}
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
    </>
  );
};

export default Header;