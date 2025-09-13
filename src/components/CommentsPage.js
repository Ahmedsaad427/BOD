import React, { useEffect } from 'react';
import { MessageSquare, Mail, User, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CommentsPage = () => {
  const { state, api } = useApp();

  useEffect(() => {
    // Fetch comments when component mounts
    if (state.comments.length === 0) {
      api.fetchComments();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
            <MessageSquare className="mr-3 text-primary-600" size={28} />
            Comments Management
          </h1>
          <p className="text-secondary-600 mt-1">
            View and manage comments from the JSONPlaceholder API.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Comments</p>
              <p className="text-2xl font-bold text-secondary-900">{state.comments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <User size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Unique Authors</p>
              <p className="text-2xl font-bold text-secondary-900">
                {new Set(state.comments.map(c => c.email)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Mail size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Email Addresses</p>
              <p className="text-2xl font-bold text-secondary-900">
                {new Set(state.comments.map(c => c.email)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Calendar size={24} className="text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Recent Activity</p>
              <p className="text-2xl font-bold text-secondary-900">
                {state.comments.slice(0, 10).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {state.comments.slice(0, 20).map((comment) => (
          <div key={comment.id} className="card hover:shadow-lg transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-primary-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-semibold text-secondary-900">
                    {comment.name}
                  </h4>
                  <span className="text-xs text-secondary-500">•</span>
                  <span className="text-xs text-secondary-500">{comment.email}</span>
                </div>
                
                <p className="text-sm text-secondary-700 mb-3 leading-relaxed">
                  {comment.body}
                </p>
                
                <div className="flex items-center justify-between text-xs text-secondary-500">
                  <span>Post ID: {comment.postId}</span>
                  <span>Comment ID: {comment.id}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {state.comments.length > 20 && (
        <div className="text-center">
          <button className="btn-secondary">
            Load More Comments ({state.comments.length - 20} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
