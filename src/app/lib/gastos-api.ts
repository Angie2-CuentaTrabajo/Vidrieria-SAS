export interface Gasto {
  id: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  monto: number;
  referencia?: string | null;
  observacion?: string | null;
}

export interface GastoPayload {
  fecha: string;
  descripcion: string;
  categoria: string;
  monto: string;
  referencia?: string;
  observacion?: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(data?.message || 'Ocurrio un error inesperado.');
}

export async function getGastos() {
  const response = await fetch('/api/gastos');
  return parseResponse<Gasto[]>(response);
}

export async function createGasto(payload: GastoPayload) {
  const response = await fetch('/api/gastos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Gasto>(response);
}

export async function updateGasto(id: string, payload: GastoPayload) {
  const response = await fetch(`/api/gastos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Gasto>(response);
}
