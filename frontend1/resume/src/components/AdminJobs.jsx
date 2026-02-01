import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, MapPin, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    status: 'active'
  });

  useEffect(() => {
    // Mock data
    const mockJobs = [
      { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Bangalore', type: 'Full-time', salary: '$80k-$120k', applicants: 45, status: 'active', postedDate: '2024-01-15' },
      { id: 2, title: 'Backend Engineer', company: 'Microsoft', location: 'Hyderabad', type: 'Full-time', salary: '$90k-$130k', applicants: 32, status: 'active', postedDate: '2024-02-10' },
      { id: 3, title: 'Data Scientist', company: 'Amazon', location: 'Mumbai', type: 'Full-time', salary: '$100k-$150k', applicants: 28, status: 'active', postedDate: '2024-03-05' },
      { id: 4, title: 'UI/UX Designer', company: 'Adobe', location: 'Noida', type: 'Contract', salary: '$60k-$90k', applicants: 18, status: 'closed', postedDate: '2024-01-20' },
      { id: 5, title: 'DevOps Engineer', company: 'Netflix', location: 'Pune', type: 'Full-time', salary: '$85k-$125k', applicants: 22, status: 'active', postedDate: '2024-04-12' },
    ];
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [search, statusFilter, jobs]);

  const handleAddJob = () => {
    if (!formData.title || !formData.company || !formData.location) {
      toast.error('Title, company, and location are required');
      return;
    }

    const newJob = {
      id: jobs.length + 1,
      ...formData,
      applicants: 0,
      postedDate: new Date().toISOString().split('T')[0]
    };

    setJobs([...jobs, newJob]);
    toast.success('Job posted successfully!');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditJob = () => {
    if (!formData.title || !formData.company || !formData.location) {
      toast.error('Title, company, and location are required');
      return;
    }

    const updatedJobs = jobs.map(job =>
      job.id === selectedJob.id ? { ...job, ...formData } : job
    );

    setJobs(updatedJobs);
    toast.success('Job updated successfully!');
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(job => job.id !== jobId));
      toast.success('Job deleted successfully!');
    }
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description || '',
      requirements: job.requirements || '',
      status: job.status
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      status: 'active'
    });
    setSelectedJob(null);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium mb-2">Jobs Management</h1>
          <p className="text-neutral-400">Manage all job postings on the platform</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition"
        >
          <Plus size={20} />
          Post Job
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Total Jobs</p>
          <p className="text-2xl font-bold">{jobs.length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Active Jobs</p>
          <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'active').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Total Applicants</p>
          <p className="text-2xl font-bold">{jobs.reduce((sum, j) => sum + j.applicants, 0)}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Closed Jobs</p>
          <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'closed').length}</p>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-neutral-900 border border-white/10 rounded-lg p-6 hover:border-white/20 transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">{job.title}</h3>
                <p className="text-neutral-400 text-sm">{job.company}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.status === 'active'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {job.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <MapPin size={16} className="text-green-500" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <DollarSign size={16} className="text-green-500" />
                {job.salary}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-neutral-400">{job.type}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-400">{job.applicants} applicants</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-neutral-500">Posted: {job.postedDate}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(job)}
                  className="p-2 rounded-lg hover:bg-white/10 text-blue-400 hover:text-blue-300 transition"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">{showAddModal ? 'Post New Job' : 'Edit Job'}</h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Job Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="e.g., $80k-$120k"
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 resize-none"
                  placeholder="Job description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 resize-none"
                  placeholder="Job requirements..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={showAddModal ? handleAddJob : handleEditJob}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black rounded-lg py-2.5 font-medium transition"
                >
                  {showAddModal ? 'Post Job' : 'Update Job'}
                </button>
                <button
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
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

export default AdminJobs;
