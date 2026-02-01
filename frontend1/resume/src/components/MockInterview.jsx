// import { useState } from 'react';
// import { interviewAPI } from '../services/api';

// function MockInterview() {
//   const [step, setStep] = useState('setup'); // setup, interview, summary
//   const [config, setConfig] = useState({
//     question_types: ['Technical'],
//     difficulty: 'Medium',
//     num_questions: 5,
//     max_duration_minutes: 15,
//   });
//   const [interview, setInterview] = useState(null);
//   const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
//   const [answer, setAnswer] = useState('');
//   const [answers, setAnswers] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const questionTypes = ['Technical', 'Behavioral', 'System Design', 'Coding'];
//   const difficulties = ['Easy', 'Medium', 'Hard'];

//   const handleTypeToggle = (type) => {
//     setConfig(prev => ({
//       ...prev,
//       question_types: prev.question_types.includes(type)
//         ? prev.question_types.filter(t => t !== type)
//         : [...prev.question_types, type]
//     }));
//   };

//   const startInterview = async () => {
//     if (config.question_types.length === 0) {
//       alert('Please select at least one question type');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await interviewAPI.startInterview(config);
//       setInterview(response.data);
//       setStep('interview');
//       setCurrentQuestionIdx(0);
//       setAnswers([]);
//     } catch (error) {
//       alert(error.response?.data?.detail || 'Failed to start interview');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitAnswer = async () => {
//     if (!answer.trim()) {
//       alert('Please provide an answer');
//       return;
//     }

//     setLoading(true);
//     try {
//       const submission = {
//         question_id: currentQuestionIdx,
//         transcript: answer,
//       };

//       const response = await interviewAPI.submitAnswer(interview.interview_id, submission);
//       setAnswers(prev => [...prev, { question: interview.questions[currentQuestionIdx].question_text, answer, score: response.data.scores }]);
//       setAnswer('');

//       if (response.data.next_question_id !== null) {
//         setCurrentQuestionIdx(response.data.next_question_id);
//       } else {
//         // Interview complete, fetch summary
//         const summaryResponse = await interviewAPI.getSummary(interview.interview_id);
//         setSummary(summaryResponse.data);
//         setStep('summary');
//       }
//     } catch (error) {
//       alert(error.response?.data?.detail || 'Failed to submit answer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetInterview = () => {
//     setStep('setup');
//     setInterview(null);
//     setCurrentQuestionIdx(0);
//     setAnswer('');
//     setAnswers([]);
//     setSummary(null);
//   };

//   return (
//     <div className="mock-interview">
//       {step === 'setup' && (
//         <div className="interview-setup">
//           <h2>🎤 Mock Interview Setup</h2>
//           <p className="description">Configure your mock interview session</p>

//           <div className="config-section">
//             <h3>Question Types</h3>
//             <div className="type-buttons">
//               {questionTypes.map(type => (
//                 <button
//                   key={type}
//                   className={`type-btn ${config.question_types.includes(type) ? 'active' : ''}`}
//                   onClick={() => handleTypeToggle(type)}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="config-section">
//             <h3>Difficulty</h3>
//             <div className="difficulty-buttons">
//               {difficulties.map(diff => (
//                 <button
//                   key={diff}
//                   className={`diff-btn ${config.difficulty === diff ? 'active' : ''}`}
//                   onClick={() => setConfig(prev => ({ ...prev, difficulty: diff }))}
//                 >
//                   {diff}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="config-section">
//             <h3>Number of Questions</h3>
//             <input
//               type="number"
//               min="1"
//               max="20"
//               value={config.num_questions}
//               onChange={(e) => setConfig(prev => ({ ...prev, num_questions: parseInt(e.target.value) }))}
//             />
//           </div>

//           <div className="config-section">
//             <h3>Duration (minutes)</h3>
//             <input
//               type="number"
//               min="5"
//               max="60"
//               value={config.max_duration_minutes}
//               onChange={(e) => setConfig(prev => ({ ...prev, max_duration_minutes: parseInt(e.target.value) }))}
//             />
//           </div>

//           <button className="btn-start" onClick={startInterview} disabled={loading}>
//             {loading ? '⏳ Starting...' : '🚀 Start Interview'}
//           </button>
//         </div>
//       )}

//       {step === 'interview' && interview && (
//         <div className="interview-session">
//           <div className="interview-header">
//             <h2>Question {currentQuestionIdx + 1} of {interview.questions.length}</h2>
//             <div className="progress-bar">
//               <div
//                 className="progress-fill"
//                 style={{ width: `${((currentQuestionIdx + 1) / interview.questions.length) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           <div className="question-card">
//             <div className="question-type">
//               {interview.questions[currentQuestionIdx].question_type}
//             </div>
//             <h3>{interview.questions[currentQuestionIdx].question_text}</h3>
//           </div>

//           <div className="answer-section">
//             <textarea
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               placeholder="Type your answer here..."
//               rows="8"
//               disabled={loading}
//             />
//           </div>

//           <div className="interview-actions">
//             <button className="btn-submit" onClick={submitAnswer} disabled={loading || !answer.trim()}>
//               {loading ? '⏳ Submitting...' : currentQuestionIdx < interview.questions.length - 1 ? '➡️ Next Question' : '✅ Finish Interview'}
//             </button>
//           </div>
//         </div>
//       )}

//       {step === 'summary' && summary && (
//         <div className="interview-summary">
//           <h2>🎉 Interview Complete!</h2>
          
//           <div className="summary-stats">
//             <div className="stat-card">
//               <div className="stat-value">{summary.answered_questions}/{summary.total_questions}</div>
//               <div className="stat-label">Questions Answered</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value">{summary.overall_score.toFixed(1)}/10</div>
//               <div className="stat-label">Overall Score</div>
//             </div>
//             <div className="stat-card decision">
//               <div className="stat-value">{summary.decision}</div>
//               <div className="stat-label">Decision</div>
//             </div>
//           </div>

//           <div className="summary-scores">
//             <div className="score-item">
//               <span className="score-label">Communication</span>
//               <div className="score-bar">
//                 <div className="score-fill" style={{ width: `${summary.average_communication * 10}%` }}></div>
//               </div>
//               <span className="score-value">{summary.average_communication.toFixed(1)}/10</span>
//             </div>
//             <div className="score-item">
//               <span className="score-label">Technical Knowledge</span>
//               <div className="score-bar">
//                 <div className="score-fill" style={{ width: `${summary.average_technical * 10}%` }}></div>
//               </div>
//               <span className="score-value">{summary.average_technical.toFixed(1)}/10</span>
//             </div>
//             <div className="score-item">
//               <span className="score-label">Problem Solving</span>
//               <div className="score-bar">
//                 <div className="score-fill" style={{ width: `${summary.average_problem_solving * 10}%` }}></div>
//               </div>
//               <span className="score-value">{summary.average_problem_solving.toFixed(1)}/10</span>
//             </div>
//           </div>

//           <div className="summary-feedback">
//             <h3>Detailed Feedback</h3>
//             <p>{summary.detailed_feedback}</p>
//           </div>

//           <div className="summary-lists">
//             <div className="strength-section">
//               <h3>💪 Strengths</h3>
//               <ul>
//                 {summary.strengths.map((strength, idx) => (
//                   <li key={idx}>{strength}</li>
//                 ))}
//               </ul>
//             </div>
//             <div className="improvement-section">
//               <h3>📈 Areas for Improvement</h3>
//               <ul>
//                 {summary.areas_for_improvement.map((area, idx) => (
//                   <li key={idx}>{area}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <button className="btn-restart" onClick={resetInterview}>
//             🔄 Start New Interview
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MockInterview;


import { useState } from 'react';
import { interviewAPI } from '../services/api';

function MockInterview() {
  const [step, setStep] = useState('setup');
  const [config, setConfig] = useState({
    question_types: ['Technical'],
    difficulty: 'Medium',
    num_questions: 5,
    max_duration_minutes: 15,
  });
  const [interview, setInterview] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const questionTypes = ['Technical', 'Behavioral', 'System Design', 'Coding'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleTypeToggle = (type) => {
    setConfig(prev => ({
      ...prev,
      question_types: prev.question_types.includes(type)
        ? prev.question_types.filter(t => t !== type)
        : [...prev.question_types, type],
    }));
  };

  const startInterview = async () => {
    if (config.question_types.length === 0) {
      alert('Please select at least one question type');
      return;
    }

    setLoading(true);
    try {
      const response = await interviewAPI.startInterview(config);
      setInterview(response.data);
      setStep('interview');
      setCurrentQuestionIdx(0);
      setAnswers([]);
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setLoading(true);
    try {
      const submission = {
        question_id: currentQuestionIdx,
        transcript: answer,
      };

      const response = await interviewAPI.submitAnswer(
        interview.interview_id,
        submission
      );

      setAnswers(prev => [
        ...prev,
        {
          question: interview.questions[currentQuestionIdx].question_text,
          answer,
          score: response.data.scores,
        },
      ]);

      setAnswer('');

      if (response.data.next_question_id !== null) {
        setCurrentQuestionIdx(response.data.next_question_id);
      } else {
        const summaryResponse = await interviewAPI.getSummary(
          interview.interview_id
        );
        setSummary(summaryResponse.data);
        setStep('summary');
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setStep('setup');
    setInterview(null);
    setCurrentQuestionIdx(0);
    setAnswer('');
    setAnswers([]);
    setSummary(null);
  };

  return (
    <div className="space-y-10">
      {/* Setup */}
      {step === 'setup' && (
        <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8">
          <h2 className="text-xl font-medium">Mock Interview Setup</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Configure your mock interview session
          </p>

          {/* Question Types */}
          <div className="mt-6">
            <p className="text-xs uppercase text-neutral-500 mb-2">
              Question Types
            </p>
            <div className="flex flex-wrap gap-2">
              {questionTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-4 py-1.5 rounded-full text-xs border transition ${
                    config.question_types.includes(type)
                      ? 'bg-green-500/20 border-green-500/40 text-green-400'
                      : 'border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mt-6">
            <p className="text-xs uppercase text-neutral-500 mb-2">
              Difficulty
            </p>
            <div className="flex gap-2">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() =>
                    setConfig(prev => ({ ...prev, difficulty: diff }))
                  }
                  className={`px-4 py-1.5 rounded-full text-xs border transition ${
                    config.difficulty === diff
                      ? 'bg-green-500/20 border-green-500/40 text-green-400'
                      : 'border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="text-xs uppercase text-neutral-500">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.num_questions}
                onChange={(e) =>
                  setConfig(prev => ({
                    ...prev,
                    num_questions: parseInt(e.target.value),
                  }))
                }
                className="mt-2 w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase text-neutral-500">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={config.max_duration_minutes}
                onChange={(e) =>
                  setConfig(prev => ({
                    ...prev,
                    max_duration_minutes: parseInt(e.target.value),
                  }))
                }
                className="mt-2 w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      )}

      {/* Interview */}
      {step === 'interview' && interview && (
        <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8 space-y-6">
          <div>
            <p className="text-sm text-neutral-400">
              Question {currentQuestionIdx + 1} of{' '}
              {interview.questions.length}
            </p>
            <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${
                    ((currentQuestionIdx + 1) /
                      interview.questions.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="border border-white/10 rounded-xl p-6 bg-black">
            <p className="text-xs uppercase text-green-400 mb-2">
              {interview.questions[currentQuestionIdx].question_type}
            </p>
            <h3 className="text-lg">
            {interview.questions[currentQuestionIdx].question_text}
            </h3>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            disabled={loading}
            placeholder="Type your answer here"
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white resize-none"
          />

          <button
            onClick={submitAnswer}
            disabled={loading || !answer.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading
              ? 'Submitting...'
              : currentQuestionIdx <
                interview.questions.length - 1
              ? 'Next Question'
              : 'Finish Interview'}
          </button>
        </div>
      )}

      {/* Summary */}
      {step === 'summary' && summary && (
        <div className="space-y-8">
          <div className="border border-white/10 rounded-2xl bg-neutral-950 p-8">
            <h2 className="text-xl font-medium mb-4">Interview Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-white/10 rounded-xl p-4 bg-black">
                <p className="text-xs text-neutral-500">Questions Answered</p>
                <p className="text-2xl font-medium">
                  {summary.answered_questions}/{summary.total_questions}
                </p>
              </div>

              <div className="border border-white/10 rounded-xl p-4 bg-black">
                <p className="text-xs text-neutral-500">Overall Score</p>
                <p className="text-2xl font-medium">
                  {summary.overall_score.toFixed(1)}/10
                </p>
              </div>

              <div className="border border-green-500/30 rounded-xl p-4 bg-green-500/5">
                <p className="text-xs text-green-400">Decision</p>
                <p className="text-2xl font-medium text-green-400">
                  {summary.decision}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-2xl bg-neutral-950 p-6">
            <h3 className="text-sm font-medium mb-3">Detailed Feedback</h3>
            <p className="text-sm text-neutral-400">
              {summary.detailed_feedback}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium mb-3">Strengths</h3>
              <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
                {summary.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 rounded-xl bg-neutral-950 p-6">
              <h3 className="text-sm font-medium mb-3">
                Areas for Improvement
              </h3>
              <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
                {summary.areas_for_improvement.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={resetInterview}
            className="w-full rounded-full border border-white/10 py-2.5 text-sm hover:bg-white/5 transition"
          >
            Start New Interview
          </button>
        </div>
      )}
    </div>
  );
}

export default MockInterview;
