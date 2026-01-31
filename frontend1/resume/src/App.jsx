import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ResumeUpload from './components/ResumeUpload';
import ResumeAnalysis from './components/ResumeAnalysis';
import ResumeImprovement from './components/ResumeImprovement';
import ResumeQA from './components/ResumeQA';
import MockInterview from './components/MockInterview';
import JobSearch from './components/JobSearch';
import Settings from './components/Settings';
import N8nTest from './components/N8nTest';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  const navItems = [
    { id: 'upload', label: '📄 Upload', path: '/upload' },
    { id: 'analysis', label: '🎯 Analysis', path: '/analysis' },
    { id: 'improvement', label: '✨ Improvement', path: '/improvement' },
    { id: 'qa', label: '💬 Q&A', path: '/qa' },
    { id: 'interview', label: '🎤 Interview', path: '/interview' },
    { id: 'jobs', label: '🔍 Job Search', path: '/jobs' },
    { id: 'n8n', label: '🧪 n8n Test', path: '/n8n-test' },
    { id: 'settings', label: '⚙️ Settings', path: '/settings' },
  ];

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">🤖 ResuMate</h1>
            <p className="app-subtitle">AI-Powered Resume & Interview Assistant</p>
          </div>
        </header>

        <nav className="app-nav">
          <div className="nav-container">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <main className="app-main">
          <div className="main-container">
            <Routes>
              <Route path="/" element={<Navigate to="/upload" replace />} />
              <Route path="/upload" element={<ResumeUpload />} />
              <Route path="/analysis" element={<ResumeAnalysis />} />
              <Route path="/improvement" element={<ResumeImprovement />} />
              <Route path="/qa" element={<ResumeQA />} />
              <Route path="/interview" element={<MockInterview />} />
              <Route path="/jobs" element={<JobSearch />} />
              <Route path="/n8n-test" element={<N8nTest />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <p>© 2026 ResuMate - Your AI Career Companion | Powered by FastAPI & React</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
