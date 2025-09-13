import React, { useState, useEffect } from "react";
import { type Customer } from "../types/customer";
import { CustomerList } from "../components/customer-list";
import { CustomerForm } from "../components/customer-form";
import { Button } from "../components/ui/button";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchCustomers = async () => {
    const { data } = await axios.get<Customer[]>("/customer");
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleSave = async (customer: Customer) => {
    try {
      if (customer.id) {
        const response = await axios.put(`/customer/${customer.id}`, customer);
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? response.data : c))
        );
      } else {
        const response = await axios.post("/customer", customer);
        setCustomers((prev) => [...prev, response.data]);
      }

      setIsFormOpen(false);
      toast.success(
        `Cliente ${customer.id ? "atualizado" : "cadastrado"} com sucesso.`
      );
    } catch {
      toast.error(
        `Erro ao ${customer.id ? "atualizar" : "adicionar"} cliente.`
      );
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/customer/${id}`);
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      toast.success("Cliente excluído com sucesso.");
    } catch {
      toast.error("Erro ao excluir cliente.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Clientes</h1>
        <Button onClick={handleAdd}>Adicionar Cliente</Button>
      </div>

      <CustomerList
        customers={customers}
        purchases={[]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CustomerForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSave}
        initialData={selectedCustomer}
      />
    </div>
  );
};

export default CustomersPage;
