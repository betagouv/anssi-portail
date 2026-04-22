import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import { RuleContext } from '@typescript-eslint/utils/ts-eslint';
import ts from 'typescript';

type IdMessage = 'route-sans-validation';
type Options = [{ methodes?: string[] }];

const rule = ESLintUtils.RuleCreator.withoutDocs({
  name: 'route-sans-validation',
  meta: {
    type: 'problem' as const,
    docs: {
      description: 'Vérifie que chaque route Express valide ses entrées avec un schéma avec Zod',
    },
    messages: {
      'route-sans-validation': 'Route sans validation détectée: {{ appelant }}.{{ nomMethode }}()',
    },
    schema: [
      {
        type: 'object',
        properties: {
          methodes: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ methodes: ['get', 'post', 'put', 'patch', 'delete'] }],
  create(contexte: Readonly<RuleContext<IdMessage, Options>>, options: Readonly<Options>): TSESLint.RuleListener {
    const METHODES_PAR_DEFAUT = ['get', 'post', 'put', 'patch', 'delete'];
    const methodes = new Set(options[0].methodes ?? METHODES_PAR_DEFAUT);

    const servicesDeParsing = contexte.sourceCode.parserServices;
    const verificateur = servicesDeParsing?.program?.getTypeChecker();

    const estSchemaZod = (type: ts.Type): boolean => {
      if (!verificateur) return false;
      const typeApparent = verificateur.getApparentType(type);

      if (typeApparent.getProperty('safeParse')) return true;
      if (typeApparent.isUnion() || typeApparent.isIntersection()) {
        return typeApparent.types.some((subtype) => estSchemaZod(subtype));
      }

      const symbole = typeApparent.getSymbol();
      if (symbole) {
        const nomSymbole = symbole.getName();
        if (nomSymbole.startsWith('Zod')) return true;
      }

      const aliasSymbole = typeApparent.aliasSymbol;
      if (aliasSymbole) {
        const nomAlias = aliasSymbole.getName();
        if (nomAlias.startsWith('Zod')) return true;
      }

      const typeEnChaine = verificateur.typeToString(typeApparent);
      return (
        typeEnChaine.includes('ZodType') ||
        typeEnChaine.includes('ZodObject') ||
        typeEnChaine.includes('ZodSchema') ||
        typeEnChaine.includes('ZodEffects') ||
        typeEnChaine.includes('ZodOptional')
      );
    };

    const typeRetourneParFonction = (type: ts.Type): boolean => {
      if (!verificateur) return false;
      const signatures = verificateur.getSignaturesOfType(type, ts.SignatureKind.Call);
      return signatures.some((signature) => {
        const typeRetour = signature.getReturnType();
        return estSchemaZod(typeRetour);
      });
    };

    const estSchemaOuFonctionRetourneSchema = (noeud: TSESTree.Expression): boolean => {
      if (!servicesDeParsing || !verificateur) return false;
      const noeudTs = servicesDeParsing.esTreeNodeToTSNodeMap?.get(noeud);
      if (!noeudTs) return false;

      const type = verificateur.getTypeAtLocation(noeudTs);
      if (!type) return false;

      return estSchemaZod(type) || typeRetourneParFonction(type);
    };

    const filtreValideLaRequete = (arg: TSESTree.CallExpressionArgument) => {
      if (arg.type !== 'CallExpression' || arg.callee.type !== 'Identifier' || arg.arguments.length !== 1) return false;
      const [schemaDeValidation] = arg.arguments;
      return schemaDeValidation.type !== 'SpreadElement' && estSchemaOuFonctionRetourneSchema(schemaDeValidation);
    };

    return {
      CallExpression(noeud: TSESTree.CallExpression) {
        if (
          noeud.callee.type === 'MemberExpression' &&
          !noeud.callee.computed &&
          noeud.callee.object.type === 'Identifier' &&
          noeud.callee.property &&
          methodes.has(noeud.callee.property.name) &&
          !noeud.arguments.some(filtreValideLaRequete)
        ) {
          const appelant = noeud.callee.object.name;
          const nomMethode = noeud.callee.property.name;
          contexte.report({
            node: noeud,
            messageId: 'route-sans-validation',
            data: { appelant, nomMethode },
          });
        }
      },
    };
  },
});

export default rule;
