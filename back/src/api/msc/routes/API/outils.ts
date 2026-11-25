import { Express, RequestHandler } from 'express';
import { Outil } from '../../../../metier/outils/outils.js';
import { RappelAnnuel } from '../../../../metier/outils/rappelAnnuel.js';
import {
  rappelMiseAJourAnnuaireContacts,
  rappelMiseAJourInventaireComposantsObsolètes,
  rappelMiseAJourListeDActivités,
  rappelMiseAJourListeInterconnexions,
  rappelMiseAJourListePrestatairesEtFournisseurs,
} from '../../../../metier/outils/rappelsDeMiseAJour.js';
import { ConfigurationServeur } from '../../../configurationServeur.js';
import { ressourceCampagneDeSensibilisation } from '../../../outils/campagneDeSensibilisation/ressourceCampagneDeSensibilisation.js';
import { ressourceModeleAnnuaireDeCrise } from '../../../outils/modeleAnnuaireDeCrise/ressourceModeleAnnuaireDeCrise.js';
import { ressourceModèleXslxGénérique } from '../../../outils/modeleXslxGenerique/ressourceModeleXslx.js';
import { ServiceModèleXslx } from '../../../outils/modeleXslxGenerique/serviceModeleXslx.js';
import { ressourceRappelIcsGénérique } from '../../../outils/rappelIcsGenerique/ressourceRappelIcs.js';
import { ressourceDocumentOutils } from '../../../outils/ressourceDocumentOutils.js';
import { ressourceRetoursSurOutil } from '../../../outils/ressourceRetoursSurOutil.js';
import { enregistreRouteDansExpress } from '../../enregistreRoutes.js';

export const enregistreLesOutils = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/api/outils${suffixe}`, ...gestionnaires);

  enregistreRoute('/retours', ressourceRetoursSurOutil(configurationServeur));

  /// OUTILS XSLX
  enregistreRoute('/modele-annuaire-de-crise.xlsx', ressourceModeleAnnuaireDeCrise(configurationServeur));
  (
    [
      ['modele-liste-d-activites.xlsx', configurationServeur.serviceModèleListeDActivités],
      ['modele-modifications-mots-de-passe.xlsx', configurationServeur.serviceModèleModificationMotsDePasse],
      ['modele-raci.xlsx', configurationServeur.serviceModèleRACI],
      ['modele-revue-comptes-utilisateurs.xlsx', configurationServeur.serviceModèleRevueComptesUtilisateurs],
      ['modele-revue-droits-d-acces.xlsx', configurationServeur.serviceModèleRevueDroitsDAccès],
      [
        'modele-liste-prestataires-et-fournisseurs.xlsx',
        configurationServeur.serviceModeleListePrestatairesEtFournisseurs,
      ],
      ['modele-liste-interconnexions.xlsx', configurationServeur.serviceModeleListeInterconnexions],
      ['modele-inventaire-composants-obsoletes.xlsx', configurationServeur.serviceModeleInventaireComposantsObsoletes],
      ['modele-analyse-de-conformite.xlsx', configurationServeur.serviceModèleAnalyseDeConformité],
      ['modele-cartographie.xlsx', configurationServeur.serviceModèleCartographie],
    ] satisfies [Outil, ServiceModèleXslx][]
  ).forEach(([outil, serviceXslx]) => {
    enregistreRoute(`/${outil}`, ressourceModèleXslxGénérique(configurationServeur, serviceXslx, outil));
  });

  /// OUTILS ICS
  (
    [
      ['rappel-mise-a-jour-annuaire-contacts.ics', rappelMiseAJourAnnuaireContacts],
      ['rappel-mise-a-jour-liste-d-activites.ics', rappelMiseAJourListeDActivités],
      ['rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics', rappelMiseAJourListePrestatairesEtFournisseurs],
      ['rappel-mise-a-jour-liste-interconnexions.ics', rappelMiseAJourListeInterconnexions],
      ['rappel-mise-a-jour-inventaire-composants-obsoletes.ics', rappelMiseAJourInventaireComposantsObsolètes],
    ] satisfies [Outil, RappelAnnuel][]
  ).forEach(([outil, rappel]) => {
    enregistreRoute(`/${outil}`, ressourceRappelIcsGénérique(configurationServeur, rappel, outil));
  });

  /// OUTILS DOCX
  enregistreRoute(
    `/modele-suivi-des-arrivees.docx`,
    ressourceDocumentOutils(
      configurationServeur,
      'modele-suivi-des-arrivees.docx',
      configurationServeur.fournisseurChemin.back.modèleSuiviDesArrivées
    )
  );

  enregistreRoute(
    `/modele-suivi-de-changement-de-fonction.docx`,
    ressourceDocumentOutils(
      configurationServeur,
      'modele-suivi-de-changement-de-fonction.docx',
      configurationServeur.fournisseurChemin.back.modèleSuiviDeChangementDeFonction
    )
  );

  /// OUTILS AUTRE
  enregistreRoute('/campagne-de-sensibilisation', ressourceCampagneDeSensibilisation(configurationServeur));
};
