import { AdaptateurObservatoireMenaceCyber } from '../infra/observatoireDesDonnees/adaptateurObservatoireMenaceCyberMemoire.js';
import { AdaptateurObservatoireMSS } from '../infra/observatoireDesDonnees/adaptateurObservatoireMSS.js';
import { DonneesObservatoireProjets } from './observatoire.js';

const SANS_FILTRE = {};
const source = 'MonServiceSécurisé';

export class ServiceObservatoire {
  private adaptateurObservatoireMSS: AdaptateurObservatoireMSS;
  private adaptateurObservatoireMenaceCyber: AdaptateurObservatoireMenaceCyber;

  constructor({
    adaptateurObservatoireMSS,
    adaptateurObservatoireMenaceCyber,
  }: {
    adaptateurObservatoireMSS: AdaptateurObservatoireMSS;
    adaptateurObservatoireMenaceCyber: AdaptateurObservatoireMenaceCyber;
  }) {
    this.adaptateurObservatoireMSS = adaptateurObservatoireMSS;
    this.adaptateurObservatoireMenaceCyber = adaptateurObservatoireMenaceCyber;
  }

  async donneesProjets(): Promise<DonneesObservatoireProjets> {
    const [total, cumulMensuel, parNiveauSecurite, mesuresFaitesParMois, cumulMensuelHomologations, date] =
      await Promise.all([
        this.adaptateurObservatoireMSS.totalServices(SANS_FILTRE),
        this.adaptateurObservatoireMSS.cumulMensuelServices(SANS_FILTRE),
        this.adaptateurObservatoireMSS.servicesParNiveauSecurite(SANS_FILTRE),
        this.adaptateurObservatoireMSS.mesuresFaitesParMois(SANS_FILTRE),
        this.adaptateurObservatoireMSS.cumulMensuelHomologations(SANS_FILTRE),
        this.adaptateurObservatoireMSS.dateDerniereExecution(),
      ]);

    return {
      services: { date: date!, source, total, cumulMensuel, parNiveauSecurite },
      mesuresFaites: { date: date!, source, parMois: mesuresFaitesParMois },
      homologations: { date: date!, source, cumulMensuel: cumulMensuelHomologations },
    };
  }

  donneesMenaceCyber() {
    return this.adaptateurObservatoireMenaceCyber.donnees();
  }
}
