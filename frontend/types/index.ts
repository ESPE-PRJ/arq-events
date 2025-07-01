// Tipos para Productos
export interface Producto {
  id?: string
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// Tipos para Stock
export interface Stock {
  id?: string
  producto_id: string
  tipo: "ENTRADA" | "SALIDA"
  cantidad: number
  motivo: string
}

// Tipos para Clientes
export interface Cliente {
  id?: string
  nombre: string
  correo: string
  direccion: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// CORREGIDO: Tipos para Órdenes según la respuesta real del backend
export interface Orden {
  id?: string
  cliente_id?: string // Para crear
  cliente?: Cliente // Para listar (viene del backend)
  orden_items: OrdenItem[]
  estado: "pendiente" | "procesando" | "completada" | "cancelada"
  total: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface OrdenItem {
  id?: string
  id_producto: string
  cantidad: number
  precio_unitario: number
  producto?: Producto // Viene del backend al listar
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// Tipos para Cobros
export interface Cobro {
  id?: string
  orden_id: string
  estado: "pendiente" | "pagado" | "fallido"
  metodo_pago: "efectivo" | "tarjeta" | "transferencia"
  fecha_creacion?: string
}

// CORREGIDO: Tipos para Despachos según la respuesta real del backend
export interface Despacho {
  id?: string
  orden_id?: string // Para crear/actualizar
  orden?: Orden // Para listar (viene del backend)
  fecha_preparacion: string
  fecha_envio: string
  estado: "pendiente" | "preparando" | "listo" | "enviado"
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// CORREGIDO: Tipos para Envíos con los estados CORRECTOS de la API
export interface Envio {
  id?: string
  despacho_id?: string // Para crear/actualizar
  despacho?: Despacho // Para listar (viene del backend)
  estado: "pendiente" | "enviado" | "entregado" // ✅ Estados correctos de la API
  transportista: string
  numero_guia: string
  fecha_envio: string
  fecha_entrega?: string | null // Campo adicional que devuelve la API
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}
