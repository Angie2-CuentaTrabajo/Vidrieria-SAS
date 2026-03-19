# Guia de Ejemplo de Llenado

## Sistema de Gestion Vidrieria

Este documento muestra un ejemplo simple de uso del sistema con datos de muestra. Sirve como guia para que el personal sepa que informacion registrar en cada paso.

## Ejemplo completo

### 1. Registrar cliente

Ir a `Clientes` y presionar `Nuevo cliente`.

Llenar asi:

- Nombre: `Juan Perez`
- Telefono: `987654321`
- Direccion: `Av. Los Olivos 123 - Lima`
- Documento: `45879632`
- Observacion: `Cliente frecuente. Prefiere contacto por WhatsApp.`

Guardar el registro.

### 2. Crear cotizacion

Ir a `Cotizaciones` y presionar `Nueva Cotizacion`.

Llenar asi:

- Cliente: `Juan Perez`
- Vigencia: `10 dias despues de la fecha actual`
- Descripcion del trabajo: `Fabricacion e instalacion de mampara de vidrio templado para bano principal.`

Agregar items:

Item 1

- Descripcion: `Vidrio templado 8 mm`
- Cantidad: `2`
- Unidad: `m2`
- Precio: `180`

Item 2

- Descripcion: `Herrajes y accesorios`
- Cantidad: `1`
- Unidad: `juego`
- Precio: `250`

Otros datos:

- Mano de obra: `200`
- Descuento: `30`
- Observaciones: `Incluye instalacion y sellado.`

Guardar la cotizacion.

### 3. Aprobar o convertir la cotizacion

Abrir el detalle de la cotizacion.

Opciones:

- Si el cliente acepta, usar `Aprobar cotizacion` o `Convertir en trabajo`
- Si no acepta, usar `Rechazar cotizacion`
- Si ya no se usara pero debe quedar historial, usar `Anular cotizacion`
- Si aun esta pendiente y no tiene trabajo asociado, usar `Eliminar cotizacion`

### 4. Crear o revisar trabajo

Si la cotizacion fue convertida, entrar a `Trabajos`.

Verificar que el trabajo tenga:

- Cliente: `Juan Perez`
- Descripcion: `Fabricacion e instalacion de mampara de vidrio templado para bano principal`
- Total: `780`
- Estado inicial: `PENDIENTE`

Si se crea un trabajo manualmente, llenar por ejemplo:

- Cliente: `Juan Perez`
- Tipo de trabajo: `Mampara`
- Descripcion: `Instalacion de mampara corrediza para ducha`
- Total: `780`
- Adelanto inicial: `300`
- Fecha de entrega: `2026-03-25`
- Boleta: `B001-245`
- Observaciones: `Coordinar instalacion por la tarde`

Guardar el trabajo.

### 5. Registrar pago

Ir a `Pagos` y registrar un pago.

Ejemplo:

- Trabajo: `Mampara corrediza para ducha`
- Monto: `300`
- Metodo: `YAPE`
- Tipo: `ADELANTO`
- Observacion: `Adelanto confirmado por WhatsApp`

Guardar el pago.

Resultado esperado:

- baja el saldo pendiente del trabajo
- aparece un ingreso en caja

### 6. Registrar inventario

Ir a `Inventario`.

Crear producto ejemplo:

- Nombre: `Vidrio templado 8 mm`
- Categoria: `Vidrios`
- Unidad: `m2`
- Stock inicial: `15`
- Stock minimo: `5`
- Costo unitario: `120`
- Proveedor: `Cristales del Peru`
- Observacion: `Uso frecuente en mamparas`

Guardar el producto.

Luego registrar una entrada:

- Tipo: `ENTRADA`
- Motivo: `COMPRA`
- Cantidad: `10`
- Costo unitario: `120`
- Proveedor: `Cristales del Peru`
- Referencia: `Factura 001-458`

Luego registrar una salida:

- Tipo: `SALIDA`
- Motivo: `USO_EN_TRABAJO`
- Cantidad: `2`
- Referencia: `Trabajo de Juan Perez`

### 7. Registrar gasto

Ir a `Gastos` y crear un gasto.

Ejemplo:

- Fecha: `hoy`
- Descripcion: `Compra de silicona y accesorios`
- Categoria: `Materiales`
- Monto: `95`
- Referencia: `Boleta 5487`
- Observacion: `Compra para instalaciones del dia`

Guardar el gasto.

Resultado esperado:

- aparece una salida en caja

### 8. Revisar caja

Ir a `Caja`.

Verificar:

- ingreso por pago de `300`
- salida por gasto de `95`
- saldo actualizado

### 9. Revisar reportes

Ir a `Reportes`.

Verificar que aparezca informacion como:

- ingresos del periodo
- gastos del periodo
- utilidad neta
- trabajos realizados
- productos mas usados

### 10. Revisar calendario

Ir a `Calendario`.

Verificar que el trabajo con fecha de entrega registrada aparezca en el dia correspondiente.

## Resumen del ejemplo

Ejemplo resumido del flujo:

1. Cliente: `Juan Perez`
2. Cotizacion: mampara de vidrio
3. Trabajo: generado desde la cotizacion
4. Pago: adelanto de `300`
5. Inventario: salida de materiales usados
6. Gasto: compra de insumos
7. Caja y reportes: actualizados automaticamente

## Recomendacion

Este documento puede compartirse con el personal como ejemplo base. Si quieres, luego puedo hacerte una version mas formal con espacios en blanco para imprimir y llenar manualmente como formato de capacitacion.
