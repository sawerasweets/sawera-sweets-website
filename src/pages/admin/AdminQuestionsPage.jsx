import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Send, CheckCircle2, EyeOff, Trash2 } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export default function AdminQuestionsPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState(() => db.get('questions'));
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const syncQuestions = () => {
    setQuestions(db.get('questions'));
  };

  const handleSaveAnswer = (id) => {
    if (!answerText.trim()) return;

    const updated = questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          answer: answerText.trim(),
          answeredBy: user?.name || 'Admin',
          status: 'published'
        };
      }
      return q;
    });

    db.set('questions', updated);
    db.logActivity('Question Answered', `Answer published for product question ${id}.`);
    setAnsweringId(null);
    setAnswerText('');
    syncQuestions();
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'hidden' : 'published';
    const updated = questions.map(q => q.id === id ? { ...q, status: nextStatus } : q);
    db.set('questions', updated);
    syncQuestions();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this question?')) {
      const filtered = questions.filter(q => q.id !== id);
      db.set('questions', filtered);
      syncQuestions();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Product Questions &amp; Answers (Q&amp;A)</h1>
        <p className="text-xs text-gray-500 mt-0.5">Answer customer inquiries regarding ingredients, mithai desi ghee purity, and packaging.</p>
      </div>

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 text-xs text-gray-500">
            No product questions pending.
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900">{q.customerName}</span>
                  <span className="text-gray-400 text-[11px] ml-2">on</span>
                  <span className="font-semibold text-[#07643D] text-[11px] ml-1">{q.productName}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                    q.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {q.status}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(q.id, q.status)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                    title="Toggle Visibility"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="font-semibold text-gray-800">Q: "{q.question}"</p>
                {q.answer && (
                  <p className="text-emerald-900 mt-2 pl-3 border-l-2 border-[#07643D] font-medium leading-relaxed">
                    <span className="font-bold text-[#07643D]">Sawera Team: </span>
                    {q.answer}
                  </p>
                )}
              </div>

              {answeringId === q.id ? (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Write an authentic answer to publish..."
                    className="flex-1 p-2 border rounded-xl outline-none focus:border-[#07643D]"
                  />
                  <button
                    onClick={() => handleSaveAnswer(q.id)}
                    className="px-4 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26]"
                  >
                    Publish Answer
                  </button>
                  <button
                    onClick={() => setAnsweringId(null)}
                    className="px-3 py-2 border rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setAnsweringId(q.id);
                      setAnswerText(q.answer || '');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                    <span>{q.answer ? 'Edit Answer' : 'Reply & Answer'}</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
