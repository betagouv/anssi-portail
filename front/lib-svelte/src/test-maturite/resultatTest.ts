import axios from 'axios';
import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
import type { RepartitionResultatsTestPourUnNiveau } from './ResultatsTest.type';
import type { Serie } from './Serie';

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

export function construisSerie({
  repartitions,
  mode = 'absolu',
}: {
  repartitions: RepartitionResultatsTestPourUnNiveau[];
  mode?: 'absolu' | 'ratio';
}): Serie {
  return niveauxMaturite.map((niveau) => {
    const repartition = repartitions.find(
      (repartition) => repartition.id === niveau.id
    );

    const valeur = {
      absolu: repartition?.totalNombreTests ?? 0,
      ratio: (repartition?.ratio ?? 0) * 100,
    };
    return {
      libelle: niveau.label,
      valeur: valeur[mode],
    };
  });
}
