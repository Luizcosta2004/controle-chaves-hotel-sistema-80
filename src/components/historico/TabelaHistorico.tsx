import { Historico } from "@/types/historico";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TabelaHistoricoProps {
  historico: Historico[];
}

export const TabelaHistorico = ({ historico }: TabelaHistoricoProps) => {
  return (
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
          {historico.map((item: Historico) => (
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
  );
};