<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import type { PageHtmlCrisp } from './pageCrisp.type';

  type Props = {
    pageCrisp?: PageHtmlCrisp;
  };

  const { pageCrisp }: Props = $props();

  let tableDesMatières = $derived(pageCrisp ? pageCrisp.tableDesMatières.filter((e) => e.profondeur === 2) : []);

  const propriétésFilAriane: PropriétésFilAriane | undefined = $derived(
    pageCrisp ? { parents: [], feuille: pageCrisp.titre } : undefined
  );

  const propsTableDesMatières = $derived({
    [estServeur ? 'table-des-matieres' : 'tableDesMatieres']: enPropriétéWebC(tableDesMatières),
  });
</script>

{#if pageCrisp}
  <Heros
    titre={pageCrisp.titre}
    description={pageCrisp.description ?? ''}
    {propriétésFilAriane}
    theme="clair"
    format="banniere"
  />

  <lab-anssi-page-crisp {...propsTableDesMatières} contenu={pageCrisp.contenu}>
    <article slot="seo">
      <div class="contenu">
        <!-- eslint-disable-next-line svelte/no-at-html-tags-->
        {@html pageCrisp.contenu}
      </div>
    </article>
  </lab-anssi-page-crisp>
{/if}
