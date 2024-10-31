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
import { Hospede, StatusHospede } from "@/types/hospede";

interface FormularioHospedeProps {
  novoHospede: Partial<Hospede>;
  setNovoHospede: (hospede: Partial<Hospede>) => void;
  onSubmit: () => void;
}

export function FormularioHospede({
  novoHospede,
  setNovoHospede,
  onSubmit,
}: FormularioHospedeProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nome" className="text-right">Nome</Label>
        <Input
          id="nome"
          className="col-span-3"
          value={novoHospede.nome || ""}
          onChange={(e) =>
            setNovoHospede({ ...novoHospede, nome: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quarto" className="text-right">Quarto</Label>
        <Input
          id="quarto"
          className="col-span-3"
          value={novoHospede.quarto || ""}
          onChange={(e) =>
            setNovoHospede({ ...novoHospede, quarto: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dataEntrada" className="text-right">Data Entrada</Label>
        <Input
          id="dataEntrada"
          type="date"
          className="col-span-3"
          value={novoHospede.dataEntrada || ""}
          onChange={(e) =>
            setNovoHospede({ ...novoHospede, dataEntrada: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dataSaida" className="text-right">Data Saída</Label>
        <Input
          id="dataSaida"
          type="date"
          className="col-span-3"
          value={novoHospede.dataSaida || ""}
          onChange={(e) =>
            setNovoHospede({ ...novoHospede, dataSaida: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select
          onValueChange={(value) =>
            setNovoHospede({ ...novoHospede, status: value as StatusHospede })
          }
          value={novoHospede.status}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="checkout">Checkout</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="observacao" className="text-right">Observação</Label>
        <Input
          id="observacao"
          className="col-span-3"
          value={novoHospede.observacao || ""}
          onChange={(e) =>
            setNovoHospede({ ...novoHospede, observacao: e.target.value })
          }
        />
      </div>
      <Button onClick={onSubmit} className="ml-auto">
        Salvar
      </Button>
    </div>
  );
}