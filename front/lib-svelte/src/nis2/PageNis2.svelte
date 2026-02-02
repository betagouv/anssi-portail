<script>
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
</script>

<Heros
  format="heros"
  theme="sombre"
  cacheTags={true}
  titre="Directive NIS 2"
  description="Préparez-vous et renforcez dès à présent le niveau de cybersécurité de votre organisation."
  cacheActions={false}
  illustrationSource="/assets/images/illustration-securiser.svg"
  illustrationAlt="Illustration NIS2"
  cacheIllustration={true}
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
