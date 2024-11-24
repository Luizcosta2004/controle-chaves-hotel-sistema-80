import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { TabelaHistorico } from "@/components/historico/TabelaHistorico";
import { PrintButton } from "@/components/historico/PrintButton";

const Historico = () => {
  const { data: historico = [] } = useQuery({
    queryKey: ["historico"],
    queryFn: db.getHistorico,
  });

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histórico de Movimentação</h1>
        <PrintButton historico={historico} />
      </div>
      
      <TabelaHistorico historico={historico} />
    </div>
  );
};

export default Historico;