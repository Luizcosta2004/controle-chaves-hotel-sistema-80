import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Historico } from "@/types/historico";
import { isNativePlatform } from "@/capacitor";
import { saveFile } from "@/utils/fileSystem";

interface PrintButtonProps {
  historico: Historico[];
}

export const PrintButton = ({ historico }: PrintButtonProps) => {
  const { toast } = useToast();

  const handlePrint = async () => {
    console.log("Iniciando impressão do relatório");
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Histórico</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              padding: 20px; 
              margin: 0;
            }
            h1 { 
              color: #4F46E5; 
              margin-bottom: 20px; 
              text-align: center;
            }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td { 
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th { 
              background-color: #f3f4f6;
              font-weight: bold;
            }
            tr:nth-child(even) { 
              background-color: #f9fafb;
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Histórico</h1>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Quarto</th>
                <th>Hóspede</th>
              </tr>
            </thead>
            <tbody>
              ${historico.map((item: Historico) => `
                <tr>
                  <td>${new Date(item.data).toLocaleString()}</td>
                  <td>${item.descricao}</td>
                  <td>${item.quarto || '-'}</td>
                  <td>${item.hospede || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    if (isNativePlatform) {
      try {
        const printPath = '/storage/emulated/0/Download/HotelKeys/temp_print.html';
        const blob = new Blob([printContent], { type: 'text/html' });
        
        await saveFile(blob, printPath);
        window.open(`file://${printPath}`, '_system');
        
        toast({
          title: "Sucesso",
          description: "Arquivo de impressão gerado com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao gerar arquivo de impressão:', error);
        toast({
          title: "Erro",
          description: "Erro ao gerar arquivo de impressão.",
          variant: "destructive",
        });
      }
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    }
  };

  return (
    <Button 
      onClick={handlePrint}
      className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
    >
      <Printer className="h-5 w-5" />
      Imprimir Relatório
    </Button>
  );
};