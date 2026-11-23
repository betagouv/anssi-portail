import axios from 'axios';

export type PointMensuel = { mois: string; valeur: number };

export type DonnéesObservatoire = {
  dateDerniereMiseAJour: Date | null;
  services: {
    total: number;
    cumulMensuel: PointMensuel[];
    parNiveauSecurite: { niveauSecurite: string; total: number }[];
  };
  mesuresFaites: { parMois: PointMensuel[] };
  homologations: { cumulMensuel: PointMensuel[] };
};

type APIObservatoire = {
  dateDerniereMiseAJour: string | null;
  services: {
    total: number;
    cumulMensuel: { mois: string; cumul: number }[];
    parNiveauSecurite: { niveauSecurite: string; total: number }[];
  };
  mesuresFaites: { parMois: { mois: string; total: number }[] };
  homologations: { cumulMensuel: { mois: string; cumul: number }[] };
};

export const récupèreDonnéesObservatoire = async (): Promise<DonnéesObservatoire> => {
  const { data } = await axios.get<APIObservatoire>('/api/observatoire');
  return {
    dateDerniereMiseAJour: data.dateDerniereMiseAJour ? new Date(data.dateDerniereMiseAJour) : null,
    services: {
      total: data.services.total,
      cumulMensuel: data.services.cumulMensuel.map(({ mois, cumul }) => ({ mois, valeur: cumul })),
      parNiveauSecurite: data.services.parNiveauSecurite,
    },
    mesuresFaites: { parMois: data.mesuresFaites.parMois.map(({ mois, total }) => ({ mois, valeur: total })) },
    homologations: {
      cumulMensuel: data.homologations.cumulMensuel.map(({ mois, cumul }) => ({ mois, valeur: cumul })),
    },
  };
};
