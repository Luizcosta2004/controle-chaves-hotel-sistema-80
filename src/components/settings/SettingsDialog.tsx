import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [printerPath, setPrinterPath] = useState(localStorage.getItem('printerPath') || '');
  const [exportPath, setExportPath] = useState(localStorage.getItem('exportPath') || '/storage/emulated/0/Download/HotelKeys');

  const handleSaveSettings = () => {
    localStorage.setItem('printerPath', printerPath);
    localStorage.setItem('exportPath', exportPath);
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              placeholder="/storage/emulated/0/Download/HotelKeys"
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
  );
};