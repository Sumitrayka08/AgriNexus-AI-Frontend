import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProfile from './pages/farmer/FarmerProfile';
import FarmerFarms from './pages/farmer/FarmerFarms';
import FarmerCrops from './pages/farmer/FarmerCrops';
import FarmerSoil from './pages/farmer/FarmerSoil';
import FarmerIrrigation from './pages/farmer/FarmerIrrigation';
import FarmerRecommendation from './pages/farmer/FarmerRecommendation';
import FarmerImageAnalysis from './pages/farmer/FarmerImageAnalysis';
import FarmerHistory from './pages/farmer/FarmerHistory';
import FarmerQueries from './pages/farmer/FarmerQueries';
import FarmerAssistant from './pages/farmer/FarmerAssistant';

import ExpertDashboard from './pages/expert/ExpertDashboard';
import ExpertQueries from './pages/expert/ExpertQueries';
import ExpertQueryDetail from './pages/expert/ExpertQueryDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminKnowledge from './pages/admin/AdminKnowledge';
import AdminAnalytics from './pages/admin/AdminAnalytics';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-emerald-400">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'FARMER') return <Navigate to="/farmer/dashboard" replace />;
  if (user?.role === 'EXPERT') return <Navigate to="/expert/dashboard" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Farmer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['FARMER']}><AppLayout /></ProtectedRoute>}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />
            <Route path="/farmer/farms" element={<FarmerFarms />} />
            <Route path="/farmer/crops" element={<FarmerCrops />} />
            <Route path="/farmer/soil" element={<FarmerSoil />} />
            <Route path="/farmer/irrigation" element={<FarmerIrrigation />} />
            <Route path="/farmer/recommendation" element={<FarmerRecommendation />} />
            <Route path="/farmer/image-analysis" element={<FarmerImageAnalysis />} />
            <Route path="/farmer/history" element={<FarmerHistory />} />
            <Route path="/farmer/queries" element={<FarmerQueries />} />
            <Route path="/farmer/assistant" element={<FarmerAssistant />} />
          </Route>

          {/* Expert Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/expert/dashboard" element={<ExpertDashboard />} />
            <Route path="/expert/queries" element={<ExpertQueries />} />
            <Route path="/expert/queries/:id" element={<ExpertQueryDetail />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AppLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/knowledge" element={<AdminKnowledge />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
