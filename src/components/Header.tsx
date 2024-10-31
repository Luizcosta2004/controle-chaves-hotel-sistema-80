import { Save, Layout, Key, Users, QrCode, History } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: "Todas as alterações foram salvas com sucesso!",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50 shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate("/painel")}
            >
              <Layout size={20} />
              Painel
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate("/chaves")}
            >
              <Key size={20} />
              Chaves
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate("/hospedes")}
            >
              <Users size={20} />
              Hóspedes
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate("/qrcode")}
            >
              <QrCode size={20} />
              Código QR
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate("/historico")}
            >
              <History size={20} />
              Histórico
            </Button>
          </nav>
          <Button className="flex items-center gap-2" onClick={handleSave}>
            <Save size={20} />
            Salvar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;