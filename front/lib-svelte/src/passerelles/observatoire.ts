import axios from 'axios';

export type PointMensuel = { mois: string; valeur: number };

type DonneesObservatoire<T> = T & {
  date: Date | null;
  source: string;
};

export type DonnéesObservatoire = {
  projets: {
    services: DonneesObservatoire<{
      total: number;
      cumulMensuel: PointMensuel[];
      parNiveauSecurite: { niveauSecurite: string; total: number }[];
    }>;
    mesuresFaites: DonneesObservatoire<{ parMois: PointMensuel[] }>;
    homologations: DonneesObservatoire<{ cumulMensuel: PointMensuel[] }>;
  };
};

type DonneesAPIObservatoire<T> = T & {
  date: string | null;
  source: string;
};

type APIObservatoire = {
  projets: {
    services: DonneesAPIObservatoire<{
      total: number;
      cumulMensuel: { mois: string; cumul: number }[];
      parNiveauSecurite: { niveauSecurite: string; total: number }[];
    }>;
    mesuresFaites: DonneesAPIObservatoire<{ parMois: { mois: string; total: number }[] }>;
    homologations: DonneesAPIObservatoire<{ cumulMensuel: { mois: string; cumul: number }[] }>;
  };
};

const enDate = (date: string | null) => (date ? new Date(date) : null);

export const récupèreDonnéesObservatoire = async (): Promise<DonnéesObservatoire> => {
  const { data } = await axios.get<APIObservatoire>('/api/observatoire');
  return {
    projets: {
      services: {
        ...data.projets.services,
        date: enDate(data.projets.services.date),
        cumulMensuel: data.projets.services.cumulMensuel.map(({ mois, cumul }) => ({ mois, valeur: cumul })),
      },
      mesuresFaites: {
        ...data.projets.mesuresFaites,
        date: enDate(data.projets.mesuresFaites.date),
        parMois: data.projets.mesuresFaites.parMois.map(({ mois, total }) => ({ mois, valeur: total })),
      },
      homologations: {
        ...data.projets.homologations,
        date: enDate(data.projets.homologations.date),
        cumulMensuel: data.projets.homologations.cumulMensuel.map(({ mois, cumul }) => ({ mois, valeur: cumul })),
      },
    },
  };
};
