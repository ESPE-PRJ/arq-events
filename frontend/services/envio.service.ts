import { apiService } from "./api"
import type { Envio } from "../types"

// Tipo unificado para crear y actualizar envíos (con estados CORRECTOS)
export interface EnvioRequest {
  despacho_id: string
  estado: "pendiente" | "enviado" | "entregado" // ✅ Estados correctos de la API
  transportista: string
  numero_guia: string
  fecha_envio: string
}

export class EnvioService {
  async crearEnvio(envio: EnvioRequest): Promise<Envio> {
    console.log("🚀 CREANDO ENVÍO - INICIO")

    // Validar que todos los campos están presentes y no están vacíos
    const camposRequeridos = ["despacho_id", "estado", "transportista", "numero_guia", "fecha_envio"]
    const camposFaltantes = camposRequeridos.filter((campo) => {
      const valor = envio[campo as keyof EnvioRequest]
      return !valor || valor.toString().trim() === ""
    })

    if (camposFaltantes.length > 0) {
      throw new Error(`Campos faltantes o vacíos: ${camposFaltantes.join(", ")}`)
    }

    // Validar que el estado es uno de los permitidos
    const estadosPermitidos = ["pendiente", "enviado", "entregado"]
    if (!estadosPermitidos.includes(envio.estado)) {
      throw new Error(`Estado no válido: ${envio.estado}. Estados permitidos: ${estadosPermitidos.join(", ")}`)
    }

    // Validar formato de UUID para despacho_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(envio.despacho_id)) {
      throw new Error(`despacho_id no es un UUID válido: ${envio.despacho_id}`)
    }

    // Validar fecha ISO
    const fechaISO = new Date(envio.fecha_envio).toISOString()
    if (fechaISO === "Invalid Date") {
      throw new Error(`fecha_envio no es una fecha válida: ${envio.fecha_envio}`)
    }

    console.log("📦 DATOS VALIDADOS:")
    console.log("  despacho_id:", envio.despacho_id, "(UUID válido)")
    console.log("  estado:", envio.estado, "(estado válido)")
    console.log("  transportista:", envio.transportista, `(${envio.transportista.length} chars)`)
    console.log("  numero_guia:", envio.numero_guia, `(${envio.numero_guia.length} chars)`)
    console.log("  fecha_envio:", envio.fecha_envio, "->", fechaISO)

    console.log("🔍 OBJETO FINAL A ENVIAR:")
    console.log(JSON.stringify(envio, null, 2))

    return apiService.post<Envio>("/envio/envio", envio)
  }

  async obtenerEnvios(): Promise<Envio[]> {
    return apiService.get<Envio[]>("/envio/envio")
  }

  async actualizarEnvio(id: string, envio: EnvioRequest): Promise<Envio> {
    console.log("🔄 ACTUALIZANDO ENVÍO")
    console.log("🆔 ID del envío:", id)
    console.log("📦 Datos a enviar:", JSON.stringify(envio, null, 2))

    return apiService.patch<Envio>(`/envio/envio/${id}`, envio)
  }

  async eliminarEnvio(id: string): Promise<void> {
    return apiService.delete<void>(`/envio/envio/${id}`)
  }
}

export const envioService = new EnvioService()
