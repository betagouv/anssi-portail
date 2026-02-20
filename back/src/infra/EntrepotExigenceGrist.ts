import { EntrepotExigence } from '../metier/EntrepotExigence';
import { Exigence } from '../metier/Exigence';

export class EntrepotExigenceGrist implements EntrepotExigence {
  async parReferentiel(_referentiel: string): Promise<Exigence[]> {
    return [
      {
        reference: '1.1-EI/EE',
        entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
        objectifSecurite:
          "Objectif de sécurité 1: Recensement des systèmes d'information",
        thematique: 'Recensement des SI',
        contenu:
          'L’entité liste l’ensemble de ses activités et services, y compris les activités et services qui ne correspondent pas aux critères pour lesquels l’entité est devenue une entité importante ou essentielle (par exemple : une entité essentielle au titre d’une activité exploitation d’un oléoduc liste, en plus des activités et services participant à l’exploitation de l’oléoduc, tous les autres activités et services qu’elle fournit).\n' +
          'Pour chaque entrée de cette liste, l’entité :\n' +
          "•\tidentifie un responsable de l’activité ou du service (par exemple le chef de service auquel est rattachée l'activité ou le service, un directeur métier, la direction générale, etc) ;\n" +
          '•\tliste les systèmes d’information les supportant.',
      },
      {
        reference: '1.2-EI/EE',
        entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
        objectifSecurite:
          "Objectif de sécurité 1: Recensement des systèmes d'information",
        thematique: 'Recensement des SI',
        contenu:
          'L’entité précise dans la liste prévue au (a) les systèmes d’information qui ne sont exposés à aucun des risques mentionnés à l’alinéa 2 de l’objectif de sécurité.\n' +
          'L’entité renseigne les justifications de ces choix.',
      },
      {
        reference: '2.A.2-EE',
        entitesCible: ['EntiteEssentielle'],
        objectifSecurite:
          "Objectif de sécurité 2: Mise en œuvre d'un cadre de gouvernance de la sécurité numérique",
        thematique: 'Rôles et responsabilités',
        contenu:
          'Il désigne au moins une personne qui le conseille et l’accompagne dans l’exercice de cette responsabilité. Cette personne est le point de contact privilégié de l’Agence nationale de la sécurité des systèmes d’information pour tous les sujets relatifs à la sécurité numérique (incidents de sécurité, communications de l’ANSSI sur les sujets relatifs aux entités essentielles)',
      },
    ];
  }
}
