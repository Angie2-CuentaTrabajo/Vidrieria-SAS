export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stock: number;
  stockMinimo: number;
  costo: number;
  proveedor?: string | null;
  observacion?: string | null;
}

export interface MovimientoInventario {
  id: string;
  fecha: string;
  tipo: string;
  motivo: string;
  cantidad: number;
  referencia?: string | null;
  costoUnitario?: number | null;
  proveedor?: string | null;
  observacion?: string | null;
}

export interface ProductoDetalle extends Producto {
  movimientos: MovimientoInventario[];
}

export interface ProductoPayload {
  nombre: string;
  categoria: string;
  unidad: string;
  stockInicial: string;
  stockMinimo: string;
  costoUnitario: string;
  proveedor: string;
  observacion: string;
}

export interface MovimientoInventarioPayload {
  tipo: 'ENTRADA' | 'SALIDA';
  motivo: string;
  cantidad: string;
  costoUnitario?: string;
  proveedor?: string;
  referencia?: string;
  observacion?: string;
  fecha: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(data?.message || 'Ocurrió un error inesperado.');
}

export async function getProductos() {
  const response = await fetch('/api/productos');
  return parseResponse<Producto[]>(response);
}

export async function getProductoDetalle(id: string) {
  const response = await fetch(`/api/productos/${id}`);
  return parseResponse<ProductoDetalle>(response);
}

export async function createProducto(payload: ProductoPayload) {
  const response = await fetch('/api/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Producto>(response);
}

export async function updateProducto(id: string, payload: Omit<ProductoPayload, 'stockInicial'>) {
  const response = await fetch(`/api/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Producto>(response);
}

export async function createMovimientoInventario(
  id: string,
  payload: MovimientoInventarioPayload,
) {
  const response = await fetch(`/api/productos/${id}/movimientos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ producto: Producto; movimiento: MovimientoInventario }>(response);
}
