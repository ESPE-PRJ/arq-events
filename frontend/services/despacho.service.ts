import { apiService } from "./api"
import type { Despacho } from "../types"

export class DespachoService {
  async crearDespacho(despacho: Despacho): Promise<Despacho> {
    return apiService.post<Despacho>("/despacho/despacho", despacho)
  }

  async obtenerDespachos(): Promise<Despacho[]> {
    return apiService.get<Despacho[]>("/despacho/despacho")
  }

  async actualizarDespacho(id: string, despacho: Partial<Despacho>): Promise<Despacho> {
    return apiService.patch<Despacho>(`/despacho/despacho/${id}`, despacho)
  }

  async eliminarDespacho(id: string): Promise<void> {
    return apiService.delete<void>(`/despacho/despacho/${id}`)
  }
}

export const despachoService = new DespachoService()
