import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlumni: 0,
    totalStudents: 0,
    totalJobs: 0,
    totalSessions: 0,
    activeSessions: 0
  });

  useEffect(() => {
    // Simulated data - replace with actual API calls
    setStats({
      totalUsers: 847,
      totalAlumni: 422,
      totalStudents: 425,
      totalJobs: 156,
      totalSessions: 89,
      activeSessions: 23
    });
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Alumni',
      value: stats.totalAlumni,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: Calendar,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions,
      icon: Activity,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20'
    }
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'registered as Alumni', time: '5 min ago' },
    { user: 'Jane Smith', action: 'posted a new job', time: '15 min ago' },
    { user: 'Mike Johnson', action: 'requested a session', time: '30 min ago' },
    { user: 'Sarah Williams', action: 'updated profile', time: '1 hour ago' },
    { user: 'David Brown', action: 'joined community event', time: '2 hours ago' }
  ];

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Dashboard</h1>
        <p className="text-neutral-400">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
          <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition">
              <p className="text-sm font-medium">Add New User</p>
              <p className="text-xs text-neutral-500 mt-1">Create a new user account</p>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition">
              <p className="text-sm font-medium">Post a Job</p>
              <p className="text-xs text-neutral-500 mt-1">Add a new job listing</p>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition">
              <p className="text-sm font-medium">Manage Sessions</p>
              <p className="text-xs text-neutral-500 mt-1">View and manage all sessions</p>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition">
              <p className="text-sm font-medium">Generate Report</p>
              <p className="text-xs text-neutral-500 mt-1">Create analytics reports</p>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 border border-white/10 rounded-xl p-6 bg-neutral-950">
        <h2 className="text-lg font-medium mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <div>
              <p className="text-sm text-neutral-400">Server Status</p>
              <p className="text-sm font-medium text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <div>
              <p className="text-sm text-neutral-400">Database</p>
              <p className="text-sm font-medium text-green-400">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            <div>
              <p className="text-sm text-neutral-400">API Response</p>
              <p className="text-sm font-medium text-yellow-400">245ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
