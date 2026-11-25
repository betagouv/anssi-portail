import { AdaptateurObservatoireMenaceCyber } from '../infra/observatoireDesDonnees/adaptateurObservatoireMenaceCyberMemoire.js';
import { AdaptateurObservatoireMSC } from '../infra/observatoireDesDonnees/adaptateurObservatoireMSC.js';
import { AdaptateurObservatoireMSS } from '../infra/observatoireDesDonnees/adaptateurObservatoireMSS.js';
import { DonneesObservatoireOrganisations, DonneesObservatoireProjets } from './observatoire.js';

const SANS_FILTRE = {};
const source = 'MonServiceSécurisé';
const sourceMSC = 'MesServicesCyber';

export class ServiceObservatoire {
  private adaptateurObservatoireMSS: AdaptateurObservatoireMSS;
  private adaptateurObservatoireMSC: AdaptateurObservatoireMSC;
  private adaptateurObservatoireMenaceCyber: AdaptateurObservatoireMenaceCyber;

  constructor({
    adaptateurObservatoireMSS,
    adaptateurObservatoireMSC,
    adaptateurObservatoireMenaceCyber,
  }: {
    adaptateurObservatoireMSS: AdaptateurObservatoireMSS;
    adaptateurObservatoireMSC: AdaptateurObservatoireMSC;
    adaptateurObservatoireMenaceCyber: AdaptateurObservatoireMenaceCyber;
  }) {
    this.adaptateurObservatoireMSS = adaptateurObservatoireMSS;
    this.adaptateurObservatoireMSC = adaptateurObservatoireMSC;
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

  async donneesOrganisations(): Promise<DonneesObservatoireOrganisations> {
    const [total, parNiveau, date] = await Promise.all([
      this.adaptateurObservatoireMSC.totalTestsMaturite(),
      this.adaptateurObservatoireMSC.testsMaturiteParNiveau(),
      this.adaptateurObservatoireMSC.dateDerniereExecution(),
    ]);

    return {
      testsMaturite: { date, source: sourceMSC, total, parNiveau },
    };
  }

  donneesMenaceCyber() {
    return this.adaptateurObservatoireMenaceCyber.donnees();
  }
}
