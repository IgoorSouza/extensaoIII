import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/use-auth";
import { MenuIcon } from "lucide-react";

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { authData, logout } = useAuth();

  if (location.pathname === "/login" || !authData) return null;

  return (
    <header className="fixed top-0 left-0 w-full bg-black shadow-md px-6 py-3 flex items-center justify-between z-20 h-14">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-white hover:bg-slate-700"
        >
          <MenuIcon className="size-5" />
        </Button>
        
        <h1 className="text-xl font-bold text-white">Supermercado Líder</h1>
      </div>
      
      <div className="flex items-center gap-4 text-white">
        <div className="flex flex-col items-end text-sm">
          <span className="font-semibold">{authData.user.name}</span>
          <span className="text-xs text-gray-300">{authData.user.email}</span>
        </div>
        
        <Button onClick={logout} variant="destructive">
          Sair
        </Button>
      </div>
    </header>
  );
};

export default TopBar;