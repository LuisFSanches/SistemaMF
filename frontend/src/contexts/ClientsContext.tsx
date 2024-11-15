import { createContext, useContext, useEffect, useState } from "react";
import { listClients } from "../services/clientService";
import { IClient } from "../interfaces/IClient";

interface ClientsContextType {
  clients: IClient[];
  loadAvailableClients: () => Promise<void>;
  addClient: (client: IClient) => void;
  editClient: (client: IClient) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC = ({ children }) => {
  const [clients, setClients] = useState<IClient[]>([]);

  const loadAvailableClients = async () => {
    if (clients.length === 0) {
      const { data: { users } } = await listClients();
      setClients(users);
    }
  };

  const addClient = (client: IClient) => {
    setClients((prevClients) => [...prevClients, client]);
  };
  
  const editClient = (updatedClient: IClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  useEffect(() => {
    loadAvailableClients();
  }, []);

  return (
    <ClientsContext.Provider value={{ clients, addClient, editClient, loadAvailableClients }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useClients must be used within a ClientsProvider");
  return context;
};
