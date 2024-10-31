import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chave, StatusChave } from "@/types/chave";

interface FormularioChaveProps {
  novaChave: Partial<Chave>;
  setNovaChave: (chave: Partial<Chave>) => void;
  onSubmit: () => void;
}

export function FormularioChave({
  novaChave,
  setNovaChave,
  onSubmit,
}: FormularioChaveProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="numero" className="text-right">Número</Label>
        <Input
          id="numero"
          className="col-span-3"
          value={novaChave.numero || ""}
          onChange={(e) =>
            setNovaChave({ ...novaChave, numero: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="andar" className="text-right">Andar</Label>
        <Input
          id="andar"
          className="col-span-3"
          value={novaChave.andar || ""}
          onChange={(e) =>
            setNovaChave({ ...novaChave, andar: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">Tipo</Label>
        <Input
          id="tipo"
          className="col-span-3"
          value={novaChave.tipo || ""}
          onChange={(e) =>
            setNovaChave({ ...novaChave, tipo: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select
          onValueChange={(value) =>
            setNovaChave({ ...novaChave, status: value as StatusChave })
          }
          value={novaChave.status}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disponível">Disponível</SelectItem>
            <SelectItem value="em uso">Em Uso</SelectItem>
            <SelectItem value="manutenção">Manutenção</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="observacao" className="text-right">Observação</Label>
        <Input
          id="observacao"
          className="col-span-3"
          value={novaChave.observacao || ""}
          onChange={(e) =>
            setNovaChave({ ...novaChave, observacao: e.target.value })
          }
        />
      </div>
      <Button onClick={onSubmit} className="ml-auto">
        Salvar
      </Button>
    </div>
  );
}