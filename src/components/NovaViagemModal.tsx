import { useEffect, useState } from 'react';
import type { Trip, Vehicle } from '../types';
import { X, Save } from 'lucide-react';
import { createTrip, updateTrip, getVehicles } from '../services/api';
import { toLocalISOString } from '../utils/dateUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tripToEdit?: Trip | null;
}

export function NovaViagemModal({ isOpen, onClose, onSuccess, tripToEdit }: Props) {
  const [formData, setFormData] = useState<Trip>({
    veiculoId: 0,
    veiculoPlaca: '',
    veiculoModelo: '',
    veiculoTipo: '',
    dataSaida: '',
    dataChegada: '',
    origem: '',
    destino: '',
    kmPercorrida: 0,
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const data = await getVehicles();
        setVehicles(data);
        
        if (tripToEdit) {
          setFormData({
            ...tripToEdit,
            dataSaida: tripToEdit.dataSaida?.substring(0, 16) || '',
            dataChegada: tripToEdit.dataChegada?.substring(0, 16) || '',
          });
        } else if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            veiculoId: data[0].id,
            veiculoPlaca: data[0].placa,
            veiculoModelo: data[0].modelo,
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar veículos:', err);
        setError('Não foi possível carregar a lista de veículos.');
      } finally {
        setLoadingVehicles(false);
      }
    };

    if (isOpen) {
      fetchVehicles();
    }
  }, [tripToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'veiculoId' || name === 'kmPercorrida' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.veiculoId || !formData.origem || !formData.destino || !formData.dataSaida || !formData.dataChegada || formData.kmPercorrida <= 0) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const saida = new Date(formData.dataSaida);
    const chegada = new Date(formData.dataChegada);

    if (isNaN(saida.getTime()) || isNaN(chegada.getTime())) {
      setError('Data de saída ou chegada inválida. Por favor, corrija o formato.');
      return;
    }

    if (chegada <= saida) {
      setError('A data de chegada deve ser posterior à data de saída.');
      return;
    }

    if (!tripToEdit && saida < new Date()) {
      setError('A data de saída não pode estar no passado.');
      return;
    }

    const isoSaida = toLocalISOString(saida);
    const isoChegada = toLocalISOString(chegada);

    if (!isoSaida || !isoChegada) {
      setError('Erro crítico de formatação de data. Tente novamente.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const payload = {
        id: tripToEdit?.id,
        veiculoId: formData.veiculoId,
        dataSaida: isoSaida,
        dataChegada: isoChegada,
        origem: formData.origem,
        destino: formData.destino,
        kmPercorrida: formData.kmPercorrida
      };

      console.log('Sending payload:', payload);

      if (tripToEdit?.id) {
        await updateTrip(tripToEdit.id, payload as any);
      } else {
        await createTrip(payload as any);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('API Error:', err);
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Verifique os dados informados');
    } finally {
      setLoading(false);
    }
  };

  const nowISO = new Date().toISOString().substring(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {tripToEdit ? 'Editar Viagem' : 'Nova Viagem'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Veículo</label>
              <select
                name="veiculoId"
                value={formData.veiculoId}
                onChange={handleChange}
                disabled={loadingVehicles}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50"
              >
                {loadingVehicles ? (
                  <option value={0} disabled>Carregando veículos...</option>
                ) : vehicles.length === 0 ? (
                  <option value={0} disabled>Nenhum veículo cadastrado</option>
                ) : (
                  vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>
                  ))
                )}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origem</label>
                <input
                  type="text"
                  name="origem"
                  value={formData.origem}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Ex: Rio de Janeiro, RJ"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Saída</label>
                <input
                  type="datetime-local"
                  name="dataSaida"
                  value={formData.dataSaida}
                  onChange={handleChange}
                  min={tripToEdit ? undefined : nowISO}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Chegada</label>
                <input
                  type="datetime-local"
                  name="dataChegada"
                  value={formData.dataChegada}
                  onChange={handleChange}
                  min={formData.dataSaida || nowISO}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Distância (KM)</label>
              <input
                type="number"
                name="kmPercorrida"
                value={formData.kmPercorrida || ''}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 text-white rounded-md font-medium hover:bg-brand-700 transition-colors flex items-center justify-center min-w-[120px]"
              disabled={loading || loadingVehicles || vehicles.length === 0}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {tripToEdit ? 'Atualizar' : 'Salvar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
