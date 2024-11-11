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
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hospedes = [] } = useQuery({
    queryKey: ["hospedes"],
    queryFn: db.getHospedes,
  });

  const handleCheckout = async (hospede: Hospede) => {
    const hospedeAtualizado = {
      ...hospede,
      status: "checkout" as StatusHospede,
      dataSaida: new Date().toISOString().split('T')[0],
    };

    const novosHospedes = hospedes.map((h: Hospede) =>
      h.id === hospede.id ? hospedeAtualizado : h
    );

    await db.setHospedes(novosHospedes);
    await db.addHistorico({
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: "hospede_checkout",
      descricao: `Hóspede ${hospede.nome} realizou check-out`,
      quarto: hospede.quarto,
      hospede: hospede.nome,
    });

    queryClient.invalidateQueries({ queryKey: ["hospedes"] });
    queryClient.invalidateQueries({ queryKey: ["historico"] });

    toast({
      title: "Sucesso",
      description: "Check-out realizado com sucesso!",
    });
  };

  const adicionarHospede = async () => {
    if (!novoHospede.nome || !novoHospede.quarto || !novoHospede.status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let novosHospedes;
    if (novoHospede.id) {
      // Editar hóspede existente
      novosHospedes = hospedes.map((h: Hospede) =>
        h.id === novoHospede.id ? { ...h, ...novoHospede } : h
      );
    } else {
      // Adicionar novo hóspede
      const hospede: Hospede = {
        id: Date.now().toString(),
        nome: novoHospede.nome,
        documento: "",
        telefone: "",
        email: "",
        quarto: novoHospede.quarto,
        status: novoHospede.status as StatusHospede,
        observacao: novoHospede.observacao,
        dataEntrada: novoHospede.dataEntrada || new Date().toISOString().split('T')[0],
        dataSaida: novoHospede.dataSaida || "",
      };
      novosHospedes = [...hospedes, hospede];
    }

    await db.setHospedes(novosHospedes);
    await db.addHistorico({
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: novoHospede.id ? "hospede_editado" : "hospede_checkin",
      descricao: novoHospede.id 
        ? `Hóspede ${novoHospede.nome} editado`
        : `Hóspede ${novoHospede.nome} realizou check-in`,
      quarto: novoHospede.quarto,
      hospede: novoHospede.nome,
    });

    queryClient.invalidateQueries({ queryKey: ["hospedes"] });
    queryClient.invalidateQueries({ queryKey: ["historico"] });
    
    setNovoHospede({});
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: novoHospede.id 
        ? "Hóspede editado com sucesso!"
        : "Hóspede cadastrado com sucesso!",
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

  const editarHospede = (hospede: Hospede) => {
    setNovoHospede(hospede);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Hóspedes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => setNovoHospede({})}>
              <Plus size={20} />
              Novo Hóspede
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {novoHospede.id ? "Editar Hóspede" : "Cadastrar Novo Hóspede"}
              </DialogTitle>
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
        onEditar={editarHospede}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Hospedes;
