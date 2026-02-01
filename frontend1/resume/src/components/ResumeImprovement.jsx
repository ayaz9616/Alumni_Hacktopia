// import { useState } from 'react';
// import { resumeAPI } from '../services/api';

// function ResumeImprovement() {
//   const [focusAreas, setFocusAreas] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleImprove = async () => {
//     setLoading(true);
//     setResult(null);

//     try {
//       const payload = {
//         focus_areas: focusAreas ? focusAreas.split(',').map(s => s.trim()) : null,
//       };

//       const response = await resumeAPI.improveResume(payload);
//       setResult(response.data);
//     } catch (error) {
//       alert(error.response?.data?.detail || 'Improvement generation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="resume-improvement">
//       <div className="improvement-form">
//         <h2>✨ Resume Improvement</h2>
//         <p className="description">Get AI-powered suggestions to enhance your resume</p>

//         <div className="form-group">
//           <label>Focus Areas (Optional, comma-separated)</label>
//           <input
//             type="text"
//             value={focusAreas}
//             onChange={(e) => setFocusAreas(e.target.value)}
//             placeholder="e.g., Experience, Skills, Education"
//             disabled={loading}
//           />
//         </div>

//         <button className="btn-primary" onClick={handleImprove} disabled={loading}>
//           {loading ? '⏳ Generating Improvements...' : '🚀 Get Improvements'}
//         </button>
//       </div>

//       {result && (
//         <div className="improvement-results">
//           <div className="overall-section">
//             <h3>📊 Overall Improvements</h3>
//             <div className="content-box">
//               {result.overall_improvements}
//             </div>
//           </div>

//           {result.improved_sections && Object.keys(result.improved_sections).length > 0 && (
//             <div className="sections-grid">
//               <h3>📝 Improved Sections</h3>
//               {Object.entries(result.improved_sections).map(([section, content]) => (
//                 <div key={section} className="section-card">
//                   <h4>{section}</h4>
//                   <div className="section-content">
//                     {content.description && (
//                       <p className="section-description">{content.description}</p>
//                     )}
//                     {content.specific && content.specific.length > 0 && (
//                       <div className="specific-suggestions">
//                         <strong>Specific Improvements:</strong>
//                         <ul>
//                           {content.specific.map((item, idx) => (
//                             <li key={idx}>{item}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                     {content.before_after && (
//                       <div className="before-after">
//                         <div className="before">
//                           <strong>Before:</strong>
//                           <pre>{content.before_after.before}</pre>
//                         </div>
//                         <div className="after">
//                           <strong>After:</strong>
//                           <pre>{content.before_after.after}</pre>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {result.suggestions && result.suggestions.length > 0 && (
//             <div className="suggestions-section">
//               <h3>💡 Suggestions</h3>
//               <ul className="suggestions-list">
//                 {result.suggestions.map((suggestion, idx) => (
//                   <li key={idx} className="suggestion-item">
//                     <span className="suggestion-icon">💡</span>
//                     <span className="suggestion-text">{suggestion}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ResumeImprovement;


import { useState } from 'react';
import { resumeAPI } from '../services/api';

function ResumeImprovement() {
  const [focusAreas, setFocusAreas] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const normalizeResult = (raw) => {
    if (!raw) return null;

    const tryParse = (text) => {
      let cleaned = String(text).trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
      }
      if (!cleaned.startsWith('{')) {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) cleaned = match[0];
      }
      try {
        return JSON.parse(cleaned);
      } catch (err) {
        return null;
      }
    };

    if (typeof raw === 'string') {
      const parsed = tryParse(raw);
      return parsed || { overall_improvements: raw };
    }

    if (typeof raw === 'object') {
      const possibleText = raw?.text || raw?.content || raw?.message || raw?.output;
      if (typeof possibleText === 'string') {
        const parsed = tryParse(possibleText);
        return parsed || { overall_improvements: possibleText };
      }

      if (typeof raw?.overall_improvements === 'string') {
        const parsed = tryParse(raw.overall_improvements);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }

      if (typeof raw?.improved_sections === 'string') {
        const parsed = tryParse(raw.improved_sections);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }

      return raw;
    }

    return { overall_improvements: String(raw) };
  };

  const handleImprove = async () => {
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        focus_areas: focusAreas
          ? focusAreas.split(',').map(s => s.trim())
          : null,
      };

      const response = await resumeAPI.improveResume(payload);
      setResult(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || 'Improvement generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Form */}
      <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8">
        <h2 className="text-xl font-medium">Resume Improvement</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Get AI-powered suggestions to enhance your resume
        </p>

        <div className="mt-6">
          <label className="block text-xs uppercase text-neutral-500 mb-2">
            Focus Areas (optional)
          </label>
          <input
            type="text"
            value={focusAreas}
            onChange={(e) => setFocusAreas(e.target.value)}
            placeholder="Experience, Skills, Education"
            disabled={loading}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
          />
        </div>

        <button
          onClick={handleImprove}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Generating improvements...' : 'Get Improvements'}
        </button>
      </div>

      {/* Results */}
      {result && (() => {
        const display = normalizeResult(result);
        if (!display) return null;
        return (
        <div className="space-y-8">
          {/* Overall Improvements */}
          <div className="border border-white/10 rounded-2xl bg-neutral-950 p-6">
            <h3 className="text-sm font-medium text-neutral-300 mb-3">
              Overall Improvements
            </h3>
            <p className="text-sm text-neutral-400 whitespace-pre-line">
              {display.overall_improvements || display.overall || ''}
            </p>
          </div>

          {/* Improved Sections */}
          {display.improved_sections &&
            Object.keys(display.improved_sections).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-300">
                  Improved Sections
                </h3>

                {Object.entries(display.improved_sections).map(
                  ([section, content]) => (
                    <div
                      key={section}
                      className="border border-white/10 rounded-xl bg-neutral-950 p-6"
                    >
                      <h4 className="text-sm font-medium text-white mb-2">
                        {section}
                      </h4>

                      {content.description && (
                        <p className="text-sm text-neutral-400 mb-3">
                          {content.description}
                        </p>
                      )}

                      {content.specific && content.specific.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs uppercase text-neutral-500 mb-2">
                            Specific Improvements
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                            {content.specific.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {content.before_after && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-white/10 rounded-lg p-4 bg-black">
                            <p className="text-xs uppercase text-neutral-500 mb-2">
                              Before
                            </p>
                            <pre className="text-xs text-neutral-400 whitespace-pre-wrap">
                              {content.before_after.before}
                            </pre>
                          </div>
                          <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
                            <p className="text-xs uppercase text-green-400 mb-2">
                              After
                            </p>
                            <pre className="text-xs text-green-400 whitespace-pre-wrap">
                              {content.before_after.after}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}

          {/* Suggestions */}
          {display.suggestions && display.suggestions.length > 0 && (
            <div className="border border-white/10 rounded-2xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Suggestions
              </h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                {display.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        );
      })()}
    </div>
  );
}

export default ResumeImprovement;
