"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientesApi, ventasApi } from "@/lib/api";
import {
  formatearFecha,
  formatearMoneda,
  validarDNI,
  validarRUC,
} from "@/lib/auth";
import { Cliente, Venta } from "@/lib/types";
import {
  AlertCircle,
  Check,
  CreditCard,
  FileText,
  Receipt,
  User,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProcesarPago() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get("pedido");

  const [pedido, setPedido] = useState<Venta | null>(null);
  const [tipoComprobante, setTipoComprobante] = useState<"BOLETA" | "FACTURA">(
    "BOLETA"
  );
  const [tipoPago, setTipoPago] = useState<string>("");
  const [cliente, setCliente] = useState<Partial<Cliente>>({
    nombre: "Cliente Final",
    apellidos: "",
    dni: "00000000",
  });
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);

  // Cargar datos del pedido
  useEffect(() => {
    const cargarDatos = async () => {
      if (!pedidoId) {
        setError("ID de pedido no válido");
        return;
      }

      try {
        setLoading(true);
        const pedidoRes = await ventasApi.getById(parseInt(pedidoId));

        setPedido(pedidoRes as Venta);
      } catch (err) {
        setError("Error al cargar los datos del pedido");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [pedidoId]);

  const calcularTotal = (): number => {
    return (
      pedido?.detalles?.reduce(
        (total, detalle) => total + detalle.precio * detalle.cantidad,
        0
      ) || 0
    );
  };

  const validarDatosCliente = (): boolean => {
    if (tipoComprobante === "BOLETA") {
      if (!cliente.nombre || !cliente.apellidos) {
        setError("Nombre y apellidos son requeridos para la boleta");
        return false;
      }
      if (
        cliente.dni &&
        cliente.dni !== "00000000" &&
        !validarDNI(cliente.dni)
      ) {
        setError("DNI debe tener 8 dígitos");
        return false;
      }
    } else if (tipoComprobante === "FACTURA") {
      if (!cliente.ruc || !cliente.razonSocial) {
        setError("RUC y razón social son requeridos para la factura");
        return false;
      }
      if (!validarRUC(cliente.ruc)) {
        setError("RUC debe tener 11 dígitos");
        return false;
      }
    }
    return true;
  };

  const handleTipoComprobanteChange = (tipo: "BOLETA" | "FACTURA") => {
    setTipoComprobante(tipo);
    setError(null);

    if (tipo === "BOLETA") {
      setCliente({
        nombre: "Cliente Final",
        apellidos: "",
        dni: "00000000",
      });
    } else {
      setCliente({
        nombre: "",
        apellidos: "",
        ruc: "",
        razonSocial: "",
      });
    }
  };

  const buscarClientePorRUC = async (ruc: string) => {
    if (!validarRUC(ruc)) return;

    try {
      const clienteRes = await clientesApi.buscarByRuc(ruc);
      if (clienteRes) {
        setCliente(clienteRes as Cliente);
      }
    } catch {
      // Si no encuentra el cliente, mantener los datos actuales
      console.log("Cliente no encontrado en base de datos");
    }
  };

  const buscarClientePorDNI = async (dni: string) => {
    if (!validarDNI(dni)) return;

    try {
      const clienteRes = await clientesApi.buscarByDni(dni);
      if (clienteRes) {
        setCliente(clienteRes as Cliente);
      }
    } catch {
      // Si no encuentra el cliente, mantener los datos actuales
      console.log("Cliente no encontrado en base de datos");
    }
  };

  const handleProcesarPago = async () => {
    if (!validarDatosCliente() || !tipoPago) {
      if (!tipoPago) setError("Debe seleccionar un tipo de pago");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const confirmarPago = async () => {
    if (!pedido) return;

    try {
      setProcesando(true);

      // Actualizar estado del pedido a PAGADO
      await ventasApi.updateEstado(pedido.id!, "PAGADO");

      // Aquí iría la lógica para:
      // 1. Crear/actualizar cliente si es necesario
      // 2. Generar comprobante electrónico
      // 3. Enviar a SUNAT
      // 4. Imprimir comprobante

      setPagoCompletado(true);
      setMostrarConfirmacion(false);
    } catch (err) {
      setError("Error al procesar el pago");
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Cargando información del pedido...
          </p>
        </div>
      </div>
    );
  }

  if (pagoCompletado) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Pago Procesado Exitosamente
            </h2>
            <p className="text-gray-600 mb-6">
              El pedido #{pedido?.id} ha sido pagado y el comprobante ha sido
              generado.
            </p>
            <div className="space-y-2">
              <Button className="w-full mb-2">
                <Receipt className="w-4 h-4 mr-2" />
                Imprimir Comprobante
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/cajero")}
              >
                Volver al Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {error || "Pedido no encontrado"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procesar Pago</h1>
          <p className="text-gray-600">
            Pedido #{pedido.id} - {formatearFecha(pedido.fecha)}
          </p>
        </div>
        <Badge variant="default" className="text-lg">
          Total: {formatearMoneda(calcularTotal())}
        </Badge>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumen del pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pedido.detalles?.map((detalle, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{detalle.producto.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {formatearMoneda(detalle.precio)} x {detalle.cantidad}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatearMoneda(detalle.precio * detalle.cantidad)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatearMoneda(calcularTotal())}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de pago */}
        <div className="space-y-6">
          {/* Tipo de comprobante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Tipo de Comprobante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={tipoComprobante}
                onValueChange={(value) =>
                  handleTipoComprobanteChange(value as "BOLETA" | "FACTURA")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BOLETA" id="boleta" />
                  <Label htmlFor="boleta">Boleta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FACTURA" id="factura" />
                  <Label htmlFor="factura">Factura</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Datos del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Datos del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tipoComprobante === "BOLETA" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={cliente.nombre || ""}
                        onChange={(e) =>
                          setCliente({ ...cliente, nombre: e.target.value })
                        }
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellidos">Apellidos</Label>
                      <Input
                        id="apellidos"
                        value={cliente.apellidos || ""}
                        onChange={(e) =>
                          setCliente({ ...cliente, apellidos: e.target.value })
                        }
                        placeholder="Apellidos del cliente"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      value={cliente.dni || ""}
                      onChange={(e) =>
                        setCliente({ ...cliente, dni: e.target.value })
                      }
                      onBlur={(e) => buscarClientePorDNI(e.target.value)}
                      placeholder="00000000 para Cliente Final"
                      maxLength={8}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="ruc">RUC</Label>
                    <Input
                      id="ruc"
                      value={cliente.ruc || ""}
                      onChange={(e) =>
                        setCliente({ ...cliente, ruc: e.target.value })
                      }
                      onBlur={(e) => buscarClientePorRUC(e.target.value)}
                      placeholder="RUC de la empresa"
                      maxLength={11}
                    />
                  </div>
                  <div>
                    <Label htmlFor="razonSocial">Razón Social</Label>
                    <Input
                      id="razonSocial"
                      value={cliente.razonSocial || ""}
                      onChange={(e) =>
                        setCliente({ ...cliente, razonSocial: e.target.value })
                      }
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tipo de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tipoPago} onValueChange={setTipoPago}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">
                    Tarjeta de Débito/Crédito
                  </SelectItem>
                  <SelectItem value="transferencia">
                    Transferencia Bancaria
                  </SelectItem>
                  <SelectItem value="yape">Yape</SelectItem>
                  <SelectItem value="plin">Plin</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={handleProcesarPago}
            disabled={!tipoPago}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Procesar Pago - {formatearMoneda(calcularTotal())}
          </Button>
        </div>
      </div>

      {/* Dialog de confirmación */}
      <Dialog open={mostrarConfirmacion} onOpenChange={setMostrarConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Procesamiento de Pago</DialogTitle>
            <DialogDescription>
              Por favor revisa los datos antes de procesar el pago
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Tipo de Comprobante:</p>
                <p>{tipoComprobante}</p>
              </div>
              <div>
                <p className="font-medium">Método de Pago:</p>
                <p className="capitalize">{tipoPago}</p>
              </div>
            </div>

            <div className="border rounded p-3">
              <p className="font-medium mb-2">Datos del Cliente:</p>
              {tipoComprobante === "BOLETA" ? (
                <div>
                  <p>
                    Nombre: {cliente.nombre} {cliente.apellidos}
                  </p>
                  <p>DNI: {cliente.dni}</p>
                </div>
              ) : (
                <div>
                  <p>RUC: {cliente.ruc}</p>
                  <p>Razón Social: {cliente.razonSocial}</p>
                </div>
              )}
            </div>

            <div className="border rounded p-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total a Pagar:</span>
                <span className="text-green-600">
                  {formatearMoneda(calcularTotal())}
                </span>
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
            <Button onClick={confirmarPago} disabled={procesando}>
              {procesando ? "Procesando..." : "Confirmar Pago"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
