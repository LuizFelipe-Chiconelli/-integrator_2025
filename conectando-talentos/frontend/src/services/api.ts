import axios from "axios";

const api = axios.create({
  baseURL: "http://integrador", // ou http://localhost se for esse o domínio da API
  withCredentials: true,        // ESSENCIAL para enviar cookies (ex: sessão PHP)
});

export default api;
