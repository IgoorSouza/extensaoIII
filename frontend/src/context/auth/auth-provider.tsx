import { useEffect, useState, type PropsWithChildren } from "react";
import type { AuthData } from "../../types/auth-data";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import type { LoginFormData } from "../../types/login-form-data";
import { AuthContext } from "./auth-context";
import { type User } from "../../types/user";
import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children }: PropsWithChildren) {
  const [authData, setAuthData] = useState<AuthData | null | undefined>(
    undefined
  );
  const navigate = useNavigate();

  useEffect(() => {
    function loadAuthData() {
      const token = localStorage.getItem("token");

      if (token) {
        const jwtPayload = jwtDecode<User>(token);
        const data: AuthData = {
          user: { name: jwtPayload.name, email: jwtPayload.email },
          token,
        };
        
        setAuthData(data);
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      } else {
        setAuthData(null);
      }
    }

    loadAuthData();
  }, []);

  async function login(credentials: LoginFormData) {
    const {
      data: { token },
    } = await api.post<AuthData>("/auth", credentials);
    const userPayload = jwtDecode<User>(token);

    setAuthData({ user: userPayload, token });
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  }

  function logout() {
    setAuthData(null);
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
