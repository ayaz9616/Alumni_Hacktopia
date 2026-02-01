import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Calendar, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Mock data
    const mockSessions = [
      {
        id: 1,
        studentName: 'Rahul Kumar',
        studentEmail: 'rahul@example.com',
        studentPhone: '+91 9876543210',
        mentorName: 'Dr. Priya Sharma',
        topic: 'Career Guidance - Data Science',
        requestedDate: '2024-05-20',
        requestedTime: '10:00 AM',
        status: 'pending',
        message: 'I need guidance on transitioning to data science from software development.'
      },
      {
        id: 2,
        studentName: 'Sneha Patel',
        studentEmail: 'sneha@example.com',
        studentPhone: '+91 9876543211',
        mentorName: 'Prof. Amit Verma',
        topic: 'Resume Review',
        requestedDate: '2024-05-18',
        requestedTime: '2:00 PM',
        status: 'approved',
        meetLink: 'https://meet.google.com/abc-defg-hij',
        message: 'Looking for feedback on my resume before applying to FAANG companies.'
      },
      {
        id: 3,
        studentName: 'Arjun Singh',
        studentEmail: 'arjun@example.com',
        studentPhone: '+91 9876543212',
        mentorName: 'Dr. Meera Nair',
        topic: 'Interview Preparation - Backend',
        requestedDate: '2024-05-22',
        requestedTime: '4:00 PM',
        status: 'pending',
        message: 'Preparing for backend engineer interviews, need mock interview practice.'
      },
      {
        id: 4,
        studentName: 'Priya Desai',
        studentEmail: 'priya@example.com',
        studentPhone: '+91 9876543213',
        mentorName: 'Dr. Rajesh Kumar',
        topic: 'Startup Guidance',
        requestedDate: '2024-05-15',
        requestedTime: '11:00 AM',
        status: 'completed',
        message: 'Want to discuss startup ideas and funding opportunities.'
      },
      {
        id: 5,
        studentName: 'Vikram Reddy',
        studentEmail: 'vikram@example.com',
        studentPhone: '+91 9876543214',
        mentorName: 'Prof. Sunita Das',
        topic: 'Higher Studies Abroad',
        requestedDate: '2024-05-19',
        requestedTime: '3:00 PM',
        status: 'rejected',
        message: 'Need advice on MS programs in USA and scholarship opportunities.'
      },
    ];
    setSessions(mockSessions);
    setFilteredSessions(mockSessions);
  }, []);

  useEffect(() => {
    let filtered = sessions;

    if (search) {
      filtered = filtered.filter(session =>
        session.studentName.toLowerCase().includes(search.toLowerCase()) ||
        session.mentorName.toLowerCase().includes(search.toLowerCase()) ||
        session.topic.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    setFilteredSessions(filtered);
  }, [search, statusFilter, sessions]);

  const handleApprove = (sessionId) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId ? { ...session, status: 'approved', meetLink: 'https://meet.google.com/generated-link' } : session
    );
    setSessions(updatedSessions);
    toast.success('Session approved successfully!');
  };

  const handleReject = (sessionId) => {
    if (window.confirm('Are you sure you want to reject this session request?')) {
      const updatedSessions = sessions.map(session =>
        session.id === sessionId ? { ...session, status: 'rejected' } : session
      );
      setSessions(updatedSessions);
      toast.success('Session rejected');
    }
  };

  const handleComplete = (sessionId) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId ? { ...session, status: 'completed' } : session
    );
    setSessions(updatedSessions);
    toast.success('Session marked as completed');
  };

  const openDetails = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Sessions Management</h1>
        <p className="text-neutral-400">Manage mentorship session requests and schedules</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search sessions..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Total Sessions</p>
          <p className="text-2xl font-bold">{sessions.length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{sessions.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Approved</p>
          <p className="text-2xl font-bold text-green-400">{sessions.filter(s => s.status === 'approved').length}</p>
        </div>
        <div className="bg-neutral-900 border border-white/10 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Completed</p>
          <p className="text-2xl font-bold text-blue-400">{sessions.filter(s => s.status === 'completed').length}</p>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-neutral-900 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-black/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Student</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Mentor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Topic</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{session.studentName}</p>
                      <p className="text-sm text-neutral-400">{session.studentEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-neutral-300">{session.mentorName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-neutral-300">{session.topic}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Calendar size={14} className="text-green-500" />
                      {session.requestedDate}
                      <span className="text-neutral-500">•</span>
                      {session.requestedTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetails(session)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition"
                      >
                        View
                      </button>
                      {session.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(session.id)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(session.id)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {session.status === 'approved' && (
                        <button
                          onClick={() => handleComplete(session.id)}
                          className="px-3 py-1.5 text-sm rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal */}
      {showDetailsModal && selectedSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-medium mb-2">Session Details</h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSession.status)}`}>
                  {getStatusIcon(selectedSession.status)}
                  {selectedSession.status}
                </span>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-black/50 border border-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-400 mb-3">Student Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-neutral-400" />
                    <span className="text-white">{selectedSession.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-neutral-400" />
                    <span className="text-neutral-300">{selectedSession.studentEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-neutral-400" />
                    <span className="text-neutral-300">{selectedSession.studentPhone}</span>
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div className="bg-black/50 border border-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-400 mb-3">Session Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Mentor</p>
                    <p className="text-white">{selectedSession.mentorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Topic</p>
                    <p className="text-white">{selectedSession.topic}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Date</p>
                      <p className="text-white">{selectedSession.requestedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Time</p>
                      <p className="text-white">{selectedSession.requestedTime}</p>
                    </div>
                  </div>
                  {selectedSession.meetLink && (
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Meeting Link</p>
                      <a
                        href={selectedSession.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 underline"
                      >
                        {selectedSession.meetLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="bg-black/50 border border-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-400 mb-2">Student Message</h3>
                <p className="text-neutral-300">{selectedSession.message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedSession.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedSession.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-400 text-black rounded-lg py-2.5 font-medium transition"
                    >
                      Approve Session
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedSession.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 border border-red-500/50 text-red-400 rounded-lg py-2.5 hover:bg-red-500/10 transition"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedSession.status === 'approved' && (
                  <button
                    onClick={() => {
                      handleComplete(selectedSession.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-400 text-white rounded-lg py-2.5 font-medium transition"
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 border border-white/10 text-white rounded-lg py-2.5 hover:bg-white/5 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessions;
