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
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import type { Customer } from "../types/customer";
import { SearchableSelect } from "./ui/searchable-select";
import { paymentSchema } from "../validators/payment";
import type { PaymentFormData } from "../types/payment-form-data";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import copy from "../assets/copy.png";
import whatsapp from "../assets/whatsapp.png";
import type { PixData } from "../types/pix-data";
import type { Payment } from "../types/payment";

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  onPixPaymentCreated: () => void;
  initialPaymentData?: Payment | null;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onClose,
  customers,
  onPixPaymentCreated,
  initialPaymentData,
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
      value: 0,
      customerId: "",
    },
  });

  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customerId = watch("customerId");

  useEffect(() => {
    if (open) {
      if (initialPaymentData) {
        setPixData({
          copyPasteCode: initialPaymentData.copyPasteCode,
          qrCode: initialPaymentData.qrCode,
        });
        reset({
          value: initialPaymentData.value,
          customerId: initialPaymentData.customerId,
        });
      } else {
        reset({
          value: 0,
          customerId: "",
        });
        setPixData(null);
      }
    } else {
      reset({
        value: 0,
        customerId: "",
      });
      setPixData(null);
    }
  }, [open, reset, initialPaymentData]);

  const submitHandler = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    setPixData(null);
    try {
      const response = await axios.post<PixData>("/payment", data);
      setPixData(response.data);
      onPixPaymentCreated();
      toast.success("Pagamento Pix gerado com sucesso!");
    } catch (error) {
      console.error("Error creating pix payment:", error);
      toast.error("Erro ao gerar pagamento Pix.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPixData(null);
    onClose();
  };

  const copyToClipboard = () => {
    if (pixData?.copyPasteCode) {
      navigator.clipboard.writeText(pixData.copyPasteCode);
      toast.success("Código Copia e Cola copiado!");
    }
  };

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const handleSendViaWhatsApp = () => {
    const encodedMessage = encodeURIComponent(pixData!.copyPasteCode);
    const whatsappUrl = `https://wa.me/55${
      selectedCustomer!.phone
    }?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialPaymentData
              ? "Detalhes do Pagamento Pix"
              : "Gerar Novo Pagamento Pix"}
          </DialogTitle>
        </DialogHeader>

        {pixData ? (
          <div className="flex flex-col items-center space-y-6 p-4">
            <div className="flex flex-col items-center space-y-2">
              <p className="font-medium">Escaneie o QR Code</p>
              <img
                src={`data:image/png;base64,${pixData.qrCode}`}
                alt="QR Code Pix"
                className="size-48 border p-2 rounded-lg"
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="pix-code">Ou use o Código Copia e Cola</Label>
              <div className="relative">
                <Input
                  id="pix-code"
                  type="text"
                  readOnly
                  value={pixData.copyPasteCode}
                  className="w-full pr-12 text-xs break-all"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute right-1 top-1 h-7 w-7 p-1"
                  onClick={copyToClipboard}
                  title="Copiar código Pix"
                >
                  <img src={copy} alt="Copiar" className="size-4" />
                </Button>
              </div>
            </div>

            <DialogFooter className="flex-col justify-end w-full">
              <Button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Fechar
              </Button>

              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSendViaWhatsApp}
                disabled={!selectedCustomer?.phone}
              >
                <img src={whatsapp} alt="WhatsApp" className="size-5" />
                Enviar por WhatsApp
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
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

            {customerId && (
              <p className="text-sm">
                <span className="font-semibold">
                  Valor pendente de pagamento do cliente:
                </span>{" "}
                {selectedCustomer?.totalPurchasesValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            )}

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Gerando..." : "Gerar pagamento Pix"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
