import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Star, Globe, Layout, Palette, Code, PenTool, TrendingUp, Users, CheckCircle, Award, Target, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useSiteSettings } from '../context/SiteSettingsContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

const Home = () => {
  const navigate = useNavigate();
  const { siteSettings, getHeroImageUrl, getThemeColors } = useSiteSettings();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
        axios.get(`${API}/services`),
        axios.get(`${API}/projects`),
        axios.get(`${API}/testimonials`)
      ]);
      
      setServices(servicesRes.data);
      setProjects(projectsRes.data);
      setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Let's Solutions */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-lg text-gray-600 font-medium">
                    👋 Hello, I'm {siteSettings?.site_title || 'Kuldeep Parjapati'}
                  </h1>
                  
                  <h2 
                    className="text-6xl lg:text-7xl font-bold text-black leading-tight"
                    style={{ 
                      color: getThemeColors().primary
                    }}
                  >
                    I Create<br />
                    <span style={{ color: getThemeColors().secondary }}>Digital Solutions</span><br />
                    That Convert
                  </h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                    {siteSettings?.site_description || 'I design modern websites that convert visitors into customers'}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3"
                    onClick={() => navigate('/contact')}
                  >
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-black">50+</div>
                  <div className="text-sm text-gray-500 mt-1">Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">95%</div>
                  <div className="text-sm text-gray-500 mt-1">Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">3+</div>
                  <div className="text-sm text-gray-500 mt-1">Years</div>
                </div>
              </div>
            </div>

            {/* Right Content - Profile Card */}
            <div className="bg-gray-50 rounded-2xl p-8 relative">
              <div className="text-center space-y-6">
                {/* Enhanced 3D MMB Logo */}
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse shadow-2xl"></div>
                  <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold transform hover:scale-110 transition-transform duration-300 shadow-inner">
                    MMB
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
                  <div className="absolute top-1/2 -left-4 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-500"></div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-black">Kuldeep Parjapati</h3>
                  <p className="text-gray-600 font-medium">Modern Web Solutions Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-16 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold text-black mb-6">About Me</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  I'm a passionate web developer and designer with expertise in creating 
                  stunning, responsive websites that engage users and drive results. 
                  My focus is on combining creativity with functionality to deliver 
                  exceptional digital experiences.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Full-Stack Web Development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Responsive Design & UX/UI</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">E-commerce & WordPress Development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">SEO & Performance Optimization</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">12+</div>
                  <div className="text-sm text-gray-600">Clients</div>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-black">Technical Skills</h3>
              <div className="space-y-6">
                {[
                  { name: 'React & Next.js', level: 95 },
                  { name: 'Node.js & Express', level: 90 },
                  { name: 'MongoDB & Firebase', level: 85 },
                  { name: 'WordPress Development', level: 92 },
                  { name: 'UI/UX Design', level: 88 },
                  { name: 'SEO Optimization', level: 85 }
                ].map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">{skill.name}</span>
                      <span className="text-gray-500 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Services Section */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-6">My Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              I offer comprehensive web development and design services to help your business grow online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => {
              const icons = {
                Globe, Layout, Palette, Code, PenTool, TrendingUp
              };
              const IconComponent = icons[service.icon] || Globe;
              
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8 space-y-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-black">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{service.description}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-lg font-bold text-blue-600 mb-4">{service.price}</div>
                      <Button 
                      className="w-full bg-black hover:bg-gray-800 text-sm"
                      onClick={() => navigate('/services')}
                    >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ready to Start Your Project */}
      <section className="py-12 px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-300 mb-6">
            Let's discuss how I can help bring your vision to life with modern web solutions
          </p>
          <Button 
            className="bg-white text-black hover:bg-gray-100 px-8"
            onClick={() => navigate('/contact')}
          >
            Let's Work Together
          </Button>
        </div>
      </section>

      {/* My Portfolio Section */}
      <section className="py-16 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-6">My Portfolio</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Here are some of my recent work and successful projects in creating 
              digital solutions and web experiences
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-sm">
              {['All', 'E-commerce', 'Websites', 'Web Apps', 'UI Design'].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === filter ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project, index) => (
              <Card key={project.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{project.category}</Badge>
                      <button 
                        onClick={() => window.open(project.live_url, '_blank')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-black">{project.title}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-black text-black hover:bg-black hover:text-white"
              onClick={() => navigate('/portfolio')}
            >
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-6">Client Testimonials</h2>
            <p className="text-gray-600 text-lg">
              Don't just take my word for it. Here's what my clients say about working with me.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="p-6 shadow-lg border-0">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-black text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-500">{testimonial.position}</div>
                      <div className="text-xs text-blue-600">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Let's Work Together */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-bold text-black">Let's Work Together</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ready to bring your ideas to life? I'm here to help you create something amazing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="text-center space-y-4 p-8 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-black">Get in Touch</h3>
                <p className="text-gray-600 text-sm">
                  Ready to start a conversation? Let's discuss your project requirements.
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                  onClick={() => navigate('/contact')}
                >
                  Get in Touch
                </Button>
              </div>
              
              <div className="text-center space-y-4 p-8 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-black">Start Your Project</h3>
                <p className="text-gray-600 text-sm">
                  Have a specific project in mind? Let's create something amazing together.
                </p>
                <Button 
                  variant="outline" 
                  className="border-black text-black hover:bg-black hover:text-white px-6"
                  onClick={() => window.location.href = 'mailto:contact@mmb.com'}
                >
                  Get Started Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;