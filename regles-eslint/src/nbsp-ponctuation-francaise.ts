import type { Rule } from 'eslint';

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

interface ÉlémentSvelte extends NœudSvelte {
  type: 'SvelteElement';
  name: { name: string };
}

const estÉlémentSvelte = (nœud: NœudSvelte): nœud is ÉlémentSvelte => nœud.type === 'SvelteElement';

type Options = [{ balisesIgnorées?: string[] }?];

const NBSP = '&nbsp;';

const BALISES_IGNORÉES_PAR_DÉFAUT = ['code', 'pre', 'kbd', 'samp'];
const TYPES_NŒUDS_IGNORÉS = new Set(['SvelteScriptElement', 'SvelteStyleElement']);

/** Une correction : remplace [début, fin[ par une espace insécable. */
interface Anomalie {
  début: number;
  fin: number;
  caractère: string;
  position: 'avant' | 'après';
}

/**
 * Espace normale avant : ; ! ? (si suivis d'un blanc ou de la fin du nœud),
 * ou avant » (quel que soit ce qui suit : `»`, `».`, `»,`…).
 */
const AVANT_PONCTUATION_RE = / ([:;!?](?=\s|$)|»)/g;

/** » collé au mot précédent (`«texte»`) : on insère un &nbsp; devant. */
const GUILLEMET_FERMANT_COLLÉ_RE = /(?<=\S)(?<!&nbsp;)»/g;

/** Après « : espace normale (ou rien), sauf si &nbsp; est déjà là. */
const APRES_GUILLEMET_OUVRANT_RE = /«( ?)(?!&nbsp;)(?=\S|$)/g;

function* trouverAnomalies(texte: string, décalage: number): Generator<Anomalie> {
  for (const correspondance of texte.matchAll(AVANT_PONCTUATION_RE)) {
    const début = décalage + correspondance.index;
    yield { début, fin: début + 1, caractère: correspondance[1]!, position: 'avant' };
  }

  for (const correspondance of texte.matchAll(GUILLEMET_FERMANT_COLLÉ_RE)) {
    const début = décalage + correspondance.index;
    yield { début, fin: début, caractère: '»', position: 'avant' }; // insertion pure
  }

  for (const correspondance of texte.matchAll(APRES_GUILLEMET_OUVRANT_RE)) {
    const début = décalage + correspondance.index + 1;
    yield { début, fin: début + correspondance[1]!.length, caractère: '«', position: 'après' };
  }
}

const règle: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          balisesIgnorées: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      utiliserNbsp: 'Utiliser une espace insécable {{position}} « {{caractère}} ».',
    },
  },

  create(context) {
    const { sourceCode } = context;
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

    function vérifier(nœud: NœudTextuel) {
      if (estIgnoré(nœud)) return;

      const [début, fin] = nœud.range;
      const texte = sourceCode.text.slice(début, fin);

      for (const anomalie of trouverAnomalies(texte, début)) {
        context.report({
          loc: {
            start: sourceCode.getLocFromIndex(Math.max(anomalie.début - 1, début)),
            end: sourceCode.getLocFromIndex(Math.min(anomalie.fin + 1, fin)),
          },
          messageId: 'utiliserNbsp',
          data: { caractère: anomalie.caractère, position: anomalie.position },
          fix: (fixer) => fixer.replaceTextRange([anomalie.début, anomalie.fin], NBSP),
        });
      }
    }

    // `unknown` : SvelteText et SvelteLiteral n'existent pas dans les types de listeners d'ESLint
    return {
      SvelteText: (nœud: unknown) => vérifier(nœud as NœudTextuel),
      // Valeurs d'attributs (`résumé="…"`), pas des directives ni des expressions `{…}`
      SvelteLiteral: (nœud: unknown) => {
        if ((nœud as NœudTextuel).parent?.type === 'SvelteAttribute') vérifier(nœud as NœudTextuel);
      },
    };
  },
};

export default règle;
