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
import { Chave } from "@/types/chave";

interface TabelaChavesProps {
  chaves: Chave[];
  onExcluir: (id: string) => void;
  onEditar: (chave: Chave) => void;
}

export function TabelaChaves({ chaves, onExcluir, onEditar }: TabelaChavesProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Andar</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Observação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chaves.map((chave) => (
            <TableRow key={chave.id}>
              <TableCell>{chave.numero}</TableCell>
              <TableCell>{chave.andar}</TableCell>
              <TableCell>{chave.tipo}</TableCell>
              <TableCell>{chave.status}</TableCell>
              <TableCell>{chave.observacao}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditar(chave)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onExcluir(chave.id)}
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