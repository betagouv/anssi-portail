import axios from 'axios';

const cleStockageLocal = 'idTestMaturite';

export const verifieResultatTestARevendiquer = async () => {
  let idTestMaturite = localStorage.getItem(cleStockageLocal);
  if (idTestMaturite) {
    await axios.put(`/api/resultats-test/${idTestMaturite}`, {});
    localStorage.removeItem(cleStockageLocal);
  }
};
