import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Briefcase, Globe, Linkedin, ExternalLink, Calendar as CalendarIcon, Clock, CheckCircle, Edit } from "lucide-react";
import { getUserProfile } from "../../lib/authManager";
import toast from "react-hot-toast";

// Calendar component for date range selection
const Calendar = ({ startDate, endDate, onDateSelect }) => {
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

const AlumniProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [sessionRequest, setSessionRequest] = useState({
    topic: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });
  const [availability, setAvailability] = useState({
    startDate: null,
    endDate: null,
    startTime: "09:00",
    endTime: "17:00",
  });
  const userProfile = getUserProfile();
  const isOwnProfile = userProfile?.id === id;

  useEffect(() => {
    // Get alumni data from location state or fetch it
    if (location.state?.alumni) {
      setAlumni(location.state.alumni);
      setLoading(false);
    } else {
      // Try to load from CSV
      loadAlumniData();
    }
  }, [id, location.state]);

  const loadAlumniData = async () => {
    try {
      const response = await fetch('/alumni_cleaned.csv');
      const csv = await response.text();
      const lines = csv.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        const obj = {};
        
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentLine[j]?.trim().replace(/^"|"$/g, '') || '';
        }
        
        if (obj.id === id) {
          setAlumni(obj);
          break;
        }
      }
    } catch (error) {
      console.error('Failed to load alumni data:', error);
    } finally {
      setLoading(false);
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

  const handleRequestSession = async (e) => {
    e.preventDefault();
    
    if (!sessionRequest.topic || !sessionRequest.preferredDate || !sessionRequest.preferredTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Here you would typically make an API call to save the session request
      // For now, we'll just show a success message
      toast.success("Session request sent! The alumni will be notified via email.");
      setShowSessionModal(false);
      setSessionRequest({
        topic: "",
        preferredDate: "",
        preferredTime: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send session request");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 py-28 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-top bg-repeat" style={{ backgroundImage: "url('/gotbackground.png')", backgroundSize: "400px 400px" }} />
        <div className="absolute inset-0 bg-[rgba(19,20,20,0.85)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,20,20,0)_35%,rgba(19,20,20,0.95)_100%)]" />
        <div className="relative z-10 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 py-28 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-top bg-repeat" style={{ backgroundImage: "url('/gotbackground.png')", backgroundSize: "400px 400px" }} />
        <div className="absolute inset-0 bg-[rgba(19,20,20,0.85)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,20,20,0)_35%,rgba(19,20,20,0.95)_100%)]" />
        <div className="relative z-10 text-center">
          <p className="text-neutral-400">Alumni not found</p>
          <button
            onClick={() => navigate('/alumni')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black font-medium hover:bg-green-400 transition"
          >
            <ArrowLeft size={18} /> Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-28 relative overflow-hidden text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-top bg-repeat"
        style={{ backgroundImage: "url('/gotbackground.png')", backgroundSize: "400px 400px" }}
      />
      <div className="absolute inset-0 bg-[rgba(19,20,20,0.85)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,20,20,0)_35%,rgba(19,20,20,0.95)_100%)]" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition text-sm"
        >
          <ArrowLeft size={18} /> Back to Directory
        </button>

        {/* Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-neutral-950/90 backdrop-blur-xl px-8 py-10 shadow-2xl">
          {/* Header */}
          <div className="flex items-start gap-6 mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0"
              style={{ backgroundColor: "#4A5E2A" }}
            >
              {getInitials(alumni.name)}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-medium mb-2">{alumni.name}</h1>
              <p className="text-lg text-green-400 mb-3">{alumni.experience || "N/A"}</p>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                {alumni.batch && (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    {alumni.batch}
                  </span>
                )}
                {alumni.course && (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    {alumni.course}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-8" />

          {/* Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-[0.15em]">
                Contact Information
              </h3>
              <div className="space-y-3">
                {alumni.email && (
                  <a
                    href={`mailto:${alumni.email}`}
                    className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition"
                  >
                    <Mail size={18} className="text-green-500" />
                    <span className="break-all">{alumni.email}</span>
                  </a>
                )}
                {alumni.linkedin && (
                  <a
                    href={alumni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition"
                  >
                    <Linkedin size={18} className="text-green-500" />
                    <span>View LinkedIn Profile</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-[0.15em]">
                Location
              </h3>
              <div className="space-y-2">
                {alumni.livesIn && (
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <MapPin size={18} className="text-green-500" />
                    <span>Currently in: {alumni.livesIn}</span>
                  </div>
                )}
                {alumni.homeTown && (
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <MapPin size={18} className="text-green-500" />
                    <span>Hometown: {alumni.homeTown}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-[0.15em]">
                Academic
              </h3>
              <div className="space-y-2">
                {alumni.rollno && (
                  <div className="text-sm text-neutral-300">
                    <span className="text-neutral-500">Roll Number:</span> {alumni.rollno}
                  </div>
                )}
                {alumni.batch && (
                  <div className="text-sm text-neutral-300">
                    <span className="text-neutral-500">Batch:</span> {alumni.batch}
                  </div>
                )}
                {alumni.course && (
                  <div className="text-sm text-neutral-300">
                    <span className="text-neutral-500">Course:</span> {alumni.course}
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            {alumni.experience && (
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-[0.15em]">
                  Professional
                </h3>
                <div className="flex items-start gap-3 text-sm text-neutral-300">
                  <Briefcase size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{alumni.experience}</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 my-8" />

          {/* Mentorship Availability Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-[0.15em]">
                Mentorship Availability
              </h3>
              {isOwnProfile && userProfile?.role === "alumni" && (
                <button
                  onClick={() => setShowAvailabilityModal(true)}
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition"
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
            </div>
            
            {availability.startDate && availability.endDate ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">Available for 1:1 Sessions</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3 text-sm text-neutral-300">
                        <CalendarIcon size={16} className="text-green-500" />
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
                    </div>
                    <p className="text-sm text-neutral-300 mb-4">
                      {alumni.name} is available for mentorship sessions. Connect to discuss career guidance, 
                      technical topics, or get advice on your professional journey.
                    </p>
                    {userProfile?.role === "student" && !isOwnProfile && (
                      <button
                        onClick={() => setShowSessionModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition"
                      >
                        <CalendarIcon size={18} />
                        Request 1:1 Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-800/50 border border-white/10 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-neutral-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">No Availability Set</p>
                    <p className="text-sm text-neutral-400">
                      {isOwnProfile 
                        ? "Set your availability to let students know when you're free for mentorship sessions."
                        : "This alumni hasn't set their availability yet. Check back later!"}
                    </p>
                    {isOwnProfile && userProfile?.role === "alumni" && (
                      <button
                        onClick={() => setShowAvailabilityModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition mt-4"
                      >
                        <CalendarIcon size={18} />
                        Set Availability
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white font-medium transition"
          >
            Back to Directory
          </button>
        </div>
      </div>

      {/* Session Request Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-medium text-white mb-6">Request 1:1 Session</h2>
            
            <form onSubmit={handleRequestSession} className="space-y-5">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Session Topic *
                </label>
                <input
                  type="text"
                  value={sessionRequest.topic}
                  onChange={(e) => setSessionRequest({...sessionRequest, topic: e.target.value})}
                  placeholder="e.g., Career guidance, Technical interview prep"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 transition"
                  required
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={sessionRequest.preferredDate}
                  onChange={(e) => setSessionRequest({...sessionRequest, preferredDate: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 transition"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Preferred Time *
                </label>
                <select
                  value={sessionRequest.preferredTime}
                  onChange={(e) => setSessionRequest({...sessionRequest, preferredTime: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 transition appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={sessionRequest.message}
                  onChange={(e) => setSessionRequest({...sessionRequest, message: e.target.value})}
                  placeholder="Share what you'd like to discuss or any specific questions..."
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 transition resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <Calendar
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
};

export default AlumniProfile;
