# Datos Demo Comercial

## Comandos

Para cargar la demo comercial en una base vacia:

```bash
cmd /c npm run demo:seed:cliente
```

Para reemplazar los datos actuales por la demo comercial:

```bash
cmd /c npm run demo:seed:cliente:reset
```

## Enfoque de esta demo

Esta carga esta pensada para presentar el sistema al cliente con un escenario mas cercano a una operacion real:

- empresas constructoras
- hoteles
- clinicas
- condominios
- tiendas
- clientes residenciales premium

## Que crea

- 10 clientes
- 10 productos
- 14 trabajos con tickets mas altos
- ingresos distribuidos en varios meses
- gastos operativos y de planilla
- inventario con materiales de mayor valor
- saldos pendientes reales
- movimientos de caja para dashboard y reportes

## Ideal para mostrar

- dashboard con KPIs mas creibles
- reportes con ingresos, gastos y utilidad
- caja con movimiento realista
- stock bajo
- calendario con entregas
- clientes con saldo pendiente

## Flujo visible actual

La demo sigue el flujo acordado con el cliente:

`Cliente -> Trabajo -> Pago -> Caja -> Reportes`
