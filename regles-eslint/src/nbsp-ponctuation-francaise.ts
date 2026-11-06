import type { Rule } from 'eslint';

/** Sous-ensemble des nœuds de svelte-eslint-parser utilisés par la règle. */
interface SvelteNode {
  type: string;
  range: [number, number];
  parent?: SvelteNode;
}

interface SvelteText extends SvelteNode {
  type: 'SvelteText';
}

interface SvelteElement extends SvelteNode {
  type: 'SvelteElement';
  name: { name: string };
}

const isSvelteElement = (node: SvelteNode): node is SvelteElement => node.type === 'SvelteElement';

type Options = [{ ignoredTags?: string[] }?];

const DEFAULT_IGNORED_TAGS = ['code', 'pre', 'kbd', 'samp'];
const IGNORED_NODE_TYPES = new Set(['SvelteScriptElement', 'SvelteStyleElement']);

const NBSP = '&nbsp;';
const PUNCTUATION_RE = / ([:;!?])(?=\s|$)/g;

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
      useNbsp: 'Utiliser une espace insécable avant « {{char}} ».',
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

    return {
      // `unknown` : SvelteText n'existe pas dans les types de listeners d'ESLint
      SvelteText(rawNode: unknown) {
        const node = rawNode as SvelteText;
        if (isIgnored(node)) return;

        const [from, to] = node.range;
        const text = sourceCode.text.slice(from, to);

        for (const match of text.matchAll(PUNCTUATION_RE)) {
          const char = match[1];
          const start = from + match.index;

          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(start),
              end: sourceCode.getLocFromIndex(start + 2),
            },
            messageId: 'useNbsp',
            data: { char },
            fix: (fixer) => fixer.replaceTextRange([start, start + 1], NBSP),
          });
        }
      },
    };
  },
};

export default rule;
