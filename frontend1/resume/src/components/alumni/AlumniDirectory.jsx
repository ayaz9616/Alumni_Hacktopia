// import React, { useState, useEffect } from 'react';
// import { Search, Filter, MapPin, Briefcase, GraduationCap, Mail, Linkedin, Github, Twitter, Facebook, X, ChevronLeft, ChevronRight } from 'lucide-react';
// import { getAlumni, getAlumniStats } from '../../services/alumniApi';
// import toast from 'react-hot-toast';

// const AlumniDirectory = () => {
//   const [alumni, setAlumni] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     search: '',
//     course: '',
//     batch: '',
//     city: '',
//     company: '',
//     page: 1,
//     limit: 12
//   });
//   const [pagination, setPagination] = useState(null);

//   const fetchAlumni = async () => {
//     try {
//       setLoading(true);
//       const response = await getAlumni(filters);
//       setAlumni(response.data);
//       setPagination(response.pagination);
//     } catch (error) {
//       toast.error('Failed to load alumni');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await getAlumniStats();
//       setStats(response.data);
//     } catch (error) {
//       console.error('Failed to load stats:', error);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   useEffect(() => {
//     fetchAlumni();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters.page, filters.course, filters.batch, filters.city, filters.company, filters.search]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Just update filters, useEffect will handle the fetch
//     setFilters(prev => ({ ...prev, search: prev.search, page: 1 }));
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters({ ...filters, [key]: value, page: 1 });
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       course: '',
//       batch: '',
//       city: '',
//       company: '',
//       page: 1,
//       limit: 12
//     });
//   };

//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const extractCompany = (experience) => {
//     if (!experience) return 'Not specified';
//     const match = experience.match(/(?:at|@)\s+([^,\n]+)/i);
//     return match ? match[1].trim() : experience.split(',')[0].trim() || 'Not specified';
//   };

//   const extractRole = (experience) => {
//     if (!experience) return '';
//     const match = experience.match(/^([^@,]+)/);
//     return match ? match[1].trim() : '';
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <h1 className="text-4xl font-bold mb-2">Alumni Directory</h1>
//         <p className="text-white/60">Connect with {pagination?.total || 0} alumni from IIIT Bhagalpur</p>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-neutral-950 border border-white/10 rounded-lg p-4">
//             <div className="text-3xl font-bold text-green-500">{stats.total}</div>
//             <div className="text-white/60 text-sm">Total Alumni</div>
//           </div>
//           {stats.byCourse.slice(0, 3).map((stat) => (
//             <div key={stat.course} className="bg-neutral-950 border border-white/10 rounded-lg p-4">
//               <div className="text-3xl font-bold text-green-500">{stat.count}</div>
//               <div className="text-white/60 text-sm">{stat.course}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Filters Sidebar */}
//           <div className="lg:w-64 flex-shrink-0">
//             <div className="bg-neutral-950 border border-white/10 rounded-lg p-6 sticky top-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold flex items-center gap-2">
//                   <Filter className="h-5 w-5" />
//                   Filters
//                 </h2>
//                 <button
//                   onClick={clearFilters}
//                   className="text-sm text-green-500 hover:text-green-400"
//                 >
//                   Clear
//                 </button>
//               </div>

//               {/* Course Filter */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Course</label>
//                 <select
//                   value={filters.course}
//                   onChange={(e) => handleFilterChange('course', e.target.value)}
//                   className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
//                 >
//                   <option value="">All Courses</option>
//                   {stats?.byCourse.map((stat) => (
//                     <option key={stat.course} value={stat.course}>
//                       {stat.course} ({stat.count})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Batch Filter */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Batch</label>
//                 <select
//                   value={filters.batch}
//                   onChange={(e) => handleFilterChange('batch', e.target.value)}
//                   className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
//                 >
//                   <option value="">All Batches</option>
//                   {stats?.byBatch.map((stat) => (
//                     <option key={stat.batch} value={stat.batch}>
//                       {stat.batch} ({stat.count})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* City Filter */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">City</label>
//                 <input
//                   type="text"
//                   value={filters.city}
//                   onChange={(e) => handleFilterChange('city', e.target.value)}
//                   placeholder="Search by city..."
//                   className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-green-500"
//                 />
//               </div>

//               {/* Company Filter */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Company</label>
//                 <input
//                   type="text"
//                   value={filters.company}
//                   onChange={(e) => handleFilterChange('company', e.target.value)}
//                   placeholder="Search by company..."
//                   className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-green-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Search Bar */}
//             <form onSubmit={handleSearch} className="mb-6">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
//                 <input
//                   type="text"
//                   value={filters.search}
//                   onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                   placeholder="Search by name, skills, experience..."
//                   className="w-full bg-neutral-950 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-green-500"
//                 />
//                 <button
//                   type="submit"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md transition-colors"
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>

//             {/* Alumni Grid */}
//             {loading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {[...Array(6)].map((_, i) => (
//                   <div key={i} className="bg-neutral-950 border border-white/10 rounded-lg p-6 animate-pulse">
//                     <div className="h-16 w-16 bg-white/10 rounded-full mb-4"></div>
//                     <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
//                     <div className="h-3 bg-white/10 rounded mb-2 w-1/2"></div>
//                     <div className="h-3 bg-white/10 rounded w-2/3"></div>
//                   </div>
//                 ))}
//               </div>
//             ) : alumni.length === 0 ? (
//               <div className="bg-neutral-950 border border-white/10 rounded-lg p-12 text-center">
//                 <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
//                 <p className="text-white/60">No alumni found matching your criteria</p>
//                 <button
//                   onClick={clearFilters}
//                   className="mt-4 text-green-500 hover:text-green-400"
//                 >
//                   Clear filters
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                   {alumni.map((person) => (
//                     <div
//                       key={person.id}
//                       className="bg-neutral-950 border border-white/10 rounded-lg p-6 hover:border-green-500/50 transition-colors group"
//                     >
//                       {/* Avatar */}
//                       <div className="flex items-start gap-4 mb-4">
//                         <div className="h-16 w-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
//                           {getInitials(person.name)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-lg font-semibold mb-1 truncate">{person.name}</h3>
//                           {person.experience && (
//                             <>
//                               <p className="text-sm text-white/80 truncate">{extractRole(person.experience)}</p>
//                               <p className="text-sm text-white/60 truncate">{extractCompany(person.experience)}</p>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       {/* Details */}
//                       <div className="space-y-2 mb-4">
//                         <div className="flex items-center gap-2 text-sm text-white/60">
//                           <GraduationCap className="h-4 w-4 flex-shrink-0" />
//                           <span className="truncate">{person.course.name} - {person.batch.year}</span>
//                         </div>
//                         {person.livesIn?.city && (
//                           <div className="flex items-center gap-2 text-sm text-white/60">
//                             <MapPin className="h-4 w-4 flex-shrink-0" />
//                             <span className="truncate">{person.livesIn.city}</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Social Links */}
//                       <div className="flex items-center gap-3 pt-4 border-t border-white/10">
//                         {person.email && (
//                           <a
//                             href={`mailto:${person.email}`}
//                             className="text-white/60 hover:text-green-500 transition-colors"
//                             title="Email"
//                           >
//                             <Mail className="h-5 w-5" />
//                           </a>
//                         )}
//                         {person.social?.linkedin && (
//                           <a
//                             href={person.social.linkedin}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-white/60 hover:text-green-500 transition-colors"
//                             title="LinkedIn"
//                           >
//                             <Linkedin className="h-5 w-5" />
//                           </a>
//                         )}
//                         {person.social?.github && (
//                           <a
//                             href={person.social.github}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-white/60 hover:text-green-500 transition-colors"
//                             title="GitHub"
//                           >
//                             <Github className="h-5 w-5" />
//                           </a>
//                         )}
//                         {person.social?.twitter && (
//                           <a
//                             href={person.social.twitter}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-white/60 hover:text-green-500 transition-colors"
//                             title="Twitter"
//                           >
//                             <Twitter className="h-5 w-5" />
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {pagination && pagination.totalPages > 1 && (
//                   <div className="mt-8 flex items-center justify-center gap-2">
//                     <button
//                       onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//                       disabled={!pagination.hasPrevPage}
//                       className="p-2 rounded-lg bg-neutral-950 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500/50 transition-colors"
//                     >
//                       <ChevronLeft className="h-5 w-5" />
//                     </button>
                    
//                     <div className="flex items-center gap-2">
//                       {[...Array(pagination.totalPages)].map((_, i) => {
//                         const page = i + 1;
//                         // Show first 2, last 2, and current with neighbors
//                         if (
//                           page === 1 ||
//                           page === 2 ||
//                           page === pagination.totalPages ||
//                           page === pagination.totalPages - 1 ||
//                           (page >= filters.page - 1 && page <= filters.page + 1)
//                         ) {
//                           return (
//                             <button
//                               key={page}
//                               onClick={() => setFilters({ ...filters, page })}
//                               className={`w-10 h-10 rounded-lg ${
//                                 page === filters.page
//                                   ? 'bg-green-600 text-white'
//                                   : 'bg-neutral-950 border border-white/10 hover:border-green-500/50'
//                               } transition-colors`}
//                             >
//                               {page}
//                             </button>
//                           );
//                         } else if (page === 3 || page === pagination.totalPages - 2) {
//                           return <span key={page} className="text-white/40">...</span>;
//                         }
//                         return null;
//                       })}
//                     </div>

//                     <button
//                       onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//                       disabled={!pagination.hasNextPage}
//                       className="p-2 rounded-lg bg-neutral-950 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500/50 transition-colors"
//                     >
//                       <ChevronRight className="h-5 w-5" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AlumniDirectory;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getAlumni } from "../../services/alumniApi";
import toast from "react-hot-toast";

// Parse CSV string to array of objects
const parseCSV = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(',');
    
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j]?.trim().replace(/^"|"$/g, '') || '';
    }
    data.push(obj);
  }
  return data;
};

// Load CSV from public folder
const loadCSVData = async () => {
  try {
    const response = await fetch('/alumni_cleaned.csv');
    const csv = await response.text();
    return parseCSV(csv);
  } catch (error) {
    console.error('Failed to load CSV:', error);
    return [];
  }
};

const AlumniDirectory = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("all");
  const [page, setPage] = useState(1);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [batchCounts, setBatchCounts] = useState({});
  const [allData, setAllData] = useState([]);

  // Fetch alumni data from CSV
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const csvData = await loadCSVData();
        
        if (!csvData || csvData.length === 0) {
          toast.error("No alumni data available");
          setAlumni([]);
          return;
        }

        setAllData(csvData);
        
        // Extract available batches
        const batchMap = {};
        csvData.forEach((a) => {
          const batchYear = a.batch;
          if (batchYear) {
            batchMap[batchYear] = (batchMap[batchYear] || 0) + 1;
          }
        });
        
        const batchList = Object.keys(batchMap).sort((a, b) => {
          const yearA = parseInt(a.replace(/\D/g, '')) || 0;
          const yearB = parseInt(b.replace(/\D/g, '')) || 0;
          return yearB - yearA;
        });
        
        setAvailableBatches(["all", ...batchList]);
        setBatchCounts(batchMap);
      } catch (error) {
        toast.error("Failed to load alumni");
        console.error(error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Filter data based on search and batch
  useEffect(() => {
    let filtered = allData;

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name?.toLowerCase().includes(searchLower) ||
        a.experience?.toLowerCase().includes(searchLower) ||
        a.course?.toLowerCase().includes(searchLower)
      );
    }

    if (batch !== "all") {
      filtered = filtered.filter(a => a.batch === batch);
    }

    // Paginate
    const start = (page - 1) * 12;
    const paged = filtered.slice(start, start + 12);
    
    setAlumni(paged);
  }, [search, batch, page, allData]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleBatchChange = (e) => {
    setBatch(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-28 relative overflow-hidden text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-top bg-repeat"
        style={{
          backgroundImage: "url('/gotbackground.png')",
          backgroundSize: "400px 400px",
        }}
      />
      <div className="absolute inset-0 bg-[rgba(19,20,20,0.85)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,20,20,0)_35%,rgba(19,20,20,0.95)_100%)]" />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/90 backdrop-blur-xl px-6 py-8 md:px-10 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500 mb-4">
              Community
            </p>
            <h1 className="text-4xl font-light mb-3">
              Alumni Directory
            </h1>
            <p className="text-sm text-neutral-400">
              Connect with our alumni network
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <input
              placeholder="Search by name, company..."
              value={search}
              onChange={handleSearchChange}
              className="bg-black border border-white/10 rounded-lg px-4 py-2
              text-sm text-white placeholder:text-neutral-500
              focus:outline-none focus:border-[#4A5E2A] focus:shadow-[0_0_0_2px_rgba(74,94,42,0.2)]
              transition-all duration-200"
            />

            <select
              value={batch}
              onChange={handleBatchChange}
              className="bg-black border border-white/10 rounded-lg px-4 py-2
              text-sm text-white focus:outline-none focus:border-[#4A5E2A]
              focus:shadow-[0_0_0_2px_rgba(74,94,42,0.2)]
              appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2rem'
              }}
            >
              <option value="all">
                All Batch Years {Object.keys(batchCounts).length > 0 && `(${Object.values(batchCounts).reduce((a, b) => a + b, 0)})`}
              </option>
              {availableBatches.filter(b => b !== "all").map((b) => (
                <option key={b} value={b}>
                  Batch of {b} ({batchCounts[b] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="flex-1">
                      <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            ) : alumni.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-sm text-neutral-500">No alumni found.</p>
              </div>
            ) : (
              alumni.map((a) => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/alumni/${a.id}`, { state: { alumni: a } })}
                  className="
                    group rounded-xl border border-white/10
                    bg-white/[0.03] p-5 cursor-pointer
                    transition-all duration-200
                    hover:bg-white/[0.06]
                    hover:translate-y-[-2px]
                  "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm"
                        style={{ backgroundColor: "#4A5E2A" }}
                      >
                        {a.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-neutral-400">
                          {a.batch}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition" />
                  </div>

                  <div className="border-t border-white/10 my-4" />

                  <p className="text-sm text-neutral-300">
                    {a.experience || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDirectory;
