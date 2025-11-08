import React from "react";
import type { Payment } from "../types/payment";
import type { Customer } from "../types/customer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface PaymentListProps {
  payments: Payment[];
  customers: Customer[];
  onRowClick: (payment: Payment) => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  customers,
  onRowClick,
}) => {
  const getCustomerName = (customerId: string) =>
    customers.find((u) => u.id === customerId)?.name ||
    "Cliente não encontrado";

  const getStatusBadge = (
    status: Payment["status"],
    isCardView: boolean = false
  ) => {
    let baseClasses =
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";

    if (isCardView) {
      baseClasses =
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset";
    }

    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span
            className={`${baseClasses} bg-green-100 text-green-700 ring-green-600/20`}
          >
            Pago
          </span>
        );
      case "pending":
      case "in_progress":
        return (
          <span
            className={`${baseClasses} bg-yellow-100 text-yellow-800 ring-yellow-600/20`}
          >
            Pendente
          </span>
        );
      case "rejected":
        return (
          <span
            className={`${baseClasses} bg-red-100 text-red-700 ring-red-600/20`}
          >
            Rejeitado
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-100 text-gray-700 ring-gray-500/10`}
          >
            {status}
          </span>
        );
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (payments.length === 0) {
    return (
      <div className="p-4 text-center border rounded-md">
        Nenhum pagamento registrado.
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Última Atualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                onClick={() => onRowClick(payment)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>
                  {payment.Customer?.name ||
                    getCustomerName(payment.customerId)}
                </TableCell>
                <TableCell>{formatCurrency(payment.value)}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell>{formatDate(payment.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden grid gap-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            onClick={() => onRowClick(payment)}
            className="bg-white border rounded-lg shadow-sm p-4 space-y-3 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold truncate">
                {payment.Customer?.name || getCustomerName(payment.customerId)}
              </h3>
              {getStatusBadge(payment.status, true)}
            </div>

            <div className="space-y-1 text-sm border-t pt-2">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="font-medium text-base">Valor:</span>
                <span className="text-base">
                  {formatCurrency(payment.value)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Criado em:</span>
                <span>{formatDate(payment.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Atualizado em:</span>
                <span>{formatDate(payment.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
