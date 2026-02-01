// import { useState, useEffect } from 'react';
// import { settingsAPI } from '../services/api';

// function Settings() {
//   const [settings, setSettings] = useState({
//     provider: 'groq',
//     api_key: '',
//     model: '',
//     ollama_base_url: 'http://localhost:11434',
//     ollama_model: 'llama3.1:8b',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     loadSettings();
//   }, []);

//   const loadSettings = async () => {
//     try {
//       const response = await settingsAPI.getSettings();
//       setSettings(response.data);
//     } catch (error) {
//       console.error('Failed to load settings:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSettings(prev => ({ ...prev, [name]: value }));
//     setMessage('');
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       await settingsAPI.updateSettings(settings);
//       setMessage('✅ Settings saved successfully!');
//     } catch (error) {
//       setMessage(`❌ ${error.response?.data?.detail || 'Failed to save settings'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="settings">
//       <div className="settings-container">
//         <h2>⚙️ Settings</h2>
//         <p className="description">Configure your AI provider and API keys</p>

//         <div className="settings-form">
//           <div className="form-group">
//             <label>LLM Provider</label>
//             <select name="provider" value={settings.provider} onChange={handleChange} disabled={loading}>
//               <option value="groq">Groq</option>
//               <option value="openai">OpenAI</option>
//               <option value="ollama">Ollama (Local)</option>
//             </select>
//           </div>

//           {(settings.provider === 'groq' || settings.provider === 'openai') && (
//             <div className="form-group">
//               <label>API Key</label>
//               <input
//                 type="password"
//                 name="api_key"
//                 value={settings.api_key || ''}
//                 onChange={handleChange}
//                 placeholder="Enter your API key"
//                 disabled={loading}
//               />
//               <small className="hint">
//                 {settings.provider === 'groq' ? 'Get your Groq API key from groq.com' : 'Get your OpenAI API key from platform.openai.com'}
//               </small>
//             </div>
//           )}

//           {(settings.provider === 'groq' || settings.provider === 'openai') && (
//             <div className="form-group">
//               <label>Model (Optional)</label>
//               <input
//                 type="text"
//                 name="model"
//                 value={settings.model || ''}
//                 onChange={handleChange}
//                 placeholder={settings.provider === 'groq' ? 'e.g., llama-3.1-8b-instant' : 'e.g., gpt-4'}
//                 disabled={loading}
//               />
//             </div>
//           )}

//           {settings.provider === 'ollama' && (
//             <>
//               <div className="form-group">
//                 <label>Ollama Base URL</label>
//                 <input
//                   type="text"
//                   name="ollama_base_url"
//                   value={settings.ollama_base_url || ''}
//                   onChange={handleChange}
//                   placeholder="http://localhost:11434"
//                   disabled={loading}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Ollama Model</label>
//                 <input
//                   type="text"
//                   name="ollama_model"
//                   value={settings.ollama_model || ''}
//                   onChange={handleChange}
//                   placeholder="llama3.1:8b"
//                   disabled={loading}
//                 />
//               </div>
//             </>
//           )}

//           <button className="btn-save" onClick={handleSave} disabled={loading}>
//             {loading ? '⏳ Saving...' : '💾 Save Settings'}
//           </button>

//           {message && (
//             <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
//               {message}
//             </div>
//           )}
//         </div>

//         <div className="settings-info">
//           <h3>ℹ️ Information</h3>
//           <ul>
//             <li><strong>Groq:</strong> Fast and free API for Llama models</li>
//             <li><strong>OpenAI:</strong> Access to GPT models (paid)</li>
//             <li><strong>Ollama:</strong> Run models locally on your machine</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Settings;


import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

function Settings() {
  const [settings, setSettings] = useState({
    provider: 'groq',
    api_key: '',
    model: '',
    ollama_base_url: 'http://localhost:11434',
    ollama_model: 'llama3.1:8b',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      await settingsAPI.updateSettings(settings);
      setMessage('Settings saved successfully');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Settings Form */}
      <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8">
        <h2 className="text-xl font-medium">Settings</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Configure your AI provider and API keys
        </p>

        {/* Provider */}
        <div className="mt-6">
          <label className="block text-xs uppercase text-neutral-500 mb-2">
            LLM Provider
          </label>
          <select
            name="provider"
            value={settings.provider}
            onChange={handleChange}
            disabled={loading}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
          >
            <option value="groq">Groq</option>
            <option value="openai">OpenAI</option>
            <option value="ollama">Ollama (Local)</option>
          </select>
        </div>

        {/* API Key */}
        {(settings.provider === 'groq' ||
          settings.provider === 'openai') && (
          <div className="mt-6">
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              API Key
            </label>
            <input
              type="password"
              name="api_key"
              value={settings.api_key || ''}
              onChange={handleChange}
              placeholder="Enter your API key"
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
            <p className="text-xs text-neutral-500 mt-2">
              {settings.provider === 'groq'
                ? 'Get your Groq API key from groq.com'
                : 'Get your OpenAI API key from platform.openai.com'}
            </p>
          </div>
        )}

        {/* Model */}
        {(settings.provider === 'groq' ||
          settings.provider === 'openai') && (
          <div className="mt-6">
            <label className="block text-xs uppercase text-neutral-500 mb-2">
              Model (optional)
            </label>
            <input
              type="text"
              name="model"
              value={settings.model || ''}
              onChange={handleChange}
              placeholder={
                settings.provider === 'groq'
                  ? 'llama-3.1-8b-instant'
                  : 'gpt-4'
              }
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
            />
          </div>
        )}

        {/* Ollama Settings */}
        {settings.provider === 'ollama' && (
          <>
            <div className="mt-6">
              <label className="block text-xs uppercase text-neutral-500 mb-2">
                Ollama Base URL
              </label>
              <input
                type="text"
                name="ollama_base_url"
                value={settings.ollama_base_url || ''}
                onChange={handleChange}
                placeholder="http://localhost:11434"
                disabled={loading}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
              />
            </div>

            <div className="mt-6">
              <label className="block text-xs uppercase text-neutral-500 mb-2">
                Ollama Model
              </label>
              <input
                type="text"
                name="ollama_model"
                value={settings.ollama_model || ''}
                onChange={handleChange}
                placeholder="llama3.1:8b"
                disabled={loading}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
              />
            </div>
          </>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-sm ${
              message.toLowerCase().includes('success')
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="border border-white/10 rounded-2xl bg-neutral-950 p-6">
        <h3 className="text-sm font-medium text-neutral-300 mb-3">
          Information
        </h3>
        <ul className="space-y-2 text-sm text-neutral-400">
          <li>
            <strong className="text-white">Groq:</strong> Fast and free API for
            Llama models
          </li>
          <li>
            <strong className="text-white">OpenAI:</strong> Access to GPT models
            (paid)
          </li>
          <li>
            <strong className="text-white">Ollama:</strong> Run models locally on
            your machine
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;

