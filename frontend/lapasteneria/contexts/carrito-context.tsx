"use client";

import { CarritoContextType, ItemCarrito, Producto } from "@/lib/types";
import { createContext, ReactNode, useContext, useReducer } from "react";

// Tipos para el reducer
type CarritoAction =
  | { type: "AGREGAR_ITEM"; payload: { producto: Producto; cantidad: number } }
  | { type: "REMOVER_ITEM"; payload: { productoId: number } }
  | {
      type: "ACTUALIZAR_CANTIDAD";
      payload: { productoId: number; cantidad: number };
    }
  | { type: "LIMPIAR_CARRITO" };

interface CarritoState {
  items: ItemCarrito[];
}

// Estado inicial
const initialState: CarritoState = {
  items: [],
};

// Reducer
function carritoReducer(
  state: CarritoState,
  action: CarritoAction
): CarritoState {
  switch (action.type) {
    case "AGREGAR_ITEM": {
      const { producto, cantidad } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.producto.id === producto.id
      );

      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar la cantidad
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          cantidad: newItems[existingItemIndex].cantidad + cantidad,
        };
        return { ...state, items: newItems };
      } else {
        // Si es un producto nuevo, agregarlo
        return {
          ...state,
          items: [...state.items, { producto, cantidad }],
        };
      }
    }

    case "REMOVER_ITEM": {
      const { productoId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.producto.id !== productoId),
      };
    }

    case "ACTUALIZAR_CANTIDAD": {
      const { productoId, cantidad } = action.payload;
      if (cantidad <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        return {
          ...state,
          items: state.items.filter((item) => item.producto.id !== productoId),
        };
      }

      const newItems = state.items.map((item) =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      );
      return { ...state, items: newItems };
    }

    case "LIMPIAR_CARRITO":
      return { ...state, items: [] };

    default:
      return state;
  }
}

// Contexto
const CarritoContext = createContext<CarritoContextType | null>(null);

// Hook personalizado para usar el contexto
export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
}

// Proveedor del contexto
interface CarritoProviderProps {
  children: ReactNode;
}

export function CarritoProvider({ children }: CarritoProviderProps) {
  const [state, dispatch] = useReducer(carritoReducer, initialState);

  // Funciones del contexto
  const agregarItem = (producto: Producto, cantidad: number) => {
    dispatch({ type: "AGREGAR_ITEM", payload: { producto, cantidad } });
  };

  const removerItem = (productoId: number) => {
    dispatch({ type: "REMOVER_ITEM", payload: { productoId } });
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    dispatch({
      type: "ACTUALIZAR_CANTIDAD",
      payload: { productoId, cantidad },
    });
  };

  const limpiarCarrito = () => {
    dispatch({ type: "LIMPIAR_CARRITO" });
  };

  // Calcular totales
  const total = state.items.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  const cantidadItems = state.items.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );

  const value: CarritoContextType = {
    items: state.items,
    agregarItem,
    removerItem,
    actualizarCantidad,
    limpiarCarrito,
    total,
    cantidadItems,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
}
