export interface Trip {
  id?: number;
  veiculoPlaca?: string;
  veiculoModelo?: string;
  veiculoTipo?: string;
  dataSaida: string;
  dataChegada: string;
  origem?: string;
  destino?: string;
  kmPercorrida: number;
}

export interface DashboardMetrics {
  totalKm: number;
  totalViagens: number;
}

export interface VehicleRanking {
  placa: string;
  modelo: string;
  tipo: string;
  kmPercorrida?: number;
}

export interface MaintenanceEntry {
  placa: string;
  modelo: string;
  data: string;
  servico: string;
}

export interface CostProjection {
  total: number;
}

export interface VolumeByType {
  tipo: string;
  volume: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
