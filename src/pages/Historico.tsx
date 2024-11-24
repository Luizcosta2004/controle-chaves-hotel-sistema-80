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
import printJS from 'print-js';

const Historico = () => {
  const { data: historico = [] } = useQuery({
    queryKey: ["historico"],
    queryFn: db.getHistorico,
  });

  const handlePrint = () => {
    console.log("Iniciando impressão do relatório");
    
    const printContent = historico.map((item: HistoricoType) => ({
      data: new Date(item.data).toLocaleString(),
      descricao: item.descricao,
      quarto: item.quarto || '-',
      hospede: item.hospede || '-'
    }));

    printJS({
      printable: printContent,
      properties: ['data', 'descricao', 'quarto', 'hospede'],
      type: 'json',
      header: '<h3 class="custom-h3">Relatório de Histórico</h3>',
      headerStyle: 'font-weight: 600; font-size: 24px; margin-bottom: 10px; color: #4F46E5;',
      gridStyle: 'border: 1px solid #ddd; padding: 8px;',
      gridHeaderStyle: 'font-weight: bold; background-color: #f3f4f6;',
      documentTitle: 'Relatório de Histórico',
      targetStyles: ['*']
    });
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