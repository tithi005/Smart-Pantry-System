import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  };

  return (
    <div className={`glass-panel p-6 rounded-2xl flex items-start justify-between transition-all duration-300 hover:scale-[1.02] hover:bg-white/10`}>
      <div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorClasses[color]} backdrop-blur-sm border`}>
        {icon}
      </div>
    </div>
  );
};
