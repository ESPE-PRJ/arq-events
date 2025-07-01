import { apiService } from "./api"
import type { Despacho } from "../types"

// Tipo específico para crear despachos (solo los campos necesarios)
export interface CrearDespachoRequest {
  orden_id: string
  fecha_preparacion: string
  fecha_envio: string
  estado: "pendiente" | "preparando" | "listo" | "enviado"
}

export class DespachoService {
  async crearDespacho(despacho: CrearDespachoRequest): Promise<Despacho> {
    return apiService.post<Despacho>("/despacho/despacho", despacho)
  }

  async obtenerDespachos(): Promise<Despacho[]> {
    return apiService.get<Despacho[]>("/despacho/despacho")
  }

  async actualizarDespacho(
    id: string,
    despacho: Partial<Omit<Despacho, "id" | "orden" | "created_at" | "updated_at" | "deleted_at">>,
  ): Promise<Despacho> {
    return apiService.patch<Despacho>(`/despacho/despacho/${id}`, despacho)
  }

  async eliminarDespacho(id: string): Promise<void> {
    return apiService.delete<void>(`/despacho/despacho/${id}`)
  }
}

export const despachoService = new DespachoService()
