import { useEffect, useState } from 'react';
import { getTrips } from '../services/api';
import type { Trip, PageResponse } from '../types';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, Truck } from 'lucide-react';
import { NovaViagemModal } from '../components/NovaViagemModal';

export function Viagens() {
  const [data, setData] = useState<PageResponse<Trip> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrips = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTrips(currentPage);
      setData(res);
    } catch (err) {
      setError('Erro ao carregar as viagens. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(page);
  }, [page]);

  const handleNextPage = () => {
    if (data && page < data.totalPages - 1) {
      setPage(p => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(p => p - 1);
    }
  };

  const handleSuccess = () => {
    if (page === 0) {
      fetchTrips(0);
    } else {
      setPage(0); // This will trigger useEffect
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Viagens</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nova Viagem
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center shadow-sm">
          <AlertCircle className="text-red-500 mr-3 bg-white rounded-full" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1 p-2">
          {loading ? (
             <div className="flex h-64 items-center justify-center">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-brand-600"></div>
             </div>
          ) : data?.content.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Truck size={48} className="mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-500">Nenhuma viagem encontrada.</p>
                <p className="text-sm">Clique em "Nova Viagem" para começar.</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Veículo</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rota</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Período</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Distância</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((trip: Trip, i: number) => (
                  <tr key={trip.id || i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                          <Truck size={20} />
                        </div>
                        <span className="font-semibold text-slate-800">{trip?.veiculoModelo || 'Veículo'} {trip?.veiculoPlaca ? `- ${trip.veiculoPlaca}` : ''}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-slate-700">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                          <span className="truncate max-w-[200px]" title={trip?.origem}>{trip?.origem || '-'}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                          <div className="w-2 h-2 rounded-full bg-brand-500 mr-2 flex-shrink-0"></div>
                          <span className="truncate max-w-[200px]" title={trip?.destino}>{trip?.destino || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      <div>Saída: <span className="font-medium text-slate-800">{trip?.dataSaida ? formatDate(trip.dataSaida) : '-'}</span></div>
                      <div>Cheg: <span className="font-medium text-slate-800">{trip?.dataChegada ? formatDate(trip.dataChegada) : '-'}</span></div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-800">
                      {trip?.kmPercorrida?.toLocaleString() ?? 0} km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
            <span className="text-sm text-slate-500">
              Página <span className="font-medium text-slate-800">{data.number + 1}</span> de <span className="font-medium text-slate-800">{data.totalPages}</span>
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className="p-2 rounded-md border border-slate-200 text-slate-600 hover:bg-white hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= data.totalPages - 1}
                className="p-2 rounded-md border border-slate-200 text-slate-600 hover:bg-white hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <NovaViagemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
