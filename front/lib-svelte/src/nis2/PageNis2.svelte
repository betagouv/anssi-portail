<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import { onMount } from 'svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import Lien from '../ui/Lien.svelte';
  import Notice from '../ui/Notice.svelte';
  import DocumentationNis2 from './DocumentationNis2.svelte';
  import ExigencesNis2 from './ExigencesNis2.svelte';
  import Presentation from './Presentation.svelte';
  import Solutions from './Solutions.svelte';

  const { itemsCyber, featureFlagNis2CyFun23 = false, exigences = undefined, guides = undefined } = $props();

  let estBureau = $state(false);
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });

  const liens = [
    { label: 'Présentation NIS 2', fragment: '#presentation' },
    { label: 'Exigences et comparaison', fragment: '#exigences' },
    { label: 'Solutions pour vous accompagner', fragment: '#solutions' },
    { label: 'Documentation et FAQ', fragment: '#documentation' },
  ];
  let lienActif = $state('#presentation');
</script>

<Heros
  format="heros"
  theme="sombre"
  cacheTags={true}
  titre="Directive NIS 2"
  description="Préparez-vous et renforcez dès à présent le niveau de cybersécurité de votre organisation."
  cacheActions={false}
  illustrationSource="/assets/images/nis2.svg"
  illustrationAlt="NIS2"
  cacheIllustration={!estBureau}
>
  {#snippet filAriane()}
    <FilAriane fondSombre={true} feuille="Directive NIS 2" />
  {/snippet}
  {#snippet actions()}
    <Lien
      apparence="bouton"
      blank
      etire
      href="https://club.ssi.gouv.fr/#/nis2/introduction"
      icone="external-link-line"
      iconeADroite
      libelle="Pré-enregistrer mon entité"
    />
  {/snippet}
</Heros>

<Notice
  description="Restez informé des dernières actualités de la directive NIS 2 et autres actualités."
  estRejetable
  titre="Newsletter MesServicesCyber :"
  lien={{
    libelle: 'S’abonner',
    titre: 'S’abonner à la newsletter',
    url: '/abonnement-infolettre?adresseRetour=/nis2',
  }}
/>

<NavigationTertiaire {liens} bind:lienActif />

<hr />

{#if estServeur || lienActif === '#presentation'}
  <Presentation />
{/if}
{#if estServeur || lienActif === '#exigences'}
  <ExigencesNis2 {featureFlagNis2CyFun23} {exigences} />
{/if}
{#if estServeur || lienActif === '#solutions'}
  <Solutions {itemsCyber} {guides} />
{/if}
{#if estServeur || lienActif === '#documentation'}
  <DocumentationNis2 />
{/if}

<style lang="scss">
  hr {
    border: 0;
    height: 24px;
    margin: 0;
  }
</style>
