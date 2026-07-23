<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import Lien from '../../ui/Lien.svelte';
  import Modale from '../../ui/Modale.svelte';

  type Props = {
    estOuverte: boolean;
  };

  let { estOuverte = $bindable() }: Props = $props();
</script>

<Modale bind:estOuverte titre="🎉 Bravo !">
  <div class="corps">
    <p class="texte-standard-md">
      Vous avez appliqué les 13 mesures du Cyberdépart. Vous avez posé les bases de votre cybersécurité.
    </p>
    <p class="texte-standard-md">
      <strong>Continuez votre progression&nbsp;:</strong> 5 modules complémentaires vous attendent pour renforcer la protection
      de votre organisation contre d'autres risques courants.
    </p>
  </div>
  {#snippet actions()}
    <Lien
      apparence="bouton"
      href="/parcours-complet"
      libelle="Poursuivre le parcours"
      iconeADroite
      icone="arrow-right-circle-line"
    />
    <Bouton libelle="Plus tard" type="secondaire" surClic={() => (estOuverte = false)} />
  {/snippet}
</Modale>

<style lang="scss">
  .corps {
    gap: 1.5rem;
  }
</style>
