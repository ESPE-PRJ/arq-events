"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Package, ShoppingCart, Users, CreditCard, Truck, Send, BarChart3, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/platform/dashboard", icon: Home },
  { name: "Inventario", href: "/platform/inventario", icon: Package },
  { name: "Órdenes", href: "/platform/ordenes", icon: ShoppingCart },
  { name: "Clientes", href: "/platform/clientes", icon: Users },
  { name: "Cobros", href: "/platform/cobros", icon: CreditCard },
  { name: "Despachos", href: "/platform/despachos", icon: Truck },
  { name: "Envíos", href: "/platform/envios", icon: Send },
]

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Distribuidora</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavItems />
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Distribuidora</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">Sistema de Gestión - Microservicios</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
