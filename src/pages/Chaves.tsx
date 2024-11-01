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
import { Chave } from "@/types/chave";
import { useToast } from "@/components/ui/use-toast";
import { FormularioChave } from "@/components/chaves/FormularioChave";
import { TabelaChaves } from "@/components/chaves/TabelaChaves";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";

const Chaves = () => {
  const [novaChave, setNovaChave] = useState<Partial<Chave>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chaves = [] } = useQuery({
    queryKey: ["chaves"],
    queryFn: db.getChaves,
  });

  const adicionarChave = async () => {
    if (!novaChave.numero || !novaChave.andar || !novaChave.tipo || !novaChave.status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let novasChaves;
    if (novaChave.id) {
      novasChaves = chaves.map((c: Chave) =>
        c.id === novaChave.id ? { ...c, ...novaChave } : c
      );
    } else {
      const chave: Chave = {
        id: Date.now().toString(),
        numero: novaChave.numero,
        andar: novaChave.andar,
        tipo: novaChave.tipo,
        status: novaChave.status,
        observacao: novaChave.observacao,
      };
      novasChaves = [...chaves, chave];
    }

    await db.setChaves(novasChaves);
    await db.addHistorico({
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: novaChave.id ? "chave_editada" : "chave_cadastrada",
      descricao: novaChave.id 
        ? `Chave ${novaChave.numero} editada`
        : `Chave ${novaChave.numero} cadastrada`,
      quarto: novaChave.numero,
    });

    queryClient.invalidateQueries({ queryKey: ["chaves"] });
    queryClient.invalidateQueries({ queryKey: ["historico"] });
    
    setNovaChave({});
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: novaChave.id 
        ? "Chave editada com sucesso!"
        : "Chave cadastrada com sucesso!",
    });
  };

  const excluirChave = async (id: string) => {
    const chave = chaves.find((c: Chave) => c.id === id);
    const novasChaves = chaves.filter((c: Chave) => c.id !== id);
    
    await db.setChaves(novasChaves);
    await db.addHistorico({
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: "chave_excluida",
      descricao: `Chave ${chave?.numero} excluída`,
      quarto: chave?.numero,
    });

    queryClient.invalidateQueries({ queryKey: ["chaves"] });
    queryClient.invalidateQueries({ queryKey: ["historico"] });
    
    toast({
      title: "Sucesso",
      description: "Chave excluída com sucesso!",
    });
  };

  const editarChave = (chave: Chave) => {
    setNovaChave(chave);
    setDialogOpen(true);
  };

  // Add event listener for keyboard events
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const key = event.key?.toLowerCase();
    if (key === 'escape' && dialogOpen) {
      setDialogOpen(false);
    }
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Chaves</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => setNovaChave({})}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Chave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {novaChave.id ? "Editar Chave" : "Cadastrar Nova Chave"}
              </DialogTitle>
            </DialogHeader>
            <FormularioChave
              novaChave={novaChave}
              setNovaChave={setNovaChave}
              onSubmit={adicionarChave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TabelaChaves 
        chaves={chaves}
        onExcluir={excluirChave}
        onEditar={editarChave}
      />
    </div>
  );
};

export default Chaves;