import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import QRCodeGenerator from "react-qr-code";
import { db } from "@/lib/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QRCodeReader } from "@/components/qrcode/QRCodeReader";

const QRCode = () => {
  const [selectedChave, setSelectedChave] = useState("");
  const [selectedHospede, setSelectedHospede] = useState("");
  const [operationType, setOperationType] = useState<"retirada" | "entrega">("retirada");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chaves = [] } = useQuery({
    queryKey: ["chaves"],
    queryFn: db.getChaves,
  });

  const { data: hospedes = [] } = useQuery({
    queryKey: ["hospedes"],
    queryFn: db.getHospedes,
  });

  const generateQRValue = () => {
    if (!selectedChave || !selectedHospede) return "";
    return JSON.stringify({
      chaveId: selectedChave,
      hospedeId: selectedHospede,
      timestamp: new Date().toISOString(),
    });
  };

  const handleScan = async (result: any) => {
    try {
      const data = JSON.parse(result.text);
      const chave = chaves.find((c: any) => c.id === data.chaveId);
      const hospede = hospedes.find((h: any) => h.id === data.hospedeId);

      if (!chave || !hospede) {
        throw new Error("Chave ou hóspede não encontrado");
      }

      const isReturning = operationType === "entrega";
      const novasChaves = chaves.map((c: any) => {
        if (c.id === chave.id) {
          return {
            ...c,
            status: isReturning ? "disponível" : "em uso",
          };
        }
        return c;
      });

      await db.setChaves(novasChaves);
      await db.addHistorico({
        id: Date.now().toString(),
        data: new Date().toISOString(),
        tipo: isReturning ? "chave_devolvida" : "chave_entregue",
        descricao: isReturning 
          ? `Chave ${chave.numero} devolvida por ${hospede.nome}`
          : `Chave ${chave.numero} retirada por ${hospede.nome}`,
        quarto: chave.numero,
        hospede: hospede.nome,
      });

      queryClient.invalidateQueries({ queryKey: ["chaves"] });
      queryClient.invalidateQueries({ queryKey: ["historico"] });
      
      toast({
        title: "Sucesso",
        description: isReturning 
          ? "Chave devolvida com sucesso!"
          : "Chave retirada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "QR Code inválido ou expirado.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-2xl font-bold mb-6">Geração e Leitura de QR Code</h1>
      
      <Tabs defaultValue="gerar" className="w-full">
        <TabsList className="mb-4 bg-primary">
          <TabsTrigger value="gerar" className="data-[state=active]:bg-white">
            Gerar QR Code
          </TabsTrigger>
          <TabsTrigger value="ler" className="data-[state=active]:bg-white">
            Ler QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gerar" className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-4">
            <div className="space-y-2">
              <Label>Selecione a Chave</Label>
              <Select onValueChange={setSelectedChave} value={selectedChave}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione uma chave" />
                </SelectTrigger>
                <SelectContent>
                  {chaves
                    .filter((c: any) => c.status === "disponível")
                    .map((chave: any) => (
                      <SelectItem key={chave.id} value={chave.id}>
                        Chave {chave.numero} - {chave.status}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Selecione o Hóspede</Label>
              <Select onValueChange={setSelectedHospede} value={selectedHospede}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione um hóspede" />
                </SelectTrigger>
                <SelectContent>
                  {hospedes
                    .filter((h: any) => h.status === "ativo")
                    .map((hospede: any) => (
                      <SelectItem key={hospede.id} value={hospede.id}>
                        {hospede.nome} - Quarto {hospede.quarto}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {generateQRValue() && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeGenerator value={generateQRValue()} size={256} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="ler">
          <QRCodeReader
            operationType={operationType}
            setOperationType={setOperationType}
            onScan={handleScan}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRCode;