"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productosApi, ventasApi } from "@/lib/api";
import { formatearMoneda } from "@/lib/auth";
import { Producto } from "@/lib/types";
import {
  AlertTriangle,
  DollarSign,
  FileText,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const [estadisticas, setEstadisticas] = useState({
    ventasHoy: 0,
    pedidosPendientes: 0,
    productosAgotados: 0,
    totalVentasMes: 0,
  });
  const [ventasSemanales, setVentasSemanales] = useState<
    {
      dia: string;
      ventas: number;
      monto: number;
    }[]
  >([]);
  const [productosPopulares, setProductosPopulares] = useState<
    {
      nombre: string;
      ventas: number;
      porcentaje: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colores = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Cargar datos del dashboard
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // Simular datos por ahora (en una implementación real, estos vendrían del backend)
        const [pedidosPendientes, productos] = await Promise.all([
          ventasApi.countByEstado("PENDIENTE"),
          productosApi.getAll(),
        ]);

        setEstadisticas({
          ventasHoy: 15,
          pedidosPendientes: pedidosPendientes as number,
          productosAgotados: (productos as Producto[]).filter(
            (p: Producto) => p.stock <= 5
          ).length,
          totalVentasMes: 45000,
        });

        // Datos simulados para las gráficas
        setVentasSemanales([
          { dia: "Lun", ventas: 12, monto: 2400 },
          { dia: "Mar", ventas: 19, monto: 3800 },
          { dia: "Mie", ventas: 15, monto: 3000 },
          { dia: "Jue", ventas: 25, monto: 5000 },
          { dia: "Vie", ventas: 30, monto: 6000 },
          { dia: "Sab", ventas: 45, monto: 9000 },
          { dia: "Dom", ventas: 35, monto: 7000 },
        ]);

        setProductosPopulares([
          { nombre: "Pan Frances", ventas: 120, porcentaje: 25 },
          { nombre: "Croissant", ventas: 95, porcentaje: 20 },
          { nombre: "Empanada Pollo", ventas: 80, porcentaje: 17 },
          { nombre: "Torta Chocolate", ventas: 65, porcentaje: 14 },
          { nombre: "Café Americano", ventas: 115, porcentaje: 24 },
        ]);
      } catch (err) {
        setError("Error al cargar las estadísticas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600">Dashboard y gestión del sistema</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.ventasHoy}</div>
            <p className="text-xs text-muted-foreground">+12% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Pendientes
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.pedidosPendientes}
            </div>
            <p className="text-xs text-muted-foreground">
              En cola de procesamiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos con Stock Bajo
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {estadisticas.productosAgotados}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren reposición
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatearMoneda(estadisticas.totalVentasMes)}
            </div>
            <p className="text-xs text-muted-foreground">+8% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ventas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ventas">Análisis de Ventas</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de ventas semanales */}
            <Card>
              <CardHeader>
                <CardTitle>Ventas de la Semana</CardTitle>
                <CardDescription>Cantidad de pedidos por día</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ventasSemanales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de ingresos semanales */}
            <Card>
              <CardHeader>
                <CardTitle>Ingresos de la Semana</CardTitle>
                <CardDescription>Monto total por día</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ventasSemanales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        formatearMoneda(value as number),
                        "Ingresos",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="monto"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Productos más vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Top 5 productos de la semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {productosPopulares.map((producto, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: colores[index % colores.length],
                          }}
                        ></div>
                        <span className="font-medium">{producto.nombre}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{producto.ventas} unidades</p>
                        <p className="text-sm text-gray-500">
                          {producto.porcentaje}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productosPopulares}
                      dataKey="porcentaje"
                      nameKey="nombre"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ nombre, porcentaje }) =>
                        `${nombre}: ${porcentaje}%`
                      }
                    >
                      {productosPopulares.map((entry, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colores[index % colores.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productos">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Gestión de Productos
                </CardTitle>
                <CardDescription>
                  Administra el catálogo de productos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = "/admin/productos")}
                >
                  Ver Todos los Productos
                </Button>
                <Button variant="outline" className="w-full">
                  Agregar Nuevo Producto
                </Button>
                <Button variant="outline" className="w-full">
                  Gestionar Categorías
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos con Stock Bajo</CardTitle>
                <CardDescription>Requieren atención inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">Pan Integral</span>
                    <Badge variant="destructive">Stock: 3</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">Galletas Avena</span>
                    <Badge variant="destructive">Stock: 1</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">Torta Vainilla</span>
                    <Badge variant="secondary">Stock: 5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Operaciones frecuentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Actualizar Precios
                </Button>
                <Button variant="outline" className="w-full">
                  Importar Productos
                </Button>
                <Button variant="outline" className="w-full">
                  Exportar Catálogo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="empleados">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Gestión de Empleados
                </CardTitle>
                <CardDescription>
                  Administra usuarios y permisos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Ver Todos los Empleados</Button>
                <Button variant="outline" className="w-full">
                  Agregar Nuevo Empleado
                </Button>
                <Button variant="outline" className="w-full">
                  Gestionar Roles
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empleados Activos</CardTitle>
                <CardDescription>Estado actual del personal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Juan Pérez</p>
                      <p className="text-sm text-gray-500">Vendedor</p>
                    </div>
                    <Badge variant="default">Activo</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">María García</p>
                      <p className="text-sm text-gray-500">Cajero</p>
                    </div>
                    <Badge variant="default">Activo</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Carlos López</p>
                      <p className="text-sm text-gray-500">Vendedor</p>
                    </div>
                    <Badge variant="secondary">Descanso</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reportes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Reportes de Ventas
                </CardTitle>
                <CardDescription>Genera informes detallados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Reporte Diario</Button>
                <Button variant="outline" className="w-full">
                  Reporte Semanal
                </Button>
                <Button variant="outline" className="w-full">
                  Reporte Mensual
                </Button>
                <Button variant="outline" className="w-full">
                  Reporte Personalizado
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimos Reportes</CardTitle>
                <CardDescription>
                  Reportes generados recientemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">Ventas Diciembre 2024</p>
                      <p className="text-sm text-gray-500">
                        Generado: 30/12/2024
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Descargar
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">Top Productos Semana 52</p>
                      <p className="text-sm text-gray-500">
                        Generado: 29/12/2024
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Descargar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
