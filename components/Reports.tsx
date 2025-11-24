import React, { useMemo } from 'react';
import { Invoice, Area, User, Inconsistency } from '../types';
import { BarChart3, Clock, AlertOctagon, UserCheck, ShieldAlert } from 'lucide-react';

interface ReportsProps {
  invoices: Invoice[];
  areas: Area[];
  users: User[];
}

export const Reports: React.FC<ReportsProps> = ({ invoices, areas, users }) => {
  
  // 1. Proactivity Report Data
  const proactivityData = useMemo(() => {
    const areaStats: Record<string, { totalTime: number; count: number }> = {};
    const userStats: Record<string, { totalTime: number; count: number }> = {};

    invoices.forEach(inv => {
      inv.inconsistencies.forEach(inc => {
        if (inc.isResolved && inc.resolvedAt) {
          const startTime = new Date(inv.issueDate).getTime();
          const endTime = new Date(inc.resolvedAt).getTime();
          const durationDays = Math.max(0, (endTime - startTime) / (1000 * 60 * 60 * 24)); // Days

          // Area Stats
          if (!areaStats[inc.areaId]) areaStats[inc.areaId] = { totalTime: 0, count: 0 };
          areaStats[inc.areaId].totalTime += durationDays;
          areaStats[inc.areaId].count += 1;

          // User Stats
          if (inc.resolvedBy) {
            if (!userStats[inc.resolvedBy]) userStats[inc.resolvedBy] = { totalTime: 0, count: 0 };
            userStats[inc.resolvedBy].totalTime += durationDays;
            userStats[inc.resolvedBy].count += 1;
          }
        }
      });
    });

    return { areaStats, userStats };
  }, [invoices]);

  // 2. Criticality / Motives Data
  const motivesData = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalInconsistencies = 0;

    invoices.forEach(inv => {
      inv.inconsistencies.forEach(inc => {
        const key = inc.description;
        counts[key] = (counts[key] || 0) + 1;
        totalInconsistencies++;
      });
    });

    const ranking = Object.entries(counts)
      .map(([desc, count]) => ({ desc, count, percentage: (count / totalInconsistencies) * 100 }))
      .sort((a, b) => b.count - a.count);

    return { ranking, totalInconsistencies };
  }, [invoices]);

  // Check for critical alert (Over 70%)
  const criticalItem = motivesData.ranking.find(item => item.percentage > 70);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Alert Banner for Critical Divergence */}
      {criticalItem && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-red-800">Alerta de Divergência Crítica Detectada!</h3>
            <p className="text-red-700 mt-1">
              O motivo de inconsistência <strong>"{criticalItem.desc}"</strong> representa <strong>{criticalItem.percentage.toFixed(1)}%</strong> de todos os casos.
            </p>
            <p className="text-sm text-red-600 mt-2 font-medium">
              ⚠️ Um e-mail de notificação foi disparado para o Gestor da Área e Usuário Geral.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Report 1: Proactivity (Resolution Time) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Relatório de Proatividade (Tempo Médio)
            </h3>
            <p className="text-sm text-gray-500 mt-1">Tempo médio (em dias) para resolução de inconsistências desde a emissão da nota.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Por Área</h4>
              <div className="space-y-3">
                {areas.map(area => {
                  const stat = proactivityData.areaStats[area.id];
                  const avg = stat && stat.count > 0 ? (stat.totalTime / stat.count).toFixed(1) : 'N/A';
                  const width = stat && stat.count > 0 ? Math.min(100, (stat.totalTime / stat.count) * 10) : 0;
                  
                  return (
                    <div key={area.id} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{area.name}</span>
                        <span className="text-gray-500 font-mono">{avg === 'N/A' ? '-' : `${avg} dias`}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-primary-500 h-2.5 rounded-full" 
                          style={{ width: `${avg === 'N/A' ? 0 : width}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Por Usuário
              </h4>
              <div className="space-y-3">
                {users.map(user => {
                  const stat = proactivityData.userStats[user.id];
                  const avg = stat && stat.count > 0 ? (stat.totalTime / stat.count).toFixed(1) : 'N/A';
                  
                  return (
                    <div key={user.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.role === 'GENERAL' ? 'Administrador' : 'Especialista'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${avg === 'N/A' ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700'}`}>
                           {avg === 'N/A' ? 'Sem dados' : `${avg} dias`}
                         </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Report 2: Motives Ranking */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-orange-600" />
              Ranking de Motivos de Inconsistência
            </h3>
            <p className="text-sm text-gray-500 mt-1">Classificação dos problemas mais recorrentes.</p>
          </div>

          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 w-2/3">Motivo / Descrição</th>
                  <th className="px-6 py-3 text-center">Ocorrências</th>
                  <th className="px-6 py-3 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {motivesData.ranking.map((item, idx) => (
                  <tr key={idx} className={item.percentage > 70 ? 'bg-red-50/50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <p className="text-gray-800 font-medium line-clamp-2" title={item.desc}>{item.desc}</p>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${item.percentage > 50 ? 'text-red-600' : 'text-gray-700'}`}>
                        {item.percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
                {motivesData.ranking.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Nenhum dado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};