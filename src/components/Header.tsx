import { Menu, Download, Upload, Save, Settings } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [printerPath, setPrinterPath] = useState(localStorage.getItem('printerPath') || '');
  const [exportPath, setExportPath] = useState(localStorage.getItem('exportPath') || '/storage/emulated/0/Download');

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
      const fileName = `hotel-data-${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${exportPath}/${fileName}`;

      // Usando a API File System do Android
      if (window.webkit?.messageHandlers?.saveFile) {
        window.webkit.messageHandlers.saveFile.postMessage({
          data: blob,
          path: filePath
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Sucesso",
        description: `Dados exportados com sucesso para ${filePath}!`,
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

  const handleSaveSettings = () => {
    localStorage.setItem('printerPath', printerPath);
    localStorage.setItem('exportPath', exportPath);
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
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
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="bg-white hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações do Sistema</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="printer" className="text-right">
                      Caminho da Impressora
                    </Label>
                    <Input
                      id="printer"
                      className="col-span-3"
                      placeholder="/dev/usb/lp0"
                      value={printerPath}
                      onChange={(e) => setPrinterPath(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="export" className="text-right">
                      Pasta de Exportação
                    </Label>
                    <Input
                      id="export"
                      className="col-span-3"
                      placeholder="/storage/emulated/0/Download"
                      value={exportPath}
                      onChange={(e) => setExportPath(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveSettings} className="ml-auto">
                    Salvar Configurações
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;