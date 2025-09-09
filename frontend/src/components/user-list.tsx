import React, { useState } from "react";
import { type User } from "../types/user";
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

interface UserListProps {
  users: User[];
  purchases: Purchase[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  purchases,
  onEdit,
  onDelete,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pixValue, setPixValue] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [pixCode, setPixCode] = useState("");

  const getUserTotalPurchases = (userId: string) => {
    return purchases
      .filter((p) => p.user_id === userId)
      .reduce((acc, p) => acc + p.value, 0);
  };

  const generatePix = async () => {
    if (!pixValue || Number(pixValue) <= 0 || !selectedUser) return;

    setQrCodeUrl(qrcode);
    setPixCode("código copia e cola aqui");
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum usuário cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleOpenModal(user)}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell
                  className="text-center space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="outline" onClick={() => onEdit(user)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(user.id)}
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

          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p>
                  <strong>Nome:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>CPF:</strong> {selectedUser.cpf}
                </p>
                <p>
                  <strong>Telefone:</strong> {selectedUser.phone}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">
                  Total em compras:{" "}
                  {getUserTotalPurchases(selectedUser.id).toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
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
                        href={`https://wa.me/${selectedUser.phone
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
