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
    const printContent = historico.map((item: HistoricoType) => `
      Data: ${new Date(item.data).toLocaleString()}
      Descrição: ${item.descricao}
      Quarto: ${item.quarto || '-'}
      Hóspede: ${item.hospede || '-'}
      ----------------------------------------
    `).join('\n');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório de Histórico</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { color: #4F46E5; margin-bottom: 20px; }
              .entry { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
              .label { font-weight: bold; }
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>Relatório de Histórico</h1>
            ${historico.map((item: HistoricoType) => `
              <div class="entry">
                <div><span class="label">Data:</span> ${new Date(item.data).toLocaleString()}</div>
                <div><span class="label">Descrição:</span> ${item.descricao}</div>
                <div><span class="label">Quarto:</span> ${item.quarto || '-'}</div>
                <div><span class="label">Hóspede:</span> ${item.hospede || '-'}</div>
              </div>
            `).join('')}
            <script>
              window.onload = function() {
                window.print();
              }
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