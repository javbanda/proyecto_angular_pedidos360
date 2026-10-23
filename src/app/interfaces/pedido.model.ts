// Producto solicitado al crear un pedido
export interface DetallePedidoRequest {
  productoId: number;
  cantidad: number;
}

// Datos que Angular envía a Spring Boot
export interface CrearPedidoRequest {
  clienteId: number;
  sucursalId: number;
  detalles: DetallePedidoRequest[];
}

// Datos que Spring Boot devuelve a Angular
export interface Pedido {
  id: number;
  clienteId: number;
  sucursalId: number;
  estado: string;
  montoTotal: number;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  fechaEntrega: string | null;
  detalles: DetallePedidoResponse[];
}

// Respuesta de cada producto del pedido
// Revisaremos sus campos cuando veamos DetallePedidoResponse.java
export interface DetallePedidoResponse {
  [campo: string]: unknown;
}