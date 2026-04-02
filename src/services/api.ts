import axios from 'axios';
import type { Trip, DashboardMetrics, VehicleRanking, VolumeByType, PageResponse, MaintenanceEntry, CostProjection, Vehicle } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1', // fallback para dev local
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await api.get<Vehicle[]>('/veiculos');
  return response.data;
}

export const getDashboardTotalKm = async (): Promise<DashboardMetrics> => {
  const response = await api.get<DashboardMetrics>('/dashboard/total-km');
  return response.data;
};

export const getDashboardRanking = async (): Promise<VehicleRanking[]> => {
  const response = await api.get<VehicleRanking[]>('/dashboard/ranking-veiculos');
  return response.data;
};

export const getDashboardVolume = async (): Promise<VolumeByType[]> => {
  const response = await api.get<VolumeByType[]>('/dashboard/volume-por-tipo');
  return response.data;
};

export const getUpcomingMaintenances = async (): Promise<MaintenanceEntry[]> => {
  const response = await api.get<MaintenanceEntry[]>('/dashboard/proximas-manutencoes');
  return response.data;
};

export const getCostProjection = async (): Promise<CostProjection> => {
  const response = await api.get<CostProjection>('/dashboard/projecao-custo');
  return response.data;
};

export const getTrips = async (page = 0, size = 10): Promise<PageResponse<Trip>> => {
  const response = await api.get<PageResponse<Trip>>('/viagens', { params: { page, size } });
  return response.data;
};

export const createTrip = async (trip: Trip): Promise<Trip> => {
  const response = await api.post<Trip>('/viagens', trip);
  return response.data;
};

export const updateTrip = async (id: number, trip: Trip): Promise<Trip> => {
  const response = await api.put<Trip>(`/viagens/${id}`, trip);
  return response.data;
};

export const deleteTrip = async (id: number): Promise<void> => {
  await api.delete(`/viagens/${id}`);
};

export default api;
