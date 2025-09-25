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
import type { PaymentFormData } from "../types/payment-form-data";
import { SearchableSelect } from "../components/ui/searchable-select";
import { PaymentForm } from "../components/payment-form";

const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Alice Silva",
    email: "alice@example.com",
    cpf: "11122233344",
    phone: "11988887777",
  },
  {
    id: "cust-2",
    name: "Bob Souza",
    email: "bob@example.com",
    cpf: "55566677788",
    phone: "21999996666",
  },
  {
    id: "cust-3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    cpf: "99988877766",
    phone: "31977775555",
  },
];

const mockPayments: Payment[] = [
  {
    id: "pay-1",
    status: "approved",
    value: 150.75,
    customerId: "cust-1",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    Customer: { name: "Alice Silva", email: "alice@example.com" },
  },
  {
    id: "pay-2",
    status: "pending",
    value: 45.0,
    customerId: "cust-2",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    Customer: { name: "Bob Souza", email: "bob@example.com" },
  },
  {
    id: "pay-3",
    status: "rejected",
    value: 200.0,
    customerId: "cust-1",
    createdAt: new Date().toISOString(),
    Customer: { name: "Alice Silva", email: "alice@example.com" },
  },
];

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
    await new Promise((resolve) => setTimeout(resolve, 50));
    setCustomers(mockCustomers);
  };

  const fetchPayments = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let filteredPayments = mockPayments.map((p) => ({
      ...p,
      Customer: mockCustomers.find((c) => c.id === p.customerId),
    })) as Payment[];

    if (filterCustomerId !== "all-customers") {
      filteredPayments = filteredPayments.filter(
        (p) => p.customerId === filterCustomerId
      );
    }

    const start = filterStartDate ? new Date(filterStartDate).getTime() : 0;
    const end = filterEndDate ? new Date(filterEndDate).getTime() : Infinity;

    filteredPayments = filteredPayments.filter((p) => {
      const paymentTime = new Date(p.createdAt).getTime();
      return paymentTime >= start && paymentTime <= end;
    });

    const totalCount = filteredPayments.length;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPayments = filteredPayments.slice(
      startIndex,
      startIndex + pageSize
    );

    setPayments(paginatedPayments);
    setTotalItems(totalCount);
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

  const handleQrCodeGenerated = (newPaymentData: PaymentFormData) => {
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      status: "pending",
      value: newPaymentData.value,
      customerId: newPaymentData.customerId,
      createdAt: new Date().toISOString(),
      Customer: mockCustomers.find((c) => c.id === newPaymentData.customerId),
    };

    mockPayments.unshift(newPayment);
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
        <Button onClick={handleOpenModal}>Gerar QR Code de Pagamento</Button>
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
        onQrCodeGenerated={handleQrCodeGenerated}
      />
    </div>
  );
};

export default PaymentsPage;
