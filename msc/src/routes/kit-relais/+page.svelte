<script lang="ts">
  import Heros from '$msc/ui/Heros.svelte';
  import { estServeur } from '$plateforme/environnement';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const pageCrisp = $derived(data.kit);

  let tableDesMatières = $derived(pageCrisp.tableDesMatières.filter((e) => e.profondeur === 2));

  const propriétésFilAriane = $derived({ feuille: pageCrisp.titre });

  const propsTableDesMatières = $derived({
    [estServeur ? 'table-des-matieres' : 'tableDesMatieres']: enPropriétéWebC(tableDesMatières),
  });
</script>

<Heros
  titre={pageCrisp.titre}
  description={pageCrisp.description}
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
