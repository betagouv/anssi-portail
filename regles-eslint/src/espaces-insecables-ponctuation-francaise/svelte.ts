import type { Rule } from 'eslint';
import { BALISES_IGNORÉES_PAR_DÉFAUT, créerVérificateur, type Options } from './commun.js';

/** Sous-ensemble des nœuds de svelte-eslint-parser utilisés par la règle. */
interface NœudSvelte {
  type: string;
  range: [number, number];
  parent?: NœudSvelte;
}

/** Texte du template (`SvelteText`) ou valeur littérale d'un attribut (`SvelteLiteral`). */
interface NœudTextuel extends NœudSvelte {
  type: 'SvelteText' | 'SvelteLiteral';
}

interface FragmentTemplate extends NœudSvelte {
  tail: boolean;
  value: { cooked: string | null };
}

interface TemplateInterpolé extends NœudSvelte {
  quasis: FragmentTemplate[];
  expressions: NœudSvelte[];
}

interface ÉlémentSvelte extends NœudSvelte {
  type: 'SvelteElement';
  name: { name: string };
}

const estÉlémentSvelte = (nœud: NœudSvelte): nœud is ÉlémentSvelte => nœud.type === 'SvelteElement';

const TYPES_NŒUDS_IGNORÉS = new Set(['SvelteScriptElement', 'SvelteStyleElement']);

export function analyserSvelte(context: Rule.RuleContext): Rule.RuleListener {
  const [options] = context.options as Options;
  const balisesIgnorées = new Set(options?.balisesIgnorées ?? BALISES_IGNORÉES_PAR_DÉFAUT);
  /** Vrai si le texte est dans <script>, <style> ou une balise ignorée. */
  function estIgnoré(nœud: NœudSvelte): boolean {
    for (let courant = nœud.parent; courant; courant = courant.parent) {
      if (TYPES_NŒUDS_IGNORÉS.has(courant.type)) return true;
      if (estÉlémentSvelte(courant) && balisesIgnorées.has(courant.name.name)) return true;
    }
    return false;
  }

  const vérifier = créerVérificateur(context, estIgnoré);

  /** Parcourt uniquement les valeurs affichées, sans inspecter les conditions ni les appels. */
  function vérifierExpression(nœud: NœudSvelte) {
    if (estIgnoré(nœud)) return;
    if (nœud.type === 'Literal') {
      const valeur = (nœud as NœudSvelte & { value: unknown }).value;
      if (typeof valeur === 'string') vérifier(nœud, nœud.range[0] + 1, nœud.range[1] - 1, 'javascript', valeur);
    } else if (nœud.type === 'ConditionalExpression') {
      const condition = nœud as NœudSvelte & { consequent: NœudSvelte; alternate: NœudSvelte };
      vérifierExpression(condition.consequent);
      vérifierExpression(condition.alternate);
    } else if (nœud.type === 'TemplateLiteral') {
      const template = nœud as TemplateInterpolé;
      for (const [index, fragment] of template.quasis.entries()) {
        // Exclure les délimiteurs `, } et ${ des fragments JavaScript.
        vérifier(
          fragment,
          fragment.range[0] + 1,
          fragment.range[1] - (fragment.tail ? 1 : 2),
          'javascript',
          fragment.value.cooked,
          index > 0
        );
      }
      for (const expression of template.expressions) vérifierExpression(expression);
    }
  }

  // `unknown` : SvelteText et SvelteLiteral n'existent pas dans les types de listeners d'ESLint
  return {
    SvelteText: (nœud: unknown) => vérifier(nœud as NœudTextuel),
    // Valeurs d'attributs (`résumé="…"`), pas des directives ni des expressions `{…}`
    SvelteLiteral: (nœud: unknown) => {
      if ((nœud as NœudTextuel).parent?.type === 'SvelteAttribute') vérifier(nœud as NœudTextuel);
    },
    SvelteMustacheTag: (nœud: unknown) => {
      const expression = nœud as NœudSvelte & { kind: string; expression: NœudSvelte };
      if (expression.kind !== 'text' || expression.parent?.type.endsWith('Directive')) return;
      vérifierExpression(expression.expression);
    },
  };
}
