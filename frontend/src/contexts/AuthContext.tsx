/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "../services/api";
import { authenticateUser } from "../services/authenticationService";
import { createUser } from "../services/clientService";

interface IAuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  userData: {
    id: string;
    username: string;
  };
  handleLogin: (username: string, password: string) => Promise<any>;
  handleSignUp: (username: string, password: string) => Promise<any>;
  handleSignOut: () => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    username: "",
  });

  const handleLogin = async (username: string, password: string) => {
    try {
      const response: any = await authenticateUser(username, password);
      const token = `${response.data.token}`;
      localStorage.setItem("token", JSON.stringify(token));
      api.defaults.headers.common.authorization = token;

      setAuthenticated(true);

      return response;
    } catch (error) {
      return error;
    }
  };

  const handleSignUp = async (username: string, password: string) => {
    try {
      await createUser(username, password);
      const login = await handleLogin(username, password);
      return login;
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
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        userData,
        handleLogin,
        handleSignUp,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
