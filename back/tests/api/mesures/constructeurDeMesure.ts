import { LienPourAllerPlusLoin, Mesure, Risque, Tutoriel } from '../../../src/metier/mesure.js';
import { ExigenceNIS2 } from '../../../src/metier/nis2/exigence.js';

export class ConstructeurDeMesure {
  private id: string = '';
  private titre: string = '';
  private phraseAccroche: string = '';
  private explications: string = '';
  private actionPrioritaire: string = '';
  private actionFacileAFaire: string = '';
  private ordre: number = 0;
  private idModule = 0;
  private readonly risques: Risque[] = [];
  private readonly liens: LienPourAllerPlusLoin[] = [];
  private readonly exigences: ExigenceNIS2[] = [];
  private tutoriels: Tutoriel[] = [];

  avecLId(id: string) {
    this.id = id;
    return this;
  }

  avecLeTitre(titre: string) {
    this.titre = titre;
    return this;
  }

  avecLaPhraseAccroche(phraseAccroche: string) {
    this.phraseAccroche = phraseAccroche;
    return this;
  }

  avecLesExplications(explications: string) {
    this.explications = explications;
    return this;
  }

  avecLActionPrioritaire(actionPrioritaire: string) {
    this.actionPrioritaire = actionPrioritaire;
    return this;
  }

  avecLActionFacileAFaire(actionFacileAFaire: string) {
    this.actionFacileAFaire = actionFacileAFaire;
    return this;
  }

  avecLOrdre(ordre: number) {
    this.ordre = ordre;
    return this;
  }

  avecUnRisque(libelle: string, description: string) {
    this.risques.push({ libelle, description });
    return this;
  }

  avecUnLien(libelle: string, url: string) {
    this.liens.push({ libelle, url });
    return this;
  }

  avecUneExigence(exigence: ExigenceNIS2) {
    this.exigences.push(exigence);
    return this;
  }

  avecIdModule(idModule: number) {
    this.idModule = idModule;
    return this;
  }

  construis() {
    return new Mesure(
      this.id,
      this.titre,
      this.phraseAccroche,
      this.explications,
      this.actionPrioritaire,
      this.actionFacileAFaire,
      this.ordre,
      this.risques,
      this.liens,
      this.exigences,
      this.idModule,
      this.tutoriels
    );
  }
}

export function mesureDeTest() {
  return new ConstructeurDeMesure();
}
