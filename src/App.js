import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import LoadingSpinner from './components/LoadingSpinner';

// Import Google Fonts
const loadFonts = () => {
  const link1 = document.createElement('link');
  link1.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
  link1.rel = 'stylesheet';
  
  const link2 = document.createElement('link');
  link2.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
  link2.rel = 'stylesheet';
  
  document.head.appendChild(link1);
  document.head.appendChild(link2);
};

// Main App Component (wrapped with AppProvider)
const AppContent = () => {
  // Load fonts on component mount
  useEffect(() => {
    loadFonts();
  }, []);
  
  const { state } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Show loading spinner while checking authentication
  if (state.loading && !state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    );
  }

  // Show login/signup forms if not authenticated
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 font-display">
              BOD Dashboard
            </h1>
            <p className="text-secondary-500 dark:text-gray-400 mt-2">
              Professional Business Operations Dashboard
            </p>
          </div>
          {authMode === 'login' ? (
            <LoginForm onSwitchToSignUp={() => setAuthMode('signup')} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  // Show main dashboard if authenticated
  return <Layout />;
};

// Root App Component
const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
