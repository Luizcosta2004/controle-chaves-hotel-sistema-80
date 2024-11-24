import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { isNativePlatform } from '@/capacitor';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [printerPath, setPrinterPath] = useState('/dev/usb/lp0');
  const [exportPath, setExportPath] = useState('/storage/emulated/0/Download/HotelKeys');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (isNativePlatform) {
          try {
            const result = await Filesystem.readFile({
              path: 'settings.json',
              directory: Directory.Documents
            });
            const settings = JSON.parse(result.data);
            setPrinterPath(settings.printerPath || '/dev/usb/lp0');
            setExportPath(settings.exportPath || '/storage/emulated/0/Download/HotelKeys');
          } catch (error) {
            console.log('Settings file not found, using defaults');
          }
        } else {
          const savedPrinterPath = localStorage.getItem('printerPath');
          const savedExportPath = localStorage.getItem('exportPath');
          if (savedPrinterPath) setPrinterPath(savedPrinterPath);
          if (savedExportPath) setExportPath(savedExportPath);
        }
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const settings = {
        printerPath,
        exportPath
      };

      if (isNativePlatform) {
        await Filesystem.writeFile({
          path: 'settings.json',
          data: JSON.stringify(settings),
          directory: Directory.Documents,
          recursive: true
        });

        // Create export directory if it doesn't exist
        await Filesystem.mkdir({
          path: exportPath,
          directory: Directory.Documents,
          recursive: true
        });
      } else {
        localStorage.setItem('printerPath', printerPath);
        localStorage.setItem('exportPath', exportPath);
      }

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações. Verifique as permissões.",
        variant: "destructive"
      });
    }
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