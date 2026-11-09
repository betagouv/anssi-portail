import type { Rule } from 'eslint';
import { BALISES_IGNORÉES_PAR_DÉFAUT, créerVérificateur, type NœudSource, type Options } from './commun.js';

interface NœudHtml extends NœudSource {
  name?: string;
  value?: string;
  parts?: NœudHtml[];
  key?: { value: string };
}

export function analyserHtml(context: Rule.RuleContext): Rule.RuleListener {
  const [options] = context.options as Options;
  const balisesIgnorées = new Set(options?.balisesIgnorées ?? BALISES_IGNORÉES_PAR_DÉFAUT);
  const commentairesLiquid = [
    ...context.sourceCode.text.matchAll(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g),
  ].map((commentaire): [number, number] => [commentaire.index, commentaire.index + commentaire[0].length]);

  const estDansCommentaire = (début: number, fin: number) =>
    commentairesLiquid.some(([débutCommentaire, finCommentaire]) => début >= débutCommentaire && fin <= finCommentaire);

  function estIgnoré(nœud: NœudSource): boolean {
    if (estDansCommentaire(...nœud.range)) return true;
    for (let courant = nœud.parent as NœudHtml | undefined; courant; courant = courant.parent as NœudHtml | undefined) {
      if (courant.type === 'ScriptTag' || courant.type === 'StyleTag') return true;
      if (courant.type === 'Tag' && courant.name && balisesIgnorées.has(courant.name.toLowerCase())) return true;
      if (courant.type === 'Attribute' && /^(?:style$|on)/i.test(courant.key?.value ?? '')) return true;
    }
    return false;
  }

  const vérifier = créerVérificateur(context, estIgnoré);

  function vérifierTexte(nœud: NœudHtml) {
    if (!nœud.parts?.length) {
      vérifier(nœud);
      return;
    }
    for (const [index, fragment] of nœud.parts.entries()) {
      if (fragment.type !== 'Part' || estDansCommentaire(...fragment.range)) continue;
      const précédent = nœud.parts[index - 1];
      const précédéInterpolation = précédent?.type === 'Template' && précédent.value?.startsWith('{{');
      vérifier(nœud, fragment.range[0], fragment.range[1], 'html', undefined, précédéInterpolation);
    }
  }

  return {
    Text: (nœud: unknown) => vérifierTexte(nœud as NœudHtml),
    AttributeValue: (nœud: unknown) => vérifierTexte(nœud as NœudHtml),
  };
}
