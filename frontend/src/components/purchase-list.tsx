import React from "react";
import { type User } from "../types/user.ts";
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

interface PurchaseListProps {
  purchases: Purchase[];
  users: User[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  users,
  onEdit,
  onDelete,
}) => {
  const getUserName = (userId: string) =>
    users.find((u) => u.id === userId)?.name || "Cliente não encontrado";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Cliente</TableHead>
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
              <TableCell>{purchase.description}</TableCell>
              <TableCell>
                {new Date(purchase.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>{getUserName(purchase.user_id)}</TableCell>
              <TableCell className="text-center space-x-2">
                <Button variant="outline" onClick={() => onEdit(purchase)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(purchase.id)}
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
