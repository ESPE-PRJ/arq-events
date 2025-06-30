"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { ordenesService } from "@/services/ordenes.service"
import type { Orden } from "@/types"

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cargarOrdenes = async () => {
    try {
      setLoading(true)
      const data = await ordenesService.obtenerOrdenes()
      setOrdenes(data)
    } catch (error) {
      console.error("Error cargando órdenes:", error)
    } finally {
      setLoading(false)
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Orden
          </Button>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Estado</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Fecha</th>
                    <th className="text-left p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((orden) => (
                    <tr key={orden.id} className="border-b">
                      <td className="p-2 font-mono text-sm">{orden.id?.slice(0, 8)}...</td>
                      <td className="p-2">{orden.cliente_id}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            orden.estado === "completada"
                              ? "bg-green-100 text-green-800"
                              : orden.estado === "procesando"
                                ? "bg-blue-100 text-blue-800"
                                : orden.estado === "cancelada"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {orden.estado}
                        </span>
                      </td>
                      <td className="p-2">${orden.total?.toFixed(2)}</td>
                      <td className="p-2">{orden.fecha_creacion}</td>
                      <td className="p-2">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
