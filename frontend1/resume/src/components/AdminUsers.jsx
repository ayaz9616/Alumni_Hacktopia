import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    batch: '',
    company: ''
  });

  useEffect(() => {
    // Mock data - replace with API call
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', role: 'student', batch: 'CSE\'25', company: '', createdAt: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', role: 'alumni', batch: 'CSE\'21', company: 'Google', createdAt: '2024-02-10' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '345-678-9012', role: 'student', batch: 'ECE\'24', company: '', createdAt: '2024-03-05' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '456-789-0123', role: 'alumni', batch: 'CSE\'22', company: 'Microsoft', createdAt: '2024-01-20' },
      { id: 5, name: 'David Brown', email: 'david@example.com', phone: '567-890-1234', role: 'student', batch: 'CSE\'25', company: '', createdAt: '2024-04-12' },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [search, roleFilter, users]);

  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    const newUser = {
      id: users.length + 1,
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUser]);
    toast.success('User added successfully!');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? { ...user, ...formData } : user
    );

    setUsers(updatedUsers);
    toast.success('User updated successfully!');
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully!');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      batch: user.batch,
      company: user.company
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'student',
      batch: '',
      company: ''
    });
    setSelectedUser(null);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium mb-2">Users Management</h1>
          <p className="text-neutral-400">Manage all users on the platform</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Students</p>
          <p className="text-2xl font-bold">{users.filter(u => u.role === 'student').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Alumni</p>
          <p className="text-2xl font-bold">{users.filter(u => u.role === 'alumni').length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-neutral-900 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-950">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Batch</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Company</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'alumni' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">{user.batch || '-'}</td>
                  <td className="px-6 py-4 text-neutral-300">{user.company || '-'}</td>
                  <td className="px-6 py-4 text-neutral-300">{user.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg hover:bg-white/10 text-blue-400 hover:text-blue-300 transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Add New User</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Batch</label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData({...formData, batch: e.target.value})}
                  placeholder="e.g., CSE'25"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              {formData.role === 'alumni' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black rounded-lg py-2.5 font-medium transition"
                >
                  Add User
                </button>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 border border-white/10 text-white rounded-lg py-2.5 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Edit User</h2>
              <button onClick={() => { setShowEditModal(false); resetForm(); }} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Batch</label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData({...formData, batch: e.target.value})}
                  placeholder="e.g., CSE'25"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>

              {formData.role === 'alumni' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleEditUser}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black rounded-lg py-2.5 font-medium transition"
                >
                  Update User
                </button>
                <button
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="flex-1 border border-white/10 text-white rounded-lg py-2.5 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
