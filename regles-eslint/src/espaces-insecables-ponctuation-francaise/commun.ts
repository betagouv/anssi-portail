import { decodeHTMLStrict } from 'entities';
import type { Rule } from 'eslint';

export interface NœudSource {
  type: string;
  range: [number, number];
  parent?: NœudSource;
}

export type Options = [{ balisesIgnorées?: string[] }?];

type Contexte = 'html' | 'javascript';
type Largeur = 'ordinaire' | 'fine';
const ESPACES: Record<Contexte, Record<Largeur, string>> = {
  html: { ordinaire: '&nbsp;', fine: '&#8239;' },
  javascript: { ordinaire: '\\u00a0', fine: '\\u202f' },
};
const largeurPour = (caractère: string): Largeur => (';!?'.includes(caractère) ? 'fine' : 'ordinaire');

export const BALISES_IGNORÉES_PAR_DÉFAUT = ['code', 'pre', 'kbd', 'samp'];

/** Une correction : remplace [début, fin[ par une espace insécable. */
interface Anomalie {
  début: number;
  fin: number;
  caractère: string;
  position: 'avant' | 'après';
}

/** Espaces horizontales à normaliser devant la ponctuation ciblée. */
const AVANT_PONCTUATION_RE = /([ \u00a0\u202f\u2009])([:;!?](?=\s|$)|»)/g;

function* trouverAnomalies(texte: string, précédéInterpolation = false): Generator<Anomalie> {
  if (précédéInterpolation && texte.startsWith('»')) {
    yield { début: 0, fin: 0, caractère: '»', position: 'avant' };
  }
  for (const correspondance of texte.matchAll(AVANT_PONCTUATION_RE)) {
    const caractère = correspondance[2]!;
    const attendu = largeurPour(caractère) === 'fine' ? '\u202f' : '\u00a0';
    if (correspondance[1] === attendu) continue;
    const début = correspondance.index;
    yield { début, fin: début + 1, caractère, position: 'avant' };
  }

  /** » collé au mot précédent : insertion pure. */
  for (const correspondance of texte.matchAll(/(?<=\S)»/g)) {
    const début = correspondance.index;
    yield { début, fin: début, caractère: '»', position: 'avant' };
  }

  /** Après « : normaliser les espaces horizontales ou insérer une espace manquante. */
  for (const correspondance of texte.matchAll(/«([ \u00a0\u202f\u2009]?)(?=\S|$)/g)) {
    if (correspondance[1] === '\u00a0') continue;
    const début = correspondance.index + 1;
    yield { début, fin: début + correspondance[1]!.length, caractère: '«', position: 'après' };
  }
}

/** Décode les entités HTML en conservant les plages des caractères source. */
function décoderHtml(source: string, décalage: number) {
  let texte = '';
  const plages: [number, number][] = [];
  for (const correspondance of source.matchAll(/&(?:#x[\da-f]+|#\d+|[a-z][\da-z]*);|[\s\S]/gi)) {
    const brut = correspondance[0];
    const valeur = decodeHTMLStrict(brut);
    const début = décalage + correspondance.index;
    texte += valeur;
    for (let i = 0; i < valeur.length; i++) plages.push([début, début + brut.length]);
  }
  return { texte, plages };
}

/** Associe chaque unité UTF-16 interprétée à sa plage dans la source JavaScript. */
function cartographier(source: string, décalage: number): [number, number][] {
  const plages: [number, number][] = [];
  const unités = /\\(?:u\{[\da-f]+\}|u[\da-f]{4}|x[\da-f]{2}|\r\n|[\s\S])|\r\n|[\s\S]/gi;
  for (const correspondance of source.matchAll(unités)) {
    const brut = correspondance[0];
    if (/^\\(?:\r\n|[\n\r\u2028\u2029])$/.test(brut)) continue;
    const longueur = brut.startsWith('\\u{') && parseInt(brut.slice(3, -1), 16) > 0xffff ? 2 : 1;
    const début = décalage + correspondance.index;
    for (let i = 0; i < longueur; i++) plages.push([début, début + brut.length]);
  }
  return plages;
}

export const meta: Rule.RuleMetaData = {
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
    utiliserNbsp: 'Utiliser une espace {{type}} {{position}} « {{caractère}} » : {{valeur}}.',
  },
};

export function créerVérificateur(context: Rule.RuleContext, estIgnoré: (nœud: NœudSource) => boolean) {
  const { sourceCode } = context;
  return function vérifier(
    nœud: NœudSource,
    début = nœud.range[0],
    fin = nœud.range[1],
    contexte: Contexte = 'html',
    interprété?: string | null,
    précédéInterpolation = false
  ) {
    if (estIgnoré(nœud)) return;

    const brut = sourceCode.text.slice(début, fin);
    const html = contexte === 'html' ? décoderHtml(brut, début) : null;
    const texte = html ? html.texte : interprété;
    if (typeof texte !== 'string') return;
    const plages = html ? html.plages : cartographier(brut, début);
    if (plages && plages.length !== texte.length) return;
    const débutSource = (index: number) => (plages ? (plages[index]?.[0] ?? fin) : index + début);
    const finSource = (index: number) => (plages ? (plages[index - 1]?.[1] ?? début) : index + début);

    for (const anomalie of trouverAnomalies(texte, précédéInterpolation)) {
      const débutAnomalie = débutSource(anomalie.début);
      const finAnomalie = anomalie.fin === anomalie.début ? débutAnomalie : finSource(anomalie.fin);
      const largeur = largeurPour(anomalie.caractère);
      const valeur = ESPACES[contexte][largeur];
      context.report({
        loc: {
          start: sourceCode.getLocFromIndex(Math.max(débutAnomalie - 1, début)),
          end: sourceCode.getLocFromIndex(Math.min(finAnomalie + 1, fin)),
        },
        messageId: 'utiliserNbsp',
        data: {
          caractère: anomalie.caractère,
          position: anomalie.position,
          type: largeur === 'fine' ? 'fine insécable' : 'insécable',
          valeur,
        },
        fix: (fixer) => fixer.replaceTextRange([débutAnomalie, finAnomalie], valeur),
      });
    }
  };
}
