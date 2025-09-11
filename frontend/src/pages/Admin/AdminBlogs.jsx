import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { 
  Plus, Edit, Trash2, Eye, Calendar, Search, Filter, 
  BookOpen, FileText, Clock, User, Tag, Image as ImageIcon,
  Save, X, Bold, Italic, Underline, List, Link2, Code
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBlog, setEditBlog] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [validationErrors, setValidationErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const contentRef = useRef(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: '',
    author: 'MMB',
    read_time: '',
    published: false
  });

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    categories: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, filterStatus, filterCategory]);

  const fetchBlogs = async () => {
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(`${API}/admin/blogs`, config);
      setBlogs(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Fetch blogs error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (blogsData) => {
    const published = blogsData.filter(blog => blog.published).length;
    const categories = [...new Set(blogsData.map(blog => blog.category))];
    
    setStats({
      total: blogsData.length,
      published,
      drafts: blogsData.length - published,
      categories
    });
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(blog => 
        filterStatus === 'published' ? blog.published : !blog.published
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === filterCategory);
    }

    setFilteredBlogs(filtered);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 20) {
      errors.excerpt = 'Excerpt must be at least 20 characters';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      errors.content = 'Content must be at least 100 characters';
    }
    
    if (!formData.image.trim()) {
      errors.image = 'Featured image URL is required';
    } else if (!isValidUrl(formData.image)) {
      errors.image = 'Please enter a valid image URL';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!formData.tags.trim()) {
      errors.tags = 'At least one tag is required';
    }
    
    if (!formData.read_time.trim()) {
      errors.read_time = 'Read time is required';
    }
    
    setValidationErrors(errors);
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

      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editBlog) {
        await axios.put(`${API}/admin/blogs/${editBlog.id}`, blogData, config);
        toast({
          title: "Success",
          description: "Blog post updated successfully"
        });
      } else {
        await axios.post(`${API}/admin/blogs`, blogData, config);
        toast({
          title: "Success",
          description: "Blog post created successfully"
        });
      }

      await fetchBlogs();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Blog save error:', error);
      toast({
        title: "Error", 
        description: error.response?.data?.detail || "Failed to save blog post",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      tags: blog.tags.join(', '),
      author: blog.author,
      read_time: blog.read_time,
      published: blog.published
    });
    setValidationErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setLoading(true);
      try {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        await axios.delete(`${API}/admin/blogs/${blogId}`, config);
        toast({
          title: "Success",
          description: "Blog post deleted successfully"
        });
        await fetchBlogs();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to delete blog post",
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
      excerpt: '',
      content: '',
      image: '',
      category: '',
      tags: '',
      author: 'MMB',
      read_time: '',
      published: false
    });
    setEditBlog(null);
    setValidationErrors({});
    setPreviewMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const insertTextAtCursor = (text) => {
    if (contentRef.current) {
      const start = contentRef.current.selectionStart;
      const end = contentRef.current.selectionEnd;
      const currentContent = formData.content;
      const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      // Set cursor position after inserted text
      setTimeout(() => {
        contentRef.current.selectionStart = start + text.length;
        contentRef.current.selectionEnd = start + text.length;
        contentRef.current.focus();
      }, 0);
    }
  };

  const formatText = (format) => {
    const formatMap = {
      bold: '**text**',
      italic: '*text*',
      underline: '<u>text</u>',
      h2: '<h2>Heading</h2>',
      h3: '<h3>Subheading</h3>',
      list: '<ul><li>Item 1</li><li>Item 2</li></ul>',
      link: '<a href="#">Link Text</a>',
      code: '<code>code</code>',
      paragraph: '<p>Paragraph text</p>'
    };
    
    insertTextAtCursor(formatMap[format] || format);
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
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>
                    {editBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                  </DialogTitle>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={previewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              {!previewMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Blog Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={validationErrors.title ? 'border-red-500' : ''}
                        placeholder="Enter blog title..."
                      />
                      {validationErrors.title && (
                        <p className="text-red-500 text-sm">{validationErrors.title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={validationErrors.category ? 'border-red-500' : ''}
                        placeholder="Web Development, AI, etc."
                      />
                      {validationErrors.category && (
                        <p className="text-red-500 text-sm">{validationErrors.category}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      className={validationErrors.excerpt ? 'border-red-500' : ''}
                      rows={3}
                      placeholder="Brief description of the blog post (min 20 characters)..."
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formData.excerpt.length} characters</span>
                      {validationErrors.excerpt && (
                        <span className="text-red-500">{validationErrors.excerpt}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content * (Rich Text Editor)</Label>
                    
                    {/* Rich Text Editor Toolbar */}
                    <div className="flex flex-wrap gap-2 p-2 border rounded-t-md bg-gray-50">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('bold')}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('italic')}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('underline')}
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                      <div className="border-l mx-2"></div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('h2')}
                      >
                        H2
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('h3')}
                      >
                        H3
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('paragraph')}
                      >
                        P
                      </Button>
                      <div className="border-l mx-2"></div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('link')}
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formatText('code')}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Textarea
                      ref={contentRef}
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      className={`rounded-t-none ${validationErrors.content ? 'border-red-500' : ''}`}
                      rows={12}
                      placeholder="Write your blog content here... You can use HTML tags for formatting."
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formData.content.length} characters</span>
                      {validationErrors.content && (
                        <span className="text-red-500">{validationErrors.content}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Featured Image URL *</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className={validationErrors.image ? 'border-red-500' : ''}
                      placeholder="https://example.com/image.jpg"
                    />
                    {validationErrors.image && (
                      <p className="text-red-500 text-sm">{validationErrors.image}</p>
                    )}
                    {formData.image && isValidUrl(formData.image) && (
                      <div className="mt-2">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-32 h-20 object-cover rounded border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Author name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="read_time">Read Time *</Label>
                      <Input
                        id="read_time"
                        name="read_time"
                        value={formData.read_time}
                        onChange={handleInputChange}
                        className={validationErrors.read_time ? 'border-red-500' : ''}
                        placeholder="5 min read"
                      />
                      {validationErrors.read_time && (
                        <p className="text-red-500 text-sm">{validationErrors.read_time}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags * (comma separated)</Label>
                    <Textarea
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className={validationErrors.tags ? 'border-red-500' : ''}
                      placeholder="React, JavaScript, Web Development, Tutorial"
                      rows={2}
                    />
                    {validationErrors.tags && (
                      <p className="text-red-500 text-sm">{validationErrors.tags}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.split(',').map((tag, index) => {
                        const trimmedTag = tag.trim();
                        return trimmedTag ? (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {trimmedTag}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <Label htmlFor="published">Publish Blog Post</Label>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t">
                    <Button type="submit" disabled={submitLoading}>
                      {submitLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {editBlog ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editBlog ? 'Update Blog Post' : 'Create Blog Post'}
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={submitLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                /* Preview Mode */
                <div className="space-y-6">
                  <div className="border rounded-lg p-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant={formData.published ? "default" : "secondary"}>
                          {formData.published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{formData.category}</Badge>
                        <span className="text-sm text-gray-500">{formData.read_time}</span>
                      </div>
                      
                      <h1 className="text-3xl font-bold text-gray-900">{formData.title || 'Blog Title'}</h1>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{formData.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formData.read_time}</span>
                        </div>
                      </div>
                      
                      {formData.image && (
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img 
                            src={formData.image} 
                            alt={formData.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <p className="text-lg text-gray-600 leading-relaxed">{formData.excerpt}</p>
                      
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
                      
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        {formData.tags.split(',').map((tag, index) => {
                          const trimmedTag = tag.trim();
                          return trimmedTag ? (
                            <Badge key={index} variant="secondary">
                              <Tag className="h-3 w-3 mr-1" />
                              {trimmedTag}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Edit className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search blogs by title, excerpt, category, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {stats.categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                  {blog.title}
                </CardTitle>
                <div className="flex space-x-1">
                  <Badge variant={blog.published ? "default" : "secondary"}>
                    {blog.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <Badge variant="outline">{blog.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{blog.read_time}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
                <div className="flex items-center space-x-1 ml-auto">
                  <User className="h-3 w-3" />
                  <span>{blog.author}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {blog.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{blog.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(blog)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(blog.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
              ? 'No blogs found' 
              : 'No blog posts yet'
            }
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first blog post to get started!'
            }
          </p>
          {(!searchTerm && filterStatus === 'all' && filterCategory === 'all') && (
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Blog Post
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;