import z from 'zod';
import { codesRegion } from '../../metier/referentielRegions';
import { codesSecteur } from '../../metier/referentielSecteurs';
import { codesTranchesEffectif } from '../../metier/referentielTranchesEffectifEtablissement';

const clesReponsesValides = [
  'prise-en-compte-risque',
  'pilotage',
  'budget',
  'ressources-humaines',
  'adoption-solutions',
  'posture',
];

const erreurSurLesNombres = 'Les valeurs de réponses doivent être comprises entre 1 et 5';
const schemaNombreEntre1Et5 = z.int(erreurSurLesNombres).min(1, erreurSurLesNombres).max(5, erreurSurLesNombres);

export const schemaRessourceResultatsDeTest = z.strictObject({
  region: z.enum(codesRegion, 'Région invalide').optional(),
  secteur: z.enum(codesSecteur, 'Secteur invalide').optional(),
  tailleOrganisation: z.enum(codesTranchesEffectif, "Taille d'organisation invalide").optional(),
  reponses: z
    .any()
    .superRefine((val, ctx) => {
      if (typeof val !== 'object' || val === null || Array.isArray(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Les réponses doivent être dans un objet',
        });
        return z.NEVER;
      }

      const clesRecues = Object.keys(val);
      const toutesLesClesValides = clesRecues.every((cle) => clesReponsesValides.includes(cle));

      if (!toutesLesClesValides) {
        ctx.addIssue({
          code: 'unrecognized_keys',
          message: 'Les clés de réponse sont invalides',
          keys: clesRecues.filter((cle) => !clesReponsesValides.includes(cle)),
        });
        return z.NEVER;
      }
    })
    .pipe(
      z.object({
        'prise-en-compte-risque': schemaNombreEntre1Et5,
        pilotage: schemaNombreEntre1Et5,
        budget: schemaNombreEntre1Et5,
        'ressources-humaines': schemaNombreEntre1Et5,
        'adoption-solutions': schemaNombreEntre1Et5,
        posture: schemaNombreEntre1Et5,
      })
    ),
  codeSessionGroupe: z.string().length(6).optional(),
});
