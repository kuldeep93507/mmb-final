import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/api/profile`);
      
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile data');
      
      // Fallback to default data if API fails
      setProfile({
        name: "Kuldeep Parjapati",
        email: "hello@mmb.dev",
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        address: "India",
        bio: "Professional Web Developer & Designer",
        linkedin: "https://linkedin.com/in/mmb",
        github: "https://github.com/mmb",
        twitter: "https://twitter.com/mmb",
        instagram: "https://instagram.com/mmb",
        website: "https://mmb.dev"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const contextValue = {
    profile,
    loading,
    error,
    refetchProfile: fetchProfile,
    refreshProfile: fetchProfile
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;