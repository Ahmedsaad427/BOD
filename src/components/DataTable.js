import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Table from './Table';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import PostForm from './PostForm';
import { useApp, ACTIONS } from '../context/AppContext';

const DataTable = () => {
  const { 
    state, 
    dispatch, 
    api, 
    paginatedPosts, 
    totalPages,
    filteredPosts 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState(state.searchTerm);

  // Fetch data on component mount
  useEffect(() => {
    if (state.posts.length === 0) {
      api.fetchPosts();
    }
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: searchTerm });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, dispatch]);

  const handleSort = (sortBy, sortOrder) => {
    dispatch({ 
      type: ACTIONS.SET_SORT, 
      payload: { sortBy, sortOrder } 
    });
  };

  const handlePageChange = (page) => {
    dispatch({ type: ACTIONS.SET_CURRENT_PAGE, payload: page });
  };

  const handleCreatePost = () => {
    dispatch({ type: ACTIONS.OPEN_CREATE_MODAL });
  };

  const handleEditPost = (post) => {
    dispatch({ 
      type: ACTIONS.OPEN_EDIT_MODAL, 
      payload: post 
    });
  };

  const handleDeletePost = (post) => {
    dispatch({ 
      type: ACTIONS.OPEN_DELETE_MODAL, 
      payload: post 
    });
  };

  const handleViewPost = (post) => {
    // For now, just show an alert. In a real app, this would navigate to a detail page
    alert(`Viewing post: ${post.title}\n\n${post.body}`);
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-sm text-secondary-600">
          #{item.id}
        </span>
      )
    },
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium text-secondary-900 truncate">
            {item.title}
          </p>
        </div>
      )
    },
    {
      key: 'body',
      title: 'Content',
      sortable: false,
      render: (item) => (
        <div className="max-w-md">
          <p className="text-sm text-secondary-600 line-clamp-2">
            {item.body}
          </p>
        </div>
      )
    },
    {
      key: 'userId',
      title: 'Author',
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          User {item.userId}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      sortable: false,
      render: (item) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewPost(item)}
            className="p-1 text-secondary-400 hover:text-primary-600 transition-colors duration-200"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditPost(item)}
            className="p-1 text-secondary-400 hover:text-blue-600 transition-colors duration-200"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeletePost(item)}
            className="p-1 text-secondary-400 hover:text-red-600 transition-colors duration-200"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            state.currentPage === i
              ? 'bg-primary-600 text-white'
              : 'text-secondary-700 hover:bg-secondary-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-secondary-200">
        <div className="flex items-center text-sm text-secondary-700">
          <span>
            Showing {((state.currentPage - 1) * state.itemsPerPage) + 1} to{' '}
            {Math.min(state.currentPage * state.itemsPerPage, filteredPosts.length)} of{' '}
            {filteredPosts.length} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(state.currentPage - 1)}
            disabled={state.currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {pages}
          </div>
          
          <button
            onClick={() => handlePageChange(state.currentPage + 1)}
            disabled={state.currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Posts Management</h1>
          <p className="text-secondary-600">
            Manage and organize your posts data
          </p>
        </div>
        
        <Button onClick={handleCreatePost} className="w-full sm:w-auto">
          <Plus size={20} className="mr-2" />
          Add New Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-secondary-600">
              {filteredPosts.length} posts found
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Table
        data={paginatedPosts}
        columns={columns}
        onSort={handleSort}
        sortBy={state.sortBy}
        sortOrder={state.sortOrder}
        loading={state.loading}
        emptyMessage="No posts found. Try adjusting your search criteria."
      />

      {/* Pagination */}
      {totalPages > 1 && <Pagination />}

      {/* Modals */}
      <Modal
        isOpen={state.isCreateModalOpen}
        onClose={() => dispatch({ type: ACTIONS.CLOSE_CREATE_MODAL })}
        title="Create New Post"
        size="lg"
      >
        <PostForm mode="create" />
      </Modal>

      <Modal
        isOpen={state.isEditModalOpen}
        onClose={() => dispatch({ type: ACTIONS.CLOSE_EDIT_MODAL })}
        title="Edit Post"
        size="lg"
      >
        <PostForm mode="edit" post={state.selectedItem} />
      </Modal>

      <Modal
        isOpen={state.isDeleteModalOpen}
        onClose={() => dispatch({ type: ACTIONS.CLOSE_DELETE_MODAL })}
        title="Delete Post"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-sm text-secondary-600 mb-6">
            This action cannot be undone. This will permanently delete the post
            "{state.selectedItem?.title}".
          </p>
          <div className="flex space-x-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: ACTIONS.CLOSE_DELETE_MODAL })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await api.deletePost(state.selectedItem.id);
                  dispatch({ type: ACTIONS.CLOSE_DELETE_MODAL });
                } catch (error) {
                  console.error('Delete error:', error);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;
