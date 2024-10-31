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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";

const Hospedes = () => {
  const [novoHospede, setNovoHospede] = useState<Partial<Hospede>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hospedes = [] } = useQuery({
    queryKey: ["hospedes"],
    queryFn: db.getHospedes,
  });

  const adicionarHospede = async () => {
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

    const novosHospedes = [...hospedes, hospede];
    await db.setHospedes(novosHospedes);
    await db.addHistorico({
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: "hospede_checkin",
      descricao: `Hóspede ${hospede.nome} realizou check-in`,
      quarto: hospede.quarto,
      hospede: hospede.nome,
    });

    queryClient.invalidateQueries({ queryKey: ["hospedes"] });
    queryClient.invalidateQueries({ queryKey: ["historico"] });
    
    setNovoHospede({});
    toast({
      title: "Sucesso",
      description: "Hóspede cadastrado com sucesso!",
    });
  };

  const excluirHospede = async (id: string) => {
    const hospede = hospedes.find((h: Hospede) => h.id === id);
    const novosHospedes = hospedes.filter((h: Hospede) => h.id !== id);
    
    await db.setHospedes(novosHospedes);
    await db.addHistorico({
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: "hospede_checkout",
      descricao: `Hóspede ${hospede?.nome} realizou check-out`,
      quarto: hospede?.quarto,
      hospede: hospede?.nome,
    });

    queryClient.invalidateQueries({ queryKey: ["hospedes"] });
    queryClient.invalidateQueries({ queryKey: ["historico"] });
    
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