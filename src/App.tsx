import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Painel from "./pages/Painel";
import Chaves from "./pages/Chaves";
import Hospedes from "./pages/Hospedes";
import QRCode from "./pages/QRCode";
import Historico from "./pages/Historico";
import Sobre from "./pages/Sobre";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/painel" replace />} />
            <Route path="/painel" element={<Painel />} />
            <Route path="/chaves" element={<Chaves />} />
            <Route path="/hospedes" element={<Hospedes />} />
            <Route path="/qrcode" element={<QRCode />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/sobre" element={<Sobre />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;