import React, { useState, useEffect } from 'react';
import { expertService } from '../../services/expertService';
import StatCard from '../../components/StatCard';
import { MessageSquare, Clock, CheckCircle2, UserCheck, ArrowRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExpertDashboard = () => {
  const [allQueries, setAllQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const data = await expertService.getAllQueries();
        setAllQueries(data);
      } catch (err) {
        console.error('Failed to load expert dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const pendingCount = allQueries.filter((q) => q.status === 'PENDING').length;
  const answeredCount = allQueries.filter((q) => q.status === 'ANSWERED').length;
  const inProgressCount = allQueries.filter((q) => q.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/70 to-slate-900/80 p-6 rounded-3xl border border-blue-900/50">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Expert Advisory Portal <Award className="w-6 h-6 text-blue-400" />
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review pending farmer tickets, provide agronomic guidance, and update status</p>
        </div>
        <button
          onClick={() => navigate('/expert/queries')}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-950 transition-all shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>View Pending Queries</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Pending Queries" value={loading ? '...' : pendingCount} icon={Clock} color="amber" description="Awaiting expert response" />
        <StatCard title="In Review" value={loading ? '...' : inProgressCount} icon={UserCheck} color="purple" description="Currently assigned" />
        <StatCard title="Answered Queries" value={loading ? '...' : answeredCount} icon={CheckCircle2} color="emerald" description="Completed expert solutions" />
      </div>

      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Recent Farmer Questions</h3>

        {loading ? (
          <div className="text-slate-400 text-sm">Loading queries...</div>
        ) : allQueries.length === 0 ? (
          <p className="text-slate-500 text-sm">No farmer queries submitted yet</p>
        ) : (
          <div className="space-y-3">
            {allQueries.slice(0, 5).map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-500">Submitted by {q.farmer?.name} ({q.farmer?.email})</span>
                  <p className="text-white text-sm font-medium mt-0.5">{q.question}</p>
                </div>
                <button
                  onClick={() => navigate(`/expert/queries/${q.id}`)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline shrink-0"
                >
                  Review & Answer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;

