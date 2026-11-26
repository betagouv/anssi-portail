import { CumulMensuel, FiltresObservatoire, TotalMensuel, TotalParNiveauSecurite } from '@metier/observatoire.js';

export interface AdaptateurObservatoireMSS {
  totalServices(filtres: FiltresObservatoire): Promise<number>;
  cumulMensuelServices(filtres: FiltresObservatoire): Promise<CumulMensuel[]>;
  mesuresFaitesParMois(filtres: FiltresObservatoire): Promise<TotalMensuel[]>;
  servicesParNiveauSecurite(filtres: FiltresObservatoire): Promise<TotalParNiveauSecurite[]>;
  cumulMensuelHomologations(filtres: FiltresObservatoire): Promise<CumulMensuel[]>;
  dateDerniereExecution(): Promise<Date | null>;
}
