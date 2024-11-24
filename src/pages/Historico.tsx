import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Historico as HistoricoType } from "@/types/historico";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Historico = () => {
  const { data: historico = [] } = useQuery({
    queryKey: ["historico"],
    queryFn: db.getHistorico,
  });

  const handlePrint = () => {
    console.log("Iniciando impressão do relatório");
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
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
              @media print {
                body { padding: 0; }
                h1 { margin-top: 0; }
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
                ${historico.map((item: HistoricoType) => `
                  <tr>
                    <td>${new Date(item.data).toLocaleString()}</td>
                    <td>${item.descricao}</td>
                    <td>${item.quarto || '-'}</td>
                    <td>${item.hospede || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histórico de Movimentação</h1>
        <Button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
        >
          <Printer className="h-5 w-5" />
          Imprimir Relatório
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Quarto</TableHead>
              <TableHead>Hóspede</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historico.map((item: HistoricoType) => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.data).toLocaleString()}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.quarto || '-'}</TableCell>
                <TableCell>{item.hospede || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Historico;