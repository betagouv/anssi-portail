import { TotalParNiveauMaturite } from '../../metier/observatoire.js';
import { AdaptateurObservatoireMSC } from './adaptateurObservatoireMSC.js';

export class AdaptateurObservatoireMSCMemoire implements AdaptateurObservatoireMSC {
  totalTestsMaturite = async (): Promise<number> => 13815;

  testsMaturiteParNiveau = async (): Promise<TotalParNiveauMaturite[]> => [
    { niveau: 'Insuffisant', total: 2349 },
    { niveau: 'Émergent', total: 5526 },
    { niveau: 'Intermédiaire', total: 3730 },
    { niveau: 'Confirmé', total: 1796 },
    { niveau: 'Optimal', total: 414 },
  ];

  dateDerniereExecution = async (): Promise<Date | null> => new Date('2026-09-30T00:00:00.000Z');
}
