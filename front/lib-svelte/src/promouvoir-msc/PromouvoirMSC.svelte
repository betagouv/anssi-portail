<script lang="ts">
  import Hero from '../ui/Hero.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  type PageHtmlCrisp = {
    titre: string;
    contenu: string | null;
    description: string;
    tableDesMatieres: unknown[];
  };

  let pageCrisp :PageHtmlCrisp = {
    titre:"",
    description:"",
    contenu:"",
    tableDesMatieres:[]
  }

  onMount(async () => {
    const reponse = await axios.get<PageHtmlCrisp>('/api/pages-crisp/promouvoir_msc');
    pageCrisp = reponse.data;
  });
</script>

<Hero
  titre={pageCrisp.titre}
  description={pageCrisp.description}
  ariane={pageCrisp.titre}
/>

<div class="article-promouvoir-msc">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html pageCrisp.contenu}
</div>
