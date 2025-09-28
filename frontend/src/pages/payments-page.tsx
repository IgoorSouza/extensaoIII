import React, { useState, useEffect } from "react";
import { type Payment } from "../types/payment";
import type { Customer } from "../types/customer";
import { PaymentList } from "../components/payment-list";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SearchableSelect } from "../components/ui/searchable-select";
import { PaymentForm } from "../components/payment-form";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filterCustomerId, setFilterCustomerId] = useState("all-customers");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get<{
        customers: Customer[];
        totalCount: number;
      }>("/customer?pageSize=999");
      setCustomers(data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Erro ao carregar lista de clientes.");
    }
  };

  const fetchPayments = async () => {
    const params = new URLSearchParams();
    if (filterCustomerId !== "all-customers")
      params.append("customerId", filterCustomerId);
    if (filterStartDate) params.append("startDate", filterStartDate);
    if (filterEndDate) params.append("endDate", filterEndDate);
    params.append("page", String(currentPage));
    params.append("pageSize", String(pageSize));

    try {
      const { data } = await axios.get<{
        payments: Payment[];
        totalCount: number;
      }>("/payment", { params });

      setPayments(data.payments);
      setTotalItems(data.totalCount);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Erro ao carregar lista de pagamentos.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [filterCustomerId, filterStartDate, filterEndDate, currentPage, pageSize]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handlePixPaymentCreated = () => {
    fetchPayments();
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const customersWithAllOption = [
    { id: "all-customers", name: "Todos" } as Customer,
    ...customers,
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Pagamentos</h1>
        <Button onClick={handleOpenModal}>Gerar Novo Pagamento</Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <h2 className="text-xl font-bold">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="customerId" className="mb-2">
              Cliente
            </Label>
            <SearchableSelect
              customers={customersWithAllOption}
              value={filterCustomerId}
              onValueChange={(value) => setFilterCustomerId(value)}
              placeholder="Selecione um cliente"
            />
          </div>

          <div>
            <Label htmlFor="startDate" className="mb-2">
              Data Inicial
            </Label>
            <Input
              id="startDate"
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endDate" className="mb-2">
              Data Final
            </Label>
            <Input
              id="endDate"
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <PaymentList payments={payments} customers={customers} />

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">
            Página {currentPage} de {totalPages} • {totalItems} itens
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={
              currentPage === totalPages ||
              totalPages === 0 ||
              currentPage >= totalPages
            }
          >
            Próxima
          </Button>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <PaymentForm
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customers={customers}
        onPixPaymentCreated={handlePixPaymentCreated}
      />
    </div>
  );
};

export default PaymentsPage;
