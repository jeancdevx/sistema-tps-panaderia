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
import { ventasApi } from "@/lib/api";
import { formatearFecha, formatearMoneda } from "@/lib/auth";
import { Venta } from "@/lib/types";
import {
  AlertCircle,
  Clock,
  CreditCard,
  FileText,
  Receipt,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function CajeroDashboard() {
  const [pedidosPendientes, setPedidosPendientes] = useState<Venta[]>([]);
  const [pedidosEnProceso, setPedidosEnProceso] = useState<Venta[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Venta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar pedidos
  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setLoading(true);
        const [pendientes, enProceso] = await Promise.all([
          ventasApi.getByEstado("PENDIENTE"),
          ventasApi.getByEstado("EN_PROCESO"),
        ]);

        setPedidosPendientes(pendientes as Venta[]);
        setPedidosEnProceso(enProceso as Venta[]);
      } catch (err) {
        setError("Error al cargar los pedidos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();

    // Actualizar cada 30 segundos
    const interval = setInterval(cargarPedidos, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSeleccionarPedido = async (pedido: Venta) => {
    try {
      setPedidoSeleccionado(pedido);
      // Cambiar estado a EN_PROCESO si está PENDIENTE
      if (pedido.estado === "PENDIENTE") {
        await ventasApi.updateEstado(pedido.id!, "EN_PROCESO");
        // Recargar pedidos
        const [pendientes, enProceso] = await Promise.all([
          ventasApi.getByEstado("PENDIENTE"),
          ventasApi.getByEstado("EN_PROCESO"),
        ]);
        setPedidosPendientes(pendientes as Venta[]);
        setPedidosEnProceso(enProceso as Venta[]);
      }
    } catch (err) {
      setError("Error al seleccionar el pedido");
      console.error(err);
    }
  };

  const handleCancelarPedido = async (pedidoId: number) => {
    try {
      await ventasApi.updateEstado(pedidoId, "CANCELADO");
      // Recargar pedidos
      const [pendientes, enProceso] = await Promise.all([
        ventasApi.getByEstado("PENDIENTE"),
        ventasApi.getByEstado("EN_PROCESO"),
      ]);
      setPedidosPendientes(pendientes as Venta[]);
      setPedidosEnProceso(enProceso as Venta[]);

      if (pedidoSeleccionado?.id === pedidoId) {
        setPedidoSeleccionado(null);
      }
    } catch (err) {
      setError("Error al cancelar el pedido");
      console.error(err);
    }
  };

  const calcularTotalPedido = (venta: Venta): number => {
    return (
      venta.detalles?.reduce(
        (total, detalle) => total + detalle.precio * detalle.cantidad,
        0
      ) || 0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel del Cajero</h1>
          <p className="text-gray-600">Gestiona pagos y comprobantes</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg">
            <Clock className="w-4 h-4 mr-2" />
            Pendientes: {pedidosPendientes.length}
          </Badge>
          <Badge variant="outline" className="text-lg">
            <CreditCard className="w-4 h-4 mr-2" />
            En Proceso: {pedidosEnProceso.length}
          </Badge>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cola de pedidos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Cola de Pedidos
              </CardTitle>
              <CardDescription>Pedidos listos para procesar</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pendientes">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pendientes">
                    Pendientes ({pedidosPendientes.length})
                  </TabsTrigger>
                  <TabsTrigger value="proceso">
                    En Proceso ({pedidosEnProceso.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pendientes" className="mt-4">
                  <div className="space-y-3">
                    {pedidosPendientes.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay pedidos pendientes
                      </p>
                    ) : (
                      pedidosPendientes.map((pedido) => (
                        <Card
                          key={pedido.id}
                          className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                            pedidoSeleccionado?.id === pedido.id
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => handleSeleccionarPedido(pedido)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  Pedido #{pedido.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatearFecha(pedido.fecha)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Vendedor: {pedido.empleado?.nombre}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  {formatearMoneda(calcularTotalPedido(pedido))}
                                </p>
                                <Badge variant="secondary">
                                  {pedido.detalles?.length || 0} items
                                </Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSeleccionarPedido(pedido);
                                }}
                              >
                                Procesar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelarPedido(pedido.id!);
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="proceso" className="mt-4">
                  <div className="space-y-3">
                    {pedidosEnProceso.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay pedidos en proceso
                      </p>
                    ) : (
                      pedidosEnProceso.map((pedido) => (
                        <Card
                          key={pedido.id}
                          className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                            pedidoSeleccionado?.id === pedido.id
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => setPedidoSeleccionado(pedido)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  Pedido #{pedido.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatearFecha(pedido.fecha)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Vendedor: {pedido.empleado?.nombre}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  {formatearMoneda(calcularTotalPedido(pedido))}
                                </p>
                                <Badge variant="default">En Proceso</Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Ir a procesar pago
                                  window.location.href = `/cajero/procesar-pago?pedido=${pedido.id}`;
                                }}
                              >
                                Procesar Pago
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelarPedido(pedido.id!);
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Detalle del pedido seleccionado */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Detalle del Pedido
              </CardTitle>
              <CardDescription>
                Información del pedido seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!pedidoSeleccionado ? (
                <p className="text-gray-500 text-center py-8">
                  Selecciona un pedido para ver los detalles
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-lg">
                      Pedido #{pedidoSeleccionado.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fecha: {formatearFecha(pedidoSeleccionado.fecha)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Vendedor: {pedidoSeleccionado.empleado?.nombre}
                    </p>
                    <Badge
                      variant={
                        pedidoSeleccionado.estado === "PENDIENTE"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {pedidoSeleccionado.estado}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Productos:</h4>
                    <div className="space-y-2">
                      {pedidoSeleccionado.detalles?.map((detalle, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm p-2 border rounded"
                        >
                          <div>
                            <p className="font-medium">
                              {detalle.producto.nombre}
                            </p>
                            <p className="text-gray-500">
                              {formatearMoneda(detalle.precio)} x{" "}
                              {detalle.cantidad}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatearMoneda(detalle.precio * detalle.cantidad)}
                          </p>
                        </div>
                      )) || []}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {formatearMoneda(
                          calcularTotalPedido(pedidoSeleccionado)
                        )}
                      </span>
                    </div>
                  </div>

                  {pedidoSeleccionado.estado === "EN_PROCESO" && (
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          window.location.href = `/cajero/procesar-pago?pedido=${pedidoSeleccionado.id}`;
                        }}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Procesar Pago
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
