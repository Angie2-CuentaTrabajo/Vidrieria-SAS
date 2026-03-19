export interface Cotizacion {
  id: string;
  numero: string;
  fecha: string;
  cliente: string;
  clienteId: string;
  descripcion: string;
  total: number;
  vigencia: string;
  estado: string;
  trabajoConvertido: boolean;
  trabajoId?: string | null;
}

export interface CotizacionItemPayload {
  descripcion: string;
  cantidad: string;
  unidad: string;
  precioUnitario: string;
}

export interface CotizacionPayload {
  clienteId: string;
  fechaVigencia: string;
  descripcion: string;
  manoObra: string;
  descuento: string;
  observaciones?: string;
  items: CotizacionItemPayload[];
}

export interface CotizacionDetalleItem {
  id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  total: number;
}

export interface CotizacionDetalle {
  id: string;
  numero: string;
  fecha: string;
  vigencia: string;
  estado: string;
  descripcion: string;
  manoObra: number;
  subtotal: number;
  descuento: number;
  total: number;
  observaciones?: string | null;
  trabajoConvertido: boolean;
  trabajoId?: string | null;
  cliente: {
    id: string;
    nombre: string;
    telefono: string;
    direccion: string;
  };
  items: CotizacionDetalleItem[];
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(data?.message || 'Ocurrio un error inesperado.');
}

export async function getCotizaciones() {
  const response = await fetch('/api/cotizaciones');
  return parseResponse<Cotizacion[]>(response);
}

export async function createCotizacion(payload: CotizacionPayload) {
  const response = await fetch('/api/cotizaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Cotizacion>(response);
}

export async function updateCotizacion(id: string, payload: CotizacionPayload) {
  const response = await fetch(`/api/cotizaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Cotizacion>(response);
}

export async function getCotizacionDetalle(id: string) {
  const response = await fetch(`/api/cotizaciones/${id}`);
  return parseResponse<CotizacionDetalle>(response);
}

export async function updateCotizacionEstado(id: string, estado: string) {
  const response = await fetch(`/api/cotizaciones/${id}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ estado }),
  });

  return parseResponse<Cotizacion>(response);
}

export async function convertirCotizacion(id: string) {
  const response = await fetch(`/api/cotizaciones/${id}/convertir`, {
    method: 'POST',
  });

  return parseResponse<{ trabajoId: string }>(response);
}

export async function anularCotizacion(id: string) {
  const response = await fetch(`/api/cotizaciones/${id}/anular`, {
    method: 'POST',
  });

  return parseResponse<Cotizacion>(response);
}

export async function deleteCotizacion(id: string) {
  const response = await fetch(`/api/cotizaciones/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message || 'Ocurrio un error inesperado.');
  }
}
