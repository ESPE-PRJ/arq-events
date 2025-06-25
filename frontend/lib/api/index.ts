import axios from "axios";

const host = process.env.NEXT_PUBLIC_API_URL || "api.example.com";

const api = axios.create({
  baseURL: new URL(host).toString(),
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
