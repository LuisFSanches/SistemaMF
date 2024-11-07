import { createContext, useContext, useEffect, useState } from "react";
import { listClients } from "../services/clientService";


interface IClients {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}
interface ClientsContextType {
  clients: IClients[];
  loadAvailableClients: () => Promise<void>;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC = ({ children }) => {
  const [clients, setClients] = useState<IClients[]>([]);

  const loadAvailableClients = async () => {
    if (clients.length === 0) {
      const { data: { users } } = await listClients();
      setClients(users);
    }
  };

  useEffect(() => {
    loadAvailableClients();
  }, []);

  return (
    <ClientsContext.Provider value={{ clients, loadAvailableClients }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useClients must be used within a ClientsProvider");
  return context;
};
