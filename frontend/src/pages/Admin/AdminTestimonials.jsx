import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  User, 
  Building, 
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTestimonial, setEditTestimonial] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [imagePreview, setImagePreview] = useState('');
  const { toast } = useToast();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    text: '',
    rating: 5,
    image: '',
    approved: true
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm, filterStatus, filterRating]);

  const fetchTestimonials = async () => {
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(`${API}/admin/testimonials`, config);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Fetch testimonials error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(testimonial => 
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(testimonial => 
        filterStatus === 'approved' ? testimonial.approved : !testimonial.approved
      );
    }

    // Rating filter
    if (filterRating !== 'all') {
      filtered = filtered.filter(testimonial => 
        testimonial.rating === parseInt(filterRating)
      );
    }

    setFilteredTestimonials(filtered);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Client name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.position.trim()) {
      errors.position = 'Position is required';
    }

    if (!formData.company.trim()) {
      errors.company = 'Company is required';
    }

    if (!formData.text.trim()) {
      errors.text = 'Testimonial text is required';
    } else if (formData.text.length < 10) {
      errors.text = 'Testimonial must be at least 10 characters';
    } else if (formData.text.length > 500) {
      errors.text = 'Testimonial must be less than 500 characters';
    }

    if (!formData.image.trim()) {
      errors.image = 'Profile image URL is required';
    } else if (!isValidUrl(formData.image)) {
      errors.image = 'Please enter a valid image URL';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    setSubmitLoading(true);
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};

      if (editTestimonial) {
        await axios.put(`${API}/admin/testimonials/${editTestimonial.id}`, formData, config);
        toast({
          title: "Success",
          description: "Testimonial updated successfully"
        });
      } else {
        await axios.post(`${API}/admin/testimonials`, formData, config);
        toast({
          title: "Success",
          description: "Testimonial created successfully"
        });
      }

      await fetchTestimonials();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Testimonial save error:', error);
      toast({
        title: "Error", 
        description: error.response?.data?.detail || "Failed to save testimonial",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      text: testimonial.text,
      rating: testimonial.rating,
      image: testimonial.image,
      approved: testimonial.approved
    });
    setImagePreview(testimonial.image);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async (testimonialId) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setLoading(true);
      try {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        await axios.delete(`${API}/admin/testimonials/${testimonialId}`, config);
        toast({
          title: "Success",
          description: "Testimonial deleted successfully"
        });
        await fetchTestimonials();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to delete testimonial",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleApproval = async (testimonial) => {
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      await axios.put(`${API}/admin/testimonials/${testimonial.id}`, {
        ...testimonial,
        approved: !testimonial.approved
      }, config);
      
      toast({
        title: "Success",
        description: `Testimonial ${!testimonial.approved ? 'approved' : 'unapproved'} successfully`
      });
      
      await fetchTestimonials();
    } catch (error) {
      console.error('Toggle approval error:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      company: '',
      text: '',
      rating: 5,
      image: '',
      approved: true
    });
    setEditTestimonial(null);
    setFormErrors({});
    setImagePreview('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update image preview
    if (name === 'image' && isValidUrl(value)) {
      setImagePreview(value);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating: parseInt(rating) }));
    if (formErrors.rating) {
      setFormErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const getStatusStats = () => {
    const approved = testimonials.filter(t => t.approved).length;
    const pending = testimonials.filter(t => !t.approved).length;
    const avgRating = testimonials.length > 0 
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : 0;
    
    return { approved, pending, avgRating, total: testimonials.length };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-1">Manage client testimonials and reviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {editTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={formErrors.name ? 'border-red-500' : ''}
                      placeholder="Enter client name"
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={formErrors.position ? 'border-red-500' : ''}
                      placeholder="e.g., CEO, Manager"
                    />
                    {formErrors.position && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.position}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={formErrors.company ? 'border-red-500' : ''}
                      placeholder="Enter company name"
                    />
                    {formErrors.company && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.company}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating *</Label>
                    <Select value={formData.rating.toString()} onValueChange={handleRatingChange}>
                      <SelectTrigger className={formErrors.rating ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(rating => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.rating && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.rating}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Testimonial Content
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="text">Testimonial Text *</Label>
                  <Textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    rows={4}
                    className={formErrors.text ? 'border-red-500' : ''}
                    placeholder="Enter the testimonial text..."
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      {formErrors.text && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.text}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formData.text.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Profile Image
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Image URL *</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className={formErrors.image ? 'border-red-500' : ''}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formErrors.image && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.image}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                          onError={() => setImagePreview('')}
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="approved">Approved for Display</Label>
                    <p className="text-sm text-gray-500">
                      When enabled, this testimonial will be visible on the website
                    </p>
                  </div>
                  <Switch
                    id="approved"
                    checked={formData.approved}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, approved: checked }))
                    }
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button type="submit" disabled={submitLoading} className="flex-1">
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editTestimonial ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {editTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitLoading}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {[5, 4, 3, 2, 1].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Star{rating !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    {testimonial.approved && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {testimonial.position}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant={testimonial.approved ? "default" : "secondary"}
                    className={testimonial.approved ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                  >
                    {testimonial.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < testimonial.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">({testimonial.rating}/5)</span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700 text-sm italic line-clamp-3">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(testimonial)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant={testimonial.approved ? "secondary" : "default"}
                  onClick={() => toggleApproval(testimonial)}
                  className="flex-1"
                >
                  {testimonial.approved ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterRating !== 'all' 
                ? 'No testimonials found' 
                : 'No testimonials yet'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' || filterRating !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first testimonial to get started'
              }
            </p>
            {(!searchTerm && filterStatus === 'all' && filterRating === 'all') && (
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Testimonial
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTestimonials;