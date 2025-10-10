import {
  createContext,
  useState,
  useEffect,
  useContext,
  type PropsWithChildren,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { AuthData } from "../types/auth-data";
import type { LoginFormData } from "../types/login-form-data";
import api from "../lib/axios";

export interface AuthContextObject {
  authData: AuthData | null;
  authenticating: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextObject);

export function AuthProvider({ children }: PropsWithChildren) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [authenticating, setAuthenticating] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    function loadAuthData() {
      try {
        const storedAuthData = localStorage.getItem("authData");

        if (storedAuthData) {
          const data: AuthData = JSON.parse(storedAuthData);
          setAuthData(data);
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        }
      } catch (error) {
        localStorage.removeItem("authData");
        console.error("Falha ao carregar dados de autenticação:", error);
      } finally {
        setAuthenticating(false);
      }
    }

    loadAuthData();
  }, []);

  async function login(credentials: LoginFormData) {
    try {
      const { data } = await api.post("/auth", credentials);

      setAuthData(data);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      localStorage.setItem("authData", JSON.stringify(data));

      toast.success("Login realizado com sucesso!");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 404) {
          toast.error("O email informado não corresponde a nenhum usuário.");
          throw new Error("User not found.");
        }

        if (error.response.status === 401) {
          toast.error("Senha incorreta.");
          throw new Error("Incorrect password.");
        }
      }

      toast.error(
        "Ocorreu um erro ao realizar o login. Por favor, tente novamente."
      );
      throw error;
    }
  }

  function logout() {
    setAuthData(null);
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("authData");
    navigate("/login");
    toast.success("Sessão encerrada.");
  }

  return (
    <AuthContext.Provider value={{ authData, authenticating, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
