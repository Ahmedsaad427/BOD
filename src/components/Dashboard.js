import React, { useEffect, useState } from 'react';
import { FileText, Users, MessageSquare, TrendingUp, Plus, Eye, BarChart2, PieChart as PieChartIcon, LineChart, Loader2, Settings, MessageSquare as MessageSquareText } from 'lucide-react';
// Using window.location for navigation as a fallback
import { useApp, ACTIONS } from '../context/AppContext';
import DataTable from './DataTable';
import DashboardCharts from './charts/DashboardCharts';

const Dashboard = () => {
  const { state, api, dispatch, addNotification } = useApp();

  useEffect(() => {
    // Fetch initial data
    api.fetchPosts();
    api.fetchUsers();
    api.fetchComments();
  }, []);

  const stats = [
    {
      name: 'Total Posts',
      value: state.posts.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Users',
      value: state.users.length,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Total Comments',
      value: state.comments.length,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Active Sessions',
      value: '1,234',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+3%',
      changeType: 'positive'
    }
  ];

  const recentPosts = state.posts.slice(0, 5);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const handleManageUsers = () => {
    // Redirect to users management page
    window.location.href = '/users';
  };

  const handleViewComments = () => {
    // Redirect to comments page
    window.location.href = '/comments';
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        
        {/* Tabs */}
        <div className="flex space-x-1 mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'overview'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'analytics'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          stat.changeType === 'positive' 
                            ? 'bg-green-500 text-white dark:bg-green-700 dark:text-white' 
                            : 'bg-red-500 text-white dark:bg-red-700 dark:text-white'
                        }`}>
                          {stat.changeType === 'positive' ? '↑' : '↓'} {stat.change}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-300">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => dispatch({ type: ACTIONS.OPEN_CREATE_MODAL })}
                    className="w-full flex items-center space-x-3 p-3 text-left bg-primary-50 dark:bg-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus size={20} className="text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Create New Post
                    </span>
                  </button>
                  <button 
                    onClick={handleManageUsers}
                    className="w-full flex items-center space-x-3 p-3 text-left bg-primary-50 dark:bg-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Settings size={20} className="text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Manage Users
                    </span>
                  </button>
                  <button 
                    onClick={handleViewComments}
                    className="w-full flex items-center space-x-3 p-3 text-left bg-primary-50 dark:bg-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <MessageSquareText size={20} className="text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      View Comments
                    </span>
                  </button>

                </div>
              </div>

              {/* System Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">API Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Database</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Last Sync</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <FileText size={20} className="text-primary-600 dark:text-primary-300" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {post.body}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              User {post.userId}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Post #{post.id}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors" aria-label="View post">
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Posts Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage and organize your posts data with advanced filtering and search capabilities.
              </p>
            </div>
            <div className="p-6">
              <DataTable />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Analytics Dashboard</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-primary-600 dark:text-primary-400 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading analytics data...</p>
            </div>
          ) : (
            <DashboardCharts />
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
