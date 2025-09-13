import React, { useState, useEffect } from 'react';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { useApp, ACTIONS } from '../context/AppContext';

const PostForm = ({ mode = 'create', post = null }) => {
  const { api, dispatch, state } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && post) {
      setFormData({
        title: post.title || '',
        body: post.body || '',
        userId: post.userId || 1
      });
    }
  }, [mode, post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Content is required';
    } else if (formData.body.length < 10) {
      newErrors.body = 'Content must be at least 10 characters';
    } else if (formData.body.length > 1000) {
      newErrors.body = 'Content must be less than 1000 characters';
    }
    
    if (!formData.userId || formData.userId < 1 || formData.userId > 10) {
      newErrors.userId = 'Author ID must be between 1 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        await api.createPost(formData);
        dispatch({ type: ACTIONS.CLOSE_CREATE_MODAL });
      } else {
        await api.updatePost(post.id, formData);
        dispatch({ type: ACTIONS.CLOSE_EDIT_MODAL });
      }
      setFormData({ title: '', body: '', userId: 1 });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (mode === 'create') {
      dispatch({ type: ACTIONS.CLOSE_CREATE_MODAL });
    } else {
      dispatch({ type: ACTIONS.CLOSE_EDIT_MODAL });
    }
    setFormData({ title: '', body: '', userId: 1 });
    setErrors({});
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Title */}
        <Input
          label="Post Title"
          name="title"
          placeholder="Enter post title"
          value={formData.title}
          onChange={handleInputChange}
          error={errors.title}
          helperText="Choose a descriptive title for your post"
        />

        {/* Content */}
        <Textarea
          label="Post Content"
          name="body"
          placeholder="Write your post content here..."
          rows={6}
          value={formData.body}
          onChange={handleInputChange}
          error={errors.body}
          helperText="Write detailed content for your post"
        />

        {/* User ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Author ID"
            name="userId"
            type="number"
            min="1"
            max="10"
            value={formData.userId}
            onChange={handleInputChange}
            error={errors.userId}
            helperText="Select author ID (1-10)"
          />

          {/* Character count for body */}
          <div className="flex items-end">
            <div className="text-sm text-secondary-500">
              {formData.body.length} / 1000 characters
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {mode === 'create' ? 'Create Post' : 'Update Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
