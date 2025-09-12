import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SiteSettingsContext = createContext({});

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [mediaSettings, setMediaSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [siteResponse, mediaResponse] = await Promise.all([
        axios.get(`${API}/site-settings`),
        axios.get(`${API}/media-settings`)
      ]);
      
      setSiteSettings(siteResponse.data);
      setMediaSettings(mediaResponse.data);
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      setError(err);
      // Set default fallback values
      setSiteSettings({
        site_title: 'MMB',
        header_tagline: 'Web Solutions',
        site_description: 'Creating modern web solutions that convert visitors into customers.',
        footer_text: '© 2024 MMB. All rights reserved.',
        primary_color: '#3b82f6',
        secondary_color: '#8b5cf6',
        accent_color: '#ef4444',
        nav_links: [],
        social_links: [],
        contact_email: '',
        contact_phone: '',
        contact_address: ''
      });
      setMediaSettings({
        logo: null,
        favicon: null,
        hero_image: null,
        about_image: null
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = () => {
    fetchSettings();
  };

  const updateSettings = (newSiteSettings, newMediaSettings) => {
    if (newSiteSettings) setSiteSettings(newSiteSettings);
    if (newMediaSettings) setMediaSettings(newMediaSettings);
  };

  const getSocialLinkUrl = (platform) => {
    if (!siteSettings?.social_links) return '#';
    const link = siteSettings.social_links.find(l => l.platform === platform);
    return link?.url || '#';
  };

  const getNavLinks = () => {
    const defaultNavLinks = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Services', path: '/services' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Testimonials', path: '/testimonials' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' }
    ];

    if (!siteSettings?.nav_links || siteSettings.nav_links.length === 0) {
      return defaultNavLinks;
    }

    return siteSettings.nav_links.map(link => ({
      name: link.name,
      path: link.url
    }));
  };

  const getLogoUrl = () => {
    return mediaSettings?.logo || null;
  };

  const getFaviconUrl = () => {
    return mediaSettings?.favicon || null;
  };

  const getHeroImageUrl = () => {
    return mediaSettings?.hero_image || null;
  };

  const getAboutImageUrl = () => {
    return mediaSettings?.about_image || null;
  };

  const getThemeColors = () => {
    return {
      primary: siteSettings?.primary_color || '#3b82f6',
      secondary: siteSettings?.secondary_color || '#8b5cf6',
      accent: siteSettings?.accent_color || '#ef4444'
    };
  };

  const contextValue = {
    siteSettings,
    mediaSettings,
    loading,
    error,
    refreshSettings,
    updateSettings,
    getSocialLinkUrl,
    getNavLinks,
    getLogoUrl,
    getFaviconUrl,
    getHeroImageUrl,
    getAboutImageUrl,
    getThemeColors
  };

  return (
    <SiteSettingsContext.Provider value={contextValue}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export default SiteSettingsContext;