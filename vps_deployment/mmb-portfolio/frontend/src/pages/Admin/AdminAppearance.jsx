import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Palette,
  Monitor,
  Navigation,
  Type,
  Eye,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import { handleError, handleSuccess, apiCall } from '../../utils/errorHandler';
import { LoadingWrapper } from '../../components/ui/loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminAppearance = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [mediaSettings, setMediaSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [siteResponse, mediaResponse] = await Promise.all([
        axios.get(`${API}/admin/site-settings`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/admin/media-settings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setSiteSettings(siteResponse.data);
      setMediaSettings(mediaResponse.data);
    } catch (error) {
      handleError(error, 'Failed to load appearance settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/site-settings`, siteSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleSuccess('Site settings saved successfully');
    } catch (error) {
      handleError(error, 'Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  const addNavLink = () => {
    const newLink = {
      label: 'New Link',
      url: '/',
      external: false,
      order: (siteSettings.nav_links?.length || 0) + 1
    };
    setSiteSettings(prev => ({
      ...prev,
      nav_links: [...(prev.nav_links || []), newLink]
    }));
  };

  const updateNavLink = (index, field, value) => {
    const newNavLinks = [...(siteSettings.nav_links || [])];
    newNavLinks[index] = { ...newNavLinks[index], [field]: value };
    setSiteSettings(prev => ({ ...prev, nav_links: newNavLinks }));
  };

  const removeNavLink = (index) => {
    const newNavLinks = [...(siteSettings.nav_links || [])];
    newNavLinks.splice(index, 1);
    setSiteSettings(prev => ({ ...prev, nav_links: newNavLinks }));
  };

  const addSocialLink = () => {
    const newLink = {
      platform: 'facebook',
      url: '',
      icon: 'facebook'
    };
    setSiteSettings(prev => ({
      ...prev,
      social_links: [...(prev.social_links || []), newLink]
    }));
  };

  const updateSocialLink = (index, field, value) => {
    const newSocialLinks = [...(siteSettings.social_links || [])];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setSiteSettings(prev => ({ ...prev, social_links: newSocialLinks }));
  };

  const removeSocialLink = (index) => {
    const newSocialLinks = [...(siteSettings.social_links || [])];
    newSocialLinks.splice(index, 1);
    setSiteSettings(prev => ({ ...prev, social_links: newSocialLinks }));
  };

  const getSocialIcon = (platform) => {
    const icons = {
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
      github: Github
    };
    return icons[platform] || ExternalLink;
  };

  if (loading) {
    return <LoadingWrapper />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appearance Settings</h1>
          <p className="text-gray-600 mt-1">Customize your site's look, colors, and branding</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          
          <Button onClick={saveSiteSettings} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors & Theme</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Site Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_title">Site Title</Label>
                  <Input
                    id="site_title"
                    value={siteSettings?.site_title || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, site_title: e.target.value }))}
                    placeholder="Your Site Title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="header_tagline">Header Tagline</Label>
                  <Input
                    id="header_tagline"
                    value={siteSettings?.header_tagline || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, header_tagline: e.target.value }))}
                    placeholder="Optional tagline for header"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={siteSettings?.site_description || ''}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, site_description: e.target.value }))}
                  placeholder="Brief description of your site"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="footer_text">Footer Text</Label>
                <Input
                  id="footer_text"
                  value={siteSettings?.footer_text || ''}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, footer_text: e.target.value }))}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={siteSettings?.contact_email || ''}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="contact@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={siteSettings?.contact_phone || ''}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  value={siteSettings?.whatsapp_number || ''}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors & Theme Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <Label htmlFor="primary_color" className="block mb-2">Primary Color</Label>
                  <div className="flex flex-col items-center space-y-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={siteSettings?.primary_color || '#3b82f6'}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="w-20 h-20 rounded-lg border-2"
                    />
                    <Input
                      value={siteSettings?.primary_color || '#3b82f6'}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                      placeholder="#3b82f6"
                      className="text-center"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Label htmlFor="secondary_color" className="block mb-2">Secondary Color</Label>
                  <div className="flex flex-col items-center space-y-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={siteSettings?.secondary_color || '#1e40af'}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                      className="w-20 h-20 rounded-lg border-2"
                    />
                    <Input
                      value={siteSettings?.secondary_color || '#1e40af'}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                      placeholder="#1e40af"
                      className="text-center"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Label htmlFor="accent_color" className="block mb-2">Accent Color</Label>
                  <div className="flex flex-col items-center space-y-2">
                    <Input
                      id="accent_color"
                      type="color"
                      value={siteSettings?.accent_color || '#ef4444'}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, accent_color: e.target.value }))}
                      className="w-20 h-20 rounded-lg border-2"
                    />
                    <Input
                      value={siteSettings?.accent_color || '#ef4444'}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, accent_color: e.target.value }))}
                      placeholder="#ef4444"
                      className="text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h4 className="font-medium mb-4">Color Preview</h4>
                <div className="space-y-3">
                  <div 
                    className="p-4 rounded text-white font-medium"
                    style={{ backgroundColor: siteSettings?.primary_color || '#3b82f6' }}
                  >
                    Primary Color Sample
                  </div>
                  <div 
                    className="p-4 rounded text-white font-medium"
                    style={{ backgroundColor: siteSettings?.secondary_color || '#1e40af' }}
                  >
                    Secondary Color Sample
                  </div>
                  <div 
                    className="p-4 rounded text-white font-medium"
                    style={{ backgroundColor: siteSettings?.accent_color || '#ef4444' }}
                  >
                    Accent Color Sample
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Navigation className="h-5 w-5 mr-2" />
                  Navigation Links
                </CardTitle>
                <Button onClick={addNavLink} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteSettings?.nav_links?.map((link, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <Input
                      value={link.label}
                      onChange={(e) => updateNavLink(index, 'label', e.target.value)}
                      placeholder="Link Label"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateNavLink(index, 'url', e.target.value)}
                      placeholder="/about"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={link.external}
                        onCheckedChange={(checked) => updateNavLink(index, 'external', checked)}
                      />
                      <Label className="text-sm">External</Label>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNavLink(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {(!siteSettings?.nav_links || siteSettings.nav_links.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No navigation links configured. Click "Add Link" to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Social Media Links</CardTitle>
                <Button onClick={addSocialLink} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteSettings?.social_links?.map((link, index) => {
                const IconComponent = getSocialIcon(link.platform);
                return (
                  <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="github">GitHub</option>
                      </select>
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              
              {(!siteSettings?.social_links || siteSettings.social_links.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No social links configured. Click "Add Social Link" to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAppearance;