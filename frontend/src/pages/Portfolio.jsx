import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ExternalLink, Github, Filter } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(projects.map(project => project.category))];
  
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline">My Portfolio</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Showcasing My Recent Work
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A collection of successful projects that demonstrate my expertise in web development, 
            design, and digital solutions.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-md">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter by:</span>
              <div className="flex space-x-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} 
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{project.category}</Badge>
                    <div className="flex space-x-2">
                      <a 
                        href={project.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                      </a>
                      <button 
                        onClick={() => window.open(project.github_url || '#', '_blank')}
                        className="p-2 bg-gray-100 hover:bg-purple-100 rounded-full transition-colors"
                      >
                        <Github className="h-4 w-4 text-gray-600 hover:text-purple-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    asChild 
                    className="w-full group-hover:bg-blue-700"
                  >
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      View Live Project
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Project Statistics
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">{projects.length}</div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length - 1}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-orange-600 mb-2">12+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Technologies I Work With
            </h2>
            <p className="text-gray-600 text-lg">
              Modern tools and frameworks for building exceptional web experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['React', 'Next.js', 'Node.js', 'MongoDB', 'WordPress', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'PHP', 'MySQL', 'Firebase', 'Stripe'].map((tech, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-medium text-gray-900">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Have a Project in Mind?
          </h2>
          <p className="text-xl text-blue-100">
            Let's create something amazing together. Get in touch to discuss your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">Start Your Project</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/services">View Services</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;