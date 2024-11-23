import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Html5QrcodeScanner } from "html5-qrcode";
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
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState("");

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render((decodedText) => {
        console.log("QR Code detected:", decodedText);
        setScannedResult(decodedText);
        setIsScanning(false);
        onScan({ text: decodedText });
        scanner?.clear();
      }, (error) => {
        console.log("QR Code scan error:", error);
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isScanning, onScan]);

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
      
      {!isScanning ? (
        <div className="text-center">
          <Button 
            onClick={() => setIsScanning(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Iniciar Leitura do QR Code
          </Button>
        </div>
      ) : (
        <div id="qr-reader" className="w-full" />
      )}
      
      {scannedResult && (
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <Label className="font-semibold">QR Code lido com sucesso!</Label>
        </div>
      )}
    </div>
  );
}