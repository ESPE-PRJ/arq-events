"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Send, Plus, Edit, Trash2, MapPin, Clock, AlertCircle, Truck } from "lucide-react"
import { envioService, type EnvioRequest } from "@/services/envio.service"
import { despachoService } from "@/services/despacho.service"
import { ordenesService } from "@/services/ordenes.service"
import type { Envio, Despacho, Orden } from "@/types"

export default function EnviosPage() {
  const [envios, setEnvios] = useState<Envio[]>([])
  const [despachos, setDespachos] = useState<Despacho[]>([])
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creatingEnvio, setCreatingEnvio] = useState(false)
  const [error, setError] = useState<string>("")

  // Usar el tipo unificado con estados CORRECTOS
  const [nuevoEnvio, setNuevoEnvio] = useState<EnvioRequest>({
    despacho_id: "",
    estado: "pendiente", // ✅ Estado válido
    transportista: "",
    numero_guia: "",
    fecha_envio: "",
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [enviosData, despachosData, ordenesData] = await Promise.all([
        envioService.obtenerEnvios(),
        despachoService.obtenerDespachos(),
        ordenesService.obtenerOrdenes(),
      ])
      setEnvios(enviosData)
      setDespachos(despachosData)
      setOrdenes(ordenesData)
    } catch (error) {
      console.error("Error cargando datos:", error)
      setError("Error cargando datos iniciales")
    } finally {
      setLoading(false)
    }
  }

  const crearEnvio = async () => {
    try {
      setError("")
      setCreatingEnvio(true)

      // Validaciones básicas
      if (!nuevoEnvio.despacho_id || !nuevoEnvio.transportista || !nuevoEnvio.numero_guia || !nuevoEnvio.fecha_envio) {
        setError("Por favor completa todos los campos requeridos")
        return
      }

      // Validar que el despacho existe
      const despachoSeleccionado = despachos.find((d) => d.id === nuevoEnvio.despacho_id)
      if (!despachoSeleccionado) {
        setError("El despacho seleccionado no existe")
        return
      }

      // Construir el objeto EXACTAMENTE como en Postman
      const envioParaEnviar: EnvioRequest = {
        despacho_id: nuevoEnvio.despacho_id.trim(),
        estado: nuevoEnvio.estado, // ✅ Ahora usa estados correctos
        transportista: nuevoEnvio.transportista.trim(),
        numero_guia: nuevoEnvio.numero_guia.trim(),
        fecha_envio: new Date(nuevoEnvio.fecha_envio).toISOString(),
      }

      console.log("🚀 DATOS FINALES PARA CREAR ENVÍO:")
      console.log("📋 Objeto:", JSON.stringify(envioParaEnviar, null, 2))

      const resultado = await envioService.crearEnvio(envioParaEnviar)
      console.log("✅ Envío creado exitosamente:", resultado)

      // Limpiar formulario
      setDialogOpen(false)
      setNuevoEnvio({
        despacho_id: "",
        estado: "pendiente",
        transportista: "",
        numero_guia: "",
        fecha_envio: "",
      })
      cargarDatos()
    } catch (error: any) {
      console.error("❌ Error completo al crear envío:", error)
      setError(`Error al crear el envío: ${error.message || "Error desconocido"}`)
    } finally {
      setCreatingEnvio(false)
    }
  }

  const actualizarEstadoEnvio = async (id: string, nuevoEstado: string) => {
    try {
      const envioActual = envios.find((e) => e.id === id)
      if (!envioActual) {
        console.error("No se encontró el envío a actualizar")
        return
      }

      // Construir el objeto con estados CORRECTOS
      const datosActualizacion: EnvioRequest = {
        despacho_id: envioActual.despacho_id || envioActual.despacho?.id || "",
        estado: nuevoEstado as any, // ✅ Ahora usa estados correctos
        transportista: envioActual.transportista,
        numero_guia: envioActual.numero_guia,
        fecha_envio: envioActual.fecha_envio,
      }

      console.log("🔄 ACTUALIZANDO ENVÍO:")
      console.log("🆔 ID:", id)
      console.log("📦 Datos:", JSON.stringify(datosActualizacion, null, 2))

      await envioService.actualizarEnvio(id, datosActualizacion)
      cargarDatos()
    } catch (error) {
      console.error("Error actualizando envío:", error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando envíos...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Envíos</h2>
            <p className="text-gray-500">Gestión de envíos y seguimiento de entregas</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Envío
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Envío</DialogTitle>
                <DialogDescription>Registra un nuevo envío para un despacho</DialogDescription>
              </DialogHeader>

              {/* Mostrar errores */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="despacho">Despacho</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoEnvio.despacho_id}
                    onChange={(e) => {
                      console.log("🔄 Seleccionando despacho:", e.target.value)
                      setNuevoEnvio({ ...nuevoEnvio, despacho_id: e.target.value })
                    }}
                  >
                    <option value="">Selecciona un despacho</option>
                    {despachos
                      .filter((d) => d.estado === "listo")
                      .map((despacho) => (
                        <option key={despacho.id} value={despacho.id}>
                          #{despacho.id?.slice(0, 8) || "N/A"} - {despacho.orden?.cliente?.nombre || "Sin cliente"}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="transportista">Transportista</Label>
                  <Input
                    id="transportista"
                    value={nuevoEnvio.transportista}
                    onChange={(e) => {
                      console.log("🔄 Transportista:", e.target.value)
                      setNuevoEnvio({ ...nuevoEnvio, transportista: e.target.value })
                    }}
                    placeholder="Transportes X"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="numero_guia">Número de Guía</Label>
                  <Input
                    id="numero_guia"
                    value={nuevoEnvio.numero_guia}
                    onChange={(e) => {
                      console.log("🔄 Número de guía:", e.target.value)
                      setNuevoEnvio({ ...nuevoEnvio, numero_guia: e.target.value })
                    }}
                    placeholder="ABC1234567"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fecha_envio">Fecha de Envío</Label>
                  <Input
                    id="fecha_envio"
                    type="datetime-local"
                    value={nuevoEnvio.fecha_envio}
                    onChange={(e) => {
                      console.log("🔄 Fecha seleccionada:", e.target.value)
                      setNuevoEnvio({ ...nuevoEnvio, fecha_envio: e.target.value })
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoEnvio.estado}
                    onChange={(e) => {
                      console.log("🔄 Estado:", e.target.value)
                      setNuevoEnvio({ ...nuevoEnvio, estado: e.target.value as any })
                    }}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>

                {/* Debug info */}
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>Debug:</strong>
                  <br />
                  despacho_id: {nuevoEnvio.despacho_id || "vacío"}
                  <br />
                  estado: {nuevoEnvio.estado} ✅
                  <br />
                  transportista: {nuevoEnvio.transportista || "vacío"}
                  <br />
                  numero_guia: {nuevoEnvio.numero_guia || "vacío"}
                  <br />
                  fecha_envio: {nuevoEnvio.fecha_envio || "vacío"}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={creatingEnvio}>
                  Cancelar
                </Button>
                <Button
                  onClick={crearEnvio}
                  disabled={
                    !nuevoEnvio.despacho_id ||
                    !nuevoEnvio.transportista ||
                    !nuevoEnvio.numero_guia ||
                    !nuevoEnvio.fecha_envio ||
                    creatingEnvio
                  }
                >
                  {creatingEnvio ? "Creando..." : "Crear Envío"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats - CORREGIDAS con estados correctos */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Envíos</CardTitle>
              <Send className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{envios.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviados</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{envios.filter((e) => e.estado === "enviado").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregados</CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{envios.filter((e) => e.estado === "entregado").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{envios.filter((e) => e.estado === "pendiente").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Envíos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Envíos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Despacho</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Transportista</TableHead>
                  <TableHead>Número de Guía</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Envío</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {envios.map((envio) => (
                  <TableRow key={envio.id}>
                    <TableCell className="font-mono text-sm">{envio.id?.slice(0, 8) || "N/A"}...</TableCell>
                    <TableCell className="font-mono text-sm">
                      #{envio.despacho?.id?.slice(0, 8) || envio.despacho_id?.slice(0, 8) || "N/A"}...
                    </TableCell>
                    <TableCell>{envio.despacho?.orden?.cliente?.nombre || "-"}</TableCell>
                    <TableCell>{envio.transportista}</TableCell>
                    <TableCell className="font-mono">{envio.numero_guia}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          envio.estado === "entregado"
                            ? "default"
                            : envio.estado === "enviado"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {envio.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{envio.fecha_envio ? new Date(envio.fecha_envio).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {envio.estado === "pendiente" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarEstadoEnvio(envio.id!, "enviado")}
                          >
                            Enviar
                          </Button>
                        )}
                        {envio.estado === "enviado" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarEstadoEnvio(envio.id!, "entregado")}
                          >
                            Entregar
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
