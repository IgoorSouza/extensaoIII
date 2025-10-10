import { createContext } from "react";
import type { AuthData } from "../../types/auth-data";
import type { LoginFormData } from "../../types/login-form-data";

export interface AuthContextObject {
  authData: AuthData | null;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextObject);
