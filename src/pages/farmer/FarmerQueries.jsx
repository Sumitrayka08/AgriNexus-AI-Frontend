import React, { useState, useEffect } from 'react';
import { expertService } from '../../services/expertService';
import Alert from '../../components/Alert';
import { MessageSquare, Send, CheckCircle2, Clock, UserCheck } from 'lucide-react';

const FarmerQueries = () => {
  const [queries, setQueries] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchQueries = async () => {
    try {
      const data = await expertService.getMyQueries();
      setQueries(data);
    } catch (err) {
      setError('Failed to load expert queries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      await expertService.createQuery(question);
      setQuestion('');
      setMessage('Your query has been submitted to agricultural experts!');
      fetchQueries();
    } catch (err) {
      setError('Failed to submit query');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ANSWERED':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60"><CheckCircle2 className="w-3.5 h-3.5" /> Answered</span>;
      case 'IN_PROGRESS':
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold bg-blue-950 text-blue-400 border border-blue-800/60"><UserCheck className="w-3.5 h-3.5" /> In Review</span>;
      default:
        return <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold bg-amber-950 text-amber-400 border border-amber-800/60"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" /> Agriculture Expert Q&A Portal
        </h2>
        <p className="text-slate-400 text-sm mt-1">Submit technical questions regarding crop diseases, soil nutrients, or farming issues to certified agronomists</p>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Ask a New Question</label>
        <textarea
          rows={3}
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
          placeholder="Describe your crop issue, leaf symptoms, or farming question in detail..."
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !question.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-950 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit to Expert'}</span>
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Your Submitted Queries</h3>

        {loading ? (
          <div className="text-slate-400 text-sm p-6">Loading queries...</div>
        ) : queries.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No queries submitted yet</p>
          </div>
        ) : (
          queries.map((q) => (
            <div key={q.id} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">{new Date(q.createdAt).toLocaleString()}</span>
                  <p className="text-white text-sm font-semibold leading-relaxed">{q.question}</p>
                </div>
                {getStatusBadge(q.status)}
              </div>

              {q.response ? (
                <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-900/50 space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
                    <span>Expert Advice {q.expert ? `by ${q.expert.name}` : ''}</span>
                    <span>{new Date(q.updatedAt || q.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-line">{q.response}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  Waiting for certified agronomist response. You will be notified once answered.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FarmerQueries;

