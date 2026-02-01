// import { useState } from 'react';
// import { resumeAPI } from '../services/api';

// function ResumeQA() {
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleAsk = async () => {
//     if (!question.trim()) return;

//     const userMessage = { role: 'user', content: question };
//     setChatHistory(prev => [...prev, userMessage]);
//     setQuestion('');
//     setLoading(true);

//     try {
//       const response = await resumeAPI.askQuestion({
//         question,
//         chat_history: chatHistory,
//       });

//       const assistantMessage = { role: 'assistant', content: response.data.answer };
//       setChatHistory(prev => [...prev, assistantMessage]);
//     } catch (error) {
//       const errorMessage = {
//         role: 'assistant',
//         content: `Error: ${error.response?.data?.detail || 'Failed to get answer'}`,
//       };
//       setChatHistory(prev => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleAsk();
//     }
//   };

//   const clearChat = () => {
//     setChatHistory([]);
//   };

//   return (
//     <div className="resume-qa">
//       <div className="qa-container">
//         <div className="qa-header">
//           <h2>💬 Resume Q&A</h2>
//           <p className="description">Ask questions about your resume</p>
//           {chatHistory.length > 0 && (
//             <button className="btn-clear" onClick={clearChat}>
//               🗑️ Clear Chat
//             </button>
//           )}
//         </div>

//         <div className="chat-container">
//           {chatHistory.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">💭</div>
//               <p>Ask me anything about your resume!</p>
//               <div className="example-questions">
//                 <p><strong>Example questions:</strong></p>
//                 <ul>
//                   <li>"What are my key skills?"</li>
//                   <li>"Summarize my work experience"</li>
//                   <li>"What are my weaknesses?"</li>
//                   <li>"What projects have I worked on?"</li>
//                 </ul>
//               </div>
//             </div>
//           ) : (
//             <div className="chat-messages">
//               {chatHistory.map((msg, idx) => (
//                 <div key={idx} className={`message ${msg.role}`}>
//                   <div className="message-avatar">
//                     {msg.role === 'user' ? '👤' : '🤖'}
//                   </div>
//                   <div className="message-content">
//                     {msg.content}
//                   </div>
//                 </div>
//               ))}
//               {loading && (
//                 <div className="message assistant">
//                   <div className="message-avatar">🤖</div>
//                   <div className="message-content typing">
//                     <span></span><span></span><span></span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="input-container">
//           <textarea
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your question here..."
//             rows="3"
//             disabled={loading}
//           />
//           <button
//             className="btn-send"
//             onClick={handleAsk}
//             disabled={loading || !question.trim()}
//           >
//             {loading ? '⏳' : '📤'} Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResumeQA;

import { useState } from 'react';
import { resumeAPI } from '../services/api';

function ResumeQA() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await resumeAPI.askQuestion({
        question,
        chat_history: chatHistory,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
      };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${
          error.response?.data?.detail || 'Failed to get answer'
        }`,
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">Resume Q&A</h2>
          <p className="text-sm text-neutral-400">
            Ask questions about your resume
          </p>
        </div>

        {chatHistory.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs rounded-full border border-white/10 px-4 py-1.5 text-neutral-400 hover:bg-white/5 transition"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Chat Container */}
      <div className="border border-white/10 rounded-2xl bg-neutral-950 h-[480px] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-sm text-neutral-400">
                Ask me anything about your resume
              </p>
              <div className="mt-4 text-xs text-neutral-500 space-y-1">
                <p>Example questions:</p>
                <p>What are my key skills?</p>
                <p>Summarize my work experience</p>
                <p>What are my weaknesses?</p>
                <p>What projects have I worked on?</p>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-2 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/5 text-neutral-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-neutral-400 rounded-xl px-4 py-2 text-sm">
                    Thinking...
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 flex gap-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here"
            rows={2}
            disabled={loading}
            className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg px-5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeQA;
