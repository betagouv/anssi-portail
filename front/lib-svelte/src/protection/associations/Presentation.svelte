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
  illustrationSource="/assets/images/personne-avec-micro-consultant-sites-cyber.svg"
  theme="sombre"
  titre=""
>
  {#snippet preambule()}
    <hgroup class="preambule">
      <h1 class="alternatif-xs">
        Protéger mon association contre les cyberattaques
      </h1>
      <p class="texte-chapo-xl">
        Tout comme les entreprises et les administrations publiques, les
        associations sont exposées aux cyberattaques&nbsp;: rançongiciels
        (ransomwares), fuites de données, hameçonnage… Les impacts peuvent être
        financiers, juridiques et réputationnels, parfois majeurs.
      </p>
      <p class="texte-chapo-xl">
        Bonne nouvelle&nbsp;: il est possible de réduire les risques avec des
        actions simples et concrètes. Découvrez les solutions gratuites
        proposées par l’État pour renforcer la cybersécurité de votre
        association et vous accompagner pas à pas dans votre démarche de
        sécurisation.
      </p>
    </hgroup>
  {/snippet}
  {#snippet filAriane()}
    <FilAriane fondSombre={true} feuille="Protéger mon association" />
  {/snippet}
</Heros>

<Proteger />

<style lang="scss">
  .preambule {
    padding-right: 32px;
  }
</style>
