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
import { Truck, Plus, Edit, Trash2, Package, AlertCircle } from "lucide-react"
import { despachoService, type CrearDespachoRequest } from "@/services/despacho.service"
import { ordenesService } from "@/services/ordenes.service"
import type { Despacho, Orden } from "@/types"

export default function DespachosPage() {
  const [despachos, setDespachos] = useState<Despacho[]>([])
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creatingDespacho, setCreatingDespacho] = useState(false)
  const [error, setError] = useState<string>("")

  // CORREGIDO: Usar el tipo específico para crear despachos
  const [nuevoDespacho, setNuevoDespacho] = useState<CrearDespachoRequest>({
    orden_id: "",
    fecha_preparacion: "",
    fecha_envio: "",
    estado: "pendiente",
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [despachosData, ordenesData] = await Promise.all([
        despachoService.obtenerDespachos(),
        ordenesService.obtenerOrdenes(),
      ])
      setDespachos(despachosData)
      setOrdenes(ordenesData)
    } catch (error) {
      console.error("Error cargando datos:", error)
      setError("Error cargando datos iniciales")
    } finally {
      setLoading(false)
    }
  }

  const crearDespacho = async () => {
    try {
      setError("")
      setCreatingDespacho(true)

      if (!nuevoDespacho.orden_id || !nuevoDespacho.fecha_preparacion || !nuevoDespacho.fecha_envio) {
        setError("Por favor completa todos los campos requeridos")
        return
      }

      // Convertir las fechas al formato ISO que espera la API
      const despachoParaEnviar: CrearDespachoRequest = {
        ...nuevoDespacho,
        fecha_preparacion: new Date(nuevoDespacho.fecha_preparacion).toISOString(),
        fecha_envio: new Date(nuevoDespacho.fecha_envio).toISOString(),
      }

      await despachoService.crearDespacho(despachoParaEnviar)
      setDialogOpen(false)
      setNuevoDespacho({ orden_id: "", fecha_preparacion: "", fecha_envio: "", estado: "pendiente" })
      cargarDatos()
    } catch (error: any) {
      console.error("Error creando despacho:", error)
      setError(`Error al crear el despacho: ${error.message}`)
    } finally {
      setCreatingDespacho(false)
    }
  }

  const actualizarEstadoDespacho = async (id: string, estado: string) => {
    try {
      await despachoService.actualizarDespacho(id, { estado: estado as any })
      cargarDatos()
    } catch (error) {
      console.error("Error actualizando despacho:", error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando despachos...</p>
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
            <h2 className="text-3xl font-bold tracking-tight">Despachos</h2>
            <p className="text-gray-500">Gestión de preparación y despacho de pedidos</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Despacho
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Despacho</DialogTitle>
                <DialogDescription>Programa un nuevo despacho para una orden</DialogDescription>
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
                  <Label htmlFor="orden">Orden</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoDespacho.orden_id}
                    onChange={(e) => setNuevoDespacho({ ...nuevoDespacho, orden_id: e.target.value })}
                  >
                    <option value="">Selecciona una orden</option>
                    {ordenes.map((orden) => (
                      <option key={orden.id} value={orden.id}>
                        #{orden.id?.slice(0, 8) || "N/A"} - {orden.cliente?.nombre || "Sin cliente"} - $
                        {orden.total?.toFixed(2) || "0.00"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fecha_preparacion">Fecha de Preparación</Label>
                  <Input
                    id="fecha_preparacion"
                    type="datetime-local"
                    value={nuevoDespacho.fecha_preparacion}
                    onChange={(e) => setNuevoDespacho({ ...nuevoDespacho, fecha_preparacion: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fecha_envio">Fecha de Envío</Label>
                  <Input
                    id="fecha_envio"
                    type="datetime-local"
                    value={nuevoDespacho.fecha_envio}
                    onChange={(e) => setNuevoDespacho({ ...nuevoDespacho, fecha_envio: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoDespacho.estado}
                    onChange={(e) => setNuevoDespacho({ ...nuevoDespacho, estado: e.target.value as any })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="preparando">Preparando</option>
                    <option value="listo">Listo</option>
                    <option value="enviado">Enviado</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={creatingDespacho}>
                  Cancelar
                </Button>
                <Button
                  onClick={crearDespacho}
                  disabled={
                    !nuevoDespacho.orden_id ||
                    !nuevoDespacho.fecha_preparacion ||
                    !nuevoDespacho.fecha_envio ||
                    creatingDespacho
                  }
                >
                  {creatingDespacho ? "Creando..." : "Crear Despacho"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Despachos</CardTitle>
              <Truck className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{despachos.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Package className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{despachos.filter((d) => d.estado === "pendiente").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preparando</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{despachos.filter((d) => d.estado === "preparando").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Listos</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{despachos.filter((d) => d.estado === "listo").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Despachos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Despachos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Preparación</TableHead>
                  <TableHead>Fecha Envío</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {despachos.map((despacho) => {
                  // CORREGIDO: Ahora usa despacho.orden directamente
                  return (
                    <TableRow key={despacho.id}>
                      <TableCell className="font-mono text-sm">{despacho.id?.slice(0, 8) || "N/A"}...</TableCell>
                      <TableCell className="font-mono text-sm">
                        #{despacho.orden?.id?.slice(0, 8) || "N/A"}...
                      </TableCell>
                      <TableCell>{despacho.orden?.cliente?.nombre || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            despacho.estado === "enviado"
                              ? "default"
                              : despacho.estado === "listo"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {despacho.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {despacho.fecha_preparacion ? new Date(despacho.fecha_preparacion).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        {despacho.fecha_envio ? new Date(despacho.fecha_envio).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {despacho.estado === "pendiente" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => actualizarEstadoDespacho(despacho.id!, "preparando")}
                            >
                              Iniciar
                            </Button>
                          )}
                          {despacho.estado === "preparando" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => actualizarEstadoDespacho(despacho.id!, "listo")}
                            >
                              Marcar Listo
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
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
