import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationContainer from './NotificationContainer';
import { useApp } from '../context/AppContext';
import Dashboard from './Dashboard';
import PostsPage from './PostsPage';
import UsersPage from './UsersPage';
import CommentsPage from './CommentsPage';
import SettingsPage from './SettingsPage';

// Create a context for page navigation
const PageContext = createContext();

export const usePageNavigation = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageNavigation must be used within a PageProvider');
  }
  return context;
};

const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

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
    <PageContext.Provider value={{ currentPage, navigateTo }}>
      {children}
      {renderPage()}
    </PageContext.Provider>
  );
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, removeNotification } = useApp();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Page content will be rendered by PageProvider */}
      </div>

      {/* Notifications */}
      <NotificationContainer 
        notifications={state.notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

const LayoutWithPages = () => {
  return (
    <PageProvider>
      <Layout />
    </PageProvider>
  );
};

export default LayoutWithPages;
