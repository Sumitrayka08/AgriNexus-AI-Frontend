import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Tractor, 
  Wheat, 
  Droplet, 
  CloudSun, 
  Sparkles, 
  Camera, 
  History, 
  MessageSquare, 
  Bot, 
  Users, 
  BookOpen, 
  BarChart3 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const farmerLinks = [
    { to: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/farmer/profile', label: 'My Profile', icon: User },
    { to: '/farmer/farms', label: 'My Farms', icon: Tractor },
    { to: '/farmer/crops', label: 'My Crops', icon: Wheat },
    { to: '/farmer/soil', label: 'Soil Health', icon: CloudSun },
    { to: '/farmer/irrigation', label: 'Irrigation', icon: Droplet },
    { to: '/farmer/recommendation', label: 'AI Crop Advisory', icon: Sparkles },
    { to: '/farmer/image-analysis', label: 'Disease Scanner', icon: Camera },
    { to: '/farmer/history', label: 'Scan History', icon: History },
    { to: '/farmer/queries', label: 'Expert Q&A', icon: MessageSquare },
    { to: '/farmer/assistant', label: 'AI Farm Bot', icon: Bot },
  ];

  const expertLinks = [
    { to: '/expert/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expert/queries', label: 'Farmer Queries', icon: MessageSquare },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { to: '/admin/analytics', label: 'System Analytics', icon: BarChart3 },
  ];

  let links = [];
  if (role === 'FARMER') links = farmerLinks;
  else if (role === 'EXPERT') links = expertLinks;
  else if (role === 'ADMIN') links = adminLinks;

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col justify-between min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {role} Portal
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-500">
        <p className="font-semibold text-slate-400">AgriNexus AI v1.0</p>
        <p className="mt-0.5">Secure Spring Boot & PyTorch Platform</p>
      </div>
    </aside>
  );
};

export default Sidebar;

