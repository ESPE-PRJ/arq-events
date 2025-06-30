import { apiService } from "./api"
import type { Orden } from "../types"

export class OrdenesService {
  async obtenerOrdenes(): Promise<Orden[]> {
    return apiService.get<Orden[]>("/ordenes/orden")
  }

  async crearOrden(orden: Orden): Promise<Orden> {
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
