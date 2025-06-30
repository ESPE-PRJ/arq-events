import { apiService } from "./api"
import type { Envio } from "../types"

export class EnvioService {
  async crearEnvio(envio: Envio): Promise<Envio> {
    return apiService.post<Envio>("/envio/envio", envio)
  }

  async obtenerEnvios(): Promise<Envio[]> {
    return apiService.get<Envio[]>("/envio/envio")
  }

  async actualizarEnvio(id: string, envio: Partial<Envio>): Promise<Envio> {
    return apiService.patch<Envio>(`/envio/envio/${id}`, envio)
  }

  async eliminarEnvio(id: string): Promise<void> {
    return apiService.delete<void>(`/envio/envio/${id}`)
  }
}

export const envioService = new EnvioService()
