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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCarrito } from "@/contexts/carrito-context";
import { categoriasApi, productosApi } from "@/lib/api";
import { formatearMoneda } from "@/lib/auth";
import { Categoria, Producto } from "@/lib/types";
import { Minus, Package, Plus, Search, Send, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function VendedorDashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const {
    items,
    agregarItem,
    actualizarCantidad,
    limpiarCarrito,
    total,
    cantidadItems,
  } = useCarrito();

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [productosRes, categoriasRes] = await Promise.all([
          productosApi.getDisponibles(),
          categoriasApi.getAll(),
        ]);

        setProductos(productosRes as Producto[]);
        setCategorias(categoriasRes as Categoria[]);
        setProductosFiltrados(productosRes as Producto[]);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtrados = productos;

    // Filtrar por categoría
    if (categoriaSeleccionada) {
      filtrados = filtrados.filter(
        (p) => p.categoria.id === categoriaSeleccionada
      );
    }

    // Filtrar por búsqueda
    if (busqueda) {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setProductosFiltrados(filtrados);
  }, [productos, categoriaSeleccionada, busqueda]);

  const handleAgregarAlCarrito = (producto: Producto) => {
    if (producto.stock > 0) {
      const cantidadEnCarrito =
        items.find((item) => item.producto.id === producto.id)?.cantidad || 0;
      if (cantidadEnCarrito < producto.stock) {
        agregarItem(producto, 1);
      }
    }
  };

  const handleCambiarCantidad = (productoId: number, nuevaCantidad: number) => {
    const producto = productos.find((p) => p.id === productoId);
    if (producto && nuevaCantidad <= producto.stock && nuevaCantidad >= 0) {
      actualizarCantidad(productoId, nuevaCantidad);
    }
  };

  const handleEnviarPedido = () => {
    if (items.length > 0) {
      setMostrarConfirmacion(true);
    }
  };

  const confirmarEnvioPedido = async () => {
    try {
      // Aquí iría la lógica para enviar el pedido al cajero
      // Por ahora solo limpiamos el carrito
      limpiarCarrito();
      setMostrarConfirmacion(false);

      // Mostrar mensaje de éxito
      alert("Pedido enviado exitosamente al cajero");
    } catch (err) {
      setError("Error al enviar el pedido");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel del Vendedor
          </h1>
          <p className="text-gray-600">Gestiona pedidos y productos</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {cantidadItems} items
          </Badge>
          <Badge variant="outline" className="text-lg">
            Total: {formatearMoneda(total)}
          </Badge>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de productos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Catálogo de Productos
              </CardTitle>
              <CardDescription>
                Selecciona productos para agregar al pedido
              </CardDescription>

              {/* Barra de búsqueda */}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={categoriaSeleccionada?.toString() || "todos"}
                onValueChange={(value) =>
                  setCategoriaSeleccionada(
                    value === "todos" ? null : parseInt(value)
                  )
                }
              >
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  {categorias.map((categoria) => (
                    <TabsTrigger
                      key={categoria.id}
                      value={categoria.id.toString()}
                    >
                      {categoria.nombre}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent
                  value={categoriaSeleccionada?.toString() || "todos"}
                  className="mt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productosFiltrados.map((producto) => {
                      const cantidadEnCarrito =
                        items.find((item) => item.producto.id === producto.id)
                          ?.cantidad || 0;
                      const disponible = producto.stock - cantidadEnCarrito;

                      return (
                        <Card
                          key={producto.id}
                          className={`${disponible <= 0 ? "opacity-50" : ""}`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-sm">
                                {producto.nombre}
                              </CardTitle>
                              <Badge
                                variant={
                                  disponible > 0 ? "default" : "secondary"
                                }
                              >
                                Stock: {disponible}
                              </Badge>
                            </div>
                            <p className="text-lg font-bold text-green-600">
                              {formatearMoneda(producto.precio)}
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleCambiarCantidad(
                                      producto.id,
                                      cantidadEnCarrito - 1
                                    )
                                  }
                                  disabled={cantidadEnCarrito <= 0}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center">
                                  {cantidadEnCarrito}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleCambiarCantidad(
                                      producto.id,
                                      cantidadEnCarrito + 1
                                    )
                                  }
                                  disabled={disponible <= 0}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAgregarAlCarrito(producto)}
                                disabled={disponible <= 0}
                              >
                                Agregar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Panel del carrito */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Pedido Actual
              </CardTitle>
              <CardDescription>Revisa y confirma el pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay productos en el pedido
                  </p>
                ) : (
                  <>
                    {items.map((item) => (
                      <div
                        key={item.producto.id}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.producto.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatearMoneda(item.producto.precio)} x{" "}
                            {item.cantidad}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatearMoneda(
                              item.producto.precio * item.cantidad
                            )}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleCambiarCantidad(
                                  item.producto.id,
                                  item.cantidad - 1
                                )
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-xs">{item.cantidad}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleCambiarCantidad(
                                  item.producto.id,
                                  item.cantidad + 1
                                )
                              }
                              disabled={item.cantidad >= item.producto.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatearMoneda(total)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={handleEnviarPedido}
                        disabled={items.length === 0}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar al Cajero
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={limpiarCarrito}
                        disabled={items.length === 0}
                      >
                        Limpiar Pedido
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmación */}
      <Dialog open={mostrarConfirmacion} onOpenChange={setMostrarConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Envío de Pedido</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres enviar este pedido al cajero?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="border rounded p-3">
              <h4 className="font-medium mb-2">Resumen del pedido:</h4>
              {items.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.producto.nombre} x{item.cantidad}
                  </span>
                  <span>
                    {formatearMoneda(item.producto.precio * item.cantidad)}
                  </span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatearMoneda(total)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMostrarConfirmacion(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmarEnvioPedido}>Confirmar Envío</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
