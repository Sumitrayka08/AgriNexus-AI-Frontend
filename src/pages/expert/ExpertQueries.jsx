import React, { useState, useEffect } from 'react';
import { expertService } from '../../services/expertService';
import Alert from '../../components/Alert';
import { MessageSquare, Clock, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExpertQueries = () => {
  const [queries, setQueries] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const data = await expertService.getAllQueries();
        setQueries(data);
      } catch (err) {
        setError('Failed to fetch queries list');
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const filteredQueries = queries.filter((q) => {
    if (filter === 'PENDING') return q.status === 'PENDING';
    if (filter === 'ANSWERED') return q.status === 'ANSWERED';
    return true;
  });

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-400" /> Farmer Technical Queries
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review, assign, and respond to incoming farmer advisory requests</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === 'ALL' ? 'bg-blue-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            All ({queries.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === 'PENDING' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Pending ({queries.filter((q) => q.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setFilter('ANSWERED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === 'ANSWERED' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Answered ({queries.filter((q) => q.status === 'ANSWERED').length})
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="text-slate-400 text-sm p-6">Loading farmer queries...</div>
      ) : filteredQueries.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No queries found matching filter</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueries.map((q) => (
            <div key={q.id} className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Farmer: {q.farmer?.name} ({q.farmer?.email})</span>
                  <p className="text-xs text-slate-500 mt-0.5">Submitted: {new Date(q.createdAt).toLocaleString()}</p>
                </div>
                {getStatusBadge(q.status)}
              </div>

              <div>
                <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
              </div>

              {q.response && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                  <span className="font-semibold text-emerald-400">Response: </span> {q.response}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => navigate(`/expert/queries/${q.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-md"
                >
                  <span>{q.response ? 'View & Edit Answer' : 'Respond to Farmer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertQueries;

