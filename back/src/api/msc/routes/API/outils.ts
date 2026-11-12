import { Express, RequestHandler } from 'express';
import { Outil } from '../../../../metier/outils/outils.js';
import { ConfigurationServeur } from '../../../configurationServeur.js';
import { ressourceCampagneDeSensibilisation } from '../../../outils/campagneDeSensibilisation/ressourceCampagneDeSensibilisation.js';
import { ressourceModeleAnnuaireDeCrise } from '../../../outils/modeleAnnuaireDeCrise/ressourceModeleAnnuaireDeCrise.js';
import { ressourceModèleXslxGénérique } from '../../../outils/modeleXslxGenerique/ressourceModeleXslx.js';
import { ServiceModèleXslx } from '../../../outils/modeleXslxGenerique/serviceModeleXslx.js';
import { ressourceRappelMiseAJourAnnuaireContacts } from '../../../outils/ressourceRappelMiseAJourAnnuaireContacts.js';
import { ressourceRappelMiseAJourListeDActivités } from '../../../outils/ressourceRappelMiseÀJourListeDActivites.js';
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
    ] satisfies [Outil, ServiceModèleXslx][]
  ).forEach(([outil, serviceXslx]) => {
    enregistreRoute(`/${outil}`, ressourceModèleXslxGénérique(configurationServeur, serviceXslx, outil));
  });

  /// OUTILS ICS
  enregistreRoute(
    '/rappel-mise-a-jour-annuaire-contacts.ics',
    ressourceRappelMiseAJourAnnuaireContacts(configurationServeur)
  );
  enregistreRoute(
    '/rappel-mise-a-jour-liste-d-activites.ics',
    ressourceRappelMiseAJourListeDActivités(configurationServeur)
  );

  /// OUTILS AUTRE
  enregistreRoute('/campagne-de-sensibilisation', ressourceCampagneDeSensibilisation(configurationServeur));
};
