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
import type { Customer } from "../types/customer";
import { purchaseSchema } from "../validators/purchase";
import type { PurchaseFormData } from "../types/purchase-form-data";

interface PurchaseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (purchase: Purchase) => void;
  initialData?: Purchase | null;
  customers: Customer[];
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  customers,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      value: 0,
      date: "",
      customerId: "",
    },
  });

  const customerId = watch("customerId");

  useEffect(() => {
    reset(
      initialData || {
        title: "",
        description: "",
        value: 0,
        date: "",
        customerId: "",
      }
    );
  }, [initialData, reset]);

  const submitHandler = (data: PurchaseFormData) => {
    const fullDate = data.date
      ? `${data.date}T12:00:00.000Z`
      : new Date().toISOString();

    const purchase: Purchase = {
      ...data,
      id: initialData?.id,
      date: fullDate,
    };

    onSubmit(purchase);
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
            <Label className="mb-2" htmlFor="value">
              Valor (R$)
            </Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              {...register("value", { valueAsNumber: true })}
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value.message}</p>
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
            <Label className="mb-2" htmlFor="customerId">
              Cliente
            </Label>
            <Select
              value={customerId || ""}
              onValueChange={(value) => setValue("customerId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && (
              <p className="text-red-500 text-sm">
                {errors.customerId.message}
              </p>
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
