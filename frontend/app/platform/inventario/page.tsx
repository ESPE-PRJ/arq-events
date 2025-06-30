"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, TrendingUp, TrendingDown, Edit, Trash2 } from "lucide-react"
import { inventarioService } from "@/services/inventario.service"
import type { Producto, Stock } from "@/types"

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [stock, setStock] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stockDialogOpen, setStockDialogOpen] = useState(false)

  // Estados para formularios
  const [nuevoProducto, setNuevoProducto] = useState<Producto>({
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: 0,
  })

  const [nuevoStock, setNuevoStock] = useState<Stock>({
    producto_id: "",
    tipo: "ENTRADA",
    cantidad: 0,
    motivo: "",
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [productosData, stockData] = await Promise.all([
        inventarioService.obtenerProductos(),
        inventarioService.obtenerStock(),
      ])
      setProductos(productosData)
      setStock(stockData)
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const crearProducto = async () => {
    try {
      await inventarioService.crearProducto(nuevoProducto)
      setDialogOpen(false)
      setNuevoProducto({ codigo: "", nombre: "", descripcion: "", precio: 0 })
      cargarDatos()
    } catch (error) {
      console.error("Error creando producto:", error)
    }
  }

  const crearMovimientoStock = async () => {
    try {
      await inventarioService.crearMovimientoStock(nuevoStock)
      setStockDialogOpen(false)
      setNuevoStock({ producto_id: "", tipo: "ENTRADA", cantidad: 0, motivo: "" })
      cargarDatos()
    } catch (error) {
      console.error("Error creando movimiento de stock:", error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando inventario...</p>
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
            <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
            <p className="text-muted-foreground">Gestión de productos y control de stock</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productos.length}</div>
              <p className="text-xs text-muted-foreground">Productos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movimientos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stock.length}</div>
              <p className="text-xs text-muted-foreground">Movimientos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${productos.reduce((sum, p) => sum + p.precio, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Valor total estimado</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="productos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="stock">Movimientos de Stock</TabsTrigger>
          </TabsList>

          {/* Productos Tab */}
          <TabsContent value="productos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Lista de Productos</h3>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Producto</DialogTitle>
                    <DialogDescription>Ingresa los datos del nuevo producto</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="codigo">Código</Label>
                      <Input
                        id="codigo"
                        value={nuevoProducto.codigo}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, codigo: e.target.value })}
                        placeholder="PROD-001"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={nuevoProducto.nombre}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={nuevoProducto.descripcion}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                        placeholder="Descripción del producto"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="precio">Precio</Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        value={nuevoProducto.precio}
                        onChange={(e) =>
                          setNuevoProducto({ ...nuevoProducto, precio: Number.parseFloat(e.target.value) })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={crearProducto}>Crear Producto</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell className="font-medium">{producto.codigo}</TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell className="max-w-xs truncate">{producto.descripcion}</TableCell>
                      <TableCell>${producto.precio.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
            </Card>
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Movimientos de Stock</h3>
              <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
                <DialogTrigger>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Movimiento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
                    <DialogDescription>Registra una entrada o salida de inventario</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="producto">Producto</Label>
                      <Select
                        value={nuevoStock.producto_id}
                        onValueChange={(value) => setNuevoStock({ ...nuevoStock, producto_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productos.map((producto) => (
                            <SelectItem key={producto.id} value={producto.id || ""}>
                              {producto.codigo} - {producto.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tipo">Tipo de Movimiento</Label>
                      <Select
                        value={nuevoStock.tipo}
                        onValueChange={(value: "ENTRADA" | "SALIDA") => setNuevoStock({ ...nuevoStock, tipo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ENTRADA">Entrada</SelectItem>
                          <SelectItem value="SALIDA">Salida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        value={nuevoStock.cantidad}
                        onChange={(e) => setNuevoStock({ ...nuevoStock, cantidad: Number.parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="motivo">Motivo</Label>
                      <Input
                        id="motivo"
                        value={nuevoStock.motivo}
                        onChange={(e) => setNuevoStock({ ...nuevoStock, motivo: e.target.value })}
                        placeholder="Motivo del movimiento"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStockDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={crearMovimientoStock}>Registrar Movimiento</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stock.map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>{movimiento.producto_id}</TableCell>
                      <TableCell>
                        <Badge variant={movimiento.tipo === "ENTRADA" ? "default" : "destructive"}>
                          {movimiento.tipo === "ENTRADA" ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {movimiento.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{movimiento.cantidad}</TableCell>
                      <TableCell>{movimiento.motivo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
