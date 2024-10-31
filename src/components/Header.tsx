import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: "Todas as alterações foram salvas com sucesso!",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary border-b z-50 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white hover:bg-gray-100">
                <Menu className="h-5 w-5" />
                <span className="ml-2">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/painel")}>
                Painel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/chaves")}>
                Chaves
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/hospedes")}>
                Hóspedes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/qrcode")}>
                Código QR
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/historico")}>
                Histórico
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white" 
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;