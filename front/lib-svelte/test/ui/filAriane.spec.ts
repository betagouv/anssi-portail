import { describe, expect, it } from 'vitest';
import { fabriqueFilAriane } from '../../src/ui/filAriane';

describe('La fabrique du fil d’Ariane', () => {
  it('ajoute l’accueil et termine par la page courante sans lien', () => {
    expect(fabriqueFilAriane({ feuille: 'Page' })).toEqual([
      { id: 'noeud-0', label: 'Accueil', href: '/' },
      { id: 'noeud-1', label: 'Page', href: '' },
    ]);
  });

  it('conserve l’ordre et les liens de plusieurs parents', () => {
    expect(
      fabriqueFilAriane({
        parents: [
          { nom: 'Catalogue', lien: '/catalogue#guides' },
          { nom: 'Collection', lien: '/collection/' },
        ],
        feuille: 'Guide',
      }).map(({ label, href }) => ({ label, href }))
    ).toEqual([
      { label: 'Accueil', href: '/' },
      { label: 'Catalogue', href: '/catalogue#guides' },
      { label: 'Collection', href: '/collection/' },
      { label: 'Guide', href: '' },
    ]);
  });

  it('décode les entités des parents et de la feuille', () => {
    const segments = fabriqueFilAriane({
      parents: [{ nom: 'A&nbsp;&amp;&nbsp;B', lien: '/a' }],
      feuille: 'L&#39;article',
    });
    expect(segments.map((s) => s.label)).toEqual(['Accueil', 'A\u00a0&\u00a0B', "L'article"]);
  });

  it('distingue les homonymes et garde les mêmes IDs lorsque les libellés changent', () => {
    const première = fabriqueFilAriane({ parents: [{ nom: 'Page', lien: '/parent' }], feuille: 'Page' });
    const seconde = fabriqueFilAriane({ parents: [{ nom: 'Autre', lien: '/parent' }], feuille: 'Titre' });
    expect(new Set(première.map((s) => s.id)).size).toBe(3);
    expect(première.map((s) => s.id)).toEqual(seconde.map((s) => s.id));
  });

  it('ne fabrique aucun segment lorsque les données ne sont pas disponibles', () => {
    expect(fabriqueFilAriane(undefined)).toEqual([]);
  });
});
