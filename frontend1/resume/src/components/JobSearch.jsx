// import { useState } from 'react';
// import { jobsAPI } from '../services/api';

// function JobSearch() {
//   const [formData, setFormData] = useState({
//     query: '',
//     location: '',
//     max_results: 10,
//     platform: 'adzuna',
//   });
//   const [loading, setLoading] = useState(false);
//   const [jobs, setJobs] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = async () => {
//     if (!formData.query.trim()) {
//       alert('Please enter a search query');
//       return;
//     }

//     setLoading(true);
//     setJobs([]);

//     try {
//       const payload = {
//         query: formData.query,
//         location: formData.location || null,
//         max_results: parseInt(formData.max_results),
//       };

//       const response = await jobsAPI.searchJobs(payload, formData.platform);
//       setJobs(response.data.jobs || []);
//     } catch (error) {
//       alert(error.response?.data?.detail || 'Job search failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="job-search">
//       <div className="search-form">
//         <h2>🔍 Job Search</h2>
//         <p className="description">Find your next opportunity</p>

//         <div className="search-inputs">
//           <div className="form-group">
//             <label>Job Title / Keywords *</label>
//             <input
//               type="text"
//               name="query"
//               value={formData.query}
//               onChange={handleChange}
//               placeholder="e.g., Software Engineer, Data Analyst"
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <label>Location</label>
//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="e.g., New York, Remote"
//               disabled={loading}
//             />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Platform</label>
//               <select name="platform" value={formData.platform} onChange={handleChange} disabled={loading}>
//                 <option value="adzuna">Adzuna</option>
//                 <option value="jooble">Jooble</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Max Results</label>
//               <input
//                 type="number"
//                 name="max_results"
//                 value={formData.max_results}
//                 onChange={handleChange}
//                 min="1"
//                 max="50"
//                 disabled={loading}
//               />
//             </div>
//           </div>
//         </div>

//         <button className="btn-search" onClick={handleSearch} disabled={loading}>
//           {loading ? '⏳ Searching...' : '🚀 Search Jobs'}
//         </button>
//       </div>

//       {jobs.length > 0 && (
//         <div className="jobs-results">
//           <h3>Found {jobs.length} Jobs</h3>
//           <div className="jobs-grid">
//             {jobs.map((job, idx) => (
//               <div key={idx} className="job-card">
//                 <div className="job-header">
//                   <h4>{job.title}</h4>
//                   <span className="company">{job.company}</span>
//                 </div>
//                 <div className="job-location">📍 {job.location}</div>
//                 <div className="job-description">
//                   {job.description.substring(0, 200)}...
//                 </div>
//                 {job.url && (
//                   <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-apply">
//                     Apply Now →
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {!loading && jobs.length === 0 && formData.query && (
//         <div className="no-results">
//           <div className="empty-icon">🔍</div>
//           <p>No jobs found. Try adjusting your search criteria.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default JobSearch;


import { useState } from 'react';
import { jobsAPI } from '../services/api';

function JobSearch() {
  const [formData, setFormData] = useState({
    query: '',
    location: '',
    max_results: 10,
    platform: 'adzuna',
  });
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!formData.query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);
    setJobs([]);

    try {
      const payload = {
        query: formData.query,
        location: formData.location || null,
        max_results: parseInt(formData.max_results),
      };

      const response = await jobsAPI.searchJobs(payload, formData.platform);
      setJobs(response.data.jobs || []);
    } catch (error) {
      alert(error.response?.data?.detail || 'Job search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Search Form */}
      <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8">
        <h2 className="text-xl font-medium">Job Search</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Find your next opportunity
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              Job Title / Keywords
            </label>
            <input
              type="text"
              name="query"
              value={formData.query}
              onChange={handleChange}
              placeholder="Software Engineer, Data Analyst"
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="New York, Remote"
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
              >
                <option value="adzuna">Adzuna</option>
                <option value="jooble">Jooble</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-2">
                Max Results
              </label>
              <input
                type="number"
                name="max_results"
                value={formData.max_results}
                onChange={handleChange}
                min="1"
                max="50"
                disabled={loading}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>

      {/* Results */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Found {jobs.length} jobs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="border border-white/10 rounded-xl bg-neutral-950 p-6 hover:border-white/20 transition"
              >
                <div className="mb-2">
                  <h4 className="text-sm font-medium">{job.title}</h4>
                  <p className="text-xs text-neutral-500">
                    {job.company}
                  </p>
                </div>

                <p className="text-xs text-neutral-400 mb-3">
                  {job.location}
                </p>

                <p className="text-sm text-neutral-400 line-clamp-4">
                  {job.description.substring(0, 200)}...
                </p>

                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm text-green-400 hover:underline"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && jobs.length === 0 && formData.query && (
        <div className="border border-white/10 rounded-xl bg-neutral-950 p-10 text-center">
          <p className="text-sm text-neutral-400">
            No jobs found. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}

export default JobSearch;
