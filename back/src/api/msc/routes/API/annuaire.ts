import { Express, RequestHandler } from 'express';
import { ConfigurationServeur } from '../../../configurationServeur.js';
import { ressourceAnnuaireDepartements } from '../../../ressourceAnnuaireDepartements.js';
import { ressourceAnnuaireOrganisations } from '../../../ressourceAnnuaireOrganisations.js';
import { ressourceAnnuaireRegions } from '../../../ressourceAnnuaireRegions.js';
import { ressourceAnnuaireSecteursActivite } from '../../../ressourceAnnuaireSecteursActivite.js';
import { ressourceAnnuaireTranchesEffectif } from '../../../ressourceAnnuaireTranchesEffectif.js';
import { enregistreRouteDansExpress } from '../../enregistreRoutes.js';

export const enregistreLesAnnuaires = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/api/annuaire${suffixe}`, ...gestionnaires);

  enregistreRoute('/organisations', ressourceAnnuaireOrganisations(configurationServeur));
  enregistreRoute('/departements', ressourceAnnuaireDepartements(configurationServeur));
  enregistreRoute('/regions', ressourceAnnuaireRegions(configurationServeur));
  enregistreRoute('/secteurs-activite', ressourceAnnuaireSecteursActivite(configurationServeur));
  enregistreRoute('/tranches-effectif', ressourceAnnuaireTranchesEffectif(configurationServeur));
};
