import React, { useEffect, useState } from "react";
import { FileText, Plus, Search, Filter, BarChart3, Table } from "lucide-react";
import { useApp, ACTIONS } from "../context/AppContext";
import DataTable from "./DataTable";
import PostsChart from "./charts/PostsChart";

const PostsPage = () => {
  const { state, api, dispatch, addNotification } = useApp();
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'charts'

  useEffect(() => {
    // Fetch posts when component mounts
    if (state.posts.length === 0) {
      api.fetchPosts();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 items-center">
            <FileText className="mr-3 text-primary-600" size={28} />
            Posts Management
          </h1>
          <p className="text-secondary-600 dark:text-gray-400 mt-1">
            Manage and organize your posts data with advanced filtering and
            search capabilities.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-secondary-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === "table"
                  ? "bg-white dark:bg-gray-600 text-secondary-900 dark:text-white shadow-sm"
                  : "text-secondary-600 dark:text-gray-400 hover:text-secondary-900 dark:hover:text-white"
              }`}
            >
              <Table size={16} className="mr-2" />
              Table
            </button>
            <button
              onClick={() => setViewMode("charts")}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === "charts"
                  ? "bg-white dark:bg-gray-600 text-secondary-900 dark:text-white shadow-sm"
                  : "text-secondary-600 dark:text-gray-400 hover:text-secondary-900 dark:hover:text-white"
              }`}
            >
              <BarChart3 size={16} className="mr-2" />
              Charts
            </button>
          </div>

          <button
            onClick={() => dispatch({ type: ACTIONS.OPEN_CREATE_MODAL })}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Post
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FileText
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">
                Total Posts
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {state.posts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Search
                size={24}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">
                Filtered Results
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {
                  state.posts.filter(
                    (post) =>
                      post.title
                        .toLowerCase()
                        .includes(state.searchTerm.toLowerCase()) ||
                      post.body
                        .toLowerCase()
                        .includes(state.searchTerm.toLowerCase())
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Filter
                size={24}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">
                Search Term
              </p>
              <p className="text-lg font-bold text-secondary-900 dark:text-white">
                {state.searchTerm || "None"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "table" ? (
        <DataTable />
      ) : (
        <PostsChart posts={state.posts} users={state.users} />
      )}
    </div>
  );
};

export default PostsPage;
