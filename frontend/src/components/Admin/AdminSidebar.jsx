import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  Mail,
  User,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      title: 'Services',
      path: '/admin/services',
      icon: Briefcase,
      badge: null
    },
    {
      title: 'Projects',
      path: '/admin/projects',
      icon: FolderOpen,
      badge: null
    },
    {
      title: 'Testimonials',
      path: '/admin/testimonials',
      icon: MessageSquare,
      badge: null
    },
    {
      title: 'Blog Posts',
      path: '/admin/blogs',
      icon: FileText,
      badge: 'Draft'
    },
    {
      title: 'Contact Inquiries',
      path: '/admin/contacts',
      icon: Mail,
      badge: '3'
    },
    {
      title: 'Media Manager',
      path: '/admin/media',
      icon: Image,
      badge: null
    },
    {
      title: 'Profile Settings',
      path: '/admin/profile',
      icon: User,
      badge: null
    }
  ];

  const isActive = (path) => location.pathname === path;

  const SidebarItem = ({ item }) => {
    const IconComponent = item.icon;
    const active = isActive(item.path);

    const content = (
      <Link
        to={item.path}
        className={`group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative ${
          active
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
        )}
        <div className={`flex items-center justify-center w-6 h-6 ${
          active ? 'text-white' : 'text-gray-400 group-hover:text-white'
        }`}>
          <IconComponent className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <>
            <span className="font-medium truncate">{item.title}</span>
            {item.badge && (
              <Badge 
                variant={active ? "secondary" : "outline"} 
                className={`ml-auto text-xs px-2 py-0 ${
                  active ? 'bg-white/20 text-white border-white/30' : 'bg-gray-700 text-gray-300 border-gray-600'
                }`}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{item.title}</p>
              {item.badge && <Badge variant="outline" className="ml-2">{item.badge}</Badge>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white min-h-screen transition-all duration-300 flex flex-col relative`}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-8 z-10 w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 p-0"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-300" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-gray-300" />
        )}
      </Button>

      {/* Logo */}
      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-700 transition-all duration-300`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MMB Admin
              </span>
              <span className="text-xs text-gray-400">Management Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'py-4 px-2' : 'py-6 px-4'} transition-all duration-300`}>
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="px-3 mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main Menu
              </h3>
            </div>
          )}
          
          {menuItems.slice(0, 4).map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
          
          {!isCollapsed && (
            <div className="px-3 mt-8 mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Content
              </h3>
            </div>
          )}
          
          {menuItems.slice(4, 7).map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
          
          {!isCollapsed && (
            <div className="px-3 mt-8 mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Settings
              </h3>
            </div>
          )}
          
          {menuItems.slice(7).map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-gray-700 transition-all duration-300`}>
        {!isCollapsed ? (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-white">System Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Performance</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-400">Excellent</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Storage</span>
                <span className="text-xs text-blue-400">68% used</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-blue-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;