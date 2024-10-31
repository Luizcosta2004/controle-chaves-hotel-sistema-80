import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import QRCodeGenerator from "react-qr-code";
import { QrReader } from "react-qr-reader";

const QRCode = () => {
  const [qrValue, setQrValue] = useState("");
  const [scannedResult, setScannedResult] = useState("");
  const { toast } = useToast();

  const handleScan = (result: any) => {
    if (result) {
      setScannedResult(result?.text);
      toast({
        title: "QR Code Lido",
        description: "QR Code identificado com sucesso!",
      });
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    toast({
      title: "Erro",
      description: "Erro ao ler o QR Code. Tente novamente.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-2xl font-bold mb-6">Geração e Leitura de QR Code</h1>
      
      <Tabs defaultValue="gerar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="gerar">Gerar QR Code</TabsTrigger>
          <TabsTrigger value="ler">Ler QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="gerar" className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="qrValue">Texto para o QR Code</Label>
            <Input
              type="text"
              id="qrValue"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              placeholder="Digite o texto para gerar o QR Code"
            />
          </div>

          {qrValue && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeGenerator value={qrValue} size={256} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="ler" className="space-y-4">
          <div className="max-w-sm mx-auto">
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: "environment" }}
              className="w-full"
            />
            {scannedResult && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <Label className="font-semibold">Resultado:</Label>
                <p className="mt-2">{scannedResult}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRCode;