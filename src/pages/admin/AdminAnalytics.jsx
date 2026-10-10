import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/StatCard';
import { BarChart3, Users, Tractor, Wheat, Camera, MessageSquare, BookOpen, Shield } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" /> Platform Analytics & Operational Metrics
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time database statistics calculated across all modules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={loading ? '...' : analytics?.totalUsers} icon={Users} color="purple" description="Active registered accounts" />
        <StatCard title="Total Farmers" value={loading ? '...' : analytics?.totalFarmers} icon={Users} color="emerald" description="Farmer accounts" />
        <StatCard title="Total Experts" value={loading ? '...' : analytics?.totalExperts} icon={Shield} color="blue" description="Agronomist accounts" />
        <StatCard title="Total Farms" value={loading ? '...' : analytics?.totalFarms} icon={Tractor} color="amber" description="Mapped farm lands" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Planted Crops" value={loading ? '...' : analytics?.totalCrops} icon={Wheat} color="amber" description="Crop cycles tracked" />
        <StatCard title="Neural AI Scans" value={loading ? '...' : analytics?.totalAnalyses} icon={Camera} color="purple" description="Leaf disease diagnoses" />
        <StatCard title="Expert Tickets" value={loading ? '...' : analytics?.totalQueries} icon={MessageSquare} color="blue" description="Total farmer tickets" />
        <StatCard title="RAG Indexed Docs" value={loading ? '...' : analytics?.totalKnowledgeDocuments} icon={BookOpen} color="emerald" description="Knowledge base entries" />
      </div>
    </div>
  );
};

export default AdminAnalytics;

