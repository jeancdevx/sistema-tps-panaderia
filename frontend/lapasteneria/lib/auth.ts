// Utilidades para manejo de roles y permisos

export const ROLES = {
  ADMIN: "ADMIN",
  VENDEDOR: "VENDEDOR",
  CAJERO: "CAJERO",
} as const;

export type RolType = (typeof ROLES)[keyof typeof ROLES];

// Permisos por rol
export const PERMISOS = {
  // Permisos del vendedor
  CREAR_PEDIDO: "CREAR_PEDIDO",
  VER_PRODUCTOS: "VER_PRODUCTOS",
  BUSCAR_PRODUCTOS: "BUSCAR_PRODUCTOS",
  GESTIONAR_CARRITO: "GESTIONAR_CARRITO",
  ENVIAR_PEDIDO: "ENVIAR_PEDIDO",
  VER_HISTORIAL_PEDIDOS: "VER_HISTORIAL_PEDIDOS",

  // Permisos del cajero
  VER_COLA_PEDIDOS: "VER_COLA_PEDIDOS",
  PROCESAR_PAGOS: "PROCESAR_PAGOS",
  EMITIR_COMPROBANTES: "EMITIR_COMPROBANTES",
  GESTIONAR_CLIENTES: "GESTIONAR_CLIENTES",
  CANCELAR_PEDIDOS: "CANCELAR_PEDIDOS",
  REIMPRIMIR_COMPROBANTES: "REIMPRIMIR_COMPROBANTES",

  // Permisos del administrador
  GESTIONAR_PRODUCTOS: "GESTIONAR_PRODUCTOS",
  GESTIONAR_CATEGORIAS: "GESTIONAR_CATEGORIAS",
  GESTIONAR_EMPLEADOS: "GESTIONAR_EMPLEADOS",
  VER_REPORTES: "VER_REPORTES",
  GENERAR_REPORTES: "GENERAR_REPORTES",
  ANULAR_COMPROBANTES: "ANULAR_COMPROBANTES",
  CONFIGURAR_SISTEMA: "CONFIGURAR_SISTEMA",
  VER_DASHBOARD: "VER_DASHBOARD",
} as const;

export type PermisoType = (typeof PERMISOS)[keyof typeof PERMISOS];

// Mapeo de roles a permisos
export const ROLES_PERMISOS: Record<RolType, PermisoType[]> = {
  [ROLES.VENDEDOR]: [
    PERMISOS.CREAR_PEDIDO,
    PERMISOS.VER_PRODUCTOS,
    PERMISOS.BUSCAR_PRODUCTOS,
    PERMISOS.GESTIONAR_CARRITO,
    PERMISOS.ENVIAR_PEDIDO,
    PERMISOS.VER_HISTORIAL_PEDIDOS,
  ],

  [ROLES.CAJERO]: [
    PERMISOS.VER_PRODUCTOS,
    PERMISOS.VER_COLA_PEDIDOS,
    PERMISOS.PROCESAR_PAGOS,
    PERMISOS.EMITIR_COMPROBANTES,
    PERMISOS.GESTIONAR_CLIENTES,
    PERMISOS.CANCELAR_PEDIDOS,
    PERMISOS.REIMPRIMIR_COMPROBANTES,
    PERMISOS.VER_HISTORIAL_PEDIDOS,
  ],

  [ROLES.ADMIN]: [
    // El admin tiene todos los permisos
    ...Object.values(PERMISOS),
  ],
};

// Función para verificar si un rol tiene un permiso específico
export function tienePermiso(rol: RolType, permiso: PermisoType): boolean {
  return ROLES_PERMISOS[rol]?.includes(permiso) || false;
}

// Función para obtener todos los permisos de un rol
export function getPermisosRol(rol: RolType): PermisoType[] {
  return ROLES_PERMISOS[rol] || [];
}

// Rutas protegidas por rol
export const RUTAS_PROTEGIDAS: Record<string, RolType[]> = {
  // Rutas del vendedor
  "/vendedor": [ROLES.VENDEDOR, ROLES.ADMIN],
  "/vendedor/productos": [ROLES.VENDEDOR, ROLES.ADMIN],
  "/vendedor/pedidos": [ROLES.VENDEDOR, ROLES.ADMIN],
  "/vendedor/nuevo-pedido": [ROLES.VENDEDOR, ROLES.ADMIN],

  // Rutas del cajero
  "/cajero": [ROLES.CAJERO, ROLES.ADMIN],
  "/cajero/cola-pedidos": [ROLES.CAJERO, ROLES.ADMIN],
  "/cajero/procesar-pago": [ROLES.CAJERO, ROLES.ADMIN],
  "/cajero/clientes": [ROLES.CAJERO, ROLES.ADMIN],
  "/cajero/comprobantes": [ROLES.CAJERO, ROLES.ADMIN],

  // Rutas del administrador
  "/admin": [ROLES.ADMIN],
  "/admin/productos": [ROLES.ADMIN],
  "/admin/categorias": [ROLES.ADMIN],
  "/admin/empleados": [ROLES.ADMIN],
  "/admin/reportes": [ROLES.ADMIN],
  "/admin/dashboard": [ROLES.ADMIN],
  "/admin/configuracion": [ROLES.ADMIN],
};

// Función para verificar si un rol puede acceder a una ruta
export function puedeAccederRuta(rol: RolType, ruta: string): boolean {
  const rolesPermitidos = RUTAS_PROTEGIDAS[ruta];
  return rolesPermitidos?.includes(rol) || false;
}

// Estados de pedidos permitidos por rol
export const ESTADOS_PEDIDO_POR_ROL = {
  [ROLES.VENDEDOR]: ["PENDIENTE", "CANCELADO"] as const,
  [ROLES.CAJERO]: ["PENDIENTE", "EN_PROCESO", "PAGADO", "CANCELADO"] as const,
  [ROLES.ADMIN]: ["PENDIENTE", "EN_PROCESO", "PAGADO", "CANCELADO"] as const,
};

// Función para verificar si un rol puede cambiar el estado de un pedido
export function puedeActualizarEstado(
  rol: RolType,
  estadoActual: string,
  nuevoEstado: string
): boolean {
  const estadosPermitidos = ESTADOS_PEDIDO_POR_ROL[rol];

  // Verificar si el rol puede manejar ambos estados
  if (
    !estadosPermitidos.includes(estadoActual as any) ||
    !estadosPermitidos.includes(nuevoEstado as any)
  ) {
    return false;
  }

  // Reglas específicas de transición
  switch (rol) {
    case ROLES.VENDEDOR:
      // El vendedor solo puede crear pedidos (PENDIENTE) y cancelarlos
      return estadoActual === "PENDIENTE" && nuevoEstado === "CANCELADO";

    case ROLES.CAJERO:
      // El cajero puede cambiar de PENDIENTE a EN_PROCESO y de EN_PROCESO a PAGADO
      return (
        (estadoActual === "PENDIENTE" && nuevoEstado === "EN_PROCESO") ||
        (estadoActual === "EN_PROCESO" && nuevoEstado === "PAGADO") ||
        (estadoActual === "PENDIENTE" && nuevoEstado === "CANCELADO") ||
        (estadoActual === "EN_PROCESO" && nuevoEstado === "CANCELADO")
      );

    case ROLES.ADMIN:
      // El admin puede hacer cualquier transición
      return true;

    default:
      return false;
  }
}

// Validación de DNI y RUC
export function validarDNI(dni: string): boolean {
  return /^\d{8}$/.test(dni);
}

export function validarRUC(ruc: string): boolean {
  return /^\d{11}$/.test(ruc);
}

// Utilidades para formateo
export function formatearMoneda(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatearFecha(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

// Función para generar ID único
export function generarId(): string {
  return Math.random().toString(36).substr(2, 9);
}
