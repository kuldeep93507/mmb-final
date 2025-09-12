import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

const WhatsAppButton = () => {
  const { profile, loading } = useProfile();
  
  const handleWhatsAppClick = () => {
    if (!profile?.whatsapp) return;
    
    const message = "Hi! I'm interested in your web development services. Can we discuss my project?";
    const whatsappUrl = `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Don't render if profile is loading or whatsapp number is not available
  if (loading || !profile?.whatsapp) {
    return null;
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default WhatsAppButton;