import { TotalParNiveauMaturite } from '../../metier/observatoire.js';

export interface AdaptateurObservatoireMSC {
  totalTestsMaturite(): Promise<number>;
  testsMaturiteParNiveau(): Promise<TotalParNiveauMaturite[]>;
  dateDerniereExecution(): Promise<Date | null>;
}
