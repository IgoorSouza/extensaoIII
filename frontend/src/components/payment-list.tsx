import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import type { Payment } from "../types/payment";
import type { Purchase } from "../types/purchase";

interface PaymentListProps {
  payments: Payment[];
  purchases: Purchase[];
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Compra</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-center">Ações</TableHead>
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
            <TableRow key={payment.id}>
              <TableCell>
                {payment.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>
                {new Date(payment.payment_date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button variant="outline" onClick={() => onEdit(payment)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(payment.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
