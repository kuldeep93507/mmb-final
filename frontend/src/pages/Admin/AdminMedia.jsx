import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { Upload, Image, Palette, Save, Trash2, Eye, FileImage, AlertCircle, CheckCircle, X, Link } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}` : '';

const AdminMedia = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mediaData, setMediaData] = useState({
    logo: '',
    hero_image: '',
    about_image: '',
    favicon: ''
  });

  const [previewFiles, setPreviewFiles] = useState({});
  const [dragActive, setDragActive] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    lastUpdated: null
  });

  const [urlInputs, setUrlInputs] = useState({
    logo: '',
    hero_image: '',
    about_image: '',
    favicon: ''
  });

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(`${API}/api/admin/media-settings`, config);
      if (response.data) {
        setMediaData(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch media data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const files = Object.values(data).filter(url => url);
    setStats({
      totalFiles: files.length,
      totalSize: files.length * 0.5, // Estimated size in MB
      lastUpdated: new Date().toLocaleDateString()
    });
  };

  const validateFile = (file, type) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    
    if (type === 'favicon') {
      allowedTypes.push('image/x-icon', 'image/vnd.microsoft.icon');
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload an image file.' };
    }

    return { valid: true };
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file, type);
    if (!validation.valid) {
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewFiles(prev => ({
        ...prev,
        [type]: {
          file,
          preview: event.target.result,
          name: file.name,
          size: file.size
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      const validation = validateFile(file, type);
      if (!validation.valid) {
        toast({
          title: "Error",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewFiles(prev => ({
          ...prev,
          [type]: {
            file,
            preview: event.target.result,
            name: file.name,
            size: file.size
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleUpload = async (type) => {
    const fileData = previewFiles[type];
    if (!fileData) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    
    try {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('type', type);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [type]: percentCompleted }));
        }
      };

      const response = await axios.post(`${API}/api/admin/upload-media`, formData, config);
      
      setMediaData(prev => ({
        ...prev,
        [type]: response.data.url
      }));

      setPreviewFiles(prev => ({
        ...prev,
        [type]: null
      }));

      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      calculateStats({ ...mediaData, [type]: response.data.url });

      toast({
        title: "Success",
        description: `${type.replace('_', ' ')} uploaded successfully`
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle structured error response from backend
      let errorMessage = "Upload failed";
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'object' && detail.message) {
          errorMessage = detail.message;
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    }
  };

  const handleRemove = async (type) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`${API}/api/admin/media/${type}`, config);
      
      setMediaData(prev => ({
        ...prev,
        [type]: ''
      }));

      calculateStats({ ...mediaData, [type]: '' });

      toast({
        title: "Success",
        description: `${type.replace('_', ' ')} removed successfully`
      });

    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to remove media",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const updateImageFromUrl = async (type, url) => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.put(`${API}/api/admin/media-settings`, {
        [type]: url
      }, config);

      if (response.data) {
        setMediaData(prev => ({ ...prev, [type]: url }));
        setUrlInputs(prev => ({ ...prev, [type]: '' }));
        toast({
          title: "Success",
          description: `${type.replace('_', ' ')} updated successfully from URL`
        });
        fetchMediaData();
      }
    } catch (error) {
      console.error('Error updating image from URL:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update image from URL",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const MediaCard = ({ type, title, description, currentUrl, recommended }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Image className="h-5 w-5 mr-2" />
            {title}
          </div>
          {currentUrl && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Active</span>
            </div>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-blue-600">{recommended}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image */}
        {currentUrl && (
          <div>
            <Label className="text-sm font-medium">Current {title}</Label>
            <div className="mt-2 p-4 border rounded-lg bg-gray-50">
              <img 
                src={currentUrl} 
                alt={title}
                className="max-h-32 max-w-full object-contain mx-auto rounded"
              />
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentUrl, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Full
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(type)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Drag & Drop Upload Area */}
        <div>
          <Label className="text-sm font-medium">Upload New {title}</Label>
          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive[type] 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={(e) => handleDrag(e, type)}
            onDragLeave={(e) => handleDrag(e, type)}
            onDragOver={(e) => handleDrag(e, type)}
            onDrop={(e) => handleDrop(e, type)}
          >
            <FileImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your image here, or
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, type)}
              className="hidden"
              id={`${type}-upload`}
            />
            <Label
              htmlFor={`${type}-upload`}
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Label>
            <p className="text-xs text-gray-500 mt-2">
              Max size: 5MB • Formats: JPG, PNG, WebP, SVG
            </p>
          </div>
        </div>

        {/* URL Input Section */}
        <div>
          <Label className="text-sm font-medium">Or Use Image URL</Label>
          <div className="mt-2 flex space-x-2">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInputs[type]}
                onChange={(e) => setUrlInputs(prev => ({ ...prev, [type]: e.target.value }))}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => updateImageFromUrl(type, urlInputs[type])}
              disabled={uploading || !urlInputs[type].trim()}
              size="sm"
            >
              <Link className="h-4 w-4 mr-2" />
              Use URL
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter a direct image URL to use as {title.toLowerCase()}
          </p>
        </div>

        {/* Preview & Upload */}
        {previewFiles[type] && (
          <div>
            <Label className="text-sm font-medium">Preview</Label>
            <div className="mt-2 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileImage className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{previewFiles[type].name}</span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(previewFiles[type].size)})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewFiles(prev => ({ ...prev, [type]: null }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <img 
                src={previewFiles[type].preview} 
                alt="Preview"
                className="max-h-32 max-w-full object-contain mx-auto rounded mb-3"
              />
              
              {uploadProgress[type] > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress[type]}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress[type]}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => handleUpload(type)}
                disabled={uploading}
                className="w-full"
              >
                {uploading && uploadProgress[type] > 0 ? (
                  <>Uploading... {uploadProgress[type]}%</>
                ) : uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {title}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600 mt-1">Manage logos, images, and other media assets with drag & drop</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileImage className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">~{stats.totalSize} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lastUpdated || 'Never'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MediaCard
          type="logo"
          title="Website Logo"
          description="Main logo displayed in header and footer"
          recommended="Recommended: PNG/SVG, 200x60px"
          currentUrl={mediaData.logo}
        />

        <MediaCard
          type="favicon"
          title="Favicon"
          description="Small icon displayed in browser tab"
          recommended="Recommended: ICO/PNG, 32x32px"
          currentUrl={mediaData.favicon}
        />

        <MediaCard
          type="hero_image"
          title="Hero Section Image"
          description="Main background image for homepage hero section"
          recommended="Recommended: JPG/PNG, 1920x1080px"
          currentUrl={mediaData.hero_image}
        />

        <MediaCard
          type="about_image"
          title="About Section Image"
          description="Profile image for about section"
          recommended="Recommended: JPG/PNG, 400x400px"
          currentUrl={mediaData.about_image}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Media Guidelines & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Supported Formats
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  JPEG/JPG - Best for photos
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  PNG - Best for logos with transparency
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  WebP - Modern format, smaller size
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  SVG - Vector graphics, scalable
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                File Requirements
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Maximum file size: 5MB</li>
                <li>• Minimum resolution: 100x100px</li>
                <li>• Aspect ratio: Maintain original</li>
                <li>• Color space: RGB recommended</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Upload className="h-4 w-4 mr-2 text-blue-600" />
                Upload Methods
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Drag & drop files directly</li>
                <li>• Click to browse and select</li>
                <li>• Real-time upload progress</li>
                <li>• Instant preview before upload</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMedia;