export interface MovimientoCaja {
  id: string;
  fecha: string;
  tipo: 'INGRESO' | 'SALIDA';
  descripcion: string;
  monto: number;
  referencia?: string | null;
  trabajoId?: string | null;
  pagoId?: string | null;
  gastoId?: string | null;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(data?.message || 'Ocurrio un error inesperado.');
}

export async function getMovimientosCaja() {
  const response = await fetch('/api/caja/movimientos');
  return parseResponse<MovimientoCaja[]>(response);
}
