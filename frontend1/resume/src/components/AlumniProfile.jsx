import { useState, useEffect } from 'react';
import { getUserProfile } from '../lib/authManager';
import { getAlumniProfile, updateAlumniProfile } from '../services/mentorshipApi';
import { Calendar, Clock, CheckCircle, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

// Calendar component for date range selection
const CalendarComponent = ({ startDate, endDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isDateInRange = (day) => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (day) => {
    if (!startDate) return false;
    return (
      day === startDate.getDate() &&
      currentMonth.getMonth() === startDate.getMonth() &&
      currentMonth.getFullYear() === startDate.getFullYear()
    );
  };

  const isEndDate = (day) => {
    if (!endDate) return false;
    return (
      day === endDate.getDate() &&
      currentMonth.getMonth() === endDate.getMonth() &&
      currentMonth.getFullYear() === endDate.getFullYear()
    );
  };

  const handleDayClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), 'start');
    } else {
      const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      if (selectedDate >= startDate) {
        onDateSelect(selectedDate, 'end');
      }
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="text-white hover:bg-neutral-800 px-2 py-1 rounded"
        >
          ←
        </button>
        <h3 className="text-white font-medium">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="text-white hover:bg-neutral-800 px-2 py-1 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs text-neutral-400 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => day && handleDayClick(day)}
            disabled={!day}
            className={`py-2 text-sm rounded ${
              !day
                ? "text-neutral-700"
                : isStartDate(day) || isEndDate(day)
                ? "bg-green-500 text-black font-medium"
                : isDateInRange(day)
                ? "bg-green-500/30 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

const inputClass =
  "w-full bg-black text-white caret-green-400 " +
  "border border-white/10 rounded-lg px-4 py-2 text-sm " +
  "placeholder:text-neutral-500 " +
  "transition-all duration-200 " +
  "hover:border-white/20 " +
  "focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30";

function AlumniProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availability, setAvailability] = useState({
    startDate: null,
    endDate: null,
    startTime: "09:00",
    endTime: "17:00",
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentRole: '',
    company: '',
    domain: '',
    batch: '',
    totalExperience: '',
    domainsOfExpertise: '',
    mentorshipPreferences: '',
    linkedIn: '',
    github: '',
    portfolioUrl: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = getUserProfile();
      const response = await getAlumniProfile(user.userId);
      if (response.profile) {
        setProfile(response.profile);
        setFormData({
          name: response.profile.name || '',
          email: response.profile.email || '',
          phone: response.profile.phone || '',
          currentRole: response.profile.currentRole || '',
          company: response.profile.company || '',
          domain: response.profile.domain || '',
          batch: response.profile.batch || '',
          totalExperience: response.profile.totalExperience || '',
          domainsOfExpertise: Array.isArray(response.profile.domainsOfExpertise) 
            ? response.profile.domainsOfExpertise.join(', ') 
            : '',
          mentorshipPreferences: response.profile.mentorshipPreferences || '',
          linkedIn: response.profile.linkedIn || '',
          github: response.profile.github || '',
          portfolioUrl: response.profile.portfolioUrl || ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ensureHttpsPrefix = (url) => {
    if (!url) return '';
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const user = getUserProfile();
      const updateData = {
        ...formData,
        linkedIn: ensureHttpsPrefix(formData.linkedIn),
        github: ensureHttpsPrefix(formData.github),
        portfolioUrl: ensureHttpsPrefix(formData.portfolioUrl),
        domainsOfExpertise: formData.domainsOfExpertise.split(',').map(d => d.trim()).filter(d => d)
      };
      
      await updateAlumniProfile(user.userId, updateData);
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDateSelect = (date, type) => {
    if (type === 'start') {
      setAvailability((prev) => ({ ...prev, startDate: date, endDate: null }));
    } else {
      if (date >= availability.startDate) {
        setAvailability((prev) => ({ ...prev, endDate: date }));
      }
    }
  };

  const saveAvailability = () => {
    if (!availability.startDate || !availability.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    toast.success("Availability updated successfully!");
    setShowAvailabilityModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-neutral-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-medium mb-4">No Profile Found</h2>
          <p className="text-neutral-400 mb-6">
            Please complete the onboarding process to create your profile.
          </p>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-3">
            Profile
          </p>
          <h1 className="text-3xl font-medium">Alumni Profile</h1>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 active:scale-[0.97] transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                loadProfile();
              }}
              className="rounded-full border border-white/10 px-6 py-2.5 text-sm hover:bg-white/5 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
              <h2 className="text-lg font-medium mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="currentRole"
                    placeholder="Current Role"
                    value={formData.currentRole}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="domain"
                    placeholder="Domain (e.g., Software, Finance)"
                    value={formData.domain}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="batch"
                    placeholder="Batch Year"
                    value={formData.batch}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="totalExperience"
                    placeholder="Experience (e.g., 5 years)"
                    value={formData.totalExperience}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <input
                  type="text"
                  name="domainsOfExpertise"
                  placeholder="Domains of Expertise (comma-separated)"
                  value={formData.domainsOfExpertise}
                  onChange={handleChange}
                  className={inputClass}
                />
                <textarea
                  name="mentorshipPreferences"
                  placeholder="Mentorship Preferences"
                  value={formData.mentorshipPreferences}
                  onChange={handleChange}
                  className={`${inputClass} h-24 resize-none`}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
              <h2 className="text-lg font-medium mb-4">Social Links</h2>
              <div className="space-y-4">
                <input
                  type="url"
                  name="linkedIn"
                  placeholder="LinkedIn URL"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="url"
                  name="github"
                  placeholder="GitHub URL"
                  value={formData.github}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="url"
                  name="portfolioUrl"
                  placeholder="Portfolio URL"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Personal Info Display */}
            <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Name</p>
                  <p className="text-white">{profile.name || 'Not provided'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Email</p>
                    <p className="text-white">{profile.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Phone</p>
                    <p className="text-white">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info Display */}
            <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
              <h2 className="text-lg font-medium mb-4">Professional Information</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Current Role</p>
                    <p className="text-white">{profile.currentRole || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Company</p>
                    <p className="text-white">{profile.company || 'Not provided'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Domain</p>
                    <p className="text-white">{profile.domain || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Batch</p>
                    <p className="text-white">{profile.batch || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Experience</p>
                    <p className="text-white">{profile.totalExperience || 'Not provided'}</p>
                  </div>
                </div>
                {profile.domainsOfExpertise && profile.domainsOfExpertise.length > 0 && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-2">Domains of Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.domainsOfExpertise.map((domain, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.mentorshipPreferences && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Mentorship Preferences</p>
                    <p className="text-white">{profile.mentorshipPreferences}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Display */}
            <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
              <h2 className="text-lg font-medium mb-4">Social Links</h2>
              <div className="space-y-3">
                {profile.linkedIn && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">LinkedIn</p>
                    <a
                      href={ensureHttpsPrefix(profile.linkedIn)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition"
                    >
                      {profile.linkedIn}
                    </a>
                  </div>
                )}
                {profile.github && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">GitHub</p>
                    <a
                      href={ensureHttpsPrefix(profile.github)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition"
                    >
                      {profile.github}
                    </a>
                  </div>
                )}
                {profile.portfolioUrl && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Portfolio</p>
                    <a
                      href={ensureHttpsPrefix(profile.portfolioUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition"
                    >
                      {profile.portfolioUrl}
                    </a>
                  </div>
                )}
                {!profile.linkedIn && !profile.github && !profile.portfolioUrl && (
                  <p className="text-neutral-500 text-sm">No social links added</p>
                )}
              </div>
            </div>

            {/* Mentorship Availability Section */}
            <div className="border border-white/10 rounded-xl p-6 bg-neutral-950">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Mentorship Availability</h2>
                <button
                  onClick={() => setShowAvailabilityModal(true)}
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition"
                >
                  <Edit size={16} />
                  {availability.startDate && availability.endDate ? 'Edit' : 'Set Availability'}
                </button>
              </div>
              
              {availability.startDate && availability.endDate ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <Calendar size={16} className="text-green-500" />
                    <span>
                      {availability.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {" - "}
                      {availability.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <Clock size={16} className="text-green-500" />
                    <span>{availability.startTime} - {availability.endTime}</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="text-sm text-green-400">Available for 1:1 mentorship sessions</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">
                  <p className="mb-3">Set your availability to let students know when you're free for mentorship sessions.</p>
                  <button
                    onClick={() => setShowAvailabilityModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition text-sm"
                  >
                    <Calendar size={16} />
                    Set Availability
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Update Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <h2 className="text-2xl font-medium text-white mb-6">Update Availability</h2>
            <div className="space-y-6">
              {/* Calendar Section */}
              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  {!availability.startDate ? "Select Start Date" : !availability.endDate ? "Select End Date" : "Date Range Selected"}
                </label>
                <CalendarComponent
                  startDate={availability.startDate}
                  endDate={availability.endDate}
                  onDateSelect={handleDateSelect}
                />

                {/* Selected Dates Display */}
                {(availability.startDate || availability.endDate) && (
                  <div className="mt-4 p-4 bg-black border border-white/10 rounded-lg">
                    <p className="text-sm text-neutral-300">
                      {availability.startDate && (
                        <>
                          <span className="text-green-500">Start:</span> {availability.startDate.toDateString()}
                        </>
                      )}
                    </p>
                    {availability.endDate && (
                      <p className="text-sm text-neutral-300 mt-2">
                        <span className="text-green-500">End:</span> {availability.endDate.toDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Time Selection */}
              {availability.startDate && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-sm font-medium text-white mb-4">Time Slot</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={availability.startTime}
                        onChange={(e) =>
                          setAvailability((prev) => ({ ...prev, startTime: e.target.value }))
                        }
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-2">End Time</label>
                      <input
                        type="time"
                        value={availability.endTime}
                        onChange={(e) =>
                          setAvailability((prev) => ({ ...prev, endTime: e.target.value }))
                        }
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveAvailability}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black rounded-full py-2.5 font-medium transition"
                >
                  Save Availability
                </button>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1 border border-white/10 text-white rounded-full py-2.5 hover:bg-white/5 transition"
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
}

export default AlumniProfile;
