<script lang="ts">
  import Hero from '../ui/Hero.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

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
</script>

<Hero
  titre={pageCrisp.titre}
  description={pageCrisp.description}
  ariane={pageCrisp.titre}
/>

<lab-anssi-page-crisp {tableDesMatieres} contenu={pageCrisp.contenu}></lab-anssi-page-crisp>