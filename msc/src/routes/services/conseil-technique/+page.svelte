<script lang="ts">
  import BoutonFavori from '$msc/favoris/BoutonFavori.svelte';
  import Lien from '$msc/ui/Lien.svelte';
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const fiche = $derived(data.fiche);
  const illustration = $derived('/assets/images/illustrations-services/' + fiche.illustration);
  const sections = [
    { id: 'explication', nom: 'De quoi s’agit-il ?' },
    { id: 'cible', nom: 'Qui peut utiliser ce service ?' },
  ];
  let active = $state('explication');
  let menu: HTMLDetailsElement;
  const suitLeFragment = () => {
    active = location.hash.slice(1) || 'explication';
    if (menu) menu.open = false;
  };

  const favoris = writable<string[]>([]);
  setContext('favorisMSC', {
    subscribe: favoris.subscribe,
    ajoute: (id: string) => favoris.update((liste) => [...liste, id]),
    retire: (id: string) => favoris.update((liste) => liste.filter((élément) => élément !== id)),
  });
  let favorisChargés = $state(false);
  onMount(async () => {
    suitLeFragment();
    if (!data.profil) return;
    try {
      const réponse = await fetch('/api/favoris');
      if (!réponse.ok) throw new Error('Lecture des favoris impossible');
      favoris.set(await réponse.json());
    } finally {
      favorisChargés = true;
    }
  });
</script>

<svelte:head><link rel="stylesheet" href="/assets/styles/service.css" /></svelte:head>
<svelte:window onhashchange={suitLeFragment} />

<lab-anssi-bandeau-page
  avec-fil-ariane=""
  description={fiche.description}
  liens-fil-ariane={JSON.stringify([
    { id: 'noeud-accueil', label: 'Accueil', href: '/' },
    { id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' },
    { id: fiche.nom, label: fiche.nom },
  ])}
  titre={fiche.nom}
  url-image={illustration}
  theme="clair"
  type="fiche"
>
  <h1 slot="seo">{fiche.nom}</h1>
  <p slot="seo">{fiche.description}</p>
  <ol slot="seo">
    <li><a rel="external" href="/">Accueil</a></li>
    <li><a rel="external" href="/catalogue">Les services et ressources cyber</a></li>
    <li>{fiche.nom}</li>
  </ol>
  <div slot="badgesgroup">
    <dsfr-badge has-icon icon="shake-hands-fill" type="accent" accent="yellow-tournesol" size="sm" label="Service"
    ></dsfr-badge>
  </div>
</lab-anssi-bandeau-page>

{#snippet sommaire()}
  <ul>
    {#each sections as section (section.id)}
      <li class:actif={active === section.id}><a href={'#' + section.id}>{section.nom}</a></li>
    {/each}
  </ul>
{/snippet}
<div class="sommaire sommaire-replie">
  <details bind:this={menu}>
    <summary>
      <span class="entete-filtres">
        <img class="menu" src="/assets/images/icone-menu-lateral.svg" width="16" height="16" alt="" /><span
          id="section-active"
        >
          {sections.find((section) => section.id === active)?.nom ?? sections[0].nom}
        </span><img class="chevron" src="/assets/images/icone-chevron-bas.svg" width="16" height="16" alt="" />
      </span>
    </summary>
    {@render sommaire()}
  </details>
</div>
<dsfr-container class="article">
  <div class="contenu-section">
    <div class="sommaire sommaire-deplie">
      {@render sommaire()}
      <span>TAGS</span>
      <div class="labels">
        {#each fiche.sources as source (source)}<span>{source}</span>{/each}
      </div>
    </div>
    <div class="contenu-article">
      <section class="explication" id="explication">
        <img src={illustration} width="868" alt="Capture d’écran" />
        <div class="actions">
          {#if !data.profil || favorisChargés}<BoutonFavori idItem={fiche.url} />{/if}
        </div>
        <h2>De quoi s'agit-il&#8239;?</h2>
        <p>
          Pour toute question simple portant sur les guides techniques publiés par l’ANSSI, posez une question en
          envoyant un mail à <code>conseil.technique [at] ssi.gouv.fr</code>.
        </p>
      </section>
      <section class="cible" id="cible">
        <h2>Qui peut utiliser ce service&#8239;?</h2>
        <span>Le service conseil technique est accessible à tous.</span>
      </section>
      <div class="haut-de-page"><Lien href="#haut-de-page" libelle="Haut de page" /></div>
    </div>
  </div>
</dsfr-container>
