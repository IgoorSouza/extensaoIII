import React, { useState } from "react";
import { PaymentList } from "../components/payment-list";
import { PaymentForm } from "../components/payment-form";
import { Button } from "../components/ui/button";
import type { Purchase } from "../types/purchase";
import type { Payment } from "../types/payment";

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [purchases] = useState<Purchase[]>([
    {
      id: "1",
      title: "Notebook Dell",
      description: "Compra de notebook para escritório",
      date: "2025-09-01",
      user_id: "1",
    },
    {
      id: "2",
      title: "Mouse Gamer",
      description: "Compra de mouse gamer",
      date: "2025-09-03",
      user_id: "2",
    },
  ]);

  const handleAdd = () => {
    setSelectedPayment(null);
    setIsFormOpen(true);
  };

  const handleSave = (payment: Payment) => {
    setPayments((prev) => {
      const exists = prev.find((p) => p.id === payment.id);
      return exists
        ? prev.map((p) => (p.id === payment.id ? payment : p))
        : [...prev, payment];
    });
    setIsFormOpen(false);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Pagamentos</h1>
        <Button onClick={handleAdd}>Registrar Pagamento</Button>
      </div>

      <PaymentList
        payments={payments}
        purchases={purchases}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PaymentForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSave}
        initialData={selectedPayment}
        purchases={purchases}
      />
    </div>
  );
};

export default PaymentsPage;
