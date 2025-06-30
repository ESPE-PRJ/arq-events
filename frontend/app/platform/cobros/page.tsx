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
import { CreditCard, Plus, Edit, Trash2, DollarSign } from "lucide-react"
import { cobrosService } from "@/services/cobros.service"
import type { Cobro } from "@/types"

export default function CobrosPage() {
  const [cobros, setCobros] = useState<Cobro[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nuevoCobro, setNuevoCobro] = useState<Cobro>({
    orden_id: "",
    estado: "pendiente",
    metodo_pago: "tarjeta",
  })

  useEffect(() => {
    cargarCobros()
  }, [])

  const cargarCobros = async () => {
    try {
      setLoading(true)
      const data = await cobrosService.obtenerCobros()
      setCobros(data)
    } catch (error) {
      console.error("Error cargando cobros:", error)
    } finally {
      setLoading(false)
    }
  }

  const crearCobro = async () => {
    try {
      await cobrosService.crearCobro(nuevoCobro)
      setDialogOpen(false)
      setNuevoCobro({ orden_id: "", estado: "pendiente", metodo_pago: "tarjeta" })
      cargarCobros()
    } catch (error) {
      console.error("Error creando cobro:", error)
    }
  }

  const actualizarEstadoCobro = async (id: string, estado: string) => {
    try {
      await cobrosService.actualizarCobro(id, { estado: estado as any })
      cargarCobros()
    } catch (error) {
      console.error("Error actualizando cobro:", error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando cobros...</p>
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
            <h2 className="text-3xl font-bold tracking-tight">Cobros</h2>
            <p className="text-gray-500">Gestión de pagos y facturación</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Cobro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Cobro</DialogTitle>
                <DialogDescription>Registra un nuevo cobro para una orden</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="orden_id">ID de Orden</Label>
                  <Input
                    id="orden_id"
                    value={nuevoCobro.orden_id}
                    onChange={(e) => setNuevoCobro({ ...nuevoCobro, orden_id: e.target.value })}
                    placeholder="ba8f3442-a6c0-4855-93b9-4a4363eac3ee"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={nuevoCobro.estado}
                    onChange={(e) => setNuevoCobro({ ...nuevoCobro, estado: e.target.value as any })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="fallido">Fallido</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="metodo_pago">Método de Pago</Label>
                  <Select
                    value={nuevoCobro.metodo_pago}
                    onChange={(e) => setNuevoCobro({ ...nuevoCobro, metodo_pago: e.target.value as any })}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={crearCobro}>Crear Cobro</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cobros</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cobros.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cobros.filter((c) => c.estado === "pendiente").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagados</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cobros.filter((c) => c.estado === "pagado").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cobros.filter((c) => c.estado === "fallido").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Cobros */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cobros</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Orden ID</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobros.map((cobro) => (
                  <TableRow key={cobro.id}>
                    <TableCell className="font-mono text-sm">{cobro.id?.slice(0, 8)}...</TableCell>
                    <TableCell className="font-mono text-sm">{cobro.orden_id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cobro.estado === "pagado"
                            ? "default"
                            : cobro.estado === "fallido"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {cobro.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{cobro.metodo_pago}</TableCell>
                    <TableCell>{cobro.fecha_creacion}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {cobro.estado === "pendiente" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarEstadoCobro(cobro.id!, "pagado")}
                          >
                            Marcar Pagado
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
