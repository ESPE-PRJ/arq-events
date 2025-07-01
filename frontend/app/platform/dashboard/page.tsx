"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, CreditCard, Truck, Send, TrendingUp, AlertCircle } from "lucide-react"

const stats = [
  {
    title: "Productos",
    value: "1,234",
    description: "Total en inventario",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Órdenes",
    value: "89",
    description: "Pendientes de procesar",
    icon: ShoppingCart,
    color: "text-green-600",
  },
  {
    title: "Clientes",
    value: "456",
    description: "Clientes registrados",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Cobros",
    value: "$12,345",
    description: "Pendientes de cobro",
    icon: CreditCard,
    color: "text-yellow-600",
  },
  {
    title: "Despachos",
    value: "23",
    description: "Listos para envío",
    icon: Truck,
    color: "text-orange-600",
  },
  {
    title: "Envíos",
    value: "67",
    description: "En tránsito",
    icon: Send,
    color: "text-red-600",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "orden",
    message: "Nueva orden #ORD-001 creada",
    time: "Hace 5 minutos",
    icon: ShoppingCart,
  },
  {
    id: 2,
    type: "cobro",
    message: "Pago recibido para orden #ORD-002",
    time: "Hace 15 minutos",
    icon: CreditCard,
  },
  {
    id: 3,
    type: "despacho",
    message: "Despacho #DES-003 marcado como listo",
    time: "Hace 30 minutos",
    icon: Truck,
  },
  {
    id: 4,
    type: "envio",
    message: "Envío #ENV-004 entregado exitosamente",
    time: "Hace 1 hora",
    icon: Send,
  },
]

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Resumen general del sistema de microservicios</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Últimas actividades del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Alertas del Sistema
              </CardTitle>
              <CardDescription>Notificaciones importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">Stock bajo en 5 productos</p>
                    <p className="text-xs text-yellow-600">Revisar inventario</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">15 órdenes pendientes de despacho</p>
                    <p className="text-xs text-blue-600">Procesar despachos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Sistema funcionando correctamente</p>
                    <p className="text-xs text-green-600">Todos los servicios activos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
