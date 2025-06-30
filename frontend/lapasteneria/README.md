# Sistema de Gestión para Panadería - Frontend

Este es el frontend del sistema de gestión para panadería, construido con Next.js 15, Shadcn UI y Clerk para autenticación.

## Características Principales

### Roles del Sistema

- **Vendedor**: Gestión de productos y creación de pedidos
- **Cajero**: Procesamiento de pagos y emisión de comprobantes
- **Administrador**: Dashboard completo, gestión de productos, empleados y reportes

### Funcionalidades por Rol

#### Vendedor (HU01, HU02)

- ✅ Seleccionar productos del catálogo
- ✅ Especificar cantidades con validación de stock
- ✅ Modificar productos en el pedido
- ✅ Visualizar resumen del pedido con subtotales y total
- ✅ Enviar pedido al cajero con confirmación
- ✅ Interfaz intuitiva con botones de agregar/quitar
- ✅ Búsqueda de productos en tiempo real
- ✅ Filtrado por categorías

#### Cajero (HU03, HU04, HU05)

- ✅ Ver cola de pedidos pendientes y en proceso
- ✅ Seleccionar pedidos para procesar
- ✅ Actualizar estados de pedidos automáticamente
- ✅ Elegir tipo de comprobante (Boleta/Factura)
- ✅ Registrar datos de clientes con validación
- ✅ Validación de DNI (8 dígitos) y RUC (11 dígitos)
- ✅ Selección de método de pago
- ✅ Confirmación antes de procesar pago
- ✅ Notificaciones de cambio de estado

#### Administrador (HU06, HU07, HU08)

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de productos y categorías
- ✅ Visualización de productos más vendidos
- ✅ Gráficos de ventas semanales y mensuales
- ✅ Control de productos con stock bajo
- ✅ Reportes de ventas y análisis
- ✅ Gestión de empleados y roles

## Tecnologías Utilizadas

- **Next.js 15** - Framework React con SSR y routing
- **TypeScript** - Tipado estático
- **Shadcn UI** - Componentes de interfaz moderna
- **Tailwind CSS** - Estilos utilitarios
- **Clerk** - Autenticación y gestión de usuarios
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos modernos

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend API corriendo en puerto 8080

### Pasos de Instalación

1. **Instalar dependencias**

```bash
npm install
```

2. **Configurar variables de entorno**

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

3. **Configurar Clerk**

- Crear cuenta en [Clerk](https://clerk.com)
- Crear nueva aplicación
- Configurar metadata para roles:
  ```json
  {
    "role": "ADMIN" // o "VENDEDOR", "CAJERO"
  }
  ```

4. **Ejecutar en desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Construir para producción
npm run start        # Iniciar en producción
npm run lint         # Verificar código
```

## Flujo de Trabajo del Sistema

### 1. Vendedor

1. Accede al catálogo de productos
2. Busca y filtra productos por categoría
3. Agrega productos al carrito con cantidades
4. Revisa el resumen del pedido
5. Envía el pedido al cajero

### 2. Cajero

1. Ve la cola de pedidos pendientes
2. Selecciona un pedido para procesar
3. Elige tipo de comprobante (Boleta/Factura)
4. Registra datos del cliente
5. Selecciona método de pago
6. Procesa el pago y genera comprobante

### 3. Administrador

1. Monitorea el dashboard en tiempo real
2. Gestiona productos y categorías
3. Supervisa empleados y sus roles
4. Genera reportes de ventas
5. Analiza productos más vendidos

## Estados de Pedidos

- `PENDIENTE` - Pedido creado por vendedor
- `EN_PROCESO` - Pedido seleccionado por cajero
- `PAGADO` - Pago procesado exitosamente
- `CANCELADO` - Pedido cancelado

## Configuración de Roles en Clerk

Para que el sistema funcione correctamente, debes configurar los roles en Clerk:

1. Ve a tu dashboard de Clerk
2. En "User Management" → "Users"
3. Edita cada usuario y agrega metadata:

```json
{
  "role": "ADMIN"
}
```

Roles disponibles:

- `ADMIN` - Acceso completo al sistema
- `VENDEDOR` - Solo módulo de ventas
- `CAJERO` - Solo módulo de caja
