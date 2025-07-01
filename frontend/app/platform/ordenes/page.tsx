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
import { ShoppingCart, Plus, Eye, Edit, Trash2, X, AlertCircle } from "lucide-react"
import { ordenesService, type CrearOrdenRequest } from "@/services/ordenes.service"
import { cobrosService } from "@/services/cobros.service"
import { inventarioService } from "@/services/inventario.service"
import type { Orden, Cliente, Producto } from "@/types"

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [error, setError] = useState<string>("")

  // CORREGIDO: Usar el tipo específico para crear órdenes
  const [nuevaOrden, setNuevaOrden] = useState<CrearOrdenRequest>({
    cliente_id: "",
    orden_items: [],
  })

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    id_producto: "",
    cantidad: 1,
    precio_unitario: 0,
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [ordenesData, clientesData, productosData] = await Promise.all([
        ordenesService.obtenerOrdenes(),
        cobrosService.obtenerClientes(),
        inventarioService.obtenerProductos(),
      ])
      setOrdenes(ordenesData)
      setClientes(clientesData)
      setProductos(productosData)
    } catch (error) {
      console.error("Error cargando datos:", error)
      setError("Error cargando datos iniciales")
    } finally {
      setLoading(false)
    }
  }

  const agregarProducto = () => {
    if (!productoSeleccionado.id_producto || productoSeleccionado.cantidad <= 0) return

    const producto = productos.find((p) => p.id === productoSeleccionado.id_producto)
    if (!producto) return

    const nuevoOrdenItem = {
      id_producto: productoSeleccionado.id_producto,
      cantidad: productoSeleccionado.cantidad,
      precio_unitario: producto.precio,
    }

    const itemsActualizados = [...nuevaOrden.orden_items, nuevoOrdenItem]

    setNuevaOrden({
      ...nuevaOrden,
      orden_items: itemsActualizados,
    })

    setProductoSeleccionado({
      id_producto: "",
      cantidad: 1,
      precio_unitario: 0,
    })
  }

  const eliminarProducto = (index: number) => {
    const itemsActualizados = nuevaOrden.orden_items.filter((_, i) => i !== index)

    setNuevaOrden({
      ...nuevaOrden,
      orden_items: itemsActualizados,
    })
  }

  const calcularTotal = () => {
    return nuevaOrden.orden_items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0)
  }

  const crearOrden = async () => {
    try {
      setError("")
      setCreatingOrder(true)

      if (!nuevaOrden.cliente_id || nuevaOrden.orden_items.length === 0) {
        setError("Por favor completa todos los campos requeridos")
        return
      }

      // CORREGIDO: Ahora el tipo coincide perfectamente
      await ordenesService.crearOrden(nuevaOrden)

      setDialogOpen(false)
      setNuevaOrden({
        cliente_id: "",
        orden_items: [],
      })
      cargarDatos()
    } catch (error: any) {
      console.error("Error creando orden:", error)
      setError(`Error al crear la orden: ${error.message}`)
    } finally {
      setCreatingOrder(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando órdenes...</p>
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
            <h2 className="text-3xl font-bold tracking-tight">Órdenes</h2>
            <p className="text-gray-500">Gestión de pedidos y órdenes de compra</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Orden
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Orden</DialogTitle>
                <DialogDescription>Crea una nueva orden seleccionando cliente y productos</DialogDescription>
              </DialogHeader>

              {/* Mostrar errores */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="grid gap-6 py-4">
                {/* Selección de Cliente */}
                <div className="grid gap-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevaOrden.cliente_id}
                    onChange={(e) => setNuevaOrden({ ...nuevaOrden, cliente_id: e.target.value })}
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} - {cliente.correo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Agregar Productos */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Agregar Productos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label>Producto</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={productoSeleccionado.id_producto}
                        onChange={(e) => {
                          const producto = productos.find((p) => p.id === e.target.value)
                          setProductoSeleccionado({
                            ...productoSeleccionado,
                            id_producto: e.target.value,
                            precio_unitario: producto?.precio || 0,
                          })
                        }}
                      >
                        <option value="">Selecciona producto</option>
                        {productos.map((producto) => (
                          <option key={producto.id} value={producto.id}>
                            {producto.codigo} - {producto.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={productoSeleccionado.cantidad}
                        onChange={(e) =>
                          setProductoSeleccionado({
                            ...productoSeleccionado,
                            cantidad: Number.parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Precio Unitario</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productoSeleccionado.precio_unitario}
                        onChange={(e) =>
                          setProductoSeleccionado({
                            ...productoSeleccionado,
                            precio_unitario: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={agregarProducto} className="w-full">
                        Agregar
                      </Button>
                    </div>
                  </div>

                  {/* Lista de Productos Agregados */}
                  {nuevaOrden.orden_items.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Productos en la orden:</h5>
                      <div className="space-y-2">
                        {nuevaOrden.orden_items.map((item, index) => {
                          const productoInfo = productos.find((p) => p.id === item.id_producto)
                          return (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex-1">
                                <span className="font-medium">{productoInfo?.nombre}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {item.cantidad} x ${item.precio_unitario.toFixed(2)} = $
                                  {(item.cantidad * item.precio_unitario).toFixed(2)}
                                </span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => eliminarProducto(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-4 text-right">
                        <span className="text-lg font-bold">Total: ${calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={creatingOrder}>
                  Cancelar
                </Button>
                <Button
                  onClick={crearOrden}
                  disabled={!nuevaOrden.cliente_id || nuevaOrden.orden_items.length === 0 || creatingOrder}
                >
                  {creatingOrder ? "Creando..." : "Crear Orden"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordenes.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Órdenes */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenes.map((orden) => (
                  <TableRow key={orden.id}>
                    <TableCell className="font-mono text-sm">{orden.id?.slice(0, 8) || "N/A"}...</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{orden.cliente?.nombre || "N/A"}</div>
                        <div className="text-sm text-gray-500">{orden.cliente?.correo || ""}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          orden.estado === "completada"
                            ? "default"
                            : orden.estado === "procesando"
                              ? "secondary"
                              : orden.estado === "cancelada"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {orden.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>${orden.total?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{orden.orden_items?.length || 0} items</div>
                        <div className="text-sm text-gray-500">
                          {orden.orden_items
                            ?.map((item) => item.producto?.nombre)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{orden.created_at ? new Date(orden.created_at).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
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
