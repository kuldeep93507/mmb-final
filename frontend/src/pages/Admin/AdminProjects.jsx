import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { Plus, Edit, Trash2, ExternalLink, Github } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { handleError, handleSuccess, apiCall, handleValidationErrors } from '../../utils/errorHandler';
import { LoadingWrapper, CardLoading, ButtonLoading, EmptyState } from '../../components/ui/loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    tags: '',
    technologies: '',
    live_url: '',
    github_url: '',
    featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    await apiCall(
      async () => {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        const response = await axios.get(`${API}/admin/projects`, config);
        return response.data;
      },
      {
        onStart: () => setLoading(true),
        onSuccess: (data) => {
          setProjects(data);
          setLoading(false);
        },
        onError: (error) => {
          handleError(error, 'Failed to load projects');
          setLoading(false);
        },
        showSuccessToast: false
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    
    if (Object.keys(errors).length > 0) {
      handleError(new Error('Validation failed'), 'Please fill in all required fields');
      return;
    }

    await apiCall(
      async () => {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        const projectData = {
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()),
          technologies: formData.technologies.split(',').map(t => t.trim())
        };

        if (editProject) {
          await axios.put(`${API}/admin/projects/${editProject.id}`, projectData, config);
          return 'updated';
        } else {
          await axios.post(`${API}/admin/projects`, projectData, config);
          return 'created';
        }
      },
      {
        onStart: () => setLoading(true),
        onSuccess: async (result) => {
          handleSuccess(`Project ${result} successfully`);
          await fetchProjects();
          resetForm();
          setIsDialogOpen(false);
          setLoading(false);
        },
        onError: (error) => {
          handleError(error, 'Failed to save project');
          setLoading(false);
        }
      }
    );
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      tags: project.tags.join(', '),
      technologies: project.technologies.join(', '),
      live_url: project.live_url,
      github_url: project.github_url || '',
      featured: project.featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await apiCall(
        async () => {
          const config = token ? {
            headers: { Authorization: `Bearer ${token}` }
          } : {};
          
          await axios.delete(`${API}/admin/projects/${projectId}`, config);
        },
        {
          onStart: () => setLoading(true),
          onSuccess: async () => {
            handleSuccess('Project deleted successfully');
            await fetchProjects();
            setLoading(false);
          },
          onError: (error) => {
            handleError(error, 'Failed to delete project');
            setLoading(false);
          }
        }
      );
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category: '',
      tags: '',
      technologies: '',
      live_url: '',
      github_url: '',
      featured: false
    });
    setEditProject(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <LoadingWrapper
      loading={loading}
      onRetry={fetchProjects}
      empty={projects.length === 0}
      emptyComponent={
        <EmptyState
          title="No projects found"
          message="Start by creating your first project to showcase your work."
          action={
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Project
            </Button>
          }
        />
      }
    >
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Web Application"
                    required
                  />
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

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input
                    id="live_url"
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL (Optional)</Label>
                  <Input
                    id="github_url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma separated)</Label>
                <Textarea
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Textarea
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Web App, Dashboard, Analytics"
                  rows={2}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <ButtonLoading loading={loading} type="submit">
                  {editProject ? 'Update Project' : 'Create Project'}
                </ButtonLoading>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <div className="flex space-x-2">
                  {project.featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                  <Badge variant="outline">{project.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{project.description}</p>
              
              <div className="space-y-2">
                <span className="font-medium text-sm">Technologies:</span>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.technologies.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(project)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(project.live_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      </div>
    </LoadingWrapper>
  );
};

export default AdminProjects;