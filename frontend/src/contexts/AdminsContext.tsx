import { createContext, useContext, useEffect, useState } from "react";
import { listAdmins } from "../services/adminService";
import { IAdmin } from "../interfaces/IAdmin";
import { PUBLIC_ROUTES } from "../constants";

interface AdminsContextType {
  admins: IAdmin[];
  loadAvailableAdmins: () => Promise<void>;
  addAdmin: (admin: IAdmin) => void;
  editAdmin: (admin: IAdmin) => void;
}

const AdminsContext = createContext<AdminsContextType | undefined>(undefined);

export const AdminsProvider: React.FC = ({ children }) => {
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const token = localStorage.getItem("token");


  const loadAvailableAdmins = async () => {
    if (admins.length === 0) {
      const { data: { admins } } = await listAdmins();
      setAdmins(admins);
    }
  };

  const addAdmin = (admin: IAdmin) => {
    setAdmins((prevAdmins) => [...prevAdmins, admin]);
  };
  
  const editAdmin = (updatedClient: IAdmin) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === updatedClient.id ? updatedClient : admin
      )
    );
  };

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      window.location.pathname === '/' || window.location.pathname.includes(route)
    );
    
    if (token && !isPublicRoute) {
      loadAvailableAdmins();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminsContext.Provider value={{ admins, addAdmin, editAdmin, loadAvailableAdmins }}>
      {children}
    </AdminsContext.Provider>
  );
};

export const useAdmins = () => {
  const context = useContext(AdminsContext);
  if (!context) throw new Error("useAdmins must be used within a AdminsProvider");
  return context;
};
