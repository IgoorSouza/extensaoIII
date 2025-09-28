import { type Customer } from "../types/customer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onEdit,
  onDelete,
}) => {
  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  return (
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
            <TableRow key={customer.id} className="hover:bg-gray-100">
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{formatCpf(customer.cpf)}</TableCell>
              <TableCell>{formatPhone(customer.phone)}</TableCell>
              <TableCell
                className="text-center space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="outline" onClick={() => onEdit(customer)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(customer.id!)}
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
