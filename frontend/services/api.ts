const API_BASE_URL = "http://localhost:8080"

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log("🚀 API Request:", {
        url,
        method: config.method || "GET",
        headers: config.headers,
        body: config.body,
      })

      const response = await fetch(url, config)

      console.log("📡 API Response:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        // Intentar obtener el mensaje de error del servidor
        let errorMessage = `HTTP error! status: ${response.status}`
        let errorBody = ""
        try {
          errorBody = await response.text()
          console.error("❌ Error Response Body:", errorBody)
          errorMessage += ` - ${errorBody}`
        } catch (e) {
          console.error("❌ Could not parse error response")
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("✅ API Success:", data)
      return data
    } catch (error) {
      console.error("💥 API request failed:", error)
      throw error
    }
  }

  // Métodos GET
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  // Métodos POST
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Métodos PATCH
  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Métodos DELETE
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiService = new ApiService()
