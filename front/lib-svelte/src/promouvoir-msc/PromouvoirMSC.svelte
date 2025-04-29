<script lang="ts">
  import Hero from '../ui/Hero.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

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
      '/api/pages-crisp/promouvoir_msc'
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

<div class="sommaire sommaire-replie">
  <details>
    <summary>
      <div class="entete-filtres">
        <img class="menu" src="/assets/images/icone-menu-lateral.svg" alt="" />
        <span id="section-active" class="titre-menu">
          {tableDesMatieres[0]?.texte}
        </span>
        <img
          class="chevron"
          src="/assets/images/icone-chevron-bas.svg"
          alt=""
        />
      </div>
    </summary>

    <ul>
      {#each tableDesMatieres as entree (entree.id)}
        <li><a href={`#${entree.id}`}>{entree.texte}</a></li>
      {/each}
    </ul>
  </details>
</div>

<div class="article">
  <div class="contenu-section">
    <div class="sommaire sommaire-deplie">
      <ul>
        {#each tableDesMatieres as entree (entree.id)}
          <li><a href={`#${entree.id}`}>{entree.texte}</a></li>
        {/each}
      </ul>
    </div>

    <div class="contenu">
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      {@html pageCrisp.contenu}
    </div>
  </div>
</div>
