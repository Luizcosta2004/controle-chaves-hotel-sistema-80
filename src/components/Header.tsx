import { Menu, Download, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/db";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: "Todas as alterações foram salvas com sucesso!",
    });
  };

  const handleExport = async () => {
    try {
      const [chaves, hospedes, historico] = await Promise.all([
        db.getChaves(),
        db.getHospedes(),
        db.getHistorico()
      ]);

      const data = {
        chaves,
        hospedes,
        historico,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hotel-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Sucesso",
        description: "Dados exportados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!data.chaves || !data.hospedes || !data.historico) {
          throw new Error('Arquivo inválido');
        }

        await Promise.all([
          db.setChaves(data.chaves),
          db.setHospedes(data.hospedes),
          localStorage.setItem('hotel_historico', JSON.stringify(data.historico))
        ]);

        toast({
          title: "Sucesso",
          description: "Dados importados com sucesso! A página será recarregada.",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao importar os dados. Verifique se o arquivo é válido.",
          variant: "destructive",
        });
      }
    };

    input.click();
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="bg-white hover:bg-gray-100"
              onClick={handleImport}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button 
              variant="outline"
              className="bg-white hover:bg-gray-100"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleSave}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;