<script lang="ts">
  import BoutonDeVoteHameconnage from './BoutonDeVoteHameconnage.svelte';

  let { mode }: { mode: 'mobile' | 'bureau' } = $props();
</script>

<div class={['panneau', mode]}>
  <h3 class="fr-h6">Vrai ou faux mail ?</h3>
  <div class="boutons-vote">
    <BoutonDeVoteHameconnage réponse="Légitime" surVote={() => {}} />
    <BoutonDeVoteHameconnage réponse="Hameçonnage" surVote={() => {}} />
  </div>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  .panneau {
    display: flex;
    background-color: white;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);
    padding: 1rem;
    gap: 1rem;
    h3 {
      display: none;
    }

    &.mobile {
      bottom: 0;
      margin-bottom: -1.5rem;
      margin-inline: -1rem;
      position: sticky;
      z-index: calc(var(--centre-aide-z-index) + 1);

      @include a-partir-de(lg) {
        display: none;
      }
    }

    &.bureau {
      display: none;
    }

    .boutons-vote {
      display: flex;
      flex: 1;
      gap: 1rem;
      min-width: 0;
    }
  }
</style>
