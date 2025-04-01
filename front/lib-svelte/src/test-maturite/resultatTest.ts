import axios from 'axios';

const cleStockageLocal = 'idTestMaturite';

export const verifieResultatTestARevendiquer = async () => {
  const idTestMaturite = localStorage.getItem(cleStockageLocal);
  if (idTestMaturite) {
    await axios.put(`/api/resultats-test/${idTestMaturite}`, {});
    localStorage.removeItem(cleStockageLocal);
  }
};

export function enregistreIdResultatTestPourRevendication(id: string) {
  localStorage.setItem(cleStockageLocal, id);
}
