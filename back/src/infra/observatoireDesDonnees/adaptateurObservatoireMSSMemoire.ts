import {
  AdaptateurObservatoireMSS,
  CumulMensuel,
  TotalMensuel,
  TotalParNiveauSecurite,
} from './adaptateurObservatoireMSS.js';

const MOIS = [
  '2025-10',
  '2025-11',
  '2025-12',
  '2026-01',
  '2026-02',
  '2026-03',
  '2026-04',
  '2026-05',
  '2026-06',
  '2026-07',
  '2026-08',
  '2026-09',
];

const serieLineaire = (debut: number, fin: number): number[] =>
  MOIS.map((_, index) => Math.round(debut + ((fin - debut) * index) / (MOIS.length - 1)));

export class AdaptateurObservatoireMSSMemoire implements AdaptateurObservatoireMSS {
  totalServices = async (): Promise<number> => 21440;

  cumulMensuelServices = async (): Promise<CumulMensuel[]> =>
    serieLineaire(14250, 21440).map((cumul, index) => ({ mois: MOIS[index], cumul }));

  mesuresFaitesParMois = async (): Promise<TotalMensuel[]> =>
    serieLineaire(127000, 208195).map((total, index) => ({ mois: MOIS[index], total }));

  servicesParNiveauSecurite = async (): Promise<TotalParNiveauSecurite[]> => [
    { niveauSecurite: 'Élémentaires', total: 10720 },
    { niveauSecurite: 'Modérés', total: 8040 },
    { niveauSecurite: 'Importants', total: 2680 },
  ];

  cumulMensuelHomologations = async (): Promise<CumulMensuel[]> =>
    serieLineaire(3780, 6710).map((cumul, index) => ({ mois: MOIS[index], cumul }));

  dateDerniereExecution = async (): Promise<Date | null> => new Date('2026-09-30T00:00:00.000Z');
}
