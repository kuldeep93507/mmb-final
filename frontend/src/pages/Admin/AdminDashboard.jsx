import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { 
  BarChart3, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  Mail,
  TrendingUp,
  Eye,
  Clock,
  Plus,
  Activity,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess, apiCall } from '../../utils/errorHandler';
import { LoadingWrapper, StatsLoading, PageLoading } from '../../components/ui/loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token, admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    await apiCall(
      async () => {
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        const response = await axios.get(`${API}/admin/stats`, config);
        return response.data;
      },
      {
        onStart: () => setLoading(true),
        onSuccess: (data) => {
          setStats(data);
          setLoading(false);
        },
        onError: (error) => {
          handleError(error, 'Failed to load dashboard statistics');
          setLoading(false);
        },
        showSuccessToast: false
      }
    );
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new portfolio project',
      icon: FolderOpen,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => navigate('/admin/projects')
    },
    {
      title: 'Write Blog Post',
      description: 'Create a new blog article',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => navigate('/admin/blogs')
    },
    {
      title: 'Add Testimonial',
      description: 'Add client testimonial',
      icon: MessageSquare,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => navigate('/admin/testimonials')
    },
    {
      title: 'Manage Media',
      description: 'Upload and organize files',
      icon: Activity,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => navigate('/admin/media')
    }
  ];



  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.total_projects || 0,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Services',
      value: stats?.total_services || 0,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Testimonials',
      value: stats?.total_testimonials || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Blog Posts',
      value: `${stats?.published_blogs || 0}/${stats?.total_blogs || 0}`,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Contact Inquiries',
      value: stats?.total_contacts || 0,
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Unread Messages',
      value: stats?.unread_contacts || 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: stats?.unread_contacts > 0 ? 'Action needed' : 'All clear',
      changeType: stats?.unread_contacts > 0 ? 'warning' : 'positive'
    }
  ];

  return (
    <LoadingWrapper
      loading={loading}
      loadingComponent={<PageLoading message="Loading dashboard..." />}
      onRetry={fetchDashboardStats}
    >
      <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getCurrentTime()}, {admin?.name || 'Admin'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Welcome back to your MMB Admin Panel. Here's what's happening today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-blue-100 text-sm">Today's Date</p>
                <p className="text-white font-semibold">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : stat.changeType === 'warning' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-24 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all duration-200 border-2 hover:border-transparent ${action.color} hover:text-white group`}
                  onClick={action.action}
                >
                  <IconComponent className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs opacity-70">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Recent Contact Inquiries</span>
              </div>
              <Badge variant="outline">{stats?.recent_contacts?.length || 0} new</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recent_contacts && stats.recent_contacts.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_contacts.slice(0, 4).map((contact) => (
                  <div key={contact.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{contact.name}</h4>
                        {!contact.read && (
                          <Badge variant="destructive" className="text-xs px-2 py-0">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                      <p className="text-sm text-gray-500 truncate">{contact.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => navigate('/admin/contacts')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All Contacts
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent contacts</p>
                <p className="text-sm text-gray-400">New inquiries will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Website Performance</span>
                  <span className="text-sm text-green-600 font-medium">Excellent</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                  <span className="text-sm text-blue-600 font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Security Score</span>
                  <span className="text-sm text-green-600 font-medium">High</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">All systems operational</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </LoadingWrapper>
  );
};

export default AdminDashboard;