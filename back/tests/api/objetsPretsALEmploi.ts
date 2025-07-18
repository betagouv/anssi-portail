import { CodeRegion } from '../../src/metier/referentielRegions';
import { CodeSecteur } from '../../src/metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../src/metier/referentielTranchesEffectifEtablissement';
import {
  IdNiveauMaturite,
  ResultatTestMaturite,
} from '../../src/metier/resultatTestMaturite';
import { Utilisateur } from '../../src/metier/utilisateur';
import { fauxAdaptateurRechercheEntreprise } from './fauxObjets';

export const jeanneDupont: Utilisateur = new Utilisateur(
  {
    email: 'jeanne.dupont@user.com',
    prenom: 'Jeanne',
    nom: 'Dupont',
    telephone: '0123456789',
    domainesSpecialite: ['RSSI'],
    siretEntite: '13000766900018',
    cguAcceptees: true,
    infolettreAcceptee: true,
  },
  fauxAdaptateurRechercheEntreprise
);

export const hectorDurant: Utilisateur = new Utilisateur(
  {
    email: 'hector.durant@mail.com',
    prenom: 'Hector',
    nom: 'Durant',
    telephone: '0123456789',
    domainesSpecialite: ['RSSI'],
    siretEntite: '13000766900018',
    cguAcceptees: true,
    infolettreAcceptee: true,
  },
  fauxAdaptateurRechercheEntreprise
);

export function creeResultatTest(idNiveau?: IdNiveauMaturite) {
  const pointsParNiveau: Record<IdNiveauMaturite, number> = {
    insuffisant: 1,
    emergent: 2,
    intermediaire: 3,
    confirme: 4,
    optimal: 5,
  };
  const pointDeLaReponse = pointsParNiveau[idNiveau || 'insuffisant'];
  const resultatDeJeanne = new ResultatTestMaturite({
    region: 'FR-NOR' as CodeRegion,
    secteur: 'J' as CodeSecteur,
    tailleOrganisation: '51' as CodeTrancheEffectif,
    reponses: {
      'prise-en-compte-risque': pointDeLaReponse,
      pilotage: pointDeLaReponse,
      budget: pointDeLaReponse,
      'ressources-humaines': pointDeLaReponse,
      'adoption-solutions': pointDeLaReponse,
      posture: pointDeLaReponse,
    },
  });
  resultatDeJeanne.revendiquePropriete(
    jeanneDupont,
    fauxAdaptateurRechercheEntreprise
  );
  return resultatDeJeanne;
}
