import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Database, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from './Button';
import Input from './Input';

const SettingsPage = () => {
  const { state, addNotification } = useApp();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    autoSave: true,
    itemsPerPage: 10,
    theme: 'primary'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    addNotification('Settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
            <Settings className="mr-3 text-primary-600" size={28} />
            Settings
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage your application preferences and configuration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center mb-6">
              <User className="mr-3 text-primary-600" size={24} />
              <h2 className="text-lg font-semibold text-secondary-900">Profile Settings</h2>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={state.user?.name || 'Admin User'}
                disabled
                helperText="Contact administrator to change name"
              />
              
              <Input
                label="Email Address"
                value={state.user?.email || 'admin@bod.com'}
                disabled
                helperText="Contact administrator to change email"
              />
              
              <Input
                label="Role"
                value={state.user?.role || 'admin'}
                disabled
                helperText="User role and permissions"
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Bell className="mr-3 text-primary-600" size={24} />
              <h2 className="text-lg font-semibold text-secondary-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900">Push Notifications</h3>
                  <p className="text-sm text-secondary-600">Receive notifications for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900">Email Updates</h3>
                  <p className="text-sm text-secondary-600">Receive email notifications for system updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailUpdates}
                    onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Palette className="mr-3 text-primary-600" size={24} />
              <h2 className="text-lg font-semibold text-secondary-900">Display Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900">Dark Mode</h3>
                  <p className="text-sm text-secondary-600">Switch to dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Items Per Page
                </label>
                <select
                  value={settings.itemsPerPage}
                  onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={5}>5 items</option>
                  <option value={10}>10 items</option>
                  <option value={20}>20 items</option>
                  <option value={50}>50 items</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Info */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Database className="mr-3 text-primary-600" size={24} />
              <h3 className="text-lg font-semibold text-secondary-900">System Info</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Last Updated</span>
                <span className="font-medium">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Status</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Shield className="mr-3 text-primary-600" size={24} />
              <h3 className="text-lg font-semibold text-secondary-900">Security</h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
                <div className="text-sm font-medium text-secondary-900">Change Password</div>
                <div className="text-xs text-secondary-600">Update your account password</div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
                <div className="text-sm font-medium text-secondary-900">Two-Factor Auth</div>
                <div className="text-xs text-secondary-600">Enable 2FA for extra security</div>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="card">
            <Button
              onClick={handleSaveSettings}
              className="w-full flex items-center justify-center"
            >
              <Save size={20} className="mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
