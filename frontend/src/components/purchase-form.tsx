import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Purchase } from "../types/purchase";
import type { User } from "../types/user";
import { purchaseSchema } from "../validators/purchases";
import type { PurchaseFormData } from "../types/purchase-form-data";

interface PurchaseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (purchase: Purchase) => void;
  initialData?: Purchase | null;
  users: User[];
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  users,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: initialData || {
      title: "",
      date: "",
      user_id: "",
    },
  });

  useEffect(() => {
    reset(initialData || { title: "", description: "", date: "", user_id: "" });
  }, [initialData, reset]);

  const submitHandler = (data: PurchaseFormData) => {
    const purchase: Purchase = {
      ...data,
      id: initialData?.id,
    };
    onSubmit(purchase);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Compra" : "Adicionar Compra"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="title">
              Título
            </Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="description">
              Descrição
            </Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="date">
              Data
            </Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="user_id">
              Cliente
            </Label>
            <Select
              value={initialData?.user_id || ""}
              onValueChange={(value) => setValue("user_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.user_id && (
              <p className="text-red-500 text-sm">{errors.user_id.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
