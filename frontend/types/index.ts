// Tipos para Productos
export interface Producto {
  id?: string
  codigo: string
  nombre: string
  descripcion: string
  precio: number
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
}

// Tipos para Órdenes
export interface Orden {
  id?: string
  cliente_id: string
  productos: ProductoOrden[]
  estado: "pendiente" | "procesando" | "completada" | "cancelada"
  total: number
  fecha_creacion?: string
}

export interface ProductoOrden {
  producto_id: string
  cantidad: number
  precio_unitario: number
}

// Tipos para Cobros
export interface Cobro {
  id?: string
  orden_id: string
  estado: "pendiente" | "pagado" | "fallido"
  metodo_pago: "efectivo" | "tarjeta" | "transferencia"
  fecha_creacion?: string
}

// Tipos para Despachos
export interface Despacho {
  id?: string
  orden_id: string
  fecha_preparacion: string
  fecha_envio: string
  estado: "pendiente" | "preparando" | "listo" | "enviado"
}

// Tipos para Envíos
export interface Envio {
  id?: string
  despacho_id: string
  estado: "pendiente" | "en_transito" | "entregado" | "devuelto"
  transportista: string
  numero_guia: string
  fecha_envio: string
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}
