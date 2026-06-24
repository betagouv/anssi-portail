<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import Lien from '../../ui/Lien.svelte';
  import Modale from '../../ui/Modale.svelte';

  type Props = {
    estOuverte: boolean;
  };

  let { estOuverte = $bindable() }: Props = $props();
</script>

<Modale bind:estOuverte>
  <h2 class="fr-h4">🎉 Bravo ! Vous avez complété Cyberdépart</h2>
  <div class="corps">
    <p class="texte-standard-md">
      En prenant votre Cyberdépart vous avez mis en place des actions pour réduire les risques les plus courants.
      Cependant il est essentiel d’aller plus loin pour renforcer votre cybersécurité dans la durée.
    </p>
    <h3 class="fr-h6">Accédez au parcours avancé</h3>
    <p class="texte-standard-md">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lectus mi, tristique pulvinar posuere eget,
      pretium ut quam. Donec convallis facilisis erat, viverra consectetur orci. Nunc hendrerit scelerisque neque et
      feugiat.<br /><br /> Praesent facilisis, ipsum at eleifend auctor, mi lorem porta massa, nec rutrum nisi massa in augue.
    </p>
  </div>
  {#snippet actions()}
    <Lien apparence="bouton" href="/parcours-complet" libelle="Accéder au parcours complet" />
    <Bouton libelle="Plus tard" type="secondaire" surClic={() => (estOuverte = false)} />
  {/snippet}
</Modale>

<style lang="scss">
  .fr-h4 {
    margin-bottom: 1rem;
  }
  .corps {
    gap: 1.5rem;
  }
</style>
