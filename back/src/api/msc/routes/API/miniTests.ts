import { Express, RequestHandler } from 'express';
import { ConfigurationServeur } from '../../../configurationServeur.js';
import { ressourceTestsExposition } from '../../../mini-tests/exposition/ressourceTestsExposition.js';
import { ressourceRéponsesRéflexesCyber } from '../../../mini-tests/reflexes-cyber/ressourceReponsesReflexesCyber.js';
import { ressourceInfoMiniTests } from '../../../mini-tests/ressourceInfoMiniTests.js';
import { ressourceReactionMiniTest } from '../../../mini-tests/ressourceReactionMiniTest.js';
import { ressourceRetourMiniTest } from '../../../mini-tests/ressourceRetourMiniTest.js';
import { ressourceRéponsesVraiFaux } from '../../../mini-tests/vrai-faux/ressourceReponsesVraiFaux.js';
import { ressourceVraiFaux } from '../../../mini-tests/vrai-faux/ressourceVraiFaux.js';
import { enregistreRouteDansExpress } from '../../enregistreRoutes.js';

export const enregistreLesMiniTests = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/api${suffixe}`, ...gestionnaires);

  enregistreRoute('/reactions-mini-tests', ressourceReactionMiniTest(configurationServeur));
  enregistreRoute('/info-mini-tests', ressourceInfoMiniTests(configurationServeur));
  enregistreRoute('/mini-tests/vrai-faux', ressourceVraiFaux(configurationServeur));
  enregistreRoute('/mini-tests/vrai-faux/reponses', ressourceRéponsesVraiFaux(configurationServeur));
  enregistreRoute('/mini-tests/reflexes-cyber/reponses', ressourceRéponsesRéflexesCyber(configurationServeur));
  enregistreRoute('/mini-tests/exposition/tests', ressourceTestsExposition(configurationServeur));
  enregistreRoute('/retour-mini-tests', ressourceRetourMiniTest(configurationServeur));
};
