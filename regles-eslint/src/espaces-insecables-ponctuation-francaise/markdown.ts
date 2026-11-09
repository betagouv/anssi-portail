import type { Linter } from 'eslint';
import { fromMarkdown } from 'mdast-util-from-markdown';

interface NœudMarkdown {
  type: string;
  position?: { start: { offset?: number }; end: { offset?: number } };
  children?: NœudMarkdown[];
}

/** Masque la syntaxe sans déplacer les positions utilisées par les diagnostics et corrections. */
function extraireTexte(source: string): string {
  const frontmatter = /^(?:\uFEFF)?---\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)(?:\r?\n|$)/.exec(source);
  const débutContenu = frontmatter?.[0].length ?? 0;
  const contenu = source.slice(débutContenu);
  const caractères = source.split('').map((caractère) => (/[\r\n]/.test(caractère) ? caractère : ' '));

  function visiter(nœud: NœudMarkdown) {
    if (nœud.type === 'text' || nœud.type === 'html') {
      const début = nœud.position?.start.offset;
      const fin = nœud.position?.end.offset;
      if (début !== undefined && fin !== undefined) {
        for (let i = début; i < fin; i++) caractères[débutContenu + i] = contenu[i]!;
      }
    }
    for (const enfant of nœud.children ?? []) visiter(enfant);
  }
  visiter(fromMarkdown(contenu));
  return caractères.join('');
}

const sources = new Map<string, { original: string; extrait: string }>();

export const markdown: Linter.Processor = {
  preprocess(source, filename) {
    const extrait = extraireTexte(source);
    sources.set(filename, { original: source, extrait });
    return [extrait];
  },
  postprocess(messages, filename) {
    const source = sources.get(filename)!;
    sources.delete(filename);
    // Le masquage ne doit jamais conduire à remplacer un délimiteur Markdown par une espace.
    return messages.flat().filter((message) => {
      if (!message.fix) return true;
      const [début, fin] = message.fix.range;
      return source.original.slice(début, fin) === source.extrait.slice(début, fin);
    });
  },
  supportsAutofix: true,
};
