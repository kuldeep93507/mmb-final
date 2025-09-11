import React, { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const { profile, loading } = useProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to backend
      await axios.post(`${BACKEND_URL}/api/contact`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project_type: formData.projectType,
        budget: formData.budget,
        message: formData.message,
        timeline: formData.timeline
      });

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your inquiry. I'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        message: '',
        timeline: ''
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error Sending Message",
        description: "There was an error sending your message. Please try again or contact directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!profile?.whatsapp) return;
    
    const message = `Hi MMB! I'm interested in your web development services.\n\nProject Type: ${formData.projectType || 'Not specified'}\nBudget: ${formData.budget || 'Not specified'}\nTimeline: ${formData.timeline || 'Not specified'}\n\nMessage: ${formData.message || 'I would like to discuss my project requirements.'}`;
    const whatsappUrl = `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const projectTypes = [
    'Website Development',
    'Landing Page Design',
    'E-commerce Store',
    'WordPress Website',
    'UX/UI Design',
    'Web Application',
    'Other'
  ];

  const budgetRanges = [
    'Under ₹10,000',
    '₹10,000 - ₹25,000',
    '₹25,000 - ₹50,000',
    '₹50,000 - ₹1,00,000',
    'Above ₹1,00,000'
  ];

  const timelines = [
    'ASAP (Rush Job)',
    '1-2 Weeks',
    '3-4 Weeks',
    '1-2 Months',
    '3+ Months'
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline">Get In Touch</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Let's Work Together
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Ready to bring your vision to life? I'm here to help you create amazing web experiences. 
            Let's discuss your project requirements.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a 
                        href={`mailto:${profile?.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {profile?.email}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        I'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <a 
                        href={`tel:${profile?.phone}`}
                        className="text-green-600 hover:text-green-700"
                      >
                        {profile?.phone}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Available 9 AM - 6 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">{profile?.address}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Serving clients worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6 text-center space-y-4">
                  <MessageCircle className="h-12 w-12 mx-auto" />
                  <h3 className="text-xl font-semibold">Quick Response on WhatsApp</h3>
                  <p className="text-green-100">
                    Get instant replies to your queries
                  </p>
                  <Button 
                    onClick={handleWhatsAppClick}
                    variant="secondary"
                    className="w-full"
                  >
                    Chat on WhatsApp
                  </Button>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Response Times</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">WhatsApp</span>
                      <span className="text-green-600 font-medium">Within 2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className="text-blue-600 font-medium">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone</span>
                      <span className="text-purple-600 font-medium">Business hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Project Inquiry Form
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and I'll get back to you with a detailed proposal.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type *</Label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select project type</option>
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map((range) => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Timeline</Label>
                        <select
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select timeline</option>
                          {timelines.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Project Details *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe your project requirements, goals, and any specific features you need..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handleWhatsAppClick}
                        className="flex-1"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp Instead
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">How long does a project take?</h3>
                <p className="text-gray-600 text-sm">
                  Project timelines vary based on complexity. Simple websites take 1-2 weeks, 
                  while complex applications can take 1-3 months.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Do you provide ongoing support?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! I provide 30 days of free support after project completion, 
                  and ongoing maintenance packages are available.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">What's included in the project cost?</h3>
                <p className="text-gray-600 text-sm">
                  All costs include design, development, testing, deployment, 
                  and 30 days of support. Hosting is additional.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Can you work with my existing team?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely! I collaborate well with designers, marketers, 
                  and other developers to deliver the best results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Happens Next?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900">Initial Contact</h3>
              <p className="text-gray-600 text-sm">
                You send your project details and I respond within 24 hours.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full mx-auto flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900">Discovery Call</h3>
              <p className="text-gray-600 text-sm">
                We discuss requirements, timeline, and budget in detail.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full mx-auto flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900">Proposal & Agreement</h3>
              <p className="text-gray-600 text-sm">
                You receive a detailed proposal and we finalize the agreement.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full mx-auto flex items-center justify-center text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900">Project Kickoff</h3>
              <p className="text-gray-600 text-sm">
                We start working on your project with regular updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;