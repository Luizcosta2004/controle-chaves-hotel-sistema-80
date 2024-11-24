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
import { useState } from "react";
import { SettingsDialog } from "./settings/SettingsDialog";
import { ExportButton } from "./header/ExportButton";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);

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
          <div className="flex items-center gap-2">
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
                <DropdownMenuItem onClick={() => navigate("/sobre")}>
                  Informações do Programa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSave}>
                  Salvar Alterações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="bg-white hover:bg-gray-100"
              onClick={() => setSettingsOpen(true)}
            >
              Configurações
            </Button>
            <ExportButton />
          </div>
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};

export default Header;