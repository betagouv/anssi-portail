<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import axios from 'axios';
  import { profilStore } from '../stores/profil.store';
  import { enPropriétéWebC } from '$plateforme/webComponent';

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
    clePageCrisp: string;
    pageCrispInitiale?: PageHtmlCrisp;
  };

  const {
    clePageCrisp,
    pageCrispInitiale = {
      titre: '',
      description: '',
      contenu: '',
      tableDesMatieres: [],
    },
  }: Props = $props();

  let pageCrisp = $state<PageHtmlCrisp>(untrack(() => pageCrispInitiale));

  onMount(async () => {
    const reponse = await axios.get<PageHtmlCrisp>('/api/pages-crisp/' + clePageCrisp);
    pageCrisp = reponse.data;
  });

  let tableDesMatieres = $derived(pageCrisp.tableDesMatieres.filter((e) => e.profondeur === 2));

  let filAriane = $derived(
    $profilStore
      ? [{ label: 'Catalogue', href: '/catalogue' }, { label: pageCrisp.titre }]
      : [{ label: 'Accueil', href: '/' }, { label: pageCrisp.titre }]
  );
</script>

<lab-anssi-bandeau-titre
  titre={pageCrisp.titre}
  description={pageCrisp.description}
  filAriane={enPropriétéWebC(filAriane)}
>
  <h1 slot="seo">{pageCrisp.titre}</h1>
  <span>{pageCrisp.description}</span>
</lab-anssi-bandeau-titre>

<lab-anssi-page-crisp tableDesMatieres={enPropriétéWebC(tableDesMatieres)} contenu={pageCrisp.contenu}>
  <article slot="seo">
    <div class="contenu">
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      {@html pageCrisp.contenu}
    </div>
  </article>
</lab-anssi-page-crisp>
