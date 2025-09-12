import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Mail, Phone, Clock, Eye, Trash2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(`${API}/admin/contacts`, config);
      setContacts(response.data);
    } catch (error) {
      console.error('Fetch contacts error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (contactId) => {
    try {
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      await axios.put(`${API}/admin/contacts/${contactId}/read`, {}, config);
      setContacts(contacts.map(contact => 
        contact.id === contactId ? { ...contact, read: true } : contact
      ));
      toast({
        title: "Success",
        description: "Contact marked as read"
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      toast({
        title: "Error",
        description: "Failed to mark contact as read",
        variant: "destructive"
      });
    }
  };

  const deleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        await axios.delete(`${API}/admin/contacts/${contactId}`, config);
        setContacts(contacts.filter(contact => contact.id !== contactId));
        toast({
          title: "Success",
          description: "Contact deleted successfully"
        });
      } catch (error) {
        console.error('Delete contact error:', error);
        toast({
          title: "Error",
          description: "Failed to delete contact",
          variant: "destructive"
        });
      }
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
        <div className="flex space-x-4">
          <Badge variant="outline">
            Total: {contacts.length}
          </Badge>
          <Badge variant="destructive">
            Unread: {contacts.filter(c => !c.read).length}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className={`hover:shadow-lg transition-shadow ${!contact.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  {!contact.read && (
                    <Badge variant="destructive" className="text-xs">New</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Email:</span>
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Phone:</span>
                      <a href={`tel:${contact.phone}`} className="text-green-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Project:</span>
                    <Badge variant="outline">{contact.project_type}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {contact.budget && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Budget:</span>
                      <Badge variant="secondary">{contact.budget}</Badge>
                    </div>
                  )}
                  {contact.timeline && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Timeline:</span>
                      <Badge variant="secondary">{contact.timeline}</Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Message:</span>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm">{contact.message}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                {!contact.read && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsRead(contact.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Mark as Read
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.project_type} Inquiry&body=Hi ${contact.name},%0D%0A%0D%0AThank you for your inquiry about ${contact.project_type}.%0D%0A%0D%0ABest regards,%0D%0AMMB`, '_blank')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => deleteContact(contact.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No contact inquiries found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;