import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const TopBar: React.FC = () => {
  const location = useLocation();

  const links = [
    { label: "Clientes", path: "/" },
    { label: "Compras", path: "/purchases" },
    { label: "Pagamentos", path: "/payments" }, // Adicionado
  ];

  return (
    <header className="w-full bg-black shadow-md px-10 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-white">Supermercado Líder</h1>
      <nav className="flex gap-2">
        {links.map((link) => (
          <Link key={link.path} to={link.path}>
            <Button
              className={
                location.pathname === link.path
                  ? "bg-white text-black hover:bg-slate-200"
                  : "bg-slate-600 hover:bg-slate-700"
              }
            >
              {link.label}
            </Button>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default TopBar;