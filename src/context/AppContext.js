import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

// Initial state
const initialState = {
  // Authentication
  isAuthenticated: false,
  user: null,
  
  // Data management
  posts: [],
  users: [],
  comments: [],
  
  // UI state
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  searchTerm: '',
  sortBy: 'id',
  sortOrder: 'asc',
  
  // Modal states
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedItem: null,
  
  // Notifications
  notifications: []
};

// Action types
export const ACTIONS = {
  // Authentication
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  
  // Data fetching
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_POSTS: 'SET_POSTS',
  SET_USERS: 'SET_USERS',
  SET_COMMENTS: 'SET_COMMENTS',
  
  // Pagination and search
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SORT: 'SET_SORT',
  
  // Modal management
  OPEN_CREATE_MODAL: 'OPEN_CREATE_MODAL',
  CLOSE_CREATE_MODAL: 'CLOSE_CREATE_MODAL',
  OPEN_EDIT_MODAL: 'OPEN_EDIT_MODAL',
  CLOSE_EDIT_MODAL: 'CLOSE_EDIT_MODAL',
  OPEN_DELETE_MODAL: 'OPEN_DELETE_MODAL',
  CLOSE_DELETE_MODAL: 'CLOSE_DELETE_MODAL',
  SET_SELECTED_ITEM: 'SET_SELECTED_ITEM',
  
  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // CRUD operations
  CREATE_POST: 'CREATE_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
      
    case ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
      
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ACTIONS.SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: null
      };
      
    case ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload
      };
      
    case ACTIONS.SET_COMMENTS:
      return {
        ...state,
        comments: action.payload
      };
      
    case ACTIONS.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
      
    case ACTIONS.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
        currentPage: 1
      };
      
    case ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder
      };
      
    case ACTIONS.OPEN_CREATE_MODAL:
      return {
        ...state,
        isCreateModalOpen: true,
        selectedItem: null
      };
      
    case ACTIONS.CLOSE_CREATE_MODAL:
      return {
        ...state,
        isCreateModalOpen: false,
        selectedItem: null
      };
      
    case ACTIONS.OPEN_EDIT_MODAL:
      return {
        ...state,
        isEditModalOpen: true,
        selectedItem: action.payload
      };
      
    case ACTIONS.CLOSE_EDIT_MODAL:
      return {
        ...state,
        isEditModalOpen: false,
        selectedItem: null
      };
      
    case ACTIONS.OPEN_DELETE_MODAL:
      return {
        ...state,
        isDeleteModalOpen: true,
        selectedItem: action.payload
      };
      
    case ACTIONS.CLOSE_DELETE_MODAL:
      return {
        ...state,
        isDeleteModalOpen: false,
        selectedItem: null
      };
      
    case ACTIONS.SET_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.payload
      };
      
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
      
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
      
    case ACTIONS.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
      
    case ACTIONS.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload.id ? action.payload : post
        )
      };
      
    case ACTIONS.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };
      
    default:
      return state;
  }
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({
        type: ACTIONS.LOGIN,
        payload: JSON.parse(user)
      });
    }
  }, []);

  // Notification functions
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: notification.id });
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  // API functions
  const api = {
    // Fetch posts from JSONPlaceholder
    fetchPosts: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        dispatch({ type: ACTIONS.SET_POSTS, payload: response.data });
        addNotification('Posts loaded successfully!', 'success');
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        addNotification('Failed to load posts', 'error');
      }
    },

    // Fetch users from JSONPlaceholder
    fetchUsers: async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        dispatch({ type: ACTIONS.SET_USERS, payload: response.data });
      } catch (error) {
        console.error('Error fetching users:', error);
        addNotification('Failed to load users', 'error');
      }
    },

    // Fetch comments from JSONPlaceholder
    fetchComments: async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
        dispatch({ type: ACTIONS.SET_COMMENTS, payload: response.data });
      } catch (error) {
        console.error('Error fetching comments:', error);
        addNotification('Failed to load comments', 'error');
      }
    },

    // Create a new post (simulated)
    createPost: async (postData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        
        // Simulate API call
        const newPost = {
          id: Date.now(), // Simple ID generation
          ...postData,
          userId: state.user?.id || 1
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        dispatch({ type: ACTIONS.CREATE_POST, payload: newPost });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        
        addNotification('Post created successfully!', 'success');
        return newPost;
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        addNotification('Failed to create post', 'error');
        throw error;
      }
    },

    // Update a post (simulated)
    updatePost: async (postId, postData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const updatedPost = { id: postId, ...postData };
        dispatch({ type: ACTIONS.UPDATE_POST, payload: updatedPost });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        
        addNotification('Post updated successfully!', 'success');
        return updatedPost;
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        addNotification('Failed to update post', 'error');
        throw error;
      }
    },

    // Delete a post (simulated)
    deletePost: async (postId) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        dispatch({ type: ACTIONS.DELETE_POST, payload: postId });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        
        addNotification('Post deleted successfully!', 'success');
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        addNotification('Failed to delete post', 'error');
        throw error;
      }
    }
  };

  // Authentication functions
  const login = (userData) => {
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: ACTIONS.LOGIN, payload: userData });
    addNotification('Login successful!', 'success');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: ACTIONS.LOGOUT });
    addNotification('Logged out successfully', 'info');
  };

  // Computed values
  const filteredPosts = state.posts.filter(post => 
    post.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aValue = a[state.sortBy];
    const bValue = b[state.sortBy];
    
    if (state.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedPosts = sortedPosts.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );

  const totalPages = Math.ceil(filteredPosts.length / state.itemsPerPage);

  const contextValue = {
    state,
    dispatch,
    api,
    login,
    logout,
    addNotification,
    removeNotification,
    filteredPosts,
    sortedPosts,
    paginatedPosts,
    totalPages
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
