import {
  CumulMensuel,
  SeuilCompletion,
  TotalParDepartement,
  TotalParNiveauMaturite,
} from '../../metier/observatoire.js';
import { codeDepartement } from '../../metier/referentielDepartements.js';
import { AdaptateurObservatoireMSC } from './adaptateurObservatoireMSC.js';

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

const cumulLineaire = (debut: number, fin: number): CumulMensuel[] =>
  MOIS.map((mois, index) => ({ mois, cumul: Math.round(debut + ((fin - debut) * index) / (MOIS.length - 1)) }));

const repartitionFictive = (maximum: number): TotalParDepartement[] =>
  codeDepartement.map((departement, index) => ({ departement, total: (index * 37) % (maximum + 1) }));

const COMPLETIONS: Record<SeuilCompletion, number> = { 50: 1894, 80: 912, 100: 347 };

export class AdaptateurObservatoireMSCMemoire implements AdaptateurObservatoireMSC {
  totalTestsMaturite = async (): Promise<number> => 13815;

  testsMaturiteParNiveau = async (): Promise<TotalParNiveauMaturite[]> => [
    { niveau: 'Insuffisant', total: 2349 },
    { niveau: 'Émergent', total: 5526 },
    { niveau: 'Intermédiaire', total: 3730 },
    { niveau: 'Confirmé', total: 1796 },
    { niveau: 'Optimal', total: 414 },
  ];

  totalTestsSensibilisation = async (): Promise<number> => 57031;

  cumulMensuelTestsSensibilisation = async (): Promise<CumulMensuel[]> => cumulLineaire(35800, 57031);

  totalParcoursRejoints = async (): Promise<number> => 7036;

  totalCyberdepartsValides = async (): Promise<number> => 5292;

  cumulMensuelCyberdepartsValides = async (): Promise<CumulMensuel[]> => cumulLineaire(1150, 5292);

  cyberdepartsValidesParDepartement = async (): Promise<TotalParDepartement[]> => repartitionFictive(252);

  totalCompletions = async (seuil: SeuilCompletion): Promise<number> => COMPLETIONS[seuil];

  cumulMensuelCompletions = async (seuil: SeuilCompletion): Promise<CumulMensuel[]> =>
    cumulLineaire(Math.round(COMPLETIONS[seuil] / 5), COMPLETIONS[seuil]);

  completionsParDepartement = async (seuil: SeuilCompletion): Promise<TotalParDepartement[]> =>
    repartitionFictive(Math.round(COMPLETIONS[seuil] / 20));

  dateDerniereExecution = async (): Promise<Date | null> => new Date('2026-09-30T00:00:00.000Z');
}
