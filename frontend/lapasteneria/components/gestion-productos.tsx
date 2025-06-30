"use client";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatearMoneda } from "@/lib/auth";
import { Categoria, Producto } from "@/lib/types";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface GestionProductosProps {
  productos: Producto[];
  categorias: Categoria[];
  onProductoCreado: (producto: Producto) => void;
  onProductoActualizado: (producto: Producto) => void;
  onProductoEliminado: (id: number) => void;
}

export default function GestionProductos({
  productos,
  categorias,
  onProductoCreado,
  onProductoActualizado,
  onProductoEliminado,
}: GestionProductosProps) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null
  );
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoriaId: "",
  });

  const productosFiltrados = productos.filter((producto) => {
    const matchNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const matchCategoria =
      !categoriaFiltro || producto.categoria.id.toString() === categoriaFiltro;
    return matchNombre && matchCategoria;
  });

  const handleAbrirModal = (producto?: Producto) => {
    if (producto) {
      setProductoEditando(producto);
      setFormData({
        nombre: producto.nombre,
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        categoriaId: producto.categoria.id.toString(),
      });
    } else {
      setProductoEditando(null);
      setFormData({
        nombre: "",
        precio: "",
        stock: "",
        categoriaId: "",
      });
    }
    setMostrarModal(true);
  };

  const handleGuardar = async () => {
    // Validaciones básicas
    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.stock ||
      !formData.categoriaId
    ) {
      alert("Todos los campos son requeridos");
      return;
    }

    const categoria = categorias.find(
      (c) => c.id.toString() === formData.categoriaId
    );
    if (!categoria) {
      alert("Categoría no válida");
      return;
    }

    const productoData: Producto = {
      id: productoEditando?.id || 0,
      nombre: formData.nombre,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      categoria: categoria,
    };

    try {
      if (productoEditando) {
        onProductoActualizado(productoData);
      } else {
        onProductoCreado(productoData);
      }
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar el producto");
    }
  };

  const handleEliminar = (producto: Producto) => {
    if (
      confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)
    ) {
      onProductoEliminado(producto.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Productos</CardTitle>
              <CardDescription>
                Administra el catálogo de productos de la panadería
              </CardDescription>
            </div>
            <Button onClick={() => handleAbrirModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las categorías</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem
                    key={categoria.id}
                    value={categoria.id.toString()}
                  >
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productosFiltrados.map((producto) => (
              <Card key={producto.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{producto.nombre}</h3>
                    <Badge
                      variant={
                        producto.stock > 10
                          ? "default"
                          : producto.stock > 0
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      Stock: {producto.stock}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {producto.categoria.nombre}
                  </p>
                  <p className="text-lg font-bold text-green-600 mb-3">
                    {formatearMoneda(producto.precio)}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAbrirModal(producto)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEliminar(producto)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {productosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron productos con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de creación/edición */}
      <Dialog open={mostrarModal} onOpenChange={setMostrarModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {productoEditando ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>
              {productoEditando
                ? "Modifica los datos del producto"
                : "Ingresa los datos del nuevo producto"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={formData.categoriaId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoriaId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem
                      key={categoria.id}
                      value={categoria.id.toString()}
                    >
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar}>
              {productoEditando ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
