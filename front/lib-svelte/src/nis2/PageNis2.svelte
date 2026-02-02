<script lang="ts">
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';

  let estBureau = false;
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });
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
    <lab-anssi-lien
      titre="Pré-enregistrer mon entité"
      href="#"
      cible="_blank"
      apparence="bouton"
      taille="md"
      variante="primaire"
    ></lab-anssi-lien>
  {/snippet}
</Heros>

<style lang="scss">
</style>
