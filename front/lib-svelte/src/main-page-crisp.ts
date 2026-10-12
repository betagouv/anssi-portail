import axios from 'axios';
import { hydrate } from 'svelte';
import PageCrisp from './page-crisp/PageCrisp.svelte';
import type { PageHtmlCrisp } from './page-crisp/pageCrisp.type';

const hydratePageCrisp = async () => {
  const réponse = await axios.get<PageHtmlCrisp>(`/api/pages-crisp${window.location.pathname}`);

  hydrate(PageCrisp, {
    target: document.getElementById('page-crisp')!,
    props: { pageCrisp: réponse.data },
  });
};

hydratePageCrisp();
