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
        Quelle que soit leur taille - TPE/PME/ETI - ou leur secteur, toutes les
        entreprises sont exposées au risque de cyberattaques, comme les
        rançongiciels (ransomwares) ou les fuites de données. Les conséquences
        financières, juridiques ou réputationnelles peuvent être très graves.
      </p>
      <p class="texte-chapo-xl">
        Comprendre les risques cyber et agir concrètement est essentiel et
        possible ! Découvrez toutes les solutions gratuites proposées par l'Etat
        pour vous aider dans vos efforts de sécurisation.
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
