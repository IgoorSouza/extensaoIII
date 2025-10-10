import type { PropsWithChildren } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { authData, authenticating } = useAuth();
  const navigate = useNavigate();

  if (authenticating) {
    return null;
  }

  if (!authData) {
    navigate("/login", { replace: true });
    toast.error("Acesso negado. Por favor, faça login.");
    return null;
  }

  return children;
};
