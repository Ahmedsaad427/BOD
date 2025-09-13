import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('dashboardUsers');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@bod.com',
        password: 'password',
        role: 'admin',
        avatar: null,
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Save users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardUsers', JSON.stringify(users));
  }, [users]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const roles = {
    admin: {
      name: 'Administrator',
      permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
      color: 'red'
    },
    editor: {
      name: 'Editor',
      permissions: ['read', 'write'],
      color: 'blue'
    },
    viewer: {
      name: 'Viewer',
      permissions: ['read'],
      color: 'green'
    },
    moderator: {
      name: 'Moderator',
      permissions: ['read', 'write', 'moderate'],
      color: 'purple'
    }
  };

  const registerUser = (userData) => {
    // Check if user with email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Name, email, and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate password strength (at least 6 characters)
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create new user object
    const newUser = {
      id: Date.now(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password, // In a real app, this should be hashed
      role: userData.role || 'viewer',
      avatar: userData.avatar || null,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    // Update users state
    setUsers(prev => [...prev, newUser]);
    
    // Log the user in after registration
    setCurrentUser(newUser);
    
    return newUser;
  };

  const loginUser = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password && u.isActive);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Logout if current user is deleted
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    const userRole = roles[currentUser.role];
    return userRole ? userRole.permissions.includes(permission) : false;
  };

  const getRoleInfo = (role) => {
    return roles[role] || roles.viewer;
  };

  const value = {
    users,
    currentUser,
    roles,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    hasPermission,
    getRoleInfo,
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <UserContext.Provider value={value}>
      {children}
      {/* Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`px-4 py-2 rounded-md shadow-lg text-white ${
              notification.type === 'error' ? 'bg-red-500' : 
              notification.type === 'success' ? 'bg-green-500' : 
              'bg-blue-500'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </UserContext.Provider>
  );
};
