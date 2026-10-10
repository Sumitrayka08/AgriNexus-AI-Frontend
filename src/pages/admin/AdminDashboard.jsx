import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/StatCard';
import { Users, Tractor, Wheat, Camera, MessageSquare, BookOpen, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-950/60 to-slate-900/80 p-6 rounded-3xl border border-red-900/50">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Administrator Command Center <Shield className="w-6 h-6 text-red-400" />
          </h2>
          <p className="text-slate-400 text-sm mt-1">Platform governance, user access management, and RAG knowledge base administration</p>
        </div>
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-red-950 transition-all shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>Manage Users</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Users" value={loading ? '...' : analytics?.totalUsers} icon={Users} color="purple" description="Farmers, Experts & Admins" />
        <StatCard title="Registered Farms" value={loading ? '...' : analytics?.totalFarms} icon={Tractor} color="emerald" description="Mapped farm lands" />
        <StatCard title="Total Crops Planted" value={loading ? '...' : analytics?.totalCrops} icon={Wheat} color="amber" description="Active crop cycles" />
        <StatCard title="Neural AI Scans" value={loading ? '...' : analytics?.totalAnalyses} icon={Camera} color="blue" description="Leaf disease diagnoses" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> User Roles Breakdown
            </h3>
            <button onClick={() => navigate('/admin/users')} className="text-xs text-purple-400 hover:underline flex items-center gap-1">
              View users list <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Farmers</span>
              <span className="font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/50">{analytics?.totalFarmers || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Agricultural Experts</span>
              <span className="font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800/50">{analytics?.totalExperts || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Platform Administrators</span>
              <span className="font-bold text-red-400 bg-red-950 px-2.5 py-0.5 rounded-full border border-red-800/50">{analytics?.totalAdmins || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> RAG Knowledge Engine
            </h3>
            <button onClick={() => navigate('/admin/knowledge')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              Manage KB <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>Indexed Documents</span>
              <span className="font-bold text-emerald-400">{analytics?.totalKnowledgeDocuments || 0}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Total Expert Queries</span>
              <span className="font-bold text-blue-400">{analytics?.totalQueries || 0}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Pending Tickets</span>
              <span className="font-bold text-amber-400">{analytics?.pendingQueries || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

