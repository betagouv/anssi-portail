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
    <h1 class="alternatif-xs">
      Protéger mon association contre les cyberattaques
    </h1>
    <p class="texte-chapo-xl">
      Les associations sont aussi concernées par le risque de cyberattaques.
      Elles peuvent être la cible de campagnes de hameçonnage / phishing ou de
      rançongiciels / ransomwares. Il n'est pas trop tard pour agir et des
      solutions existent&nbsp;!
    </p>
  {/snippet}
  {#snippet filAriane()}
    <FilAriane fondSombre={true} feuille="Protéger mon association" />
  {/snippet}
</Heros>

<Proteger origine="landing-associations" />
