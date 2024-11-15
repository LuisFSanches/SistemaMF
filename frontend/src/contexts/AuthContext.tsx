/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState, useContext } from "react";

import { api } from "../services/api";
import { authenticateUser } from "../services/authenticationService";

interface IAuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  adminData: {
    id: string;
    username: string;
  };
  handleLogin: (username: string, password: string) => Promise<any>;
  handleSignOut: () => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({
    id: "",
    username: "",
  });

  const handleLogin = async (username: string, password: string) => {
    try {
      const response: any = await authenticateUser(username, password);
      setAdminData(response.data.admin);
      const token = `${response.data.token}`;
      localStorage.setItem("token", JSON.stringify(token));
      api.defaults.headers.common.authorization = token;

      setAuthenticated(true);

      return response;
    } catch (error) {
      return error;
    }
  };

  const handleSignOut = async () => {
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.common.authorization = "";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common.authorization = `${JSON.parse(token)}`;
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        adminData,
        handleLogin,
        handleSignOut,
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
