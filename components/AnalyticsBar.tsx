import React, { useMemo } from 'react';
import { Invoice } from '../types';
import { PieChart, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AnalyticsBarProps {
  invoices: Invoice[];
}

export const AnalyticsBar: React.FC<AnalyticsBarProps> = ({ invoices }) => {
  const stats = useMemo(() => {
    const total = invoices.length;
    if (total === 0) return { resolvedCount: 0, percentage: 0, avgDays: 0 };

    const resolvedInvoices = invoices.filter(inv => 
      inv.inconsistencies.every(inc => inc.isResolved)
    );

    const resolvedCount = resolvedInvoices.length;
    const percentage = Math.round((resolvedCount / total) * 100);

    // Calculate Average Time (Resolved Date - Issue Date)
    let totalMilliseconds = 0;
    let countWithDates = 0;

    resolvedInvoices.forEach(inv => {
      if (inv.resolvedAt && inv.issueDate) {
        const start = new Date(inv.issueDate).getTime();
        const end = new Date(inv.resolvedAt).getTime();
        const diff = end - start;
        if (diff >= 0) {
            totalMilliseconds += diff;
            countWithDates++;
        }
      }
    });

    // Convert ms to days
    const avgDays = countWithDates > 0 
      ? Math.round((totalMilliseconds / countWithDates) / (1000 * 60 * 60 * 24)) 
      : 0;

    return {
      resolvedCount,
      percentage,
      avgDays
    };
  }, [invoices]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Metric 1: Completion Status */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary-500" />
            Progresso de Resolução
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{stats.percentage}%</span>
            <span className="text-sm text-gray-500">concluído</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {stats.resolvedCount} de {invoices.length} notas finalizadas
          </p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
           <svg className="w-full h-full absolute transform -rotate-90">
             <circle
               cx="32"
               cy="32"
               r="28"
               stroke="currentColor"
               strokeWidth="4"
               fill="transparent"
               className="text-gray-100"
             />
             <circle
               cx="32"
               cy="32"
               r="28"
               stroke="currentColor"
               strokeWidth="4"
               fill="transparent"
               strokeDasharray={175.93} // 2 * pi * 28
               strokeDashoffset={175.93 - (175.93 * stats.percentage) / 100}
               className="text-primary-500 transition-all duration-1000 ease-out"
             />
           </svg>
           <CheckCircle2 className="w-6 h-6 text-primary-600 absolute" />
        </div>
      </div>

      {/* Metric 2: Average Time */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            Tempo Médio de Solução
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{stats.avgDays}</span>
            <span className="text-sm text-gray-500">dias</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Desde a emissão até a correção total
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-full">
            <TrendingUp className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};