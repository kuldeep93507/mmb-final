import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, Gift, Clock, Percent, ExternalLink } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const OfferBanner = () => {
  const [offer, setOffer] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferData();
  }, []);

  useEffect(() => {
    // Check if banner was dismissed in localStorage
    const dismissed = localStorage.getItem('offer-banner-dismissed');
    if (dismissed) {
      const dismissedData = JSON.parse(dismissed);
      // Check if it's the same offer
      if (offer && dismissedData.offerId === offer.id) {
        setIsDismissed(true);
      }
    }
  }, [offer]);

  const fetchOfferData = async () => {
    try {
      console.log('🔄 Fetching offer data...');
      const [offersResponse, settingsResponse] = await Promise.all([
        axios.get(`${API}/offers/active`),
        axios.get(`${API}/site-settings`)
      ]);
      
      console.log('📝 Site Settings:', settingsResponse.data);
      console.log('🎁 Active Offers:', offersResponse.data);
      
      setSiteSettings(settingsResponse.data);
      
      // Get the highest priority active offer
      const activeOffers = offersResponse.data;
      if (activeOffers && activeOffers.length > 0) {
        console.log('✅ Setting offer:', activeOffers[0]);
        setOffer(activeOffers[0]); // Already sorted by priority
      } else {
        console.log('❌ No active offers found');
      }
    } catch (error) {
      console.error('❌ Failed to fetch offer data:', error);
    } finally {
      setLoading(false);
      console.log('✅ Loading completed');
    }
  };

  const dismissBanner = () => {
    setIsDismissed(true);
    // Store dismissal in localStorage
    if (offer) {
      localStorage.setItem('offer-banner-dismissed', JSON.stringify({
        offerId: offer.id,
        dismissedAt: new Date().toISOString()
      }));
    }
  };

  const handleOfferClick = () => {
    if (offer && offer.cta_url) {
      if (offer.cta_url.startsWith('http')) {
        window.open(offer.cta_url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = offer.cta_url;
      }
    }
  };

  const formatTimeRemaining = (endDate) => {
    if (!endDate) return null;
    
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else {
      return 'Ending soon';
    }
  };

  // Show banner if all conditions are met
  if (loading || !offer || !siteSettings?.offers_enabled || isDismissed) {
    return null;
  }


  const timeRemaining = formatTimeRemaining(offer.ends_at);

  return (
    <div 
      className="relative overflow-hidden animate-in slide-in-from-top duration-500"
      style={{ 
        backgroundColor: offer.background_color || '#ff6b6b',
        color: offer.text_color || '#ffffff'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, currentColor 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Offer Content */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Icon */}
            <div className="flex-shrink-0">
              <Gift className="h-6 w-6" />
            </div>
            
            {/* Offer Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 flex-wrap">
                <span className="font-bold text-lg">
                  {offer.title}
                </span>
                
                {offer.subtitle && (
                  <span className="font-medium opacity-90">
                    {offer.subtitle}
                  </span>
                )}
                
                {offer.discount_percentage && (
                  <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                    <Percent className="h-4 w-4" />
                    <span className="font-bold text-sm">
                      {offer.discount_percentage}% OFF
                    </span>
                  </div>
                )}
                
                {offer.discount_amount && (
                  <div className="bg-white/20 px-2 py-1 rounded-full">
                    <span className="font-bold text-sm">
                      Save {offer.discount_amount}
                    </span>
                  </div>
                )}
                
                {timeRemaining && (
                  <div className="flex items-center space-x-1 text-sm opacity-90">
                    <Clock className="h-4 w-4" />
                    <span>{timeRemaining}</span>
                  </div>
                )}
              </div>
              
              {offer.description && (
                <p className="text-sm opacity-90 mt-1 hidden sm:block">
                  {offer.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* CTA Button */}
            {offer.cta_url && (
              <Button
                onClick={handleOfferClick}
                size="sm"
                className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm transition-all duration-200 font-medium"
                style={{ 
                  color: offer.text_color || '#ffffff'
                }}
              >
                {offer.cta_text || 'Get Offer'}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {/* Dismiss Button */}
            <Button
              onClick={dismissBanner}
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-white/10 rounded-full"
              style={{ color: offer.text_color || '#ffffff' }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;