import React, { useState } from 'react';
import Dashboard from './Dashboard';
import PostsPage from './PostsPage';
import UsersPage from './UsersPage';
import CommentsPage from './CommentsPage';
import SettingsPage from './SettingsPage';

const MainContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'posts':
        return <PostsPage />;
      case 'users':
        return <UsersPage />;
      case 'comments':
        return <CommentsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Main content */}
      <div className="lg:ml-64">
        {/* Page content */}
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

// Export the setCurrentPage function so it can be used by the Sidebar
export { MainContent };
export const usePageNavigation = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return { currentPage, navigateTo };
};
