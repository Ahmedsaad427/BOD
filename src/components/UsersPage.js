import React, { useEffect } from 'react';
import { Users, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UsersPage = () => {
  const { state, api } = useApp();

  useEffect(() => {
    // Fetch users when component mounts
    if (state.users.length === 0) {
      api.fetchUsers();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
            <Users className="mr-3 text-primary-600" size={28} />
            Users Management
          </h1>
          <p className="text-secondary-600 mt-1">
            View and manage user information from the JSONPlaceholder API.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">{state.users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Mail size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Email Addresses</p>
              <p className="text-2xl font-bold text-secondary-900">{state.users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Globe size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Websites</p>
              <p className="text-2xl font-bold text-secondary-900">{state.users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <MapPin size={24} className="text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Locations</p>
              <p className="text-2xl font-bold text-secondary-900">{state.users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.users.map((user) => (
          <div key={user.id} className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-secondary-900 truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-secondary-600 mb-2">@{user.username}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-secondary-600">
                    <Mail size={16} className="mr-2 text-secondary-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-secondary-600">
                    <Phone size={16} className="mr-2 text-secondary-400" />
                    <span>{user.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-secondary-600">
                    <Globe size={16} className="mr-2 text-secondary-400" />
                    <span className="truncate">{user.website}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-secondary-600">
                    <MapPin size={16} className="mr-2 text-secondary-400" />
                    <span className="truncate">
                      {user.address.city}, {user.address.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary-500">Company</span>
                <span className="text-sm font-medium text-secondary-900">
                  {user.company.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
