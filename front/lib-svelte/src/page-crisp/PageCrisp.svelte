<script lang="ts">
  import axios from 'axios';
  import { onMount, untrack } from 'svelte';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';

  type EntreeTableDesMatieres = {
    profondeur: number;
    texte: string;
    id: string;
  };

  type PageHtmlCrisp = {
    titre: string;
    contenu: string | null;
    description: string;
    tableDesMatieres: EntreeTableDesMatieres[];
  };

  type Props = {
    pageCrispInitiale?: PageHtmlCrisp;
  };

  const { pageCrispInitiale }: Props = $props();

  let pageCrisp = $state<PageHtmlCrisp | undefined>(untrack(() => pageCrispInitiale));

  onMount(async () => {
    const slug = window.location.pathname;
    const réponse = await axios.get<PageHtmlCrisp>(`/api/pages-crisp${slug}`);
    pageCrisp = réponse.data;
  });

  let tableDesMatières = $derived(pageCrisp ? pageCrisp.tableDesMatieres.filter((e) => e.profondeur === 2) : []);

  const propriétésFilAriane: PropriétésFilAriane = $derived(
    pageCrisp
      ? [
          {
            nom: pageCrisp.titre,
          },
        ]
      : []
  );
</script>

{#if pageCrisp}
  <Heros
    titre={pageCrisp.titre}
    description={pageCrisp.description}
    segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
    theme="clair"
    format="banniere"
  />

  <lab-anssi-page-crisp tableDesMatieres={enPropriétéWebC(tableDesMatières)} contenu={pageCrisp.contenu}>
    <article slot="seo">
      <div class="contenu">
        <!-- eslint-disable-next-line svelte/no-at-html-tags-->
        {@html pageCrisp.contenu}
      </div>
    </article>
  </lab-anssi-page-crisp>
{/if}
