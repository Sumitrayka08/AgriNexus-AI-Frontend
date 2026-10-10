import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
      icon: Info,
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${config.bg}`}>
      <div className="flex items-center gap-2.5">
        <Icon className="w-5 h-5 shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-75 transition-opacity text-xs underline ml-2">
          Dismiss
        </button>
      )}
    </div>
  );
};

export default Alert;

