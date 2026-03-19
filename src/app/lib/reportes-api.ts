export interface ReporteSerieItem {
  label: string;
  ingresos: number;
  gastos: number;
}

export interface ReporteEstadoTrabajo {
  estado: string;
  cantidad: number;
}

export interface ReporteClienteSaldo {
  cliente: string;
  saldo: number;
}

export interface ReporteProductoUsado {
  producto: string;
  cantidad: number;
}

export interface ReportesResumen {
  totalIngresos: number;
  totalGastos: number;
  utilidadNeta: number;
  trabajosRealizados: number;
  ingresosVsGastos: ReporteSerieItem[];
  trabajosPorEstado: ReporteEstadoTrabajo[];
  clientesConSaldo: ReporteClienteSaldo[];
  productosUsados: ReporteProductoUsado[];
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(data?.message || 'Ocurrio un error inesperado.');
}

export async function getReportes(periodo: string) {
  const response = await fetch(`/api/reportes?periodo=${encodeURIComponent(periodo)}`);
  return parseResponse<ReportesResumen>(response);
}
