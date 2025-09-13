import React, { useState, useEffect } from "react";
import { type Purchase } from "../types/purchase";
import type { Customer } from "../types/customer";
import { PurchaseList } from "../components/purchase-list";
import { PurchaseForm } from "../components/purchase-form";
import { Button } from "../components/ui/button";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchPurchases = async () => {
    const { data } = await axios.get<Purchase[]>("/purchase");
    setPurchases(data);
  };

  const fetchCustomers = async () => {
    const { data } = await axios.get<Customer[]>("/customer?pageSize=999");
    setCustomers(data);
  };

  useEffect(() => {
    fetchPurchases();
    fetchCustomers();
  }, []);

  const handleAdd = () => {
    setSelectedPurchase(null);
    setIsFormOpen(true);
  };

  const handleSave = async (purchase: Purchase) => {
    try {
      if (purchase.id) {
        const response = await axios.put(`/purchase/${purchase.id}`, purchase);
        setPurchases((prev) =>
          prev.map((p) => (p.id === purchase.id ? response.data : p))
        );
      } else {
        const response = await axios.post("/purchase", purchase);
        setPurchases((prev) => [...prev, response.data]);
      }

      setIsFormOpen(false);
      toast.success(
        `Compra ${purchase.id ? "atualizada" : "cadastrada"} com sucesso.`
      );
    } catch {
      toast.error(`Erro ao ${purchase.id ? "atualizar" : "adicionar"} compra.`);
    }
  };

  const handleEdit = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/purchase/${id}`);
      setPurchases((prev) => prev.filter((purchase) => purchase.id !== id));
      toast.success("Compra excluída com sucesso.");
    } catch {
      toast.error("Erro ao excluir compra.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Compras</h1>
        <Button onClick={handleAdd}>Adicionar Compra</Button>
      </div>

      <PurchaseList
        purchases={purchases}
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PurchaseForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSave}
        initialData={selectedPurchase}
        customers={customers}
      />
    </div>
  );
};

export default PurchasesPage;
