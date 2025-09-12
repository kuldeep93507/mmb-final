import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editService, setEditService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    features: '',
    icon: 'Globe',
    active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(`${API}/admin/services`, config);
      setServices(response.data);
    } catch (error) {
      console.error('Fetch services error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const serviceData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim())
      };

      if (editService) {
        await axios.put(`${API}/admin/services/${editService.id}`, serviceData, config);
        toast({
          title: "Success",
          description: "Service updated successfully"
        });
      } else {
        await axios.post(`${API}/admin/services`, serviceData, config);
        toast({
          title: "Success",
          description: "Service created successfully"
        });
      }

      // Refresh the services list immediately
      await fetchServices();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Service save error:', error);
      toast({
        title: "Error", 
        description: error.response?.data?.detail || "Failed to save service",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      duration: service.duration,
      features: service.features.join(', '),
      icon: service.icon,
      active: service.active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      try {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        await axios.delete(`${API}/admin/services/${serviceId}`, config);
        toast({
          title: "Success",
          description: "Service deleted successfully"
        });
        // Refresh the services list immediately
        await fetchServices();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to delete service",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      features: '',
      icon: 'Globe',
      active: true
    });
    setEditService(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Globe">Globe</option>
                    <option value="Layout">Layout</option>
                    <option value="Palette">Palette</option>
                    <option value="Code">Code</option>
                    <option value="PenTool">PenTool</option>
                    <option value="TrendingUp">TrendingUp</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Starting from ₹15,000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="7-14 days"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Responsive Design, Fast Loading, SEO Optimized"
                  rows={2}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                <Label htmlFor="active">Active Service</Label>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={submitLoading}>
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editService ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editService ? 'Update Service' : 'Create Service'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <div className="flex space-x-2">
                  <Badge variant={service.active ? "default" : "secondary"}>
                    {service.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{service.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Price:</span>
                  <span className="text-blue-600">{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Duration:</span>
                  <span>{service.duration}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-medium text-sm">Features:</span>
                <div className="flex flex-wrap gap-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {service.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(service)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found. Create your first service!</p>
        </div>
      )}
    </div>
  );
};

export default AdminServices;