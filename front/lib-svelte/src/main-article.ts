import { hydrate } from 'svelte';

import ComposantArticle from '@article/Article.svelte';
import type { Article } from '@article/article.type';
import { récupèreArticle } from '@passerelles/blog/articles';

const hydrateArticle = async () => {
  const slug = window.location.pathname.replace(/^\//, '');
  const réponse: Article | undefined = await récupèreArticle(slug);

  hydrate(ComposantArticle, {
    target: document.getElementById('article')!,
    props: { articlePréchargé: réponse },
  });
};

hydrateArticle();
