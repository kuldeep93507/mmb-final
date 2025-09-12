import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  Plus,
  Edit,
  Trash2,
  Gift,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  DollarSign,
  Percent,
  Save,
  X
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import { handleError, handleSuccess, apiCall } from '../../utils/errorHandler';
import { LoadingWrapper } from '../../components/ui/loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta_text: 'Get Offer',
    cta_url: '',
    discount_percentage: '',
    discount_amount: '',
    active: true,
    starts_at: '',
    ends_at: '',
    priority: 1,
    background_color: '#ff6b6b',
    text_color: '#ffffff'
  });

  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersResponse, settingsResponse] = await Promise.all([
        axios.get(`${API}/admin/offers`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/admin/site-settings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setOffers(offersResponse.data);
      setSiteSettings(settingsResponse.data);
    } catch (error) {
      handleError(error, 'Failed to load offers data');
    } finally {
      setLoading(false);
    }
  };

  const toggleGlobalOffers = async () => {
    try {
      const newStatus = !siteSettings.offers_enabled;
      await axios.put(`${API}/admin/site-settings`, {
        ...siteSettings,
        offers_enabled: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSiteSettings(prev => ({ ...prev, offers_enabled: newStatus }));
      handleSuccess(`Offers ${newStatus ? 'enabled' : 'disabled'} globally`);
    } catch (error) {
      handleError(error, 'Failed to update global offer settings');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedOffer) {
        // Update existing offer
        await axios.put(`${API}/admin/offers/${selectedOffer.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        handleSuccess('Offer updated successfully');
      } else {
        // Create new offer
        await axios.post(`${API}/admin/offers`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        handleSuccess('Offer created successfully');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      handleError(error, `Failed to ${selectedOffer ? 'update' : 'create'} offer`);
    }
  };

  const deleteOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      await axios.delete(`${API}/admin/offers/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleSuccess('Offer deleted successfully');
      fetchData();
    } catch (error) {
      handleError(error, 'Failed to delete offer');
    }
  };

  const toggleOffer = async (offerId) => {
    try {
      await axios.patch(`${API}/admin/offers/${offerId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleSuccess('Offer status updated');
      fetchData();
    } catch (error) {
      handleError(error, 'Failed to toggle offer');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      cta_text: 'Get Offer',
      cta_url: '',
      discount_percentage: '',
      discount_amount: '',
      active: true,
      starts_at: '',
      ends_at: '',
      priority: 1,
      background_color: '#ff6b6b',
      text_color: '#ffffff'
    });
    setSelectedOffer(null);
    setShowCreateDialog(false);
  };

  const editOffer = (offer) => {
    setSelectedOffer(offer);
    setFormData({
      title: offer.title || '',
      subtitle: offer.subtitle || '',
      description: offer.description || '',
      cta_text: offer.cta_text || 'Get Offer',
      cta_url: offer.cta_url || '',
      discount_percentage: offer.discount_percentage || '',
      discount_amount: offer.discount_amount || '',
      active: offer.active !== undefined ? offer.active : true,
      starts_at: offer.starts_at ? offer.starts_at.split('T')[0] : '',
      ends_at: offer.ends_at ? offer.ends_at.split('T')[0] : '',
      priority: offer.priority || 1,
      background_color: offer.background_color || '#ff6b6b',
      text_color: offer.text_color || '#ffffff'
    });
    setShowCreateDialog(true);
  };

  if (loading) {
    return <LoadingWrapper />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offers & Promotions</h1>
          <p className="text-gray-600 mt-1">Manage promotional offers and campaign banners</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Global Toggle */}
          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border">
            <span className="text-sm font-medium">Global Offers</span>
            <Switch
              checked={siteSettings?.offers_enabled || false}
              onCheckedChange={toggleGlobalOffers}
            />
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedOffer ? 'Edit Offer' : 'Create New Offer'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Diwali Special Offer"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      placeholder="e.g., Get 50% OFF"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detailed description of the offer..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cta_text">Button Text</Label>
                    <Input
                      id="cta_text"
                      value={formData.cta_text}
                      onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                      placeholder="Get Offer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cta_url">Button URL</Label>
                    <Input
                      id="cta_url"
                      value={formData.cta_url}
                      onChange={(e) => setFormData({...formData, cta_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="discount_percentage">Discount %</Label>
                    <Input
                      id="discount_percentage"
                      type="number"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                      placeholder="50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="discount_amount">Discount Amount</Label>
                    <Input
                      id="discount_amount"
                      value={formData.discount_amount}
                      onChange={(e) => setFormData({...formData, discount_amount: e.target.value})}
                      placeholder="₹5000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="starts_at">Start Date</Label>
                    <Input
                      id="starts_at"
                      type="date"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ends_at">End Date</Label>
                    <Input
                      id="ends_at"
                      type="date"
                      value={formData.ends_at}
                      onChange={(e) => setFormData({...formData, ends_at: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="background_color">Background Color</Label>
                    <Input
                      id="background_color"
                      type="color"
                      value={formData.background_color}
                      onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="text_color">Text Color</Label>
                    <Input
                      id="text_color"
                      type="color"
                      value={formData.text_color}
                      onChange={(e) => setFormData({...formData, text_color: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                  />
                  <Label>Active</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {selectedOffer ? 'Update' : 'Create'} Offer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Offers List */}
      <div className="grid gap-4">
        {offers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Gift className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers created yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create your first promotional offer to start engaging customers
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Offer
              </Button>
            </CardContent>
          </Card>
        ) : (
          offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              <div 
                className="h-2"
                style={{ backgroundColor: offer.background_color }}
              ></div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">{offer.title}</h3>
                      <Badge variant={offer.active ? "default" : "secondary"}>
                        {offer.active ? 'Active' : 'Inactive'}
                      </Badge>
                      {offer.priority > 1 && (
                        <Badge variant="outline">Priority {offer.priority}</Badge>
                      )}
                    </div>
                    
                    {offer.subtitle && (
                      <p className="text-lg text-gray-600 mb-2">{offer.subtitle}</p>
                    )}
                    
                    {offer.description && (
                      <p className="text-gray-700 mb-3">{offer.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {offer.discount_percentage && (
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          {offer.discount_percentage}% OFF
                        </div>
                      )}
                      
                      {offer.discount_amount && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {offer.discount_amount}
                        </div>
                      )}
                      
                      {offer.starts_at && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(offer.starts_at).toLocaleDateString()}
                        </div>
                      )}
                      
                      {offer.ends_at && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Ends {new Date(offer.ends_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOffer(offer.id)}
                    >
                      {offer.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editOffer(offer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOffer(offer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOffers;