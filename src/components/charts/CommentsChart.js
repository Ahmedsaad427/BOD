import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const CommentsChart = ({ comments }) => {
  // Prepare data for charts
  const commentsByPost = comments.reduce((acc, comment) => {
    const postId = comment.postId;
    acc[postId] = (acc[postId] || 0) + 1;
    return acc;
  }, {});

  const postData = Object.entries(commentsByPost)
    .slice(0, 10)
    .map(([postId, count]) => ({
      postId: `Post ${postId}`,
      comments: count
    }));

  const commentsByLength = [
    { name: 'Short (< 50 chars)', value: comments.filter(comment => comment.body.length < 50).length },
    { name: 'Medium (50-100 chars)', value: comments.filter(comment => comment.body.length >= 50 && comment.body.length < 100).length },
    { name: 'Long (100+ chars)', value: comments.filter(comment => comment.body.length >= 100).length }
  ];

  const commentsByEmail = comments.reduce((acc, comment) => {
    const email = comment.email;
    acc[email] = (acc[email] || 0) + 1;
    return acc;
  }, {});

  const emailData = Object.entries(commentsByEmail)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([email, count]) => ({
      email: email.split('@')[0],
      comments: count
    }));

  // Timeline data (first 20 comments)
  const timelineData = comments.slice(0, 20).map((comment, index) => ({
    index: index + 1,
    comments: 1,
    postId: comment.postId
  }));

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Comments by Post */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Comments by Post (Top 10)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={postData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="postId" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="comments" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comments Length Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Comment Length Distribution
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={commentsByLength}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {commentsByLength.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Active Commenters */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Most Active Commenters
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emailData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="email" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="comments" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comments Timeline */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Comments Timeline
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="comments" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CommentsChart;
