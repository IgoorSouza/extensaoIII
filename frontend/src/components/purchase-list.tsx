import React, { useState } from "react";
import { type Customer } from "../types/customer.ts";
import type { Purchase } from "../types/purchase.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import DeletionConfirmationModal from "./deletion-confirmation-modal.tsx";

interface PurchaseListProps {
  purchases: Purchase[];
  customers: Customer[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  customers,
  onEdit,
  onDelete,
}) => {
  const [purchaseToDelete, setPurchaseToDelete] = useState<Purchase | null>(
    null
  );

  const getCustomerName = (customerId: string) =>
    customers.find((u) => u.id === customerId)?.name ||
    "Cliente não encontrado";

  const handleDelete = () => {
    onDelete(purchaseToDelete!.id!);
    setPurchaseToDelete(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhuma compra registrada.
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.title}</TableCell>
                <TableCell className="max-md:max-w-[150px] max-w-[200px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {purchase.description}
                </TableCell>
                <TableCell>{getCustomerName(purchase.customerId)}</TableCell>
                <TableCell>
                  {purchase.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(purchase.date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button variant="outline" onClick={() => onEdit(purchase)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setPurchaseToDelete(purchase)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeletionConfirmationModal
        title="Excluir Compra"
        confirmationText={`Tem certeza que deseja excluir a compra ${purchaseToDelete?.title}?`}
        open={!!purchaseToDelete}
        onClose={() => setPurchaseToDelete(null)}
        onConfirmation={handleDelete}
      />
    </>
  );
};
