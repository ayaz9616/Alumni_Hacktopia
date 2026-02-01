// import { useState } from 'react';
// import { resumeAPI } from '../services/api';

// function ResumeUpload({ onUploadSuccess }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [resumes, setResumes] = useState([]);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setMessage('');
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage('Please select a file');
//       return;
//     }

//     if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
//       setMessage('Only PDF and TXT files are supported');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await resumeAPI.uploadResume(file);
//       setMessage(`✅ ${response.data.message}`);
//       setFile(null);
//       document.getElementById('file-input').value = '';
//       if (onUploadSuccess) onUploadSuccess(response.data);
//       loadResumes();
//     } catch (error) {
//       setMessage(`❌ ${error.response?.data?.detail || 'Upload failed'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadResumes = async () => {
//     try {
//       const response = await resumeAPI.listResumes();
//       setResumes(response.data.resumes || []);
//     } catch (error) {
//       console.error('Failed to load resumes:', error);
//     }
//   };

//   useState(() => {
//     loadResumes();
//   }, []);

//   return (
//     <div className="resume-upload">
//       <div className="upload-card">
//         <h2>📄 Upload Resume</h2>
//         <p className="description">Upload your resume in PDF or TXT format</p>
        
//         <div className="upload-area">
//           <input
//             id="file-input"
//             type="file"
//             accept=".pdf,.txt"
//             onChange={handleFileChange}
//             disabled={loading}
//           />
//           {file && <p className="file-name">Selected: {file.name}</p>}
//         </div>

//         <button
//           className="btn-primary"
//           onClick={handleUpload}
//           disabled={loading || !file}
//         >
//           {loading ? '⏳ Uploading...' : '📤 Upload Resume'}
//         </button>

//         {message && (
//           <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
//             {message}
//           </div>
//         )}
//       </div>

//       {resumes.length > 0 && (
//         <div className="resumes-list">
//           <h3>Your Resumes</h3>
//           <div className="resumes-grid">
//             {resumes.map((resume) => (
//               <div key={resume.id} className="resume-item">
//                 <span className="resume-name">{resume.filename}</span>
//                 <span className="resume-date">
//                   {new Date(resume.created_at).toLocaleDateString()}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ResumeUpload;
import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';

function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resumes, setResumes] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setMessage('Only PDF and TXT files are supported');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await resumeAPI.uploadResume(file);
      setMessage(response.data.message);
      setFile(null);
      document.getElementById('file-input').value = '';
      if (onUploadSuccess) onUploadSuccess(response.data);
      loadResumes();
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.listResumes();
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  return (
    <div className="space-y-10">
      {/* Upload Card */}
      <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8">
        <h2 className="text-xl font-medium">Upload Resume</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Upload your resume in PDF or TXT format
        </p>

        {/* File Input */}
        <div className="mt-6">
          <label
            htmlFor="file-input"
            className="block w-full cursor-pointer rounded-xl border border-dashed border-white/20 p-6 text-center hover:border-green-500/40 transition"
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
            <p className="text-sm text-neutral-400">
              {file ? `Selected file: ${file.name}` : 'Click to select a resume file'}
            </p>
          </label>
        </div>

        {/* Upload Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              message.toLowerCase().includes('failed')
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-green-500/10 border border-green-500/30 text-green-400'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Resume List */}
      
    </div>
  );
}

export default ResumeUpload;
