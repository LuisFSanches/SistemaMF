import { createContext, useContext, useState } from "react";
import { listClients } from "../services/clientService";
import { IClient } from "../interfaces/IClient";

interface ClientsContextType {
  clients: IClient[];
  totalClients: number
  loadAvailableClients: (page: number, pageSize: number) => Promise<void>;
  addClient: (client: IClient) => void;
  editClient: (client: IClient) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC = ({ children }) => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [totalClients, setTotalClients] = useState(0);

  const loadAvailableClients = async (page: number, pageSize: number) => {
    const { data: { users, total } } = await listClients(page, pageSize);
    setClients(users);
    setTotalClients(total);
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

  return (
    <ClientsContext.Provider value={{
        clients,
        totalClients,
        addClient,
        editClient,
        loadAvailableClients
      }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useClients must be used within a ClientsProvider");
  return context;
};
