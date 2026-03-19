import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

const shouldReset = process.argv.includes('--reset');
const now = new Date();

function hashPassword(password) {
  return crypto.scryptSync(password, 'vidrieria-salt', 64).toString('hex');
}

function relativeDate({ months = 0, days = 0, hours = 0 } = {}) {
  const date = new Date(now);
  date.setMonth(date.getMonth() + months);
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  return date;
}

async function ensureBaseUsers() {
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@vidrieria.com' },
    update: {
      nombre: 'Administrador',
      telefono: '999999999',
      activo: true,
      rol: 'ADMIN',
    },
    create: {
      nombre: 'Administrador',
      email: 'admin@vidrieria.com',
      telefono: '999999999',
      passwordHash: hashPassword('admin123'),
      rol: 'ADMIN',
      activo: true,
    },
  });

  const operador = await prisma.usuario.upsert({
    where: { email: 'operador@vidrieria.com' },
    update: {
      nombre: 'Operador Comercial',
      telefono: '988777666',
      activo: true,
      rol: 'OPERADOR',
    },
    create: {
      nombre: 'Operador Comercial',
      email: 'operador@vidrieria.com',
      telefono: '988777666',
      passwordHash: hashPassword('operador123'),
      rol: 'OPERADOR',
      activo: true,
    },
  });

  return { admin, operador };
}

async function ensureConfiguracion() {
  const data = {
    nombreComercial: 'Vidrieria Cristal Pro',
    telefono: '987654321',
    email: 'ventas@vidrieriacristalpro.com',
    direccion: 'Av. Argentina 1840, Lima',
    moneda: 'PEN',
    stockMinimoPorDefecto: 8,
  };

  const existing = await prisma.configuracionNegocio.findFirst();

  if (existing) {
    await prisma.configuracionNegocio.update({
      where: { id: existing.id },
      data,
    });
    return;
  }

  await prisma.configuracionNegocio.create({
    data,
  });
}

async function assertDatabaseReady() {
  const [clientes, trabajos, productos, pagos, gastos] = await Promise.all([
    prisma.cliente.count(),
    prisma.trabajo.count(),
    prisma.producto.count(),
    prisma.pago.count(),
    prisma.gasto.count(),
  ]);

  const total = clientes + trabajos + productos + pagos + gastos;

  if (total > 0 && !shouldReset) {
    throw new Error('La base ya tiene datos. Usa "npm run demo:seed:cliente:reset" para reemplazarlos por la demo comercial.');
  }
}

async function resetBusinessData() {
  await prisma.$transaction([
    prisma.movimientoCaja.deleteMany(),
    prisma.pago.deleteMany(),
    prisma.trabajoMaterial.deleteMany(),
    prisma.movimientoInventario.deleteMany(),
    prisma.gasto.deleteMany(),
    prisma.trabajo.deleteMany(),
    prisma.cotizacionItem.deleteMany(),
    prisma.cotizacion.deleteMany(),
    prisma.producto.deleteMany(),
    prisma.categoriaInventario.deleteMany(),
    prisma.categoriaGasto.deleteMany(),
    prisma.tipoTrabajo.deleteMany(),
    prisma.cliente.deleteMany(),
  ]);
}

async function createCatalogs() {
  const categoriaInventarioNames = ['Vidrios', 'Accesorios', 'Selladores', 'Perfiles', 'Espejos', 'Barandas'];
  const categoriaGastoNames = ['Materiales', 'Transporte', 'Servicios', 'Herramientas', 'Planilla', 'Operativos'];
  const tipoTrabajoNames = ['Mampara', 'Puerta de vidrio', 'Espejo', 'Baranda', 'Ventana', 'Fachada'];

  const categoriasInventario = {};
  for (const nombre of categoriaInventarioNames) {
    categoriasInventario[nombre] = await prisma.categoriaInventario.create({ data: { nombre } });
  }

  const categoriasGasto = {};
  for (const nombre of categoriaGastoNames) {
    categoriasGasto[nombre] = await prisma.categoriaGasto.create({ data: { nombre } });
  }

  const tiposTrabajo = {};
  for (const nombre of tipoTrabajoNames) {
    tiposTrabajo[nombre] = await prisma.tipoTrabajo.create({ data: { nombre } });
  }

  return { categoriasInventario, categoriasGasto, tiposTrabajo };
}

async function createClients() {
  const clientesData = [
    ['Constructora Andina SAC', '014221100', 'Av. Javier Prado 2850 - San Isidro', '20563214789'],
    ['Hotel Mirador del Pacifico', '012478965', 'Malecón Cisneros 415 - Miraflores', '20654123789'],
    ['Clinica Santa Elena', '013256987', 'Av. Brasil 1550 - Pueblo Libre', '20587412366'],
    ['Corporacion Vega', '014785632', 'Av. Colonial 1120 - Callao', '20632547891'],
    ['Mariana Torres', '978456123', 'Calle Las Orquídeas 221 - Surco', '43785219'],
    ['Eduardo Palomino', '965874123', 'Jr. Cuzco 115 - Cercado de Lima', '40985217'],
    ['Restaurante El Mirador', '014125478', 'Av. La Mar 250 - Miraflores', '20569874123'],
    ['Condominio Las Palmeras', '014778899', 'Av. Guardia Civil 980 - San Borja', '20698745120'],
    ['Patricia Campos', '956321478', 'Av. Los Fresnos 602 - La Molina', '46852314'],
    ['Tienda Nova Home', '014778845', 'Av. Aviación 3650 - San Borja', '20574123698'],
  ];

  const clientes = [];
  for (const [nombre, telefono, direccion, documento] of clientesData) {
    clientes.push(await prisma.cliente.create({
      data: {
        nombre,
        telefono,
        direccion,
        documento,
      },
    }));
  }

  return clientes;
}

async function createProducts(catalogs) {
  const products = {};
  const productsData = [
    { nombre: 'Vidrio templado 10 mm', categoria: 'Vidrios', unidad: 'm2', stockActual: 34, stockMinimo: 12, costoUnitario: 165, proveedor: 'Cristales Premium' },
    { nombre: 'Vidrio laminado 8 mm', categoria: 'Vidrios', unidad: 'm2', stockActual: 11, stockMinimo: 10, costoUnitario: 145, proveedor: 'Cristales Premium' },
    { nombre: 'Vidrio insulado', categoria: 'Vidrios', unidad: 'm2', stockActual: 6, stockMinimo: 8, costoUnitario: 220, proveedor: 'Cristales Premium' },
    { nombre: 'Espejo biselado 6 mm', categoria: 'Espejos', unidad: 'm2', stockActual: 14, stockMinimo: 6, costoUnitario: 110, proveedor: 'Espejos Finos SAC' },
    { nombre: 'Spider para fachada', categoria: 'Accesorios', unidad: 'unidad', stockActual: 18, stockMinimo: 8, costoUnitario: 95, proveedor: 'Herrajes Arquitectonicos' },
    { nombre: 'Kit premium para mampara', categoria: 'Accesorios', unidad: 'juego', stockActual: 5, stockMinimo: 6, costoUnitario: 240, proveedor: 'Herrajes Arquitectonicos' },
    { nombre: 'Perfil aluminio linea pesada', categoria: 'Perfiles', unidad: 'ml', stockActual: 60, stockMinimo: 20, costoUnitario: 34, proveedor: 'Aluminios del Centro' },
    { nombre: 'Silicona estructural', categoria: 'Selladores', unidad: 'tubo', stockActual: 9, stockMinimo: 12, costoUnitario: 28, proveedor: 'Sika Peru' },
    { nombre: 'Boton para baranda', categoria: 'Barandas', unidad: 'unidad', stockActual: 22, stockMinimo: 10, costoUnitario: 48, proveedor: 'Acero y Vidrio Peru' },
    { nombre: 'Jalador tubular inoxidable', categoria: 'Accesorios', unidad: 'unidad', stockActual: 16, stockMinimo: 8, costoUnitario: 55, proveedor: 'Herrajes Arquitectonicos' },
  ];

  for (const item of productsData) {
    const producto = await prisma.producto.create({
      data: {
        nombre: item.nombre,
        categoriaId: catalogs.categoriasInventario[item.categoria].id,
        unidad: item.unidad,
        stockActual: item.stockActual,
        stockMinimo: item.stockMinimo,
        costoUnitario: item.costoUnitario,
        proveedor: item.proveedor,
      },
    });

    products[item.nombre] = producto;
  }

  return products;
}

async function createInventoryHistory(productos, adminId) {
  const movimientos = [
    { producto: 'Vidrio templado 10 mm', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 40, costoUnitario: 165, fecha: relativeDate({ months: -3, days: 4 }), referencia: 'FAC-11025' },
    { producto: 'Vidrio laminado 8 mm', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 20, costoUnitario: 145, fecha: relativeDate({ months: -2, days: 6 }), referencia: 'FAC-11048' },
    { producto: 'Vidrio insulado', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 10, costoUnitario: 220, fecha: relativeDate({ months: -2, days: 18 }), referencia: 'FAC-11076' },
    { producto: 'Espejo biselado 6 mm', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 18, costoUnitario: 110, fecha: relativeDate({ months: -1, days: -10 }), referencia: 'FAC-11105' },
    { producto: 'Spider para fachada', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 20, costoUnitario: 95, fecha: relativeDate({ months: -1, days: -7 }), referencia: 'FAC-11108' },
    { producto: 'Kit premium para mampara', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 8, costoUnitario: 240, fecha: relativeDate({ months: -1, days: -4 }), referencia: 'FAC-11112' },
    { producto: 'Silicona estructural', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 18, costoUnitario: 28, fecha: relativeDate({ days: -22 }), referencia: 'FAC-11130' },
    { producto: 'Perfil aluminio linea pesada', tipo: 'ENTRADA', motivo: 'COMPRA', cantidad: 80, costoUnitario: 34, fecha: relativeDate({ days: -20 }), referencia: 'FAC-11133' },
    { producto: 'Vidrio insulado', tipo: 'SALIDA', motivo: 'USO_EN_TRABAJO', cantidad: 4, fecha: relativeDate({ days: -8 }), referencia: 'Fachada corporativa' },
    { producto: 'Kit premium para mampara', tipo: 'SALIDA', motivo: 'USO_EN_TRABAJO', cantidad: 3, fecha: relativeDate({ days: -5 }), referencia: 'Mamparas hotel' },
    { producto: 'Silicona estructural', tipo: 'SALIDA', motivo: 'USO_EN_TRABAJO', cantidad: 9, fecha: relativeDate({ days: -3 }), referencia: 'Instalaciones comerciales' },
  ];

  for (const movimiento of movimientos) {
    await prisma.movimientoInventario.create({
      data: {
        productoId: productos[movimiento.producto].id,
        usuarioId: adminId,
        tipo: movimiento.tipo,
        motivo: movimiento.motivo,
        cantidad: movimiento.cantidad,
        costoUnitario: movimiento.costoUnitario ?? null,
        referencia: movimiento.referencia,
        fecha: movimiento.fecha,
      },
    });
  }
}

async function createTrabajosAndFinance(clientes, productos, catalogs, users) {
  const trabajosSeed = [
    {
      numero: 'TRA-2026-1001',
      cliente: 'Constructora Andina SAC',
      tipo: 'Fachada',
      descripcion: 'Suministro e instalacion de fachada de vidrio para modulo administrativo',
      total: 18500,
      fechaRegistro: relativeDate({ months: -3, days: 5 }),
      fechaEntrega: relativeDate({ months: -2, days: -20 }),
      estado: 'ENTREGADO',
      boleta: 'F001-5401',
      pagos: [
        { monto: 7000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ months: -3, days: 5, hours: 1 }) },
        { monto: 6500, metodo: 'TRANSFERENCIA', tipo: 'PARCIAL', fecha: relativeDate({ months: -2, days: -28, hours: 3 }) },
        { monto: 5000, metodo: 'TRANSFERENCIA', tipo: 'FINAL', fecha: relativeDate({ months: -2, days: -20, hours: 4 }) },
      ],
      materiales: [
        ['Vidrio insulado', 12, 'm2', 220],
        ['Spider para fachada', 8, 'unidad', 95],
        ['Silicona estructural', 6, 'tubo', 28],
      ],
    },
    {
      numero: 'TRA-2026-1002',
      cliente: 'Hotel Mirador del Pacifico',
      tipo: 'Mampara',
      descripcion: 'Mamparas de vidrio templado para 6 suites premium',
      total: 12600,
      fechaRegistro: relativeDate({ months: -2, days: 12 }),
      fechaEntrega: relativeDate({ months: -1, days: -20 }),
      estado: 'ENTREGADO',
      boleta: 'F001-5438',
      pagos: [
        { monto: 5000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ months: -2, days: 12, hours: 1 }) },
        { monto: 4200, metodo: 'TRANSFERENCIA', tipo: 'PARCIAL', fecha: relativeDate({ months: -1, days: -27, hours: 2 }) },
        { monto: 3400, metodo: 'TRANSFERENCIA', tipo: 'FINAL', fecha: relativeDate({ months: -1, days: -20, hours: 3 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 14, 'm2', 165],
        ['Kit premium para mampara', 6, 'juego', 240],
        ['Silicona estructural', 5, 'tubo', 28],
      ],
    },
    {
      numero: 'TRA-2026-1003',
      cliente: 'Clinica Santa Elena',
      tipo: 'Puerta de vidrio',
      descripcion: 'Puertas templadas para consultorios y reception',
      total: 8450,
      fechaRegistro: relativeDate({ months: -2, days: 20 }),
      fechaEntrega: relativeDate({ months: -1, days: -12 }),
      estado: 'ENTREGADO',
      boleta: 'F001-5451',
      pagos: [
        { monto: 3500, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ months: -2, days: 20, hours: 1 }) },
        { monto: 4950, metodo: 'TRANSFERENCIA', tipo: 'FINAL', fecha: relativeDate({ months: -1, days: -12, hours: 2 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 7, 'm2', 165],
        ['Jalador tubular inoxidable', 6, 'unidad', 55],
        ['Spider para fachada', 4, 'unidad', 95],
      ],
    },
    {
      numero: 'TRA-2026-1004',
      cliente: 'Corporacion Vega',
      tipo: 'Ventana',
      descripcion: 'Ventanas y paños fijos para oficina central',
      total: 9600,
      fechaRegistro: relativeDate({ months: -1, days: -22 }),
      fechaEntrega: relativeDate({ months: -1, days: -10 }),
      estado: 'TERMINADO',
      boleta: 'F001-5480',
      pagos: [
        { monto: 4000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ months: -1, days: -22, hours: 1 }) },
      ],
      materiales: [
        ['Vidrio laminado 8 mm', 11, 'm2', 145],
        ['Perfil aluminio linea pesada', 24, 'ml', 34],
      ],
    },
    {
      numero: 'TRA-2026-1005',
      cliente: 'Mariana Torres',
      tipo: 'Espejo',
      descripcion: 'Espejos biselados para hall y comedor principal',
      total: 2650,
      fechaRegistro: relativeDate({ months: -1, days: -14 }),
      fechaEntrega: relativeDate({ months: -1, days: -9 }),
      estado: 'ENTREGADO',
      boleta: 'B001-3002',
      pagos: [
        { monto: 1000, metodo: 'YAPE', tipo: 'ADELANTO', fecha: relativeDate({ months: -1, days: -14, hours: 1 }) },
        { monto: 1650, metodo: 'TRANSFERENCIA', tipo: 'FINAL', fecha: relativeDate({ months: -1, days: -9, hours: 2 }) },
      ],
      materiales: [
        ['Espejo biselado 6 mm', 6, 'm2', 110],
        ['Perfil aluminio linea pesada', 10, 'ml', 34],
      ],
    },
    {
      numero: 'TRA-2026-1006',
      cliente: 'Eduardo Palomino',
      tipo: 'Puerta de vidrio',
      descripcion: 'Puerta templada para oficina en casa',
      total: 1980,
      fechaRegistro: relativeDate({ months: -1, days: -6 }),
      fechaEntrega: relativeDate({ months: -1, days: -2 }),
      estado: 'ENTREGADO',
      boleta: 'B001-3010',
      pagos: [
        { monto: 800, metodo: 'EFECTIVO', tipo: 'ADELANTO', fecha: relativeDate({ months: -1, days: -6, hours: 1 }) },
        { monto: 1180, metodo: 'PLIN', tipo: 'FINAL', fecha: relativeDate({ months: -1, days: -2, hours: 3 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 2.5, 'm2', 165],
        ['Jalador tubular inoxidable', 1, 'unidad', 55],
      ],
    },
    {
      numero: 'TRA-2026-1007',
      cliente: 'Restaurante El Mirador',
      tipo: 'Fachada',
      descripcion: 'Mampara apilable y cerramiento de terraza',
      total: 14300,
      fechaRegistro: relativeDate({ days: -24 }),
      fechaEntrega: relativeDate({ days: -12 }),
      estado: 'TERMINADO',
      boleta: 'F001-5522',
      pagos: [
        { monto: 6000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ days: -24, hours: 1 }) },
        { monto: 3500, metodo: 'TRANSFERENCIA', tipo: 'PARCIAL', fecha: relativeDate({ days: -17, hours: 2 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 15, 'm2', 165],
        ['Perfil aluminio linea pesada', 22, 'ml', 34],
        ['Silicona estructural', 5, 'tubo', 28],
      ],
    },
    {
      numero: 'TRA-2026-1008',
      cliente: 'Condominio Las Palmeras',
      tipo: 'Baranda',
      descripcion: 'Barandas de vidrio para escaleras y balcones del lobby',
      total: 17200,
      fechaRegistro: relativeDate({ days: -18 }),
      fechaEntrega: relativeDate({ days: -5 }),
      estado: 'EN_PROCESO',
      boleta: 'F001-5536',
      pagos: [
        { monto: 7000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ days: -18, hours: 1 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 16, 'm2', 165],
        ['Boton para baranda', 18, 'unidad', 48],
        ['Silicona estructural', 4, 'tubo', 28],
      ],
    },
    {
      numero: 'TRA-2026-1009',
      cliente: 'Patricia Campos',
      tipo: 'Mampara',
      descripcion: 'Mampara de ducha con herrajes negros',
      total: 2380,
      fechaRegistro: relativeDate({ days: -13 }),
      fechaEntrega: relativeDate({ days: -9 }),
      estado: 'ENTREGADO',
      boleta: 'B001-3024',
      pagos: [
        { monto: 1000, metodo: 'YAPE', tipo: 'ADELANTO', fecha: relativeDate({ days: -13, hours: 1 }) },
        { monto: 1380, metodo: 'EFECTIVO', tipo: 'FINAL', fecha: relativeDate({ days: -9, hours: 2 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 2.7, 'm2', 165],
        ['Kit premium para mampara', 1, 'juego', 240],
      ],
    },
    {
      numero: 'TRA-2026-1010',
      cliente: 'Tienda Nova Home',
      tipo: 'Espejo',
      descripcion: 'Espejos de exhibicion para nueva area de decoracion',
      total: 4820,
      fechaRegistro: relativeDate({ days: -10 }),
      fechaEntrega: relativeDate({ days: -3 }),
      estado: 'ENTREGADO',
      boleta: 'F001-5550',
      pagos: [
        { monto: 2500, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ days: -10, hours: 1 }) },
        { monto: 2320, metodo: 'TRANSFERENCIA', tipo: 'FINAL', fecha: relativeDate({ days: -3, hours: 2 }) },
      ],
      materiales: [
        ['Espejo biselado 6 mm', 9, 'm2', 110],
      ],
    },
    {
      numero: 'TRA-2026-1011',
      cliente: 'Hotel Mirador del Pacifico',
      tipo: 'Baranda',
      descripcion: 'Barandas de vidrio para rooftop del hotel',
      total: 21400,
      fechaRegistro: relativeDate({ days: -7 }),
      fechaEntrega: relativeDate({ days: 6 }),
      estado: 'EN_PROCESO',
      boleta: 'F001-5561',
      pagos: [
        { monto: 9000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ days: -7, hours: 1 }) },
        { monto: 4000, metodo: 'TRANSFERENCIA', tipo: 'PARCIAL', fecha: relativeDate({ days: -2, hours: 2 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 20, 'm2', 165],
        ['Boton para baranda', 22, 'unidad', 48],
        ['Silicona estructural', 6, 'tubo', 28],
      ],
    },
    {
      numero: 'TRA-2026-1012',
      cliente: 'Constructora Andina SAC',
      tipo: 'Ventana',
      descripcion: 'Ventanas proyectantes para edificio piloto',
      total: 11800,
      fechaRegistro: relativeDate({ days: -5 }),
      fechaEntrega: relativeDate({ days: 8 }),
      estado: 'PENDIENTE',
      boleta: 'F001-5568',
      pagos: [
        { monto: 5000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ days: -5, hours: 1 }) },
      ],
      materiales: [
        ['Vidrio laminado 8 mm', 14, 'm2', 145],
        ['Perfil aluminio linea pesada', 28, 'ml', 34],
      ],
    },
    {
      numero: 'TRA-2026-1013',
      cliente: 'Clinica Santa Elena',
      tipo: 'Puerta de vidrio',
      descripcion: 'Puertas automáticas de acceso para emergencia',
      total: 15400,
      fechaRegistro: relativeDate({ days: -2 }),
      fechaEntrega: relativeDate({ days: 9 }),
      estado: 'PENDIENTE',
      boleta: 'F001-5572',
      pagos: [
        { monto: 6000, metodo: 'TRANSFERENCIA', tipo: 'ADELANTO', fecha: relativeDate({ days: -2, hours: 2 }) },
      ],
      materiales: [
        ['Vidrio templado 10 mm', 12, 'm2', 165],
        ['Jalador tubular inoxidable', 4, 'unidad', 55],
        ['Spider para fachada', 8, 'unidad', 95],
      ],
    },
    {
      numero: 'TRA-2026-1014',
      cliente: 'Patricia Campos',
      tipo: 'Espejo',
      descripcion: 'Espejo retroiluminado para walking closet',
      total: 3200,
      fechaRegistro: relativeDate({ days: 0, hours: -4 }),
      fechaEntrega: relativeDate({ days: 5 }),
      estado: 'PENDIENTE',
      boleta: 'B001-3035',
      pagos: [
        { monto: 1200, metodo: 'YAPE', tipo: 'ADELANTO', fecha: relativeDate({ hours: -3 }) },
      ],
      materiales: [
        ['Espejo biselado 6 mm', 4.5, 'm2', 110],
      ],
    },
  ];

  for (const item of trabajosSeed) {
    const cliente = clientes.find((entry) => entry.nombre === item.cliente);
    const totalPagado = item.pagos.reduce((sum, pago) => sum + pago.monto, 0);

    const trabajo = await prisma.trabajo.create({
      data: {
        numero: item.numero,
        clienteId: cliente.id,
        tipoTrabajoId: catalogs.tiposTrabajo[item.tipo].id,
        usuarioId: users.admin.id,
        fechaRegistro: item.fechaRegistro,
        fechaEntrega: item.fechaEntrega,
        descripcion: item.descripcion,
        direccionInstalacion: cliente.direccion,
        observaciones: `Escenario comercial demo - ${item.tipo}`,
        comprobanteNumero: item.boleta,
        total: item.total,
        adelanto: totalPagado,
        saldo: Math.max(item.total - totalPagado, 0),
        estado: item.estado,
      },
    });

    for (const material of item.materiales) {
      const producto = productos[material[0]];
      await prisma.trabajoMaterial.create({
        data: {
          trabajoId: trabajo.id,
          productoId: producto.id,
          cantidad: material[1],
          unidad: material[2],
          costoUnitario: material[3],
          subtotal: Number(material[1]) * Number(material[3]),
        },
      });
    }

    for (const pagoItem of item.pagos) {
      const pago = await prisma.pago.create({
        data: {
          clienteId: cliente.id,
          trabajoId: trabajo.id,
          usuarioId: users.admin.id,
          fecha: pagoItem.fecha,
          monto: pagoItem.monto,
          metodo: pagoItem.metodo,
          tipo: pagoItem.tipo,
          observacion: 'Pago demo comercial',
        },
      });

      await prisma.movimientoCaja.create({
        data: {
          usuarioId: users.admin.id,
          trabajoId: trabajo.id,
          pagoId: pago.id,
          fecha: pagoItem.fecha,
          tipo: 'INGRESO',
          descripcion: `Pago de trabajo - ${item.descripcion}`,
          monto: pagoItem.monto,
          referencia: trabajo.numero,
        },
      });
    }
  }
}

async function createGastos(catalogs, userId) {
  const gastos = [
    { fecha: relativeDate({ months: -3, days: 7 }), descripcion: 'Compra mayorista de perfiles y accesorios', categoria: 'Materiales', monto: 4200, referencia: 'FAC-8001' },
    { fecha: relativeDate({ months: -2, days: 16 }), descripcion: 'Flete especial para cristales de fachada', categoria: 'Transporte', monto: 980, referencia: 'TR-2201' },
    { fecha: relativeDate({ months: -1, days: -20 }), descripcion: 'Mantenimiento de pulidora y cortadora', categoria: 'Herramientas', monto: 1350, referencia: 'SER-401' },
    { fecha: relativeDate({ months: -1, days: -11 }), descripcion: 'Planilla tecnica de instaladores', categoria: 'Planilla', monto: 3200, referencia: 'PLA-031' },
    { fecha: relativeDate({ months: -1, days: -2 }), descripcion: 'Internet, telefonia y licencias', categoria: 'Servicios', monto: 460, referencia: 'REC-991' },
    { fecha: relativeDate({ days: -14 }), descripcion: 'Compra urgente de silicona estructural', categoria: 'Materiales', monto: 760, referencia: 'FAC-8080' },
    { fecha: relativeDate({ days: -8 }), descripcion: 'Combustible y movilidad de instalaciones', categoria: 'Transporte', monto: 390, referencia: 'MOV-110' },
    { fecha: relativeDate({ days: -4 }), descripcion: 'Planilla tecnica de apoyo externo', categoria: 'Planilla', monto: 1850, referencia: 'PLA-036' },
    { fecha: relativeDate({ days: 0, hours: -2 }), descripcion: 'Compra de herrajes premium importados', categoria: 'Materiales', monto: 1280, referencia: 'FAC-8122' },
  ];

  for (const item of gastos) {
    const gasto = await prisma.gasto.create({
      data: {
        categoriaId: catalogs.categoriasGasto[item.categoria].id,
        usuarioId: userId,
        fecha: item.fecha,
        descripcion: item.descripcion,
        monto: item.monto,
        referencia: item.referencia,
        observacion: 'Gasto demo comercial',
      },
    });

    await prisma.movimientoCaja.create({
      data: {
        usuarioId: userId,
        gastoId: gasto.id,
        fecha: item.fecha,
        tipo: 'SALIDA',
        descripcion: item.descripcion,
        monto: item.monto,
        referencia: item.referencia,
      },
    });
  }
}

async function main() {
  await ensureConfiguracion();
  const users = await ensureBaseUsers();
  await assertDatabaseReady();

  if (shouldReset) {
    console.log('Limpiando datos actuales para cargar la demo comercial...');
    await resetBusinessData();
  }

  const catalogs = await createCatalogs();
  const clientes = await createClients();
  const productos = await createProducts(catalogs);
  await createInventoryHistory(productos, users.admin.id);
  await createTrabajosAndFinance(clientes, productos, catalogs, users);
  await createGastos(catalogs, users.admin.id);

  console.log('Datos demo comercial cargados correctamente.');
  console.log('Resumen: 10 clientes, 10 productos, 14 trabajos corporativos y residenciales, pagos, gastos y reportes con montos de presentacion.');
  console.log('Usuarios demo: admin@vidrieria.com / admin123 y operador@vidrieria.com / operador123');
}

main()
  .catch((error) => {
    console.error('No se pudo cargar la demo comercial:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
