-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'OPERADOR');

-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('PEN', 'USD');

-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "EstadoTrabajo" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'TERMINADO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'YAPE', 'PLIN', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('ADELANTO', 'PARCIAL', 'FINAL');

-- CreateEnum
CREATE TYPE "TipoMovimientoInventario" AS ENUM ('ENTRADA', 'SALIDA');

-- CreateEnum
CREATE TYPE "MotivoMovimientoInventario" AS ENUM ('COMPRA', 'USO_EN_TRABAJO', 'VENTA_DIRECTA', 'MERMA', 'AJUSTE', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoMovimientoCaja" AS ENUM ('INGRESO', 'SALIDA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "passwordHash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'ADMIN',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "documento" TEXT,
    "observacion" TEXT,
    "email" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVigencia" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "manoObra" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "trabajoConvertido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CotizacionItem" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "unidad" TEXT NOT NULL,
    "precioUnitario" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CotizacionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoTrabajo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoTrabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajo" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "cotizacionId" TEXT,
    "tipoTrabajoId" TEXT,
    "usuarioId" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" TIMESTAMP(3),
    "descripcion" TEXT NOT NULL,
    "direccionInstalacion" TEXT,
    "observaciones" TEXT,
    "comprobanteNumero" TEXT,
    "total" DECIMAL(12,2) NOT NULL,
    "adelanto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "saldo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estado" "EstadoTrabajo" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrabajoMaterial" (
    "id" TEXT NOT NULL,
    "trabajoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "unidad" TEXT NOT NULL,
    "costoUnitario" DECIMAL(12,2),
    "subtotal" DECIMAL(12,2),
    "observacion" TEXT,

    CONSTRAINT "TrabajoMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "trabajoId" TEXT,
    "usuarioId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(12,2) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "tipo" "TipoPago" NOT NULL,
    "observacion" TEXT,
    "referenciaExterna" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaInventario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriaInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoriaId" TEXT,
    "unidad" TEXT NOT NULL,
    "stockActual" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "stockMinimo" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "costoUnitario" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "proveedor" TEXT,
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "trabajoId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "TipoMovimientoInventario" NOT NULL,
    "motivo" "MotivoMovimientoInventario" NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "costoUnitario" DECIMAL(12,2),
    "referencia" TEXT,
    "proveedor" TEXT,
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaGasto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriaGasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" TEXT NOT NULL,
    "categoriaId" TEXT,
    "usuarioId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "referencia" TEXT,
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoCaja" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "trabajoId" TEXT,
    "pagoId" TEXT,
    "gastoId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "TipoMovimientoCaja" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "referencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoCaja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionNegocio" (
    "id" TEXT NOT NULL,
    "nombreComercial" TEXT NOT NULL,
    "razonSocial" TEXT,
    "ruc" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "moneda" "Moneda" NOT NULL DEFAULT 'PEN',
    "logoUrl" TEXT,
    "stockMinimoPorDefecto" DECIMAL(12,3) NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionNegocio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Cliente_nombre_idx" ON "Cliente"("nombre");

-- CreateIndex
CREATE INDEX "Cliente_telefono_idx" ON "Cliente"("telefono");

-- CreateIndex
CREATE INDEX "Cliente_documento_idx" ON "Cliente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Cotizacion_numero_key" ON "Cotizacion"("numero");

-- CreateIndex
CREATE INDEX "Cotizacion_clienteId_idx" ON "Cotizacion"("clienteId");

-- CreateIndex
CREATE INDEX "Cotizacion_estado_idx" ON "Cotizacion"("estado");

-- CreateIndex
CREATE INDEX "Cotizacion_fechaEmision_idx" ON "Cotizacion"("fechaEmision");

-- CreateIndex
CREATE INDEX "CotizacionItem_cotizacionId_idx" ON "CotizacionItem"("cotizacionId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoTrabajo_nombre_key" ON "TipoTrabajo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Trabajo_numero_key" ON "Trabajo"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Trabajo_cotizacionId_key" ON "Trabajo"("cotizacionId");

-- CreateIndex
CREATE INDEX "Trabajo_clienteId_idx" ON "Trabajo"("clienteId");

-- CreateIndex
CREATE INDEX "Trabajo_tipoTrabajoId_idx" ON "Trabajo"("tipoTrabajoId");

-- CreateIndex
CREATE INDEX "Trabajo_estado_idx" ON "Trabajo"("estado");

-- CreateIndex
CREATE INDEX "Trabajo_fechaEntrega_idx" ON "Trabajo"("fechaEntrega");

-- CreateIndex
CREATE INDEX "TrabajoMaterial_trabajoId_idx" ON "TrabajoMaterial"("trabajoId");

-- CreateIndex
CREATE INDEX "TrabajoMaterial_productoId_idx" ON "TrabajoMaterial"("productoId");

-- CreateIndex
CREATE INDEX "Pago_clienteId_idx" ON "Pago"("clienteId");

-- CreateIndex
CREATE INDEX "Pago_trabajoId_idx" ON "Pago"("trabajoId");

-- CreateIndex
CREATE INDEX "Pago_fecha_idx" ON "Pago"("fecha");

-- CreateIndex
CREATE INDEX "Pago_metodo_idx" ON "Pago"("metodo");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaInventario_nombre_key" ON "CategoriaInventario"("nombre");

-- CreateIndex
CREATE INDEX "Producto_nombre_idx" ON "Producto"("nombre");

-- CreateIndex
CREATE INDEX "Producto_categoriaId_idx" ON "Producto"("categoriaId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_productoId_idx" ON "MovimientoInventario"("productoId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_trabajoId_idx" ON "MovimientoInventario"("trabajoId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_fecha_idx" ON "MovimientoInventario"("fecha");

-- CreateIndex
CREATE INDEX "MovimientoInventario_tipo_motivo_idx" ON "MovimientoInventario"("tipo", "motivo");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaGasto_nombre_key" ON "CategoriaGasto"("nombre");

-- CreateIndex
CREATE INDEX "Gasto_categoriaId_idx" ON "Gasto"("categoriaId");

-- CreateIndex
CREATE INDEX "Gasto_fecha_idx" ON "Gasto"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "MovimientoCaja_pagoId_key" ON "MovimientoCaja"("pagoId");

-- CreateIndex
CREATE UNIQUE INDEX "MovimientoCaja_gastoId_key" ON "MovimientoCaja"("gastoId");

-- CreateIndex
CREATE INDEX "MovimientoCaja_fecha_idx" ON "MovimientoCaja"("fecha");

-- CreateIndex
CREATE INDEX "MovimientoCaja_tipo_idx" ON "MovimientoCaja"("tipo");

-- CreateIndex
CREATE INDEX "MovimientoCaja_trabajoId_idx" ON "MovimientoCaja"("trabajoId");

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionItem" ADD CONSTRAINT "CotizacionItem_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_tipoTrabajoId_fkey" FOREIGN KEY ("tipoTrabajoId") REFERENCES "TipoTrabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabajoMaterial" ADD CONSTRAINT "TrabajoMaterial_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabajoMaterial" ADD CONSTRAINT "TrabajoMaterial_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaInventario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaGasto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_gastoId_fkey" FOREIGN KEY ("gastoId") REFERENCES "Gasto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
