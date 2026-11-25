import { AdaptateurObservatoireMenaceCyber } from '../infra/observatoireDesDonnees/adaptateurObservatoireMenaceCyberMemoire.js';
import { AdaptateurObservatoireMSC } from '../infra/observatoireDesDonnees/adaptateurObservatoireMSC.js';
import { AdaptateurObservatoireMSS } from '../infra/observatoireDesDonnees/adaptateurObservatoireMSS.js';
import { DonneesObservatoireOrganisations, DonneesObservatoireProjets, SEUILS_COMPLETION } from './observatoire.js';
import { DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER, NOMBRES_DE_DIAGNOSTIC_CYBER } from './statistiques.js';

const SANS_FILTRE = {};
const source = 'MonServiceSécurisé';
const sourceMSC = 'MesServicesCyber';

const dateLaPlusAncienne = (a: Date, b: Date) => (a < b ? a : b);

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
    const [
      total,
      parNiveau,
      totalTestsSensibilisation,
      cumulMensuelTestsSensibilisation,
      totalParcoursRejoints,
      totalCyberdepartsValides,
      cumulMensuelCyberdepartsValides,
      completionsParSeuil,
      date,
    ] = await Promise.all([
      this.adaptateurObservatoireMSC.totalTestsMaturite(),
      this.adaptateurObservatoireMSC.testsMaturiteParNiveau(),
      this.adaptateurObservatoireMSC.totalTestsSensibilisation(),
      this.adaptateurObservatoireMSC.cumulMensuelTestsSensibilisation(),
      this.adaptateurObservatoireMSC.totalParcoursRejoints(),
      this.adaptateurObservatoireMSC.totalCyberdepartsValides(),
      this.adaptateurObservatoireMSC.cumulMensuelCyberdepartsValides(),
      this.completionsParSeuil(),
      this.adaptateurObservatoireMSC.dateDerniereExecution(),
    ]);

    return {
      testsMaturite: { date, source: sourceMSC, total, parNiveau },
      testsSensibilisation: {
        date,
        source: sourceMSC,
        total: totalTestsSensibilisation,
        cumulMensuel: cumulMensuelTestsSensibilisation,
      },
      demarchesInitiees: {
        date: date && dateLaPlusAncienne(date, DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER),
        source: sourceMSC,
        total: totalParcoursRejoints + NOMBRES_DE_DIAGNOSTIC_CYBER,
      },
      diagnosticsCyberdepart: {
        date: DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER,
        source: sourceMSC,
        total: NOMBRES_DE_DIAGNOSTIC_CYBER,
      },
      cyberdepartsValides: {
        date,
        source: sourceMSC,
        total: totalCyberdepartsValides,
        cumulMensuel: cumulMensuelCyberdepartsValides,
      },
      completions: { date, source: sourceMSC, parSeuil: completionsParSeuil },
    };
  }

  private completionsParSeuil() {
    return Promise.all(
      SEUILS_COMPLETION.map(async (seuil) => {
        const [total, cumulMensuel] = await Promise.all([
          this.adaptateurObservatoireMSC.totalCompletions(seuil),
          this.adaptateurObservatoireMSC.cumulMensuelCompletions(seuil),
        ]);
        return { seuil, total, cumulMensuel };
      })
    );
  }

  donneesMenaceCyber() {
    return this.adaptateurObservatoireMenaceCyber.donnees();
  }
}
