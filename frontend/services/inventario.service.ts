import { apiService } from "./api"
import type { Producto, Stock } from "../types"

export class InventarioService {
  // Productos
  async crearProducto(producto: Producto): Promise<Producto> {
    return apiService.post<Producto>("/inventario/producto/", producto)
  }

  async obtenerProductos(): Promise<Producto[]> {
    return apiService.get<Producto[]>("/inventario/producto/")
  }

  // Stock
  async crearMovimientoStock(stock: Stock): Promise<Stock> {
    return apiService.post<Stock>("/inventario/stock", stock)
  }

  async obtenerStock(): Promise<Stock[]> {
    return apiService.get<Stock[]>("/inventario/stock/")
  }
}

export const inventarioService = new InventarioService()
