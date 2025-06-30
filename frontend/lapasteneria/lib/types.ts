// Tipos de datos principales del sistema

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "ADMIN" | "VENDEDOR" | "CAJERO";
  activo: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: Categoria;
  imagen?: string;
  activo?: boolean;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  ruc?: string;
  razonSocial?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  tipoCliente: TipoCliente;
}

export interface TipoCliente {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface TipoPago {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono?: string;
  cargo: Cargo;
  activo: boolean;
}

export interface Cargo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface DetalleVenta {
  id?: number;
  producto: Producto;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Venta {
  id?: number;
  cliente: Cliente;
  empleado: Empleado;
  fecha: string;
  estado: EstadoPedido;
  tipoPago: TipoPago;
  detalles: DetalleVenta[];
  total?: number;
}

export type EstadoPedido = "PENDIENTE" | "EN_PROCESO" | "PAGADO" | "CANCELADO";

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface Comprobante {
  id: number;
  venta: Venta;
  tipo: "BOLETA" | "FACTURA";
  serie: string;
  numero: string;
  fechaEmision: string;
  anulado: boolean;
}

export interface ReporteVentas {
  fechaInicio: string;
  fechaFin: string;
  totalVentas: number;
  cantidadPedidos: number;
  productos: {
    producto: Producto;
    cantidadVendida: number;
    totalVendido: number;
  }[];
}

export interface EstadisticasDashboard {
  ventasHoy: number;
  pedidosPendientes: number;
  productosAgotados: number;
  clientesNuevos: number;
  topProductos: {
    producto: Producto;
    cantidadVendida: number;
  }[];
}

// Contexto para el carrito de compras
export interface CarritoContextType {
  items: ItemCarrito[];
  agregarItem: (producto: Producto, cantidad: number) => void;
  removerItem: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  limpiarCarrito: () => void;
  total: number;
  cantidadItems: number;
}

// Respuestas de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
