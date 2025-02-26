import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  VideoCameraIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      path: '/chat',
      label: 'Chat',
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />
    },
    {
      path: '/video-chat',
      label: 'Video Chat',
      icon: <VideoCameraIcon className="w-6 h-6" />
    },
    {
      path: '/mood-tracker',
      label: 'Mood Tracker',
      icon: <ChartBarIcon className="w-6 h-6" />
    },
    {
      path: '/mood-history',
      label: 'Mood History',
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />
    },
    {
      path: '/parent-dashboard',
      label: 'Parent Dashboard',
      icon: <UserGroupIcon className="w-6 h-6" />
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-4 ${
                isActive(item.path)
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 