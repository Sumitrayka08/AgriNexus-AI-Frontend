import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expertService } from '../../services/expertService';
import Alert from '../../components/Alert';
import { MessageSquare, Send, ArrowLeft, CheckCircle2, User, Clock } from 'lucide-react';

const ExpertQueryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await expertService.getQueryById(id);
        setQuery(data);
        if (data.response) {
          setResponseText(data.response);
        }
      } catch (err) {
        setError('Failed to load query details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const updated = await expertService.respondToQuery(id, responseText.trim());
      setQuery(updated);
      setMessage('Response published to farmer successfully!');
    } catch (err) {
      setError('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-slate-400 text-sm p-6">Loading query details...</div>;
  if (!query) return <Alert type="error" message="Query record not found" />;

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={() => navigate('/expert/queries')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Queries
      </button>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{query.farmer?.name}</h3>
              <p className="text-xs text-slate-400">{query.farmer?.email}</p>
            </div>
          </div>
          <span className="text-xs text-slate-500">{new Date(query.createdAt).toLocaleString()}</span>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Farmer Question</span>
          <p className="text-white text-base font-medium bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
            {query.question}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitResponse} className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Expert Solution & Agronomic Recommendation
        </label>
        <textarea
          rows={6}
          required
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 leading-relaxed"
          placeholder="Type detailed agronomic treatment, chemical/organic fungicide dosage, or irrigation guidance..."
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !responseText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-950 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Publishing Solution...' : 'Publish Expert Solution'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpertQueryDetail;

