import { useEffect, useState } from 'react';
import { getDashboardTotalKm, getDashboardRanking, getDashboardVolume } from '../services/api';
import type { DashboardMetrics, VehicleRanking, VolumeByType } from '../types';
import { Route, Activity, BarChart3, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [ranking, setRanking] = useState<VehicleRanking[]>([]);
  const [volume, setVolume] = useState<VolumeByType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsRes, rankingRes, volumeRes] = await Promise.all([
          getDashboardTotalKm(),
          getDashboardRanking(),
          getDashboardVolume()
        ]);
        setMetrics(metricsRes || null);
        setRanking(rankingRes || []);
        setVolume(volumeRes || []);
      } catch (err) {
        setError('Erro ao carregar os dados do painel. Verifique se a API está rodando.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-brand-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center shadow-sm">
        <AlertCircle className="text-red-500 mr-3 bg-white rounded-full" />
        <span className="text-red-700 font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Visão Geral</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 rounded-lg mr-4">
            <Route className="text-brand-600" size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">KM Total Percorrido</p>
            <h3 className="text-3xl font-bold text-slate-800">{metrics?.totalKm?.toLocaleString() ?? 0} <span className="text-lg text-slate-400 font-semibold">km</span></h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-50 rounded-lg mr-4">
            <Activity className="text-emerald-600" size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Viagens</p>
            <h3 className="text-3xl font-bold text-slate-800">{metrics?.totalViagens?.toLocaleString() ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-4 bg-purple-50 rounded-lg mr-4">
            <BarChart3 className="text-purple-600" size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Categorias</p>
            <h3 className="text-3xl font-bold text-slate-800">{volume.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Ranking de Veículos</h2>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-slate-200">
                   <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">Pos</th>
                   <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Placa</th>
                   <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Modelo</th>
                   <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Tipo</th>
                 </tr>
               </thead>
               <tbody>
                  {ranking.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-brand-600 italic">{i + 1}º</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{item?.placa || '-'}</td>
                      <td className="py-3 px-4 text-slate-600">{item?.modelo || '-'}</td>
                      <td className="py-3 px-4 text-slate-600 font-semibold text-right">{item?.tipo || '-'}</td>
                    </tr>
                  ))}
                  {ranking.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">Nenhum dado encontrado</td>
                    </tr>
                  )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Volume List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Volume por Tipo</h2>
           <div className="space-y-4 mt-2">
             {volume.map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <span className="font-medium text-slate-700">{item?.tipo || '-'}</span>
                 <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-brand-600 shadow-sm border border-slate-200">
                   {item?.volume ?? 0}
                 </span>
               </div>
             ))}
             {volume.length === 0 && (
                <div className="py-8 text-center text-slate-400">Nenhum dado encontrado</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
