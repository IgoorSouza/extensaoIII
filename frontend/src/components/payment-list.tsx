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

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Pago
          </span>
        );
      case "pending":
      case "in_progress":
        return (
          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            Pendente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-500/10">
            {status}
          </span>
        );
    }
  };

  return (
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
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Nenhum pagamento registrado.
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow
              key={payment.id}
              onClick={() => onRowClick(payment)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>
                {payment.Customer?.name || getCustomerName(payment.customerId)}
              </TableCell>
              <TableCell>
                {payment.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell>
                {new Date(payment.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                {new Date(payment.updatedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};