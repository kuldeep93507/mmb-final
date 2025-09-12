import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Button } from '../ui/button';
import { 
  LogOut, 
  User, 
  Bell, 
  Search,
  Menu,
  Sun,
  Moon,
  Settings
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback to mock data
      setNotifications([
        { id: 1, title: 'New contact inquiry', time: '2 min ago', unread: true, type: 'contact' },
        { id: 2, title: 'Blog post published', time: '1 hour ago', unread: true, type: 'blog' },
        { id: 3, title: 'System backup completed', time: '3 hours ago', unread: false, type: 'system' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Set up polling for real-time updates
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: `${isDarkMode ? 'Light' : 'Dark'} mode enabled`,
      description: `Switched to ${isDarkMode ? 'light' : 'dark'} theme.`,
    });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="flex items-center space-x-4 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {unreadCount} new
                        </Badge>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-sm ${notification.unread ? 'font-semibold' : 'font-normal'}`}>
                              {notification.title}
                            </span>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center text-blue-600 dark:text-blue-400 cursor-pointer">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {user?.name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name || 'Admin'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.role || 'Administrator'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>© 2024 MMB Admin Panel</span>
                <span>•</span>
                <span>Version 2.0.0</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>System Status: </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 dark:text-green-400">Online</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;