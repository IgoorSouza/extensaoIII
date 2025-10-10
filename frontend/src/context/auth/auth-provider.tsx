import { useEffect, useState, type PropsWithChildren } from "react";
import type { AuthData } from "../../types/auth-data";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import type { LoginFormData } from "../../types/login-form-data";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: PropsWithChildren) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function loadAuthData() {
      const storedAuthData = localStorage.getItem("authData");

      if (storedAuthData) {
        const data: AuthData = JSON.parse(storedAuthData);
        setAuthData(data);
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      }
    }

    loadAuthData();
  }, []);

  async function login(credentials: LoginFormData) {
    const { data } = await api.post("/auth", credentials);

    setAuthData(data);
    api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    localStorage.setItem("authData", JSON.stringify(data));
  }

  function logout() {
    setAuthData(null);
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("authData");
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
