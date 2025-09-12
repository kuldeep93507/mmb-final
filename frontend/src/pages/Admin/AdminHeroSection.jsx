import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { LoadingWrapper } from '../../components/ui/loading';
import { 
  Save, 
  RefreshCw, 
  Type, 
  MessageSquare,
  User,
  BarChart3,
  MousePointer,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import { handleError, handleSuccess, apiCall } from '../../utils/errorHandler';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const AdminHeroSection = () => {
  const [heroData, setHeroData] = useState({
    greeting_text: '',
    main_heading_line1: '',
    main_heading_line2: '',
    main_heading_line3: '',
    subtitle: '',
    cta_button_text: '',
    cta_button_url: '',
    profile_name: '',
    profile_title: '',
    profile_logo_text: '',
    stats: {
      projects_count: '',
      projects_label: '',
      satisfaction_rate: '',
      satisfaction_label: '',
      experience_years: '',
      experience_label: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    await apiCall(
      async () => {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        const response = await axios.get(`${API}/admin/hero-section`, config);
        return response.data;
      },
      {
        onStart: () => setLoading(true),
        onSuccess: (data) => {
          setHeroData(data);
          setLoading(false);
        },
        onError: (error) => {
          handleError(error, toast);
          setLoading(false);
        }
      }
    );
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('stats.')) {
      const statField = field.replace('stats.', '');
      setHeroData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statField]: value
        }
      }));
    } else {
      setHeroData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    await apiCall(
      async () => {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        const response = await axios.put(`${API}/admin/hero-section`, heroData, config);
        return response.data;
      },
      {
        onStart: () => setSaving(true),
        onSuccess: (data) => {
          handleSuccess('Hero section updated successfully!', toast);
          setSaving(false);
        },
        onError: (error) => {
          handleError(error, toast);
          setSaving(false);
        }
      }
    );
  };

  if (loading) {
    return <LoadingWrapper loading={loading} />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
          <p className="text-gray-600 mt-2">Customize the main hero section of your homepage</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchHeroSection} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Main Content */}
        <div className="space-y-6">
          {/* Greeting & Heading */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Main Heading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Greeting Text</label>
                <Input
                  placeholder="👋 Hello, I'm MMB Port"
                  value={heroData.greeting_text}
                  onChange={(e) => handleInputChange('greeting_text', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Main Heading Line 1</label>
                <Input
                  placeholder="I Create"
                  value={heroData.main_heading_line1}
                  onChange={(e) => handleInputChange('main_heading_line1', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Main Heading Line 2</label>
                <Input
                  placeholder="Digital Solutions"
                  value={heroData.main_heading_line2}
                  onChange={(e) => handleInputChange('main_heading_line2', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Main Heading Line 3</label>
                <Input
                  placeholder="That Convert"
                  value={heroData.main_heading_line3}
                  onChange={(e) => handleInputChange('main_heading_line3', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <Textarea
                  placeholder="Professional Portfolio Website"
                  value={heroData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="w-5 h-5" />
                Call to Action Button
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <Input
                  placeholder="Get Started"
                  value={heroData.cta_button_text}
                  onChange={(e) => handleInputChange('cta_button_text', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Button URL</label>
                <Input
                  placeholder="/contact"
                  value={heroData.cta_button_url}
                  onChange={(e) => handleInputChange('cta_button_url', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile & Stats */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Name</label>
                <Input
                  placeholder="Kuldeep Parjapati"
                  value={heroData.profile_name}
                  onChange={(e) => handleInputChange('profile_name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Profile Title</label>
                <Input
                  placeholder="Modern Web Solutions Expert"
                  value={heroData.profile_title}
                  onChange={(e) => handleInputChange('profile_title', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Logo Text</label>
                <Input
                  placeholder="MMB"
                  value={heroData.profile_logo_text}
                  onChange={(e) => handleInputChange('profile_logo_text', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Projects Count</label>
                  <Input
                    placeholder="50+"
                    value={heroData.stats.projects_count}
                    onChange={(e) => handleInputChange('stats.projects_count', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Projects Label</label>
                  <Input
                    placeholder="Projects"
                    value={heroData.stats.projects_label}
                    onChange={(e) => handleInputChange('stats.projects_label', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Satisfaction Rate</label>
                  <Input
                    placeholder="95%"
                    value={heroData.stats.satisfaction_rate}
                    onChange={(e) => handleInputChange('stats.satisfaction_rate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Satisfaction Label</label>
                  <Input
                    placeholder="Satisfaction"
                    value={heroData.stats.satisfaction_label}
                    onChange={(e) => handleInputChange('stats.satisfaction_label', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Years</label>
                  <Input
                    placeholder="3+"
                    value={heroData.stats.experience_years}
                    onChange={(e) => handleInputChange('stats.experience_years', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Label</label>
                  <Input
                    placeholder="Years"
                    value={heroData.stats.experience_label}
                    onChange={(e) => handleInputChange('stats.experience_label', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Preview */}
              <div className="space-y-4">
                <h1 className="text-lg text-gray-600 font-medium">
                  {heroData.greeting_text || "👋 Hello, I'm MMB Port"}
                </h1>
                
                <h2 className="text-4xl font-bold text-blue-600 leading-tight">
                  {heroData.main_heading_line1 || "I Create"}<br />
                  <span className="text-blue-800">{heroData.main_heading_line2 || "Digital Solutions"}</span><br />
                  {heroData.main_heading_line3 || "That Convert"}
                </h2>
                
                <p className="text-gray-600">
                  {heroData.subtitle || "Professional Portfolio Website"}
                </p>
                
                <Button className="bg-black text-white">
                  {heroData.cta_button_text || "Get Started"}
                </Button>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div>
                    <div className="text-2xl font-bold">{heroData.stats.projects_count || "50+"}</div>
                    <div className="text-xs text-gray-500">{heroData.stats.projects_label || "Projects"}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{heroData.stats.satisfaction_rate || "95%"}</div>
                    <div className="text-xs text-gray-500">{heroData.stats.satisfaction_label || "Satisfaction"}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{heroData.stats.experience_years || "3+"}</div>
                    <div className="text-xs text-gray-500">{heroData.stats.experience_label || "Years"}</div>
                  </div>
                </div>
              </div>

              {/* Right Preview - Profile Card */}
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-4">
                  {heroData.profile_logo_text || "MMB"}
                </div>
                <h3 className="text-xl font-bold">{heroData.profile_name || "Kuldeep Parjapati"}</h3>
                <p className="text-gray-600">{heroData.profile_title || "Modern Web Solutions Expert"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHeroSection;