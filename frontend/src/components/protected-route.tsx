import { type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { authData } = useAuth();
  const navigate = useNavigate();

  if (authData == null) {
    navigate("/login", { replace: true });
    return null;
  }

  return children;
};
