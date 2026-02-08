/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState, useContext } from "react";

import { api } from "../services/api";
import { authenticateUser } from "../services/authenticationService";
import { getStoreById } from "../services/storeService";
import { listAllStores, switchStore as switchStoreService } from "../services/adminService";
import { IStore, IStoreListItem } from "../interfaces/IStore";

interface IAuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  adminData: {
    id?: string;
    username: string;
    name: string;
    role: string;
    store_id?: string | null;
  };
  storeData: IStore | null;
  needsOnboarding: boolean;
  availableStores: IStoreListItem[];
  loadingStores: boolean;
  handleLogin: (username: string, password: string) => Promise<any>;
  handleSignOut: () => void;
  refreshStoreData: () => Promise<void>;
  loadAvailableStores: () => Promise<void>;
  handleSwitchStore: (storeId: string) => Promise<void>;
}

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<IStore | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [availableStores, setAvailableStores] = useState<IStoreListItem[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [adminData, setAdminData] = useState({
    id: "",
    username: "",
    role: "",
    name: "",
    store_id: null as string | null
  });

  const fetchStoreData = async (storeId: string) => {
    try {
      const store = await getStoreById(storeId);
      setStoreData(store);
      setNeedsOnboarding(store.is_first_access);
      localStorage.setItem("storeData", JSON.stringify(store));
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const refreshStoreData = async () => {
    if (adminData.store_id) {
      await fetchStoreData(adminData.store_id);
    }
  };

  const loadAvailableStores = async () => {
    setLoadingStores(true);
    try {
      const response = await listAllStores();
      setAvailableStores(response.data);
    } catch (error) {
      console.error("Error loading stores:", error);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleSwitchStore = async (storeId: string) => {
    setLoadingStores(true);
    try {
      const response = await switchStoreService(storeId);
      const { admin: adminResponse, token: newToken } = response.data;

      const newAdminData = {
        id: adminResponse.id,
        username: adminResponse.username,
        role: adminResponse.role,
        name: adminResponse.name,
        store_id: adminResponse.store_id || null
      };

      setAdminData(newAdminData);
      localStorage.setItem("adminData", JSON.stringify(newAdminData));
      localStorage.setItem("token", newToken);

      // Atualizar dados da loja
      if (adminResponse.store) {
        setStoreData(adminResponse.store);
        setNeedsOnboarding(adminResponse.store.is_first_access);
        localStorage.setItem("storeData", JSON.stringify(adminResponse.store));
      }

      // Recarregar a página para aplicar as mudanças
      window.location.reload();
    } catch (error) {
      console.error("Error switching store:", error);
      throw error;
    } finally {
      setLoadingStores(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response: any = await authenticateUser(username, password);
      
      // Extrair dados do admin da resposta
      // Backend retorna: { id, name, username, role, store_id, token }
      const { admin: adminResponse, token: adminToken } = response.data;

      const adminData = {
        id: adminResponse.id,
        username: adminResponse.username,
        role: adminResponse.role,
        name: adminResponse.name,
        store_id: adminResponse.store_id || null
      }

      console.log("Logged in admin:", adminData);
      
      setAdminData(adminData);
      localStorage.setItem("adminData", JSON.stringify(adminData));

      // Armazenar token SEM aspas duplas
      const token = adminToken;
      localStorage.setItem("token", token);
      
      // NÃO é mais necessário setar aqui, o interceptor fará isso
      // api.defaults.headers.common.authorization = token;

      setAuthenticated(true);
      
      // Buscar dados da loja se o admin tiver store_id
      if (adminData.store_id) {
        await fetchStoreData(adminData.store_id);
      }

      // Se for SYS_ADMIN, carregar lista de lojas
      if (adminData.role === 'SYS_ADMIN') {
        await loadAvailableStores();
      }

      window.location.reload();

      return response;
    } catch (error) {
      return error;
    }
  };

  const handleSignOut = async () => {
    setAuthenticated(false);
    setStoreData(null);
    setNeedsOnboarding(false);
    setAvailableStores([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminData");
    localStorage.removeItem("storeData");
    api.defaults.headers.common.authorization = "";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAdminData = localStorage.getItem("adminData");
    const storedStoreData = localStorage.getItem("storeData");

    if (token) {
      // Não precisa mais setar manualmente, o interceptor fará isso
      setAuthenticated(true);
    }

    if (storedAdminData) {
      try {
        const admin = JSON.parse(storedAdminData);
        setAdminData(admin);
        
        // Buscar dados atualizados da loja se tiver store_id
        if (admin.store_id && token) {
          fetchStoreData(admin.store_id);
        }

        // Se for SYS_ADMIN, carregar lista de lojas
        if (admin.role === 'SYS_ADMIN') {
          loadAvailableStores();
        }
      } catch (error) {
        console.error("Error parsing adminData:", error);
        // Limpar dados inválidos
        localStorage.removeItem("adminData");
      }
    }

    if (storedStoreData) {
      try {
        const store = JSON.parse(storedStoreData);
        console.log("Loaded store from localStorage:", store);
        setStoreData(store);
        setNeedsOnboarding(store.is_first_access);
      } catch (error) {
        console.error("Error parsing storeData:", error);
        localStorage.removeItem("storeData");
      }
    }
    
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        adminData,
        storeData,
        needsOnboarding,
        availableStores,
        loadingStores,
        handleLogin,
        handleSignOut,
        refreshStoreData,
        loadAvailableStores,
        handleSwitchStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminData = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAdminData must be used within a ClientsProvider");
  return context;
};
