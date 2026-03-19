# Manual de Usuario

## Sistema de Gestion Vidrieria

### 1. Objetivo del sistema

Este sistema ayuda a registrar y controlar la operacion diaria de una vidrieria. Permite gestionar clientes, cotizaciones, trabajos, pagos, inventario, gastos, caja, reportes, calendario, usuarios y configuracion del negocio.

### 2. Ingreso al sistema

1. Abrir el sistema en el navegador.
2. Ingresar con el correo y la contrasena asignados.
3. Presionar `Iniciar sesion`.

Usuario inicial de prueba:

- Correo: `admin@vidrieria.com`
- Contrasena: `admin123`

### 3. Flujo principal de trabajo

El flujo recomendado dentro del sistema es:

`Cliente -> Cotizacion -> Trabajo -> Pago -> Caja -> Reportes`

### 4. Modulos del sistema

#### Dashboard

Muestra un resumen general del negocio:

- ingresos y gastos
- trabajos recientes
- pagos recientes
- alertas
- stock bajo

#### Clientes

Sirve para registrar y administrar clientes.

Permite:

- crear clientes
- editar clientes
- ver el detalle de cada cliente
- revisar trabajos y pagos asociados

Datos recomendados:

- nombre
- telefono
- direccion
- documento
- observacion

#### Cotizaciones

Sirve para registrar presupuestos antes de crear un trabajo.

Permite:

- crear cotizaciones con items, mano de obra y descuento
- editar cotizaciones no convertidas
- aprobar o rechazar cotizaciones
- convertir cotizaciones en trabajos
- eliminar cotizaciones pendientes sin trabajo asociado
- anular cotizaciones usadas o que deben conservar historial

Reglas importantes:

- una cotizacion pendiente y sin trabajo asociado se puede eliminar
- una cotizacion usada o relacionada con un trabajo no debe borrarse
- en esos casos se debe anular para conservar historial

Estados usados:

- `PENDIENTE`
- `APROBADA`
- `RECHAZADA`
- `VENCIDA`
- `ANULADA`

#### Trabajos

Sirve para registrar trabajos reales del negocio.

Permite:

- crear trabajos
- editar trabajos
- cambiar estado
- ver detalle del trabajo
- consultar pagos del trabajo
- revisar saldo pendiente

Estados usados:

- `PENDIENTE`
- `EN PROCESO`
- `TERMINADO`
- `ENTREGADO`
- `CANCELADO`

#### Pagos

Sirve para registrar el dinero recibido por trabajos.

Permite:

- registrar adelantos
- registrar pagos parciales
- registrar pagos finales
- asociar el pago a un trabajo

Cada pago impacta automaticamente en:

- saldo del trabajo
- caja

#### Inventario

Sirve para controlar productos y materiales.

Permite:

- crear productos
- editar productos
- registrar entradas
- registrar salidas
- revisar historial de movimientos
- detectar stock bajo

Ejemplos:

- vidrio
- espejo
- perfil
- silicona
- accesorios

#### Gastos

Sirve para registrar egresos del negocio.

Permite:

- crear gastos
- editar gastos
- clasificarlos por categoria

Cada gasto impacta automaticamente en caja.

#### Caja

Muestra los movimientos de dinero del negocio.

Permite revisar:

- ingresos
- salidas
- saldo general
- origen de cada movimiento

#### Reportes

Muestra informacion resumida para analisis.

Incluye:

- ingresos vs gastos
- utilidad neta
- trabajos realizados
- trabajos por estado
- clientes con saldo
- productos mas usados

#### Calendario

Muestra los trabajos segun fecha de entrega.

Sirve para:

- planificar instalaciones
- revisar entregas del dia
- ordenar carga de trabajo por fecha

#### Configuracion

Permite administrar datos generales del sistema.

Incluye:

- datos del negocio
- perfil del usuario
- cambio de contrasena
- gestion de usuarios

Si el usuario tiene rol `ADMIN`, tambien puede:

- crear usuarios
- editar usuarios
- activar o desactivar usuarios
- cambiar roles

### 5. Recomendaciones de uso diario

1. Registrar al cliente antes de crear una cotizacion o trabajo.
2. Crear la cotizacion con todos los items y montos claros.
3. Convertir la cotizacion a trabajo cuando el cliente confirme.
4. Registrar cada pago apenas se reciba.
5. Mantener el inventario actualizado con entradas y salidas.
6. Registrar los gastos el mismo dia para que caja y reportes sean confiables.
7. Revisar calendario y dashboard al inicio de la jornada.

### 6. Buenas practicas

- No borrar informacion usada en operaciones reales si debe quedar historial.
- Usar anulacion cuando una cotizacion ya tuvo uso o referencia.
- Verificar montos antes de guardar pagos o gastos.
- Actualizar el estado de los trabajos para mejorar reportes y calendario.
- Mantener usuarios y contrasenas bajo control del administrador.

### 7. Errores comunes

#### No puedo eliminar una cotizacion

Solo se puede eliminar si esta:

- en estado `PENDIENTE`
- sin trabajo asociado

Si no cumple eso, debe anularse.

#### No puedo editar una cotizacion

Puede ocurrir si:

- ya fue convertida en trabajo
- fue anulada

#### Un pago no aparece en caja

Revisar que el pago se haya guardado correctamente y que este asociado a un trabajo.

#### Un gasto no aparece en caja

Revisar que el gasto se haya registrado correctamente.

### 8. Soporte interno

Si el sistema presenta un error:

1. revisar si el usuario tiene permisos
2. volver a cargar la pagina
3. confirmar que el dato se haya guardado
4. comunicar el problema al encargado tecnico

### 9. Resumen final

Este sistema fue pensado para ordenar la operacion de una vidrieria de forma simple. La recomendacion es usarlo siguiendo el flujo principal del negocio y evitando borrar informacion que ya forme parte del historial operativo.
