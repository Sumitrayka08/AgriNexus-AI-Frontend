import React, { useState, useEffect } from 'react';
import { farmService } from '../../services/farmService';
import { cropService } from '../../services/cropService';
import { imageAnalysisService } from '../../services/imageAnalysisService';
import { expertService } from '../../services/expertService';
import StatCard from '../../components/StatCard';
import { Tractor, Wheat, Camera, MessageSquare, ArrowRight, Sparkles, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const [farmsCount, setFarmsCount] = useState(0);
  const [cropsCount, setCropsCount] = useState(0);
  const [scansCount, setScansCount] = useState(0);
  const [queriesCount, setQueriesCount] = useState(0);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const farms = await farmService.getFarms();
        const crops = await cropService.getCrops();
        const scans = await imageAnalysisService.getHistory();
        const queries = await expertService.getMyQueries();

        setFarmsCount(farms.length || 0);
        setCropsCount(crops.length || 0);
        setScansCount(scans.length || 0);
        setQueriesCount(queries.length || 0);
        setRecentScans(scans.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/60 to-slate-900/80 p-6 rounded-3xl border border-emerald-900/40">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Welcome to AgriNexus AI <Sprout className="w-6 h-6 text-emerald-400" />
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time intelligent farm metrics and neural crop monitoring</p>
        </div>
        <button
          onClick={() => navigate('/farmer/image-analysis')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-950 hover:from-emerald-400 hover:to-teal-300 transition-all shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Scan Leaf Disease</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Farms" value={loading ? '...' : farmsCount} icon={Tractor} color="emerald" description="Registered farm lands" />
        <StatCard title="Active Crops" value={loading ? '...' : cropsCount} icon={Wheat} color="amber" description="Planted crop cycles" />
        <StatCard title="Disease Scans" value={loading ? '...' : scansCount} icon={Camera} color="purple" description="Neural AI analyses" />
        <StatCard title="Expert Queries" value={loading ? '...' : queriesCount} icon={MessageSquare} color="blue" description="Submitted Q&A tickets" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" /> Recent Disease Scans
            </h3>
            <button onClick={() => navigate('/farmer/history')} className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              View all history <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <p className="text-slate-500 text-sm">Loading recent scans...</p>
          ) : recentScans.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
              <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No disease scans recorded yet</p>
              <button onClick={() => navigate('/farmer/image-analysis')} className="mt-2 text-xs text-emerald-400 underline">Upload your first leaf image</button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{scan.disease?.replace(/_/g, ' ')}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{scan.imageName}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      {scan.confidence?.toFixed(1)}% Match
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">{new Date(scan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Farm Assistant</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ask questions about crop diseases, organic fertilization, or seasonal planting. Powered by RAG & Agricultural Knowledge Base.
            </p>
          </div>
          <button
            onClick={() => navigate('/farmer/assistant')}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl text-sm border border-slate-700 transition-all"
          >
            <span>Open AI Chatbot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

