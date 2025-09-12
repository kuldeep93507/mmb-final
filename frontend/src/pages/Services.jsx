import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Globe, Layout, Palette, Code, PenTool, TrendingUp, ArrowRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      Globe, Layout, Palette, Code, PenTool, TrendingUp
    };
    return icons[iconName] || Globe;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "Understanding your requirements, goals, and target audience to create a comprehensive project plan."
    },
    {
      step: "02", 
      title: "Design & Wireframes",
      description: "Creating wireframes and visual designs that align with your brand and user experience goals."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "Building your solution with clean, efficient code and thorough testing across devices and browsers."
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Deploying your project and providing ongoing support to ensure optimal performance."
    }
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline">My Services</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Professional Web Development & Design Services
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Comprehensive digital solutions to help your business grow online with modern, 
            responsive websites and applications.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = getIcon(service.icon);
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-8 space-y-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                        <Badge variant="outline">{service.duration}</Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">What's Included:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button asChild className="w-full group-hover:bg-blue-700">
                        <Link to="/contact">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline">My Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How I Work
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A proven process that ensures quality results and client satisfaction from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((process, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center text-xl font-bold">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{process.title}</h3>
                  <p className="text-gray-600">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline">Why Choose MMB</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Your Success Is My Priority
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  With years of experience and a passion for creating exceptional digital experiences, 
                  I'm committed to delivering solutions that drive real results for your business.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Modern Technologies</h3>
                    <p className="text-gray-600">Using latest frameworks and tools for optimal performance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Responsive Design</h3>
                    <p className="text-gray-600">Perfect experience across all devices and screen sizes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">SEO Optimized</h3>
                    <p className="text-gray-600">Built-in SEO best practices for better search rankings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Ongoing Support</h3>
                    <p className="text-gray-600">Continuous support and maintenance after project completion</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold">
                    MMB
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    Professional Web Development Services
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow">
                      <div className="text-2xl font-bold text-blue-600">15+</div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow">
                      <div className="text-2xl font-bold text-purple-600">12+</div>
                      <div className="text-xs text-gray-600">Clients</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow">
                      <div className="text-2xl font-bold text-green-600">3+</div>
                      <div className="text-xs text-gray-600">Years</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100">
            Let's discuss your requirements and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Get Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;