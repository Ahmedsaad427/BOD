import React from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

const Table = ({ 
  data = [], 
  columns = [], 
  onSort, 
  sortBy, 
  sortOrder,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}) => {
  const handleSort = (column) => {
    if (onSort && column.sortable !== false) {
      const newOrder = sortBy === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
      onSort(column.key, newOrder);
    }
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key] || '-';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-secondary-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <p className="text-secondary-600 text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-secondary-100' : ''
                  }`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable !== false && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          size={12} 
                          className={`${
                            sortBy === column.key && sortOrder === 'asc' 
                              ? 'text-primary-600' 
                              : 'text-secondary-400'
                          }`} 
                        />
                        <ChevronDown 
                          size={12} 
                          className={`${
                            sortBy === column.key && sortOrder === 'desc' 
                              ? 'text-primary-600' 
                              : 'text-secondary-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {data.map((item, index) => (
              <tr 
                key={item.id || index} 
                className="table-row"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={column.key || colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900"
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
