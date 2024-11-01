import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { QrReader } from "react-qr-reader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QRCodeReaderProps {
  operationType: "retirada" | "entrega";
  setOperationType: (value: "retirada" | "entrega") => void;
  onScan: (result: any) => void;
}

export function QRCodeReader({ operationType, setOperationType, onScan }: QRCodeReaderProps) {
  const [isReading, setIsReading] = useState(true);
  const [tempResult, setTempResult] = useState<any>(null);
  const [scannedResult, setScannedResult] = useState("");

  const handleScan = (result: any) => {
    if (result?.text && isReading) {
      setTempResult(result);
      setIsReading(false);
    }
  };

  const handleConfirm = () => {
    if (tempResult?.text) {
      onScan(tempResult);
      setScannedResult(tempResult.text);
      setTempResult(null);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="mb-4">
        <Label className="mb-2 block">Tipo de Operação</Label>
        <Select 
          onValueChange={(value: "retirada" | "entrega") => setOperationType(value)} 
          value={operationType}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Selecione a operação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retirada">Retirada de Chave</SelectItem>
            <SelectItem value="entrega">Entrega de Chave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isReading ? (
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: "environment" }}
          className="w-full"
          scanDelay={500}
          videoId="qr-video"
        />
      ) : tempResult ? (
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">QR Code detectado!</p>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar Leitura
            </Button>
            <Button 
              onClick={() => {
                setTempResult(null);
                setIsReading(true);
              }}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Button 
            onClick={() => setIsReading(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Ler Novo QR Code
          </Button>
        </div>
      )}
      
      {scannedResult && (
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <Label className="font-semibold">QR Code lido com sucesso!</Label>
        </div>
      )}
    </div>
  );
}