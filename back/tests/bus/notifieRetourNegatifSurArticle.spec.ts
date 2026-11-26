import { describe, expect, it, vi } from 'vitest';

import { MessagerieInstantanee } from '@metier/messagerieInstantanee.js';
import { RetourArticleDonné } from '@bus/evenements/retourArticleDonne.js';
import { notifieUnRetourNégatifSurArticle } from '@bus/notifieRetourNegatifSurArticle.js';

import { fausseMessagerieInstantanee } from '../api/fauxObjets.js';

describe("L'abonnement qui notifie un retour d'article  négatif", () => {
  it('consigne un évènement retour article pour un retour négatif', async () => {
    const messagerieInstantanee: MessagerieInstantanee = {
      ...fausseMessagerieInstantanee,
    };
    const notifieUnRetourNégatifSurArticleEspion = vi.spyOn(messagerieInstantanee, 'notifieUnRetourNégatifSurArticle');
    await notifieUnRetourNégatifSurArticle({ messagerieInstantanee })(
      new RetourArticleDonné({
        slug: 'un-article',
        commentaire: "J'aime pas",
        retour: 'NEGATIF',
      })
    );

    expect(notifieUnRetourNégatifSurArticleEspion).toHaveBeenCalledExactlyOnceWith({
      commentaire: "J'aime pas",
      slug: 'un-article',
    });
  });

  it('ne consigne pas un évènement pour un retour positif', async () => {
    const messagerieInstantanee = {
      ...fausseMessagerieInstantanee,
    };
    const notifieUnRetourNégatifSurArticleEspion = vi.spyOn(messagerieInstantanee, 'notifieUnRetourNégatifSurArticle');
    await notifieUnRetourNégatifSurArticle({ messagerieInstantanee })(
      new RetourArticleDonné({
        slug: 'un-article',
        commentaire: "J'aime",
        retour: 'POSITIF',
      })
    );

    expect(notifieUnRetourNégatifSurArticleEspion).not.toHaveBeenCalled();
  });
});
