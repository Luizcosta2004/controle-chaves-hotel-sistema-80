import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Hospede } from "@/types/hospede";

interface TabelaHospedesProps {
  hospedes: Hospede[];
  onExcluir: (id: string) => void;
  onEditar: (hospede: Hospede) => void;
}

export function TabelaHospedes({ hospedes, onExcluir, onEditar }: TabelaHospedesProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Quarto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data Entrada</TableHead>
            <TableHead>Data Saída</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospedes.map((hospede) => (
            <TableRow key={hospede.id}>
              <TableCell>{hospede.nome}</TableCell>
              <TableCell>{hospede.quarto}</TableCell>
              <TableCell>{hospede.status}</TableCell>
              <TableCell>{hospede.dataEntrada}</TableCell>
              <TableCell>{hospede.dataSaida}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditar(hospede)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onExcluir(hospede.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}