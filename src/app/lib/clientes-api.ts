export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
  documento?: string | null;
  observacion?: string | null;
  saldoPendiente: number;
  cantidadTrabajos: number;
}

export interface ClienteDetalleTrabajo {
  id: string;
  fecha: string;
  descripcion: string;
  total: number;
  saldo: number;
  estado: string;
}

export interface ClienteDetallePago {
  id: string;
  fecha: string;
  trabajo: string;
  monto: number;
  tipo: string;
  metodo: string;
}

export interface ClienteDetalle extends Cliente {
  trabajos: ClienteDetalleTrabajo[];
  pagos: ClienteDetallePago[];
}

export interface ClientePayload {
  nombre: string;
  telefono: string;
  direccion: string;
  documento: string;
  observacion: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(data?.message || 'Ocurrió un error inesperado.');
}

export async function getClientes() {
  const response = await fetch('/api/clientes');
  return parseResponse<Cliente[]>(response);
}

export async function createCliente(payload: ClientePayload) {
  const response = await fetch('/api/clientes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Cliente>(response);
}

export async function getClienteDetalle(id: string) {
  const response = await fetch(`/api/clientes/${id}`);
  return parseResponse<ClienteDetalle>(response);
}

export async function updateCliente(id: string, payload: ClientePayload) {
  const response = await fetch(`/api/clientes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Cliente>(response);
}

export async function deleteCliente(id: string) {
  const response = await fetch(`/api/clientes/${id}`, {
    method: 'DELETE',
  });

  return parseResponse<void>(response);
}
