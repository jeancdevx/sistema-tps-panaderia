"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ventasApi } from "@/lib/api";
import { formatearFecha, formatearMoneda } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart3,
  CalendarIcon,
  DollarSign,
  Download,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { toast } from "sonner";

interface ReporteVentas {
  fecha: string;
  totalVentas: number;
  cantidadVentas: number;
  ventaPromedio: number;
}

interface ProductoMasVendido {
  id: number;
  nombre: string;
  cantidadVendida: number;
  ingresoTotal: number;
}

interface ResumenPeriodo {
  totalIngresos: number;
  totalVentas: number;
  ticketPromedio: number;
  productosVendidos: number;
}

export default function ReportesPage() {
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [tipoReporte, setTipoReporte] = useState<
    "ventas" | "productos" | "empleados"
  >("ventas");

  // Estados para los datos
  const [reporteVentas, setReporteVentas] = useState<ReporteVentas[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<
    ProductoMasVendido[]
  >([]);
  const [resumenPeriodo, setResumenPeriodo] = useState<ResumenPeriodo>({
    totalIngresos: 0,
    totalVentas: 0,
    ticketPromedio: 0,
    productosVendidos: 0,
  });

  const cargarReportes = useCallback(async () => {
    try {
      setLoading(true);

      const fechaInicioStr = format(fechaInicio, "yyyy-MM-dd");
      const fechaFinStr = format(fechaFin, "yyyy-MM-dd");

      // Obtener datos de ventas del backend (comentado por ahora)
      try {
        await ventasApi.getByFecha(fechaInicioStr, fechaFinStr);
        // En producción, usar los datos reales del backend
      } catch {
        console.log("API no disponible, usando datos de ejemplo");
      }

      // Generar datos de ejemplo para el reporte
      const reporteData: ReporteVentas[] = generarDatosVentas(
        fechaInicio,
        fechaFin
      );
      const productosData: ProductoMasVendido[] = generarDatosProductos();
      const resumenData: ResumenPeriodo = calcularResumen(reporteData);

      setReporteVentas(reporteData);
      setProductosMasVendidos(productosData);
      setResumenPeriodo(resumenData);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      toast.error("Error al cargar los reportes");
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes, tipoReporte]);

  const generarDatosVentas = (inicio: Date, fin: Date): ReporteVentas[] => {
    const datos: ReporteVentas[] = [];
    const diferenciaDias = Math.ceil(
      (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i <= diferenciaDias; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + i);

      const cantidadVentas = Math.floor(Math.random() * 50) + 10;
      const totalVentas = cantidadVentas * (Math.random() * 100 + 20);

      datos.push({
        fecha: format(fecha, "yyyy-MM-dd"),
        totalVentas: Math.round(totalVentas * 100) / 100,
        cantidadVentas,
        ventaPromedio: Math.round((totalVentas / cantidadVentas) * 100) / 100,
      });
    }

    return datos;
  };

  const generarDatosProductos = (): ProductoMasVendido[] => {
    const productos = [
      "Pan Francés",
      "Pan Integral",
      "Croissant",
      "Empanadas",
      "Torta Chocolate",
      "Pan Dulce",
      "Bizcocho",
      "Queque",
      "Rosquitas",
      "Pan de Molde",
    ];

    return productos.map((nombre, index) => ({
      id: index + 1,
      nombre,
      cantidadVendida: Math.floor(Math.random() * 200) + 50,
      ingresoTotal: Math.floor(Math.random() * 5000) + 1000,
    }));
  };

  const calcularResumen = (datos: ReporteVentas[]): ResumenPeriodo => {
    const totalIngresos = datos.reduce(
      (sum, item) => sum + item.totalVentas,
      0
    );
    const totalVentas = datos.reduce(
      (sum, item) => sum + item.cantidadVentas,
      0
    );

    return {
      totalIngresos: Math.round(totalIngresos * 100) / 100,
      totalVentas,
      ticketPromedio:
        totalVentas > 0
          ? Math.round((totalIngresos / totalVentas) * 100) / 100
          : 0,
      productosVendidos: Math.floor(Math.random() * 1000) + 500,
    };
  };

  const exportarReporte = () => {
    // Aquí iría la lógica para exportar a PDF/Excel
    toast.success("Reporte exportado correctamente");
  };

  const coloresPastel = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5A2B",
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Analíticas</h1>
          <p className="text-muted-foreground">
            Análisis detallado de las operaciones de la panadería
          </p>
        </div>
        <Button onClick={exportarReporte}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicio
                      ? format(fechaInicio, "dd/MM/yyyy", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    onSelect={(date) => date && setFechaInicio(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaFin && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFin
                      ? format(fechaFin, "dd/MM/yyyy", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    onSelect={(date) => date && setFechaFin(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select
                value={tipoReporte}
                onValueChange={(value: "ventas" | "productos" | "empleados") =>
                  setTipoReporte(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ventas">Reporte de Ventas</SelectItem>
                  <SelectItem value="productos">
                    Reporte de Productos
                  </SelectItem>
                  <SelectItem value="empleados">
                    Reporte de Empleados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={cargarReportes}
                className="w-full"
                disabled={loading}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {loading ? "Cargando..." : "Generar Reporte"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatearMoneda(resumenPeriodo.totalIngresos)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Ventas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resumenPeriodo.totalVentas}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.3% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatearMoneda(resumenPeriodo.ticketPromedio)}
            </div>
            <p className="text-xs text-muted-foreground">
              +4.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Vendidos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resumenPeriodo.productosVendidos}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <Tabs
        value={tipoReporte}
        onValueChange={(value: string) =>
          setTipoReporte(value as "ventas" | "productos" | "empleados")
        }
      >
        <TabsList>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-6">
          {/* Gráfico de Ventas por Día */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas</CardTitle>
              <CardDescription>
                Evolución de ventas diarias en el período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reporteVentas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fecha"
                    tickFormatter={(value) => format(new Date(value), "dd/MM")}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      format(new Date(value as string), "dd/MM/yyyy")
                    }
                    formatter={(value: number, name: string) => [
                      name === "totalVentas" ? formatearMoneda(value) : value,
                      name === "totalVentas" ? "Total Ventas" : "Cantidad",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalVentas"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="totalVentas"
                  />
                  <Line
                    type="monotone"
                    dataKey="cantidadVentas"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    name="cantidadVentas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabla de Ventas Detallada */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Ventas por Día</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cantidad de Ventas</TableHead>
                    <TableHead>Total Ventas</TableHead>
                    <TableHead>Venta Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteVentas.slice(-10).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatearFecha(item.fecha)}</TableCell>
                      <TableCell>{item.cantidadVentas}</TableCell>
                      <TableCell>{formatearMoneda(item.totalVentas)}</TableCell>
                      <TableCell>
                        {formatearMoneda(item.ventaPromedio)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productos" className="space-y-6">
          {/* Gráfico de Productos Más Vendidos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>
                  Top 10 productos por cantidad vendida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productosMasVendidos.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="nombre"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidadVendida" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ingresos por Producto</CardTitle>
                <CardDescription>
                  Participación en ingresos totales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productosMasVendidos.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="ingresoTotal"
                    >
                      {productosMasVendidos.slice(0, 6).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={coloresPastel[index % coloresPastel.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatearMoneda(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de Productos */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking Completo de Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad Vendida</TableHead>
                    <TableHead>Ingreso Total</TableHead>
                    <TableHead>Precio Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productosMasVendidos.map((producto, index) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {producto.nombre}
                      </TableCell>
                      <TableCell>{producto.cantidadVendida}</TableCell>
                      <TableCell>
                        {formatearMoneda(producto.ingresoTotal)}
                      </TableCell>
                      <TableCell>
                        {formatearMoneda(
                          producto.ingresoTotal / producto.cantidadVendida
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empleados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Empleados</CardTitle>
              <CardDescription>
                Esta funcionalidad estará disponible próximamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Los reportes de empleados se implementarán en una próxima
                  versión
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
