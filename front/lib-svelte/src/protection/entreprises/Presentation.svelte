<script lang="ts">
  import FilAriane from '../../ui/FilAriane.svelte';
  import Heros from '../../ui/Heros.svelte';
  import Proteger from '../Proteger.svelte';
</script>

<Heros
  cacheActions
  cacheIllustration={false}
  cacheTags
  description=""
  format="heros"
  illustrationAlt=""
  illustrationSource="/assets/images/personne-avec-laptop-entoure-de-diagrammes.svg"
  theme="sombre"
  titre=""
>
  {#snippet preambule()}
    <hgroup class="preambule">
      <h1 class="alternatif-xs">
        Protéger mon entreprise contre les cyberattaques
      </h1>
      <p class="texte-chapo-xl">
        Toutes les entreprises sont exposées au risque de cyberattaques. En 2024, les TPE/PME et ETI ont notamment
        représenté 37&nbsp;% des victimes de rançongiciels ou ransowmare représentant les premières entités visées.
      </p>
    </hgroup>
  {/snippet}
  {#snippet filAriane()}
    <FilAriane
      fondSombre={true}
      feuille="Protéger mon entreprise contre les cyberattaques"
    />
  {/snippet}
</Heros>

<Proteger origine="landing-entreprises" />

<style lang="scss">
  .preambule {
    padding-right: 32px;
  }
</style>
