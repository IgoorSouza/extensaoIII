import React, { useState } from "react";
import { type Purchase } from "../types/purchase";
import type { User } from "../types/user";
import { PurchaseList } from "../components/purchase-list";
import { PurchaseForm } from "../components/purchase-form";
import { Button } from "../components/ui/button";

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      cpf: "12345678900",
      phone: "11999999999",
    },
    {
      id: "2",
      name: "Maria Souza",
      email: "maria@email.com",
      cpf: "98765432100",
      phone: "11888888888",
    },
  ]);

  const handleAdd = () => {
    setSelectedPurchase(null);
    setIsFormOpen(true);
  };

  const handleSave = (purchase: Purchase) => {
    setPurchases((prev) => {
      const exists = prev.find((p) => p.id === purchase.id);
      return exists
        ? prev.map((p) => (p.id === purchase.id ? purchase : p))
        : [...prev, purchase];
    });
    setIsFormOpen(false);
  };

  const handleEdit = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Compras</h1>
        <Button onClick={handleAdd}>Adicionar Compra</Button>
      </div>

      <PurchaseList
        purchases={purchases}
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PurchaseForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSave}
        initialData={selectedPurchase}
        users={users}
      />
    </div>
  );
};

export default PurchasesPage;
