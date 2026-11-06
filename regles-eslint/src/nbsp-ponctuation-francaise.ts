import type { Rule } from 'eslint';

/** Sous-ensemble des nœuds de svelte-eslint-parser utilisés par la règle. */
interface SvelteNode {
  type: string;
  range: [number, number];
  parent?: SvelteNode;
}

/** Texte du template (`SvelteText`) ou valeur littérale d'un attribut (`SvelteLiteral`). */
interface SvelteTextual extends SvelteNode {
  type: 'SvelteText' | 'SvelteLiteral';
}

interface SvelteElement extends SvelteNode {
  type: 'SvelteElement';
  name: { name: string };
}

const isSvelteElement = (node: SvelteNode): node is SvelteElement => node.type === 'SvelteElement';

type Options = [{ ignoredTags?: string[] }?];

const NBSP = '&nbsp;';

const DEFAULT_IGNORED_TAGS = ['code', 'pre', 'kbd', 'samp'];
const IGNORED_NODE_TYPES = new Set(['SvelteScriptElement', 'SvelteStyleElement']);

/** Une correction : remplace [from, to[ par une espace insécable. */
interface Issue {
  from: number;
  to: number;
  char: string;
  where: 'avant' | 'après';
}

/**
 * Espace normale avant : ; ! ? (si suivis d'un blanc ou de la fin du nœud),
 * ou avant » (quel que soit ce qui suit : `»`, `».`, `»,`…).
 */
const BEFORE_PUNCTUATION_RE = / ([:;!?](?=\s|$)|»)/g;

/** » collé au mot précédent (`«texte»`) : on insère un &nbsp; devant. */
const GLUED_CLOSING_RE = /(?<=\S)(?<!&nbsp;)»/g;

/** Après « : espace normale (ou rien), sauf si &nbsp; est déjà là. */
const AFTER_OPENING_RE = /«( ?)(?!&nbsp;)(?=\S|$)/g;

function* findIssues(text: string, offset: number): Generator<Issue> {
  for (const m of text.matchAll(BEFORE_PUNCTUATION_RE)) {
    const from = offset + m.index;
    yield { from, to: from + 1, char: m[1]!, where: 'avant' };
  }

  for (const m of text.matchAll(GLUED_CLOSING_RE)) {
    const from = offset + m.index;
    yield { from, to: from, char: '»', where: 'avant' }; // insertion pure
  }

  for (const m of text.matchAll(AFTER_OPENING_RE)) {
    const from = offset + m.index + 1;
    yield { from, to: from + m[1]!.length, char: '«', where: 'après' };
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          ignoredTags: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useNbsp: 'Utiliser une espace insécable {{where}} « {{char}} ».',
    },
  },

  create(context) {
    const { sourceCode } = context;
    const [options] = context.options as Options;
    const ignoredTags = new Set(options?.ignoredTags ?? DEFAULT_IGNORED_TAGS);

    /** Vrai si le texte est dans <script>, <style> ou une balise ignorée. */
    function isIgnored(node: SvelteNode): boolean {
      for (let current = node.parent; current; current = current.parent) {
        if (IGNORED_NODE_TYPES.has(current.type)) return true;
        if (isSvelteElement(current) && ignoredTags.has(current.name.name)) return true;
      }
      return false;
    }

    function check(node: SvelteTextual) {
      if (isIgnored(node)) return;

      const [from, to] = node.range;
      const text = sourceCode.text.slice(from, to);

      for (const issue of findIssues(text, from)) {
        context.report({
          loc: {
            start: sourceCode.getLocFromIndex(Math.max(issue.from - 1, from)),
            end: sourceCode.getLocFromIndex(Math.min(issue.to + 1, to)),
          },
          messageId: 'useNbsp',
          data: { char: issue.char, where: issue.where },
          fix: (fixer) => fixer.replaceTextRange([issue.from, issue.to], NBSP),
        });
      }
    }

    // `unknown` : SvelteText et SvelteLiteral n'existent pas dans les types de listeners d'ESLint
    return {
      SvelteText: (node: unknown) => check(node as SvelteTextual),
      // Valeurs d'attributs (`résumé="…"`), pas des directives ni des expressions `{…}`
      SvelteLiteral: (node: unknown) => {
        if ((node as SvelteTextual).parent?.type === 'SvelteAttribute') check(node as SvelteTextual);
      },
    };
  },
};

export default rule;
