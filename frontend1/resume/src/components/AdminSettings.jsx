import React, { useState } from 'react';
import { Save, Bell, Mail, Lock, Globe, Palette, Database, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Alumni Hacktopia',
    siteUrl: 'https://alumnihacktopia.com',
    contactEmail: 'admin@alumnihacktopia.com',
    allowRegistration: true,
    requireEmailVerification: true,
    enableSessions: true,
    enableJobs: true,
    sessionApproval: true,
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    theme: 'dark',
    primaryColor: '#4A5E2A',
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    // Save settings logic here
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="text-white max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium mb-2">Settings</h1>
          <p className="text-neutral-400">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={24} className="text-green-500" />
            <h2 className="text-xl font-medium">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Site URL</label>
              <input
                type="text"
                value={settings.siteUrl}
                onChange={(e) => handleChange('siteUrl', e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Authentication Settings */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-green-500" />
            <h2 className="text-xl font-medium">Authentication</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Allow New Registrations</p>
                <p className="text-sm text-neutral-400">Users can create new accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Email Verification Required</p>
                <p className="text-sm text-neutral-400">Users must verify email before access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-green-500" />
            <h2 className="text-xl font-medium">Features</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Enable Mentorship Sessions</p>
                <p className="text-sm text-neutral-400">Allow users to book mentorship sessions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSessions}
                  onChange={(e) => handleChange('enableSessions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Enable Job Board</p>
                <p className="text-sm text-neutral-400">Display job postings on the platform</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableJobs}
                  onChange={(e) => handleChange('enableJobs', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Session Approval Required</p>
                <p className="text-sm text-neutral-400">Admin must approve session requests</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sessionApproval}
                  onChange={(e) => handleChange('sessionApproval', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={24} className="text-green-500" />
            <h2 className="text-xl font-medium">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-neutral-400">Send email notifications to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-neutral-400">Send push notifications to browsers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="font-medium">Weekly Digest Email</p>
                <p className="text-sm text-neutral-400">Send weekly summary to all users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => handleChange('weeklyDigest', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={24} className="text-green-500" />
            <h2 className="text-xl font-medium">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Primary Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database size={24} className="text-green-500" />
            <h2 className="text-xl font-medium">Database</h2>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => toast.success('Database backup created successfully!')}
              className="w-full p-4 bg-black/30 rounded-lg hover:bg-black/50 transition text-left"
            >
              <p className="font-medium mb-1">Backup Database</p>
              <p className="text-sm text-neutral-400">Create a backup of the entire database</p>
            </button>
            <button
              onClick={() => toast.success('Cache cleared successfully!')}
              className="w-full p-4 bg-black/30 rounded-lg hover:bg-black/50 transition text-left"
            >
              <p className="font-medium mb-1">Clear Cache</p>
              <p className="text-sm text-neutral-400">Clear all cached data to improve performance</p>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure? This will delete all data!')) {
                  toast.error('This is a demo. Database reset disabled.');
                }
              }}
              className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition text-left"
            >
              <p className="font-medium text-red-400 mb-1">Reset Database</p>
              <p className="text-sm text-neutral-400">Delete all data and reset to default</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
