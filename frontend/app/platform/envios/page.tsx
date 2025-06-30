"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
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
import { Send, Plus, Edit, Trash2, MapPin, Clock } from "lucide-react"
import { envioService } from "@/services/envio.service"
import type { Envio } from "@/types"

export default function EnviosPage() {
  const [envios, setEnvios] = useState<Envio[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nuevoEnvio, setNuevoEnvio] = useState<Envio>({
    despacho_id: "",
    estado: "pendiente",
    transportista: "",
    numero_guia: "",
    fecha_envio: "",
  })

  useEffect(() => {
    cargarEnvios()
  }, [])

  const cargarEnvios = async () => {
    try {
      setLoading(true)
      const data = await envioService.obtenerEnvios()
      setEnvios(data)
    } catch (error) {
      console.error("Error cargando envíos:", error)
    } finally {
      setLoading(false)
    }
  }

  const crearEnvio = async () => {
    try {
      await envioService.crearEnvio(nuevoEnvio)
      setDialogOpen(false)
      setNuevoEnvio({ despacho_id: "", estado: "pendiente", transportista: "", numero_guia: "", fecha_envio: "" })
      cargarEnvios()
    } catch (error) {
      console.error("Error creando envío:", error)
    }
  }

  const actualizarEstadoEnvio = async (id: string, estado: string) => {
    try {
      await envioService.actualizarEnvio(id, { estado: estado as any })
      cargarEnvios()
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
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="despacho_id">ID de Despacho</Label>
                  <Input
                    id="despacho_id"
                    value={nuevoEnvio.despacho_id}
                    onChange={(e) => setNuevoEnvio({ ...nuevoEnvio, despacho_id: e.target.value })}
                    placeholder="09b41e4f-040c-4c1f-a9de-a78b252ddcfa"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transportista">Transportista</Label>
                  <Input
                    id="transportista"
                    value={nuevoEnvio.transportista}
                    onChange={(e) => setNuevoEnvio({ ...nuevoEnvio, transportista: e.target.value })}
                    placeholder="Transportes X"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numero_guia">Número de Guía</Label>
                  <Input
                    id="numero_guia"
                    value={nuevoEnvio.numero_guia}
                    onChange={(e) => setNuevoEnvio({ ...nuevoEnvio, numero_guia: e.target.value })}
                    placeholder="ABC1234567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fecha_envio">Fecha de Envío</Label>
                  <Input
                    id="fecha_envio"
                    type="datetime-local"
                    value={nuevoEnvio.fecha_envio}
                    onChange={(e) => setNuevoEnvio({ ...nuevoEnvio, fecha_envio: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={nuevoEnvio.estado}
                    onChange={(e) => setNuevoEnvio({ ...nuevoEnvio, estado: e.target.value as any })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_transito">En Tránsito</option>
                    <option value="entregado">Entregado</option>
                    <option value="devuelto">Devuelto</option>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={crearEnvio}>Crear Envío</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
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
              <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{envios.filter((e) => e.estado === "en_transito").length}</div>
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
                  <TableHead>Despacho ID</TableHead>
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
                    <TableCell className="font-mono text-sm">{envio.id?.slice(0, 8)}...</TableCell>
                    <TableCell className="font-mono text-sm">{envio.despacho_id.slice(0, 8)}...</TableCell>
                    <TableCell>{envio.transportista}</TableCell>
                    <TableCell className="font-mono">{envio.numero_guia}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          envio.estado === "entregado"
                            ? "default"
                            : envio.estado === "en_transito"
                              ? "secondary"
                              : envio.estado === "devuelto"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {envio.estado.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(envio.fecha_envio).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {envio.estado === "pendiente" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarEstadoEnvio(envio.id!, "en_transito")}
                          >
                            Enviar
                          </Button>
                        )}
                        {envio.estado === "en_transito" && (
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
