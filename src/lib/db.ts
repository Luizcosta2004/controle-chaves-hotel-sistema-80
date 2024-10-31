// Simulating a database with localStorage
const DB_KEYS = {
  chaves: 'hotel_chaves',
  hospedes: 'hotel_hospedes',
  historico: 'hotel_historico'
};

export const db = {
  getChaves: async () => {
    const data = localStorage.getItem(DB_KEYS.chaves);
    return data ? JSON.parse(data) : [];
  },
  
  setChaves: async (chaves: any[]) => {
    localStorage.setItem(DB_KEYS.chaves, JSON.stringify(chaves));
    return chaves;
  },
  
  getHospedes: async () => {
    const data = localStorage.getItem(DB_KEYS.hospedes);
    return data ? JSON.parse(data) : [];
  },
  
  setHospedes: async (hospedes: any[]) => {
    localStorage.setItem(DB_KEYS.hospedes, JSON.stringify(hospedes));
    return hospedes;
  },
  
  getHistorico: async () => {
    const data = localStorage.getItem(DB_KEYS.historico);
    return data ? JSON.parse(data) : [];
  },
  
  addHistorico: async (historico: any) => {
    const atual = await db.getHistorico();
    const novo = [historico, ...atual];
    localStorage.setItem(DB_KEYS.historico, JSON.stringify(novo));
    return novo;
  }
};