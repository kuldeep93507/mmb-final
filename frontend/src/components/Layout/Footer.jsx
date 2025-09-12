import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const Footer = () => {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const { siteSettings, getSocialLinkUrl, getLogoUrl, getThemeColors } = useSiteSettings();

  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Dynamic Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getLogoUrl() ? (
                /* Custom Uploaded Logo */
                <div className="relative">
                  <div className="w-10 h-10 relative">
                    <img 
                      src={getLogoUrl()} 
                      alt={siteSettings?.site_title || 'Logo'}
                      className="w-10 h-10 object-contain rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                /* Default 3D Footer Logo with Dynamic Colors */
                <div className="relative">
                  <div className="w-10 h-10 relative">
                    {/* Shadow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg transform translate-x-0.5 translate-y-0.5 opacity-40"></div>
                    
                    {/* Main Logo with Dynamic Colors */}
                    <div 
                      className="relative w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${getThemeColors().primary}, ${getThemeColors().secondary})`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                      <span className="relative text-white font-bold text-sm drop-shadow-lg">
                        {siteSettings?.site_title?.substring(0, 3).toUpperCase() || 'MMB'}
                      </span>
                      <div className="absolute top-0.5 left-0.5 w-4 h-1.5 bg-white/30 rounded-full blur-sm"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  {siteSettings?.site_title || 'MMB'}
                </span>
                <span className="text-xs text-gray-400 -mt-1">
                  {siteSettings?.header_tagline || 'Web Solutions'}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {siteSettings?.site_description || 'Creating modern web solutions that convert visitors into customers. Professional website development and digital services.'}
            </p>
            <div className="flex space-x-4">
              <a 
                href={getSocialLinkUrl('linkedin')} 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href={getSocialLinkUrl('github')} 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href={getSocialLinkUrl('twitter')} 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href={getSocialLinkUrl('instagram')} 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Portfolio'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => handleNavigation(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                    className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {['Website Development', 'Landing Page Design', 'UX/UI Design', 'WordPress Development'].map((service) => (
                <li key={service}>
                  <button 
                    onClick={() => handleNavigation('/services')}
                    className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="animate-pulse h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="animate-pulse h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a 
                    href={`mailto:${profile?.email}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {profile?.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a 
                    href={`tel:${profile?.phone}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {profile?.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400 text-sm">{profile?.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-gray-400 text-sm">
              {siteSettings?.footer_text || `© 2024 ${siteSettings?.site_title || 'MMB'}. All rights reserved.`}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Developed by <span className="text-blue-400 font-medium">Kuldeep Parjapati</span>
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => handleNavigation('/privacy')} className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </button>
            <button onClick={() => handleNavigation('/terms')} className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;