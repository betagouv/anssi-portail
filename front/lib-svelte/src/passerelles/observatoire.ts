import axios from 'axios';

export type PointMensuel = { mois: string; valeur: number };

type DonneesObservatoire<T> = T & {
  date: Date | null;
  source: string;
};

export type ChiffreCléMenaceCyber = DonneesObservatoire<{ total: string }>;

type IndicateurMenaceCyber =
  'evenementsSecurite' | 'incidents' | 'rançongiciels' | 'fraudesVirement' | 'cyberharcèlements' | 'volsDonnées';

export type TotalParNiveauMaturité = { niveau: string; total: number };

export type SeuilComplétion = 50 | 80 | 100;

export type DonnéesObservatoire = {
  menaceCyber: Record<IndicateurMenaceCyber, ChiffreCléMenaceCyber>;
  organisations: {
    testsMaturité: DonneesObservatoire<{ total: number; parNiveau: TotalParNiveauMaturité[] }>;
    testsSensibilisation: DonneesObservatoire<{ total: number; cumulMensuel: PointMensuel[] }>;
    démarchesInitiées: DonneesObservatoire<{ total: number }>;
    diagnosticsCyberdépart: DonneesObservatoire<{ total: number }>;
    cyberdépartsValidés: DonneesObservatoire<{ total: number; cumulMensuel: PointMensuel[] }>;
    complétions: DonneesObservatoire<{
      parSeuil: { seuil: SeuilComplétion; total: number; cumulMensuel: PointMensuel[] }[];
    }>;
  };
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

type CumulMensuelAPI = { mois: string; cumul: number };

type APIObservatoire = {
  menaceCyber: Record<IndicateurMenaceCyber, DonneesAPIObservatoire<{ total: string }>>;
  organisations: {
    testsMaturite: DonneesAPIObservatoire<{ total: number; parNiveau: TotalParNiveauMaturité[] }>;
    testsSensibilisation: DonneesAPIObservatoire<{ total: number; cumulMensuel: CumulMensuelAPI[] }>;
    demarchesInitiees: DonneesAPIObservatoire<{ total: number }>;
    diagnosticsCyberdepart: DonneesAPIObservatoire<{ total: number }>;
    cyberdepartsValides: DonneesAPIObservatoire<{ total: number; cumulMensuel: CumulMensuelAPI[] }>;
    completions: DonneesAPIObservatoire<{
      parSeuil: { seuil: SeuilComplétion; total: number; cumulMensuel: CumulMensuelAPI[] }[];
    }>;
  };
  projets: {
    services: DonneesAPIObservatoire<{
      total: number;
      cumulMensuel: CumulMensuelAPI[];
      parNiveauSecurite: { niveauSecurite: string; total: number }[];
    }>;
    mesuresFaites: DonneesAPIObservatoire<{ parMois: { mois: string; total: number }[] }>;
    homologations: DonneesAPIObservatoire<{ cumulMensuel: CumulMensuelAPI[] }>;
  };
};

const enDate = (date: string | null) => (date ? new Date(date) : null);

const enPoints = (cumulMensuel: CumulMensuelAPI[]): PointMensuel[] =>
  cumulMensuel.map(({ mois, cumul }) => ({ mois, valeur: cumul }));

export const récupèreDonnéesObservatoire = async (): Promise<DonnéesObservatoire> => {
  const { data } = await axios.get<APIObservatoire>('/api/observatoire');
  const chiffreClé = (chiffre: APIObservatoire['menaceCyber'][IndicateurMenaceCyber]): ChiffreCléMenaceCyber => ({
    ...chiffre,
    date: enDate(chiffre.date),
  });

  return {
    menaceCyber: {
      evenementsSecurite: chiffreClé(data.menaceCyber.evenementsSecurite),
      incidents: chiffreClé(data.menaceCyber.incidents),
      rançongiciels: chiffreClé(data.menaceCyber.rançongiciels),
      fraudesVirement: chiffreClé(data.menaceCyber.fraudesVirement),
      cyberharcèlements: chiffreClé(data.menaceCyber.cyberharcèlements),
      volsDonnées: chiffreClé(data.menaceCyber.volsDonnées),
    },
    organisations: {
      testsMaturité: {
        ...data.organisations.testsMaturite,
        date: enDate(data.organisations.testsMaturite.date),
      },
      testsSensibilisation: {
        ...data.organisations.testsSensibilisation,
        date: enDate(data.organisations.testsSensibilisation.date),
        cumulMensuel: enPoints(data.organisations.testsSensibilisation.cumulMensuel),
      },
      démarchesInitiées: {
        ...data.organisations.demarchesInitiees,
        date: enDate(data.organisations.demarchesInitiees.date),
      },
      diagnosticsCyberdépart: {
        ...data.organisations.diagnosticsCyberdepart,
        date: enDate(data.organisations.diagnosticsCyberdepart.date),
      },
      cyberdépartsValidés: {
        ...data.organisations.cyberdepartsValides,
        date: enDate(data.organisations.cyberdepartsValides.date),
        cumulMensuel: enPoints(data.organisations.cyberdepartsValides.cumulMensuel),
      },
      complétions: {
        ...data.organisations.completions,
        date: enDate(data.organisations.completions.date),
        parSeuil: data.organisations.completions.parSeuil.map((parSeuil) => ({
          ...parSeuil,
          cumulMensuel: enPoints(parSeuil.cumulMensuel),
        })),
      },
    },
    projets: {
      services: {
        ...data.projets.services,
        date: enDate(data.projets.services.date),
        cumulMensuel: enPoints(data.projets.services.cumulMensuel),
      },
      mesuresFaites: {
        ...data.projets.mesuresFaites,
        date: enDate(data.projets.mesuresFaites.date),
        parMois: data.projets.mesuresFaites.parMois.map(({ mois, total }) => ({ mois, valeur: total })),
      },
      homologations: {
        ...data.projets.homologations,
        date: enDate(data.projets.homologations.date),
        cumulMensuel: enPoints(data.projets.homologations.cumulMensuel),
      },
    },
  };
};
