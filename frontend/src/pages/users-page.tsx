import React, { useState } from "react";
import { type User } from "../types/user";
import { UserList } from "../components/user-list";
import { UserForm } from "../components/user-form";
import { Button } from "../components/ui/button";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleSave = (user: User) => {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      return exists
        ? prev.map((u) => (u.id === user.id ? user : u))
        : [...prev, user];
    });
    setIsFormOpen(false);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
        <Button onClick={handleAdd}>Adicionar Usuário</Button>
      </div>

      <UserList users={users} purchases={[]} onEdit={handleEdit} onDelete={handleDelete} />

      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSave}
        initialData={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
