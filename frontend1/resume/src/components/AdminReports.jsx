import React, { useState } from 'react';
import { TrendingUp, Users, Briefcase, Calendar, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('month');

  const handleExport = (reportType) => {
    toast.success(`${reportType} report exported successfully!`);
  };

  const handleRefresh = () => {
    toast.success('Reports refreshed!');
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium mb-2">Reports & Analytics</h1>
          <p className="text-neutral-400">View platform statistics and generate reports</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users size={24} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">+12.5%</span>
          </div>
          <p className="text-2xl font-bold mb-1">847</p>
          <p className="text-sm text-neutral-400">Total Users</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={24} className="text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">+8.3%</span>
          </div>
          <p className="text-2xl font-bold mb-1">89</p>
          <p className="text-sm text-neutral-400">Sessions Completed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Briefcase size={24} className="text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">+15.7%</span>
          </div>
          <p className="text-2xl font-bold mb-1">156</p>
          <p className="text-sm text-neutral-400">Active Jobs</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={24} className="text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">+23.1%</span>
          </div>
          <p className="text-2xl font-bold mb-1">92%</p>
          <p className="text-sm text-neutral-400">Satisfaction Rate</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">User Growth</h3>
            <button
              onClick={() => handleExport('User Growth')}
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="space-y-4">
            {[
              { month: 'Jan', students: 65, alumni: 35 },
              { month: 'Feb', students: 75, alumni: 42 },
              { month: 'Mar', students: 85, alumni: 48 },
              { month: 'Apr', students: 95, alumni: 55 },
              { month: 'May', students: 110, alumni: 62 },
            ].map((data, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-400">{data.month}</span>
                  <span className="text-white">{data.students + data.alumni} users</span>
                </div>
                <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                  <div
                    className="bg-green-500"
                    style={{ width: `${(data.students / 120) * 100}%` }}
                    title={`${data.students} students`}
                  />
                  <div
                    className="bg-blue-500"
                    style={{ width: `${(data.alumni / 120) * 100}%` }}
                    title={`${data.alumni} alumni`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-neutral-400">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-neutral-400">Alumni</span>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Session Statistics</h3>
            <button
              onClick={() => handleExport('Session Statistics')}
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Completed', count: 89, percentage: 72, color: 'bg-green-500' },
              { label: 'Scheduled', count: 23, percentage: 19, color: 'bg-blue-500' },
              { label: 'Cancelled', count: 8, percentage: 6, color: 'bg-red-500' },
              { label: 'Pending', count: 4, percentage: 3, color: 'bg-yellow-500' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-300">{stat.label}</span>
                  <span className="text-white font-medium">{stat.count}</span>
                </div>
                <div className="relative h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${stat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Application Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Job Applications</h3>
            <button
              onClick={() => handleExport('Job Applications')}
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="space-y-4">
            {[
              { company: 'Google', applications: 45, color: 'bg-blue-500' },
              { company: 'Microsoft', applications: 32, color: 'bg-green-500' },
              { company: 'Amazon', applications: 28, color: 'bg-yellow-500' },
              { company: 'Meta', applications: 25, color: 'bg-purple-500' },
              { company: 'Netflix', applications: 22, color: 'bg-red-500' },
            ].map((job, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-300">{job.company}</span>
                  <span className="text-white font-medium">{job.applications} applications</span>
                </div>
                <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${job.color} rounded-full`}
                    style={{ width: `${(job.applications / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Mentors */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Top Mentors</h3>
            <button
              onClick={() => handleExport('Top Mentors')}
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Dr. Priya Sharma', sessions: 24, rating: 4.9 },
              { name: 'Prof. Amit Verma', sessions: 21, rating: 4.8 },
              { name: 'Dr. Meera Nair', sessions: 18, rating: 4.9 },
              { name: 'Dr. Rajesh Kumar', sessions: 15, rating: 4.7 },
              { name: 'Prof. Sunita Das', sessions: 11, rating: 4.8 },
            ].map((mentor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 font-medium">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{mentor.name}</p>
                    <p className="text-sm text-neutral-400">{mentor.sessions} sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export All Reports */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-2">Generate Complete Report</h3>
            <p className="text-neutral-400">Download a comprehensive report with all analytics data</p>
          </div>
          <button
            onClick={() => handleExport('Complete')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition"
          >
            <Download size={20} />
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
