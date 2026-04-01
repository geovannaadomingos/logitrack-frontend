import axios from 'axios';
import type { Trip, DashboardMetrics, VehicleRanking, VolumeByType, PageResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const getTrips = async (page = 0, size = 10): Promise<PageResponse<Trip>> => {
  const response = await api.get<PageResponse<Trip>>('/viagens', { params: { page, size } });
  return response.data;
};

export const createTrip = async (trip: Trip): Promise<Trip> => {
  const response = await api.post<Trip>('/viagens', trip);
  return response.data;
};

export default api;
