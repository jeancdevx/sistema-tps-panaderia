// Configuración y utilidades para llamadas a la API
import { Cargo, Categoria, Cliente, Empleado, Producto, Venta } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient();

// Funciones específicas para cada entidad
export const productosApi = {
  getAll: () => apiClient.get("/productos"),
  getById: (id: number) => apiClient.get(`/productos/${id}`),
  create: (producto: Partial<Producto>) =>
    apiClient.post("/productos", producto),
  update: (id: number, producto: Partial<Producto>) =>
    apiClient.put(`/productos/${id}`, producto),
  delete: (id: number) => apiClient.delete(`/productos/${id}`),
  getByCategoria: (categoriaId: number) =>
    apiClient.get(`/productos/categoria/${categoriaId}`),
  buscar: (nombre: string) =>
    apiClient.get(`/productos/buscar?nombre=${nombre}`),
  getDisponibles: () => apiClient.get("/productos/disponibles"),
  actualizarStock: (id: number, cantidad: number) =>
    apiClient.put(`/productos/${id}/stock?cantidad=${cantidad}`, {}),
};

export const ventasApi = {
  getAll: () => apiClient.get("/pedidos"),
  getById: (id: number) => apiClient.get(`/pedidos/${id}`),
  create: (venta: Partial<Venta>) => apiClient.post("/pedidos", venta),
  updateEstado: (id: number, estado: string) =>
    apiClient.put(`/pedidos/${id}/estado?estado=${estado}`, {}),
  delete: (id: number) => apiClient.delete(`/pedidos/${id}`),
  getByCliente: (clienteId: number) =>
    apiClient.get(`/pedidos/cliente/${clienteId}`),
  getByFecha: (fechaInicio: string, fechaFin: string) =>
    apiClient.get(
      `/pedidos/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    ),
  getByEstado: (estado: string) => apiClient.get(`/pedidos/estado/${estado}`),
  countByEstado: (estado: string) =>
    apiClient.get(`/pedidos/estado/${estado}/count`),
};

export const clientesApi = {
  getAll: () => apiClient.get("/clientes"),
  getById: (id: number) => apiClient.get(`/clientes/${id}`),
  create: (cliente: Partial<Cliente>) => apiClient.post("/clientes", cliente),
  update: (id: number, cliente: Partial<Cliente>) =>
    apiClient.put(`/clientes/${id}`, cliente),
  delete: (id: number) => apiClient.delete(`/clientes/${id}`),
  buscarByDni: (dni: string) => apiClient.get(`/clientes/dni/${dni}`),
  buscarByRuc: (ruc: string) => apiClient.get(`/clientes/ruc/${ruc}`),
};

export const categoriasApi = {
  getAll: () => apiClient.get("/categorias"),
  getById: (id: number) => apiClient.get(`/categorias/${id}`),
  create: (categoria: Partial<Categoria>) =>
    apiClient.post("/categorias", categoria),
  update: (id: number, categoria: Partial<Categoria>) =>
    apiClient.put(`/categorias/${id}`, categoria),
  delete: (id: number) => apiClient.delete(`/categorias/${id}`),
};

export const tipoClientesApi = {
  getAll: () => apiClient.get("/tipo-clientes"),
  getById: (id: number) => apiClient.get(`/tipo-clientes/${id}`),
};

export const empleadosApi = {
  getAll: () => apiClient.get<Empleado[]>("/empleados"),
  getById: (id: number) => apiClient.get<Empleado>(`/empleados/${id}`),
  create: (empleado: Partial<Empleado>) =>
    apiClient.post<Empleado>("/empleados", empleado),
  update: (id: number, empleado: Partial<Empleado>) =>
    apiClient.put<Empleado>(`/empleados/${id}`, empleado),
  delete: (id: number) => apiClient.delete(`/empleados/${id}`),
  getByDni: (dni: string) => apiClient.get<Empleado>(`/empleados/dni/${dni}`),
  getActivos: () => apiClient.get<Empleado[]>("/empleados/activos"),
};

export const cargosApi = {
  getAll: () => apiClient.get<Cargo[]>("/cargos"),
  getById: (id: number) => apiClient.get<Cargo>(`/cargos/${id}`),
  create: (cargo: Partial<Cargo>) => apiClient.post<Cargo>("/cargos", cargo),
  update: (id: number, cargo: Partial<Cargo>) =>
    apiClient.put<Cargo>(`/cargos/${id}`, cargo),
  delete: (id: number) => apiClient.delete(`/cargos/${id}`),
};

// Funciones de utilidad para manejo de errores
export const handleApiError = (error: Error | unknown) => {
  console.error("API Error:", error);

  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response: { status: number } }).response;
    if (response?.status === 401) {
      // Redirigir al login
      window.location.href = "/auth/login";
    }
  }

  return error instanceof Error ? error.message : "Ha ocurrido un error";
};

export default apiClient;
