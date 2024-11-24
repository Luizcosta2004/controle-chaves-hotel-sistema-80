import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { saveFile } from "@/utils/fileSystem";

export const ExportButton = () => {
  const { toast } = useToast();

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
      const exportPath = localStorage.getItem('exportPath') || '/storage/emulated/0/Download/HotelKeys';
      const fileName = `hotel-data-${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${exportPath}/${fileName}`;

      await saveFile(blob, filePath);

      toast({
        title: "Sucesso",
        description: `Dados exportados com sucesso para ${filePath}!`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro",
        description: "Erro ao exportar os dados. Verifique as configurações de exportação.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const result = e.target?.result;
            if (result) {
              const data = JSON.parse(result as string);
              await Promise.all([
                db.setChaves(data.chaves),
                db.setHospedes(data.hospedes),
                db.setHistorico(data.historico)
              ]);
              toast({
                title: "Sucesso",
                description: "Dados importados com sucesso!",
              });
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Erro",
        description: "Erro ao importar os dados. Verifique o arquivo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline"
        className="bg-white hover:bg-gray-100"
        onClick={handleExport}
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </Button>
      <Button 
        variant="outline"
        className="bg-white hover:bg-gray-100"
        onClick={handleImport}
      >
        <Upload className="h-4 w-4 mr-2" />
        Importar
      </Button>
    </div>
  );
};