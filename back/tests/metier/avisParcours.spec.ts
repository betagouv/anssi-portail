import { expectTypeOf, it } from 'vitest';
import { AvisParcours } from '../../src/metier/messagerieInstantanee.js';

it('exige une recommandation sauf pour un avis de mi-parcours', () => {
  type AvisMiParcours = Extract<AvisParcours, { typeDeRetour: 'mi-parcours' }>;
  type AvisAvecRecommandation = Exclude<AvisParcours, AvisMiParcours>;

  expectTypeOf<AvisMiParcours['recommandationAutreOrganisation']>().toEqualTypeOf<undefined>();
  expectTypeOf<AvisAvecRecommandation['recommandationAutreOrganisation']>().toEqualTypeOf<
    'oui' | 'non' | 'peut-être'
  >();
});
