import React, { useEffect, useState } from "react";
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
import type { Customer } from "../types/customer";
import { SearchableSelect } from "./ui/searchable-select";
import { paymentSchema } from "../validators/payment";
import type { PaymentFormData } from "../types/payment-form-data";
import toast from "react-hot-toast";
import type { QrCodeData } from "../types/qr-code-data";

const QR_API_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=";

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  onQrCodeGenerated: (newPayment: PaymentFormData) => void;
}

export const PaymentForm: React.FC<QrCodeModalProps> = ({
  open,
  onClose,
  customers,
  onQrCodeGenerated,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      title: "",
      description: "",
      value: 0,
      customerId: "",
    },
  });

  const [qrCodeData, setQrCodeData] = useState<QrCodeData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customerId = watch("customerId");

  useEffect(() => {
    if (!open) {
      reset({
        title: "",
        description: "",
        value: 0,
        customerId: "",
      });
      setQrCodeData(null);
    }
  }, [open, reset]);

  const submitHandler = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    setQrCodeData(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const paymentLink = `https://sandbox.mercadopago.com.br/payment?id=${Date.now()}`;

      const qrCodeData: QrCodeData = {
        qrCode: paymentLink,
        paymentId: `MP-${Date.now()}`,
      };

      setQrCodeData(qrCodeData);
      onQrCodeGenerated(data);
      toast.success("QR Code de pagamento gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar QR Code de pagamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQrCodeData(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Gerar QR Code de Pagamento</DialogTitle>
        </DialogHeader>

        {qrCodeData ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-semibold text-green-600">
              Código de Pagamento Criado!
            </p>
            <img
              src={`${QR_API_URL}${encodeURIComponent(qrCodeData.qrCode)}`}
              alt="QR Code de Pagamento"
              className="size-48 border p-2"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="title">
                Título do Pagamento
              </Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="description">
                Descrição (Opcional)
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
              <Label className="mb-2" htmlFor="customerId">
                Cliente
              </Label>
              <SearchableSelect
                customers={customers}
                value={customerId}
                onValueChange={(value) => setValue("customerId", value)}
                placeholder="Selecione um cliente"
              />
              {errors.customerId && (
                <p className="text-red-500 text-sm">
                  {errors.customerId.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Gerando..." : "Gerar QR Code"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
