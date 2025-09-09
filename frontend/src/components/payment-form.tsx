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
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import type { Payment } from "../types/payment";
import type { Purchase } from "../types/purchase";
import { paymentSchema } from "../validators/payments";
import type { PaymentFormData } from "../types/payment-form-data";

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payment: Payment) => void;
  initialData?: Payment | null;
  purchases: Purchase[];
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      amount: 0,
      payment_date: "",
    },
  });

  useEffect(() => {
    reset(
      initialData || {
        amount: 0,
        payment_date: "",
      }
    );
  }, [initialData, reset]);

  const submitHandler = (data: PaymentFormData) => {
    const payment: Payment = {
      ...data,
      id: initialData?.id || crypto.randomUUID(),
    };
    onSubmit(payment);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Pagamento" : "Adicionar Pagamento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="amount">
              Valor
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>
          <div>
            <Label className="mb-2" htmlFor="payment_date">
              Data do Pagamento
            </Label>
            <Input
              id="payment_date"
              type="date"
              {...register("payment_date")}
            />
            {errors.payment_date && (
              <p className="text-red-500 text-sm">
                {errors.payment_date.message}
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
