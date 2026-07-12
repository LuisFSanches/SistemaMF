import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3334";

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'x-custom-secret': "only-mirai-users",
  },
});

// Interceptor para adicionar token automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para capturar warnings de assinatura
api.interceptors.response.use(
  (response) => {
    const warning = response.headers['x-subscription-warning'];
    const status = response.headers['x-subscription-status'];
    
    if (warning && status) {
      // Disparar evento customizado para o sistema mostrar notificação
      window.dispatchEvent(new CustomEvent('subscription-warning', {
        detail: { warning, status }
      }));
    }
    
    return response;
  },
  (error) => {
    // Capturar erro 401 de trial expirado
    if (error.response?.status === 401) {
      const message = error.response?.data?.message;
      if (message === "Trial period expired. Please subscribe to a plan to continue using the system.") {
        // Disparar evento para abrir modal de seleção de planos
        window.dispatchEvent(new CustomEvent('subscription-trial-expired'));
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper para obter store_id do admin logado
export const getStoreId = (): string | null => {
  const adminData = localStorage.getItem("adminData");
  if (!adminData) return null;
  
  try {
    const admin = JSON.parse(adminData);
    return admin.store_id || null;
  } catch (error) {
    console.error("Error parsing adminData:", error);
    return null;
  }
};

// Helper para obter dados do admin logado
export const getAdminData = () => {
  const adminData = localStorage.getItem("adminData");
  if (!adminData) return null;
  
  try {
    return JSON.parse(adminData);
  } catch (error) {
    console.error("Error parsing adminData:", error);
    return null;
  }
};
