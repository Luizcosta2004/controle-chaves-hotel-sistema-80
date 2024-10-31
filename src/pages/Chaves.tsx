import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Chave, StatusChave } from "@/types/chave";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Chaves = () => {
  const [chaves, setChaves] = useState<Chave[]>([]);
  const [novaChave, setNovaChave] = useState<Partial<Chave>>({});
  const { toast } = useToast();

  const adicionarChave = () => {
    if (!novaChave.numero || !novaChave.andar || !novaChave.tipo || !novaChave.status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const chave: Chave = {
      id: Date.now().toString(),
      numero: novaChave.numero,
      andar: novaChave.andar,
      tipo: novaChave.tipo,
      status: novaChave.status as StatusChave,
      observacao: novaChave.observacao,
    };

    setChaves([...chaves, chave]);
    setNovaChave({});
    toast({
      title: "Sucesso",
      description: "Chave cadastrada com sucesso!",
    });
  };

  const excluirChave = (id: string) => {
    setChaves(chaves.filter((chave) => chave.id !== id));
    toast({
      title: "Sucesso",
      description: "Chave excluída com sucesso!",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Chaves</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Nova Chave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Chave</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numero" className="text-right">
                  Número
                </Label>
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
                <Label htmlFor="andar" className="text-right">
                  Andar
                </Label>
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
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
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
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
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
                <Label htmlFor="observacao" className="text-right">
                  Observação
                </Label>
                <Input
                  id="observacao"
                  className="col-span-3"
                  value={novaChave.observacao || ""}
                  onChange={(e) =>
                    setNovaChave({ ...novaChave, observacao: e.target.value })
                  }
                />
              </div>
              <Button onClick={adicionarChave} className="ml-auto">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
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
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => excluirChave(chave.id)}
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
    </div>
  );
};

export default Chaves;