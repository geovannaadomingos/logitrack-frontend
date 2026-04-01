import { useState } from 'react';
import type { Trip } from '../types';
import { X, Save } from 'lucide-react';
import { createTrip } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MOCK_VEHICLES = [
  { placa: 'ABC-1234', modelo: 'Volvo FH 540', tipo: 'PESADO' },
  { placa: 'XYZ-9876', modelo: 'Scania R450', tipo: 'PESADO' },
  { placa: 'LMN-4567', modelo: 'Mercedes-Benz Actros', tipo: 'PESADO' },
  { placa: 'KJH-1122', modelo: 'Iveco Stralis 460', tipo: 'PESADO' },
  { placa: 'HGT-3344', modelo: 'VW Meteor 29.520', tipo: 'PESADO' },
  { placa: 'AAA-0000', modelo: 'Fiorino 1.4', tipo: 'LEVE' }
];

export function NovaViagemModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<Trip>({
    veiculoPlaca: MOCK_VEHICLES[0].placa,
    veiculoModelo: MOCK_VEHICLES[0].modelo,
    veiculoTipo: MOCK_VEHICLES[0].tipo,
    dataSaida: '',
    dataChegada: '',
    origem: '',
    destino: '',
    kmPercorrida: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'veiculoPlaca') {
      const selected = MOCK_VEHICLES.find(v => v.placa === value);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          veiculoPlaca: selected.placa,
          veiculoModelo: selected.modelo,
          veiculoTipo: selected.tipo
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'kmPercorrida' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origem || !formData.destino || !formData.dataSaida || !formData.dataChegada || formData.kmPercorrida <= 0) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await createTrip(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Erro ao criar viagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Nova Viagem</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Veículo</label>
              <select
                name="veiculoPlaca"
                value={formData.veiculoPlaca}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                {MOCK_VEHICLES.map((v) => (
                  <option key={v.placa} value={v.placa}>{v.modelo} ({v.placa})</option>
                ))}
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
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
