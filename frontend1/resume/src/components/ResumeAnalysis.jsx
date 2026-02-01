// import { useState } from 'react';
// import { resumeAPI } from '../services/api';

// function ResumeAnalysis() {
//   const [formData, setFormData] = useState({
//     role: '',
//     cutoff_score: 75,
//     jd_text: '',
//     custom_skills: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAnalyze = async () => {
//     if (!formData.role.trim()) {
//       alert('Please enter a job role');
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     try {
//       const payload = {
//         role: formData.role,
//         cutoff_score: parseInt(formData.cutoff_score),
//         jd_text: formData.jd_text || null,
//         custom_skills: formData.custom_skills ? formData.custom_skills.split(',').map(s => s.trim()) : null,
//       };

//       const response = await resumeAPI.analyzeResume(payload);
//       setResult(response.data);
//     } catch (error) {
//       alert(error.response?.data?.detail || 'Analysis failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="resume-analysis">
//       <div className="analysis-form">
//         <h2>🎯 Resume Analysis</h2>
//         <p className="description">Analyze your resume against job requirements</p>

//         <div className="form-group">
//           <label>Job Role *</label>
//           <input
//             type="text"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             placeholder="e.g., Software Engineer, Data Scientist"
//             disabled={loading}
//           />
//         </div>

//         <div className="form-group">
//           <label>Cutoff Score (0-100)</label>
//           <input
//             type="number"
//             name="cutoff_score"
//             value={formData.cutoff_score}
//             onChange={handleChange}
//             min="0"
//             max="100"
//             disabled={loading}
//           />
//         </div>

//         <div className="form-group">
//           <label>Job Description (Optional)</label>
//           <textarea
//             name="jd_text"
//             value={formData.jd_text}
//             onChange={handleChange}
//             placeholder="Paste the job description here..."
//             rows="4"
//             disabled={loading}
//           />
//         </div>

//         <div className="form-group">
//           <label>Custom Skills (Optional, comma-separated)</label>
//           <input
//             type="text"
//             name="custom_skills"
//             value={formData.custom_skills}
//             onChange={handleChange}
//             placeholder="Python, JavaScript, React, Machine Learning"
//             disabled={loading}
//           />
//         </div>

//         <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
//           {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
//         </button>
//       </div>

//       {result && (
//         <div className="analysis-results">
//           <div className="score-card">
//             <h3>Overall Score</h3>
//             <div className="score-circle">
//               <span className="score-value">{result.overall_score.toFixed(1)}</span>
//               <span className="score-label">/ 100</span>
//             </div>
//           </div>

//           <div className="results-grid">
//             <div className="result-section">
//               <h3>✅ Matching Skills ({result.matching_skills.length})</h3>
//               <div className="skills-list">
//                 {result.matching_skills.map((skill, idx) => (
//                   <span key={idx} className="skill-tag match">{skill}</span>
//                 ))}
//               </div>
//             </div>

//             <div className="result-section">
//               <h3>❌ Missing Skills ({result.missing_skills.length})</h3>
//               <div className="skills-list">
//                 {result.missing_skills.map((skill, idx) => (
//                   <span key={idx} className="skill-tag missing">{skill}</span>
//                 ))}
//               </div>
//             </div>

//             <div className="result-section">
//               <h3>💪 Strengths</h3>
//               <ul>
//                 {result.strengths.map((strength, idx) => (
//                   <li key={idx}>{strength}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="result-section">
//               <h3>📈 Recommendations</h3>
//               <ul>
//                 {result.recommendations.map((rec, idx) => (
//                   <li key={idx}>{rec}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {result.skill_scores && Object.keys(result.skill_scores).length > 0 && (
//             <div className="skill-scores">
//               <h3>Skill Ratings</h3>
//               {Object.entries(result.skill_scores).map(([skill, score]) => (
//                 <div key={skill} className="skill-bar">
//                   <span className="skill-name">{skill}</span>
//                   <div className="bar-container">
//                     <div className="bar-fill" style={{ width: `${(score / 10) * 100}%` }}></div>
//                   </div>
//                   <span className="skill-score">{score.toFixed(1)}/10</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ResumeAnalysis;


import { useState } from 'react';
import { resumeAPI } from '../services/api';

function ResumeAnalysis() {
  const [formData, setFormData] = useState({
    role: '',
    cutoff_score: 75,
    jd_text: '',
    custom_skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    if (!formData.role.trim()) {
      alert('Please enter a job role');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload = {
        role: formData.role,
        cutoff_score: parseInt(formData.cutoff_score),
        jd_text: formData.jd_text || null,
        custom_skills: formData.custom_skills
          ? formData.custom_skills.split(',').map(s => s.trim())
          : null,
      };

      const response = await resumeAPI.analyzeResume(payload);
      setResult(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Analysis Form */}
      <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8">
        <h2 className="text-xl font-medium">Resume Analysis</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Analyze your resume against job requirements
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              Job Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Software Engineer, Data Scientist"
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              Cutoff Score
            </label>
            <input
              type="number"
              name="cutoff_score"
              value={formData.cutoff_score}
              onChange={handleChange}
              min="0"
              max="100"
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              Job Description (optional)
            </label>
            <textarea
              name="jd_text"
              value={formData.jd_text}
              onChange={handleChange}
              rows={4}
              placeholder="Paste the job description here"
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              Custom Skills (comma-separated)
            </label>
            <input
              type="text"
              name="custom_skills"
              value={formData.custom_skills}
              onChange={handleChange}
              placeholder="Python, JavaScript, React"
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Score */}
          <div className="border border-white/10 rounded-2xl bg-neutral-950 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Overall Score</p>
              <p className="text-3xl font-medium text-green-400">
                {result.overall_score.toFixed(1)}
                <span className="text-sm text-neutral-500"> / 100</span>
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Matching Skills ({result.matching_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matching_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-white/10 rounded-xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Missing Skills ({result.missing_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Strengths
              </h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                {result.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 rounded-xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill Scores */}
          {result.skill_scores && Object.keys(result.skill_scores).length > 0 && (
            <div className="border border-white/10 rounded-2xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium text-neutral-300 mb-4">
                Skill Ratings
              </h3>
              <div className="space-y-3">
                {Object.entries(result.skill_scores).map(([skill, score]) => (
                  <div key={skill} className="flex items-center gap-4">
                    <span className="w-32 text-xs text-neutral-400 truncate">
                      {skill}
                    </span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-400 w-10 text-right">
                      {score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeAnalysis;
