import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onMenuToggle }) => {
  const { state, addNotification } = useApp();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('user-menu');
      const button = document.querySelector('button[onClick*="user-menu"]');
      
      if (menu && !menu.contains(event.target) && button && !button.contains(event.target)) {
        menu.classList.add('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-secondary-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
        >
          <Menu size={20} className="text-secondary-600" />
        </button>
        
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
            Welcome back, {state.user?.name || 'User'}!
          </h2>
          <p className="text-sm text-secondary-500 dark:text-gray-400">
            Here's what's happening with your data today.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-secondary-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addNotification(`Searching for: "${searchTerm}"`, 'info');
              }
            }}
            className="pl-10 pr-4 py-2 w-64 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-secondary-600 dark:text-gray-400" />
          )}
        </button>

        {/* Notifications */}
        <button 
          onClick={() => addNotification('You have no new notifications', 'info')}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
        >
          <Bell size={20} className="text-secondary-600 dark:text-gray-400" />
          {state.notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {state.notifications.length}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative">
          <button 
            className="flex items-center space-x-3 focus:outline-none"
            onClick={() => document.getElementById('user-menu').classList.toggle('hidden')}
          >
            <div className="w-8 h-8 bg-primary-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {state.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {state.user?.email || 'user@example.com'}
              </p>
            </div>
          </button>
          
          {/* Dropdown menu */}
          <div 
            id="user-menu" 
            className="hidden absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Settings</p>
            </div>
            
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${isDarkMode ? 'bg-primary-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Click outside to close */}
        <div 
          id="dropdown-overlay" 
          className="hidden fixed inset-0 z-40"
          onClick={() => document.getElementById('user-menu').classList.add('hidden')}
        />
      </div>
    </header>
  );
};

export default Header;
