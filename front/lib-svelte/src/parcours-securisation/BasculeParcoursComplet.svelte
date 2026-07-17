<script lang="ts">
  import Lien from '../ui/Lien.svelte';
</script>

<div class="encart">
  <h4>Protégez votre organisation dans la durée</h4>
  <p class="texte-standard-md">
    Passer au niveau supérieur et continuez à progresser avec des mesures plus avancées pour renforcer vos pratiques,
    mieux structurer vos actions et protéger votre organisation dans la durée.
  </p>
  <div class="lien">
    <Lien
      apparence="bouton"
      libelle="Continuer à renforcer ma sécurité"
      etire
      icone="arrow-right-line"
      iconeADroite
      href="/module-avance"
    />
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .encart {
    display: grid;
    padding: 1.5rem;
    background-color: var(--background-alt-blue-france);
    grid-template-areas: 'titre' 'description' 'action';

    @include a-partir-de(lg) {
      grid-template-areas: 'titre action' 'description action';
      column-gap: 1.5rem;
    }

    h4 {
      margin-bottom: 1rem;
      grid-area: titre;
    }

    p {
      grid-area: description;
    }

    .lien {
      grid-area: action;
      display: flex;
      flex-direction: column;
      @include a-partir-de(md) {
        flex-direction: row;
        align-items: center;
        padding: 10px;
      }
    }
  }
</style>
