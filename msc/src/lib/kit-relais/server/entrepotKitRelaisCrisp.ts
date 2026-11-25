import { isAxiosError } from '@anssi-portail/axios';
import { aseptiseHtml } from '@anssi-portail/infrastructure/aseptisationDuHtml';
import { Cache } from '@anssi-portail/infrastructure/cache';
import type { KitRelais } from '../kitRelais.js';
import type { EntrepotKitRelais } from './entrepotKitRelais.js';

interface LecteurCrisp {
  recupereArticle(slug: string): Promise<{
    titre: string;
    description: string;
    contenu: string | null;
    tableDesMatieres: KitRelais['tableDesMatières'];
  }>;
}

export const creeEntrepotKitRelais = (cms: LecteurCrisp, ttl: Temporal.Duration): EntrepotKitRelais => {
  const cache = new Cache<KitRelais>({ ttl });
  const slug = 'le-kit-relais-messervicescyber';
  const charge = async (): Promise<KitRelais> => {
    const article = await cms.recupereArticle(slug);
    return {
      titre: article.titre,
      tableDesMatières: article.tableDesMatieres,
      description: article.description,
      contenu: aseptiseHtml(article.contenu ?? ''),
    };
  };
  return {
    async lis() {
      try {
        return await cache.get(slug, charge);
      } catch (erreur) {
        if (isAxiosError(erreur) && erreur.response?.status === 404) return undefined;
        throw erreur;
      }
    },
  };
};
