import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend, color = 'emerald' }) => {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1.5">{value}</h3>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.emerald}`}>
            <Icon className="w-6 h-6 stroke-[2]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

