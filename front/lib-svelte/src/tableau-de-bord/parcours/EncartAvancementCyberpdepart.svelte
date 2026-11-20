<script lang="ts">
  import { DsfrCard } from '@lab-anssi/ui-kit';
  import Progression from '../../parcours-securisation/Progression.svelte';
</script>

<div class="avancement-cyberdepart">
  <div class="entete">
    <h2 class="titre">Cyberdépart</h2>
    <div class="progression">
      <Progression actuel={0} max={12} cible={6} mode="sans-titre"></Progression>
    </div>
    <p class="texte-standard-md">
      <strong>🛡️Renforcez dès maintenant votre sécurité.</strong> Commencez par des actions simples et concrètes pour protéger
      votre organisation contre les cyberattaques.
    </p>
  </div>
  <DsfrCard
    title="Évitez de tout perdre en cas de cyberattaque 😩"
    hasDescription
    description="Sauvegarder régulièrement les données, vérifier et mettre à l’abri ses sauvegardes"
    hasDetailEnd
    detailEnd=""
    hasBadge
    noLink
    size="sm"
    horizontal
    horizontalProportion="tier"
  ></DsfrCard>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .avancement-cyberdepart {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background-color: var(--background-default-grey);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

    .entete {
      display: grid;
      grid-template-areas:
        'titre'
        'progression'
        'introduction';
      gap: 1.5rem;
      align-items: center;

      @include a-partir-de(sm) {
        grid-template-areas:
          'titre progression'
          'introduction introduction';
        grid-template-columns: 1fr 1fr;
      }

      .titre {
        grid-area: titre;
        margin: 0;
      }
      .progression {
        grid-area: progression;
        @include a-partir-de(sm) {
          margin-left: auto;
        }
      }
      p {
        grid-area: introduction;
      }
    }
  }
</style>
