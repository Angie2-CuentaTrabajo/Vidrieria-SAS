export interface DashboardKpis {
  trabajosHoy: number;
  trabajosPendientes: number;
  trabajosTerminadosMes: number;
  trabajosCanceladosMes: number;
  ingresosDia: number;
  gastosDia: number;
  saldoCaja: number;
  stockBajo: number;
}

export interface DashboardChartItem {
  mes: string;
  ingresos: number;
  gastos: number;
}

export interface DashboardRecentTrabajo {
  id: string;
  fecha: string;
  cliente: string;
  descripcion: string;
  total: number;
  estado: string;
}

export interface DashboardRecentPago {
  id: string;
  fecha: string;
  cliente: string;
  monto: number;
  tipo: string;
  metodo: string;
}

export interface DashboardStockBajo {
  id: string;
  producto: string;
  stock: number;
  minimo: number;
}

export interface DashboardAlerta {
  tipo: 'warning' | 'info' | 'success';
  mensaje: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  chartData: DashboardChartItem[];
  recentTrabajos: DashboardRecentTrabajo[];
  recentPagos: DashboardRecentPago[];
  stockBajo: DashboardStockBajo[];
  alertas: DashboardAlerta[];
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(data?.message || 'Ocurrio un error inesperado.');
}

export async function getDashboard() {
  const response = await fetch('/api/dashboard');
  return parseResponse<DashboardData>(response);
}
