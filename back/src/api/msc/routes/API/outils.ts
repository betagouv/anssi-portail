import { Express, RequestHandler } from 'express';
import { ConfigurationServeur } from '../../../configurationServeur.js';
import { ressourceKitDeSensibilisationInterne } from '../../../outils/kitDeSensibilisationInterne/ressourceKitDeSensibilisationInterne.js';
import { ressourceModeleAnnuaireDeCrise } from '../../../outils/modeleAnnuaireDeCrise/ressourceModeleAnnuaireDeCrise.js';
import { ressourceModeleListeDActivites } from '../../../outils/modeleListeDActivites/ressourceModeleListeDActivites.js';
import { ressourceModeleModificationsMotsDePasse } from '../../../outils/modeleModificationMotsDePasse/ressourceModeleModificationsMotsDePasse.js';
import { ressourceModèleRevueComptesUtilisateurs } from '../../../outils/modeleRevueComptesUtilisateurs/ressourceModeleRevueComptesUtilisateurs.js';
import { ressourceModèleRevueDroitsDAccès } from '../../../outils/modeleRevueDroitsDAcces/ressourceModeleRevueDroitsDAcces.js';
import { ressourceRappelMiseAJourAnnuaireContacts } from '../../../outils/ressourceRappelMiseAJourAnnuaireContacts.js';
import { ressourceRappelMiseAJourListeDActivités } from '../../../outils/ressourceRappelMiseÀJourListeDActivites.js';
import { ressourceRetoursSurOutil } from '../../../outils/ressourceRetoursSurOutil.js';
import { enregistreRouteDansExpress } from '../../enregistreRoutes.js';

export const enregistreLesOutils = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/api/outils${suffixe}`, ...gestionnaires);

  enregistreRoute('/retours', ressourceRetoursSurOutil(configurationServeur));

  enregistreRoute('/modele-annuaire-de-crise.xlsx', ressourceModeleAnnuaireDeCrise(configurationServeur));
  enregistreRoute(
    '/modele-modifications-mots-de-passe.xlsx',
    ressourceModeleModificationsMotsDePasse(configurationServeur)
  );
  enregistreRoute(
    '/rappel-mise-a-jour-annuaire-contacts.ics',
    ressourceRappelMiseAJourAnnuaireContacts(configurationServeur)
  );
  enregistreRoute('/modele-liste-d-activites.xlsx', ressourceModeleListeDActivites(configurationServeur));
  enregistreRoute(
    '/rappel-mise-a-jour-liste-d-activites.ics',
    ressourceRappelMiseAJourListeDActivités(configurationServeur)
  );

  enregistreRoute(
    '/modele-revue-comptes-utilisateurs.xlsx',
    ressourceModèleRevueComptesUtilisateurs(configurationServeur)
  );
  enregistreRoute('/modele-revue-droits-d-acces.xlsx', ressourceModèleRevueDroitsDAccès(configurationServeur));

  enregistreRoute('/kit-de-sensibilisation-interne', ressourceKitDeSensibilisationInterne(configurationServeur));
};
