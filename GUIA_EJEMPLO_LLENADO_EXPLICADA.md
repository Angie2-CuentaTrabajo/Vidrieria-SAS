# Guia de Ejemplo de Llenado Explicada

## Sistema de Gestion Vidrieria

Este documento explica, con ejemplos simples, para que sirve cada campo principal del sistema y en que caso se usa dentro del negocio.

## 1. Clientes

El modulo `Clientes` sirve para registrar a las personas o empresas que solicitan trabajos.

### Campos y su uso

- `Nombre`
  Sirve para identificar al cliente dentro del sistema. Se usa en cotizaciones, trabajos, pagos, reportes y busquedas.

- `Telefono`
  Sirve para contactar al cliente rapidamente por llamada o WhatsApp. Es util para coordinar visitas, confirmaciones y entregas.

- `Direccion`
  Sirve para registrar la direccion del cliente o del lugar principal de referencia. Ayuda al momento de ubicar instalaciones o entregas.

- `Documento`
  Sirve para guardar DNI, RUC u otro dato de identificacion. Es util para control interno o emision de comprobantes.

- `Observacion`
  Sirve para anotar detalles importantes, por ejemplo si el cliente es frecuente, si solo responde por WhatsApp o si tiene condiciones especiales.

### Ejemplo

- Nombre: `Juan Perez`
- Telefono: `987654321`
- Direccion: `Av. Los Olivos 123 - Lima`
- Documento: `45879632`
- Observacion: `Cliente frecuente. Prefiere contacto por WhatsApp.`

## 2. Cotizaciones

El modulo `Cotizaciones` sirve para preparar presupuestos antes de confirmar un trabajo.

### Campos principales y su uso

- `Cliente`
  Sirve para asociar la cotizacion a una persona especifica. Esto permite luego convertirla en trabajo y mantener el historial ordenado.

- `Vigencia`
  Sirve para indicar hasta cuando el precio ofrecido es valido. Se usa para evitar confusiones cuando cambian costos de materiales o mano de obra.

- `Descripcion del trabajo`
  Sirve para resumir lo que se va a fabricar o instalar. Debe explicar claramente el servicio ofrecido.

- `Items`
  Sirven para detallar materiales, accesorios o conceptos cobrados. Ayudan a descomponer el costo total.

#### Dentro de cada item

- `Descripcion`
  Explica que material o servicio parcial se esta cobrando. Ejemplo: vidrio templado, herrajes, instalacion.

- `Cantidad`
  Indica cuantas unidades, metros, metros cuadrados o juegos se van a usar.

- `Unidad`
  Sirve para aclarar como se mide el item. Ejemplo: `m2`, `unidad`, `juego`, `ml`.

- `Precio`
  Es el valor por cada unidad del item. El sistema lo usa para calcular el total del item.

- `Mano de obra`
  Sirve para cobrar la fabricacion, traslado o instalacion, aparte de los materiales.

- `Descuento`
  Sirve para reducir el total final si se da una rebaja comercial.

- `Observaciones`
  Sirve para agregar condiciones especiales, aclaraciones o alcances del servicio.

### Uso en el negocio

La cotizacion ayuda a:

- presentar un precio claro al cliente
- justificar el monto cobrado
- convertir luego ese presupuesto en trabajo real
- conservar historial aunque una cotizacion no se concrete

### Ejemplo

- Cliente: `Juan Perez`
- Vigencia: `10 dias despues de la fecha actual`
- Descripcion del trabajo: `Fabricacion e instalacion de mampara de vidrio templado para bano principal`

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

Otros campos:

- Mano de obra: `200`
- Descuento: `30`
- Observaciones: `Incluye instalacion y sellado`

## 3. Trabajos

El modulo `Trabajos` sirve para registrar trabajos confirmados y hacer seguimiento hasta su entrega.

### Campos principales y su uso

- `Cliente`
  Indica a quien pertenece el trabajo. Permite relacionar pagos y saldos.

- `Tipo de trabajo`
  Sirve para clasificar el servicio. Ejemplos: mampara, puerta de vidrio, espejo, ventana.

- `Descripcion`
  Explica el trabajo concreto que se va a realizar.

- `Total`
  Es el valor completo del trabajo. Sirve para calcular adelantos, pagos parciales y saldo pendiente.

- `Adelanto inicial`
  Sirve para registrar un pago inicial al momento de crear el trabajo, si el cliente ya dejo una parte del dinero.

- `Fecha de entrega`
  Sirve para planificar el calendario y coordinar con el cliente.

- `Boleta`
  Sirve para guardar el numero del comprobante asociado.

- `Observaciones`
  Sirve para dejar instrucciones utiles, como horarios, detalles de instalacion o coordinaciones especiales.

### Uso en el negocio

Este modulo ayuda a:

- saber que trabajos estan pendientes
- organizar entregas e instalaciones
- controlar cuanto debe cada cliente
- enlazar pagos y calendario

### Ejemplo

- Cliente: `Juan Perez`
- Tipo de trabajo: `Mampara`
- Descripcion: `Instalacion de mampara corrediza para ducha`
- Total: `780`
- Adelanto inicial: `300`
- Fecha de entrega: `2026-03-25`
- Boleta: `B001-245`
- Observaciones: `Coordinar instalacion por la tarde`

## 4. Pagos

El modulo `Pagos` sirve para registrar el dinero recibido de los clientes.

### Campos principales y su uso

- `Trabajo`
  Sirve para saber que trabajo esta pagando el cliente.

- `Monto`
  Es la cantidad abonada. El sistema la resta del saldo pendiente.

- `Metodo`
  Sirve para registrar como se pago. Ejemplos: efectivo, transferencia, Yape, Plin, tarjeta.

- `Tipo`
  Sirve para clasificar el pago segun el momento comercial:
  `ADELANTO`, `PARCIAL` o `FINAL`.

- `Observacion`
  Sirve para dejar notas como numero de operacion, confirmacion o acuerdo con el cliente.

### Uso en el negocio

Cada pago sirve para:

- reducir el saldo del trabajo
- registrar ingreso en caja
- mantener orden financiero

### Ejemplo

- Trabajo: `Mampara corrediza para ducha`
- Monto: `300`
- Metodo: `YAPE`
- Tipo: `ADELANTO`
- Observacion: `Adelanto confirmado por WhatsApp`

## 5. Inventario

El modulo `Inventario` sirve para controlar materiales y productos usados por la vidrieria.

### Campos principales del producto y su uso

- `Nombre`
  Sirve para identificar el material o producto. Ejemplo: vidrio templado 8 mm.

- `Categoria`
  Sirve para agrupar productos similares. Ayuda en orden y reportes.

- `Unidad`
  Indica como se mide el producto. Ejemplo: `m2`, `unidad`, `ml`.

- `Stock inicial`
  Es la cantidad con la que empieza el registro del producto.

- `Stock minimo`
  Sirve como alerta para saber cuando conviene volver a comprar.

- `Costo unitario`
  Sirve para estimar costos de compra y referencia interna.

- `Proveedor`
  Sirve para saber a quien se compra el material.

- `Observacion`
  Sirve para dejar notas internas sobre uso o caracteristicas.

### Campos de movimientos y su uso

- `Tipo`
  Puede ser `ENTRADA` o `SALIDA`. Indica si el stock aumenta o disminuye.

- `Motivo`
  Explica por que se movio el stock. Ejemplo: compra, uso en trabajo, merma o ajuste.

- `Cantidad`
  Indica cuanto material entro o salio.

- `Referencia`
  Sirve para relacionar el movimiento con una factura, trabajo o nota interna.

### Uso en el negocio

Este modulo ayuda a:

- evitar faltantes de material
- saber que productos se usan mas
- controlar compras y consumo

### Ejemplo

Producto:

- Nombre: `Vidrio templado 8 mm`
- Categoria: `Vidrios`
- Unidad: `m2`
- Stock inicial: `15`
- Stock minimo: `5`
- Costo unitario: `120`
- Proveedor: `Cristales del Peru`
- Observacion: `Uso frecuente en mamparas`

Movimiento:

- Tipo: `SALIDA`
- Motivo: `USO_EN_TRABAJO`
- Cantidad: `2`
- Referencia: `Trabajo de Juan Perez`

## 6. Gastos

El modulo `Gastos` sirve para registrar egresos del negocio.

### Campos principales y su uso

- `Fecha`
  Sirve para saber cuando se realizo el gasto.

- `Descripcion`
  Resume de que fue el gasto.

- `Categoria`
  Sirve para ordenar gastos por tipo. Ejemplo: materiales, transporte, servicios, mantenimiento.

- `Monto`
  Es el valor pagado.

- `Referencia`
  Sirve para anotar boleta, factura o codigo de soporte.

- `Observacion`
  Sirve para guardar detalles adicionales.

### Uso en el negocio

Cada gasto sirve para:

- registrar salidas de dinero
- reflejar el movimiento en caja
- mejorar precision de reportes

### Ejemplo

- Fecha: `hoy`
- Descripcion: `Compra de silicona y accesorios`
- Categoria: `Materiales`
- Monto: `95`
- Referencia: `Boleta 5487`
- Observacion: `Compra para instalaciones del dia`

## 7. Caja

El modulo `Caja` no suele requerir llenado directo en todos los casos, porque muchos movimientos se generan automaticamente.

### Para que sirve

Sirve para ver:

- ingresos por pagos
- salidas por gastos
- saldo general del negocio

### Uso en el negocio

Permite revisar rapidamente si el dinero registrado coincide con la operacion diaria.

## 8. Reportes

El modulo `Reportes` toma la informacion ya registrada y la convierte en resumen.

### Para que sirve

Sirve para analizar:

- cuanto ingreso el negocio
- cuanto gasto
- cuanta utilidad genero
- que trabajos se hacen mas
- que clientes tienen saldo pendiente

## 9. Calendario

El modulo `Calendario` usa las fechas de entrega de los trabajos.

### Para que sirve

Sirve para:

- programar instalaciones
- ordenar entregas
- evitar cruces de fechas

## 10. Reglas importantes de cotizaciones

- Si una cotizacion esta `PENDIENTE` y no tiene trabajo asociado, se puede eliminar.
- Si la cotizacion ya fue usada, no conviene borrarla.
- En ese caso se debe `ANULAR` para conservar historial.

## 11. Resumen

Cada campo del sistema no solo guarda informacion, sino que apoya una parte real del negocio:

- cliente para identificar y contactar
- cotizacion para vender
- trabajo para producir
- pago para cobrar
- inventario para controlar materiales
- gasto para registrar salidas
- caja y reportes para revisar resultados

Si quieres, luego tambien te lo puedo convertir en una version mas formal tipo manual de capacitacion para personal nuevo.
