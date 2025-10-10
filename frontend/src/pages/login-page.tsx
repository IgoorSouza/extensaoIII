import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { LoginFormData } from "../types/login-form-data";
import { useAuth } from "../hooks/use-auth";
import { loginSchema } from "../validators/login";
import { AxiosError } from "axios";

const LoginPage: React.FC = () => {
  const { login, authData } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (authData) {
    navigate("/");
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      login(data);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";

      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          errorMessage = "Usuário não encontrado.";
        }

        if (error.response?.status === 401) {
          errorMessage = "Senha incorreta.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg border">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Supermercado Líder - Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
