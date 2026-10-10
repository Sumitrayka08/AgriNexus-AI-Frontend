import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, User as UserIcon, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="flex items-center gap-1 bg-red-950 text-red-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-red-800/50"><Shield className="w-3 h-3" /> Admin</span>;
      case 'EXPERT':
        return <span className="flex items-center gap-1 bg-blue-950 text-blue-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-800/50"><Award className="w-3 h-3" /> Expert</span>;
      default:
        return <span className="flex items-center gap-1 bg-emerald-950 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-800/50"><Sprout className="w-3 h-3" /> Farmer</span>;
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
          <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
            AgriNexus <span className="text-emerald-400 text-sm font-semibold px-1.5 py-0.5 bg-emerald-950/80 rounded border border-emerald-500/30">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">Intelligent Agriculture & Farm Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            {getRoleBadge(user.role)}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium text-slate-200">{user.name}</span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-slate-700"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

