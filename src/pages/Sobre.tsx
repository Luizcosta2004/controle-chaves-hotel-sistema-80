const Sobre = () => {
  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Informações do Programa</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Sistema de Controle de Chaves de Hotel</h2>
            <p className="text-gray-600">
              Sistema desenvolvido para gerenciamento de chaves, hóspedes e controle de acesso em hotéis.
            </p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Desenvolvedor</h2>
            <p className="text-gray-600">
              LUIZ Costa
            </p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Versão</h2>
            <p className="text-gray-600">1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobre;