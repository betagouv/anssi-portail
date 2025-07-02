<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { profilStore } from '../stores/profil.store';

  export let clePageCrisp: string;

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

  let pageCrisp: PageHtmlCrisp = {
    titre: '',
    description: '',
    contenu: '',
    tableDesMatieres: [],
  };

  onMount(async () => {
    const reponse = await axios.get<PageHtmlCrisp>(
      '/api/pages-crisp/' + clePageCrisp
    );
    pageCrisp = reponse.data;
  });

  $: tableDesMatieres = pageCrisp.tableDesMatieres.filter(
    (e) => e.profondeur === 2
  );

  $: filAriane = $profilStore
    ? [{ label: 'Catalogue', href: '/catalogue' }, { label: pageCrisp.titre }]
    : [{ label: 'Accueil', href: '/' }, { label: pageCrisp.titre }];
</script>

<lab-anssi-bandeau-titre
  titre={pageCrisp.titre}
  description={pageCrisp.description}
  {filAriane}
></lab-anssi-bandeau-titre>

<lab-anssi-page-crisp {tableDesMatieres} contenu={pageCrisp.contenu}
></lab-anssi-page-crisp>
