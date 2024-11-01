import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Historico as HistoricoType } from "@/types/historico";
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

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-2xl font-bold mb-4">Histórico de Movimentação</h1>
      
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