import { apiService } from "./api"
import type { Cliente, Cobro } from "../types"

export class CobrosService {
  // Clientes
  async crearCliente(cliente: Cliente): Promise<Cliente> {
    return apiService.post<Cliente>("/cobros/cliente", cliente)
  }

  async obtenerClientes(): Promise<Cliente[]> {
    return apiService.get<Cliente[]>("/cobros/cliente")
  }

  // Cobros
  async crearCobro(cobro: Cobro): Promise<Cobro> {
    return apiService.post<Cobro>("/cobros/cobro", cobro)
  }

  async obtenerCobros(): Promise<Cobro[]> {
    return apiService.get<Cobro[]>("/cobros/cobro")
  }

  async actualizarCobro(id: string, cobro: Partial<Cobro>): Promise<Cobro> {
    return apiService.patch<Cobro>(`/cobros/cobro/${id}`, cobro)
  }

  async eliminarCobro(id: string): Promise<void> {
    return apiService.delete<void>(`/cobros/cobro/${id}`)
  }
}

export const cobrosService = new CobrosService()
