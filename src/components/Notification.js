import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Notification = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'info':
      default:
        return 'border-blue-500';
    }
  };

  return (
    <div className={`notification ${notification.type} ${getBorderColor()} animate-slide-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-secondary-900">
            {notification.message}
          </p>
          <p className="text-xs text-secondary-500 mt-1">
            {notification.timestamp.toLocaleTimeString()}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onRemove(notification.id)}
            className="inline-flex text-secondary-400 hover:text-secondary-600 focus:outline-none focus:text-secondary-600 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
