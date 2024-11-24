import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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

  return (
    <Button 
      variant="outline"
      className="bg-white hover:bg-gray-100"
      onClick={handleExport}
    >
      <Download className="h-4 w-4 mr-2" />
      Exportar
    </Button>
  );
};