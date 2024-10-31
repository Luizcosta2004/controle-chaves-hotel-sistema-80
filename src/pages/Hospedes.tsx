import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Hospede, StatusHospede } from "@/types/hospede";
import { useToast } from "@/components/ui/use-toast";
import { FormularioHospede } from "@/components/hospedes/FormularioHospede";
import { TabelaHospedes } from "@/components/hospedes/TabelaHospedes";

const Hospedes = () => {
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [novoHospede, setNovoHospede] = useState<Partial<Hospede>>({});
  const { toast } = useToast();

  const adicionarHospede = () => {
    if (!novoHospede.nome || !novoHospede.documento || !novoHospede.quarto || !novoHospede.status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const hospede: Hospede = {
      id: Date.now().toString(),
      nome: novoHospede.nome,
      documento: novoHospede.documento,
      telefone: novoHospede.telefone || "",
      email: novoHospede.email || "",
      quarto: novoHospede.quarto,
      status: novoHospede.status as StatusHospede,
      observacao: novoHospede.observacao,
      dataEntrada: novoHospede.dataEntrada || new Date().toISOString().split('T')[0],
      dataSaida: novoHospede.dataSaida || "",
    };

    setHospedes([...hospedes, hospede]);
    setNovoHospede({});
    toast({
      title: "Sucesso",
      description: "Hóspede cadastrado com sucesso!",
    });
  };

  const excluirHospede = (id: string) => {
    setHospedes(hospedes.filter((hospede) => hospede.id !== id));
    toast({
      title: "Sucesso",
      description: "Hóspede excluído com sucesso!",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Hóspedes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Novo Hóspede
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Hóspede</DialogTitle>
            </DialogHeader>
            <FormularioHospede
              novoHospede={novoHospede}
              setNovoHospede={setNovoHospede}
              onSubmit={adicionarHospede}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TabelaHospedes 
        hospedes={hospedes}
        onExcluir={excluirHospede}
      />
    </div>
  );
};

export default Hospedes;