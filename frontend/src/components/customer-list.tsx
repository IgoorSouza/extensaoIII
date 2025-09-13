import React, { useState } from "react";
import { type Customer } from "../types/customer";
import { type Purchase } from "../types/purchase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import qrcode from "../assets/qr-code.png";
import copy from "../assets/copy.png";
import whatsapp from "../assets/whatsapp.png";

interface CustomerListProps {
  customers: Customer[];
  purchases: Purchase[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  purchases,
  onEdit,
  onDelete,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pixValue, setPixValue] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [pixCode, setPixCode] = useState("");

  const getCustomerTotalPurchases = (customerId: string) => {
    return purchases
      .filter((p) => p.customerId === customerId)
      .reduce((acc, p) => acc + p.value, 0);
  };

  const generatePix = async () => {
    if (!pixValue || Number(pixValue) <= 0 || !selectedCustomer) return;

    setQrCodeUrl(qrcode);
    setPixCode("código copia e cola aqui");
  };

  const handleOpenModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPixValue("");
    setQrCodeUrl("");
    setPixCode("");
    setIsModalOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum cliente cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleOpenModal(customer)}
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.cpf}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell
                  className="text-center space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="outline" onClick={() => onEdit(customer)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(customer.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-3/4 overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p>
                  <strong>Nome:</strong> {selectedCustomer.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedCustomer.email}
                </p>
                <p>
                  <strong>CPF:</strong> {selectedCustomer.cpf}
                </p>
                <p>
                  <strong>Telefone:</strong> {selectedCustomer.phone}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">
                  Total em compras:{" "}
                  {getCustomerTotalPurchases(
                    selectedCustomer.id
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h3>
              </div>

              <div className="space-y-3 mt-6">
                <label className="text-sm font-medium">Valor do PIX</label>
                <Input
                  type="number"
                  className="mt-1"
                  step="0.01"
                  value={pixValue}
                  onChange={(e) => setPixValue(e.target.value)}
                  placeholder="Digite o valor"
                />
                <Button onClick={generatePix}>Gerar PIX</Button>

                {qrCodeUrl && pixCode && (
                  <div className="space-y-3 mt-4 flex flex-col">
                    <div className="flex justify-center">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code PIX"
                        className="w-48 h-48 border rounded"
                      />
                    </div>

                    <div className="relative">
                      <Input readOnly value={pixCode} className="pr-10" />
                      <img
                        src={copy}
                        alt="Copiar código"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition"
                        onClick={() => navigator.clipboard.writeText(pixCode)}
                      />
                    </div>

                    <Button variant="outline" className="self-center">
                      <a
                        href={`https://wa.me/${selectedCustomer.phone
                          .replaceAll(" ", "")
                          .replaceAll(
                            "-",
                            ""
                          )}?text=Olá, esse é seu código PIX: *código pix*`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex"
                      >
                        Enviar código via WhatsApp{" "}
                        <img src={whatsapp} className="size-5 ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
