import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Star, Quote } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
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

  const additionalTestimonials = [
    {
      id: 4,
      name: "Kavita Patel",
      position: "HR Manager",
      company: "Hisar Job Place",
      rating: 5,
      text: "MMB created an excellent job portal for us. The platform is user-friendly and has helped connect many job seekers with employers. Great work!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Sanjay Verma",
      position: "Business Owner",
      company: "Local Business",
      rating: 5,
      text: "Professional service, excellent communication, and delivered exactly what we needed. MMB's expertise in web development is outstanding.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Meera Singh",
      position: "Marketing Director",
      company: "Tech Startup",
      rating: 5,
      text: "The landing page MMB designed for our campaign increased our conversion rate significantly. Highly recommend for any web project!",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const allTestimonials = [...testimonials, ...additionalTestimonials];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline">Client Testimonials</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            What My Clients Say
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Real feedback from satisfied clients who trusted me with their web development projects.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">5.0</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                Average Rating
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">12+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600">Projects Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="h-12 w-12 text-blue-600" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-600 italic text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.position}</div>
                      <div className="text-xs text-blue-600">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12 text-center space-y-6">
              <Quote className="h-16 w-16 mx-auto opacity-50" />
              <blockquote className="text-2xl md:text-3xl font-light leading-relaxed">
                "{testimonials[0]?.text || 'MMB creates exceptional digital experiences that truly represent your brand and connect with your audience.'}"
              </blockquote>
              <div className="space-y-2">
                <div className="font-semibold text-xl">{testimonials[0]?.name || 'Client Name'}</div>
                <div className="text-blue-100">{testimonials[0]?.position || 'Position'}, {testimonials[0]?.company || 'Company'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Amazing Clients
            </h2>
            <p className="text-gray-600 text-lg">
              Working with businesses across various industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {['Skillpay', 'Durga Chemical', 'Hisar Jobs', 'NeoGenie', 'Pensiya Farm', 'Krishi Ledger'].map((client, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold text-sm">
                    {client.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">{client}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Recognition */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Clients Choose MMB
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Clear Communication</h3>
              <p className="text-gray-600">
                Regular updates and transparent communication throughout the project lifecycle.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Timely Delivery</h3>
              <p className="text-gray-600">
                Committed to meeting deadlines without compromising on quality.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Quality Results</h3>
              <p className="text-gray-600">
                High-quality code, beautiful design, and exceptional user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Join My Happy Clients?
          </h2>
          <p className="text-xl text-blue-100">
            Let's discuss your project and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Project
            </a>
            <a 
              href="/portfolio"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View My Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;