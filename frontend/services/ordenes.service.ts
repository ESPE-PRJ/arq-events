import { apiService } from "./api"
import type { Orden } from "../types"

// Tipo específico para crear órdenes (solo los campos necesarios)
export interface CrearOrdenRequest {
  cliente_id: string
  orden_items: {
    id_producto: string
    cantidad: number
    precio_unitario: number
  }[]
}

export class OrdenesService {
  async obtenerOrdenes(): Promise<Orden[]> {
    return apiService.get<Orden[]>("/ordenes/orden")
  }

  async crearOrden(orden: CrearOrdenRequest): Promise<Orden> {
    return apiService.post<Orden>("/ordenes/orden", orden)
  }

  async actualizarOrden(id: string, orden: Partial<Orden>): Promise<Orden> {
    return apiService.patch<Orden>(`/ordenes/orden/${id}`, orden)
  }

  async eliminarOrden(id: string): Promise<void> {
    return apiService.delete<void>(`/ordenes/orden/${id}`)
  }
}

export const ordenesService = new OrdenesService()
