<script lang="ts">
  import CanonAConfetti from '../../ui/CanonAConfetti.svelte';
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane from '../../ui/FilAriane.svelte';
  import BoiteMail from './BoiteMail.svelte';
  import { mailOuvert } from './hameconnage.store';
  import Mail from './Mail.svelte';
  import PanneauActionsMail from './PanneauActionsMail.svelte';
  import PanneauLateral from './PanneauLateral.svelte';

  const réponseUtilisateur = $derived($mailOuvert?.réponseUtilisateur);
</script>

<dsfr-container class={`${réponseUtilisateur}-reponse`}>
  <FilAriane
    segments={fabriqueFilAriane({
      feuille: 'Hameçonnage : saurez-vous distinguer le mail légitime du faux&nbsp;?',
      branche: { nom: 'Faire le test !', lien: '/faire-le-test' },
    })}
  />
  <h1 class="fr-h6">Hameçonnage&nbsp;: saurez-vous distinguer le mail légitime du faux&nbsp;?</h1>
  <div class="conteneur">
    <PanneauLateral />
    {#if $mailOuvert}
      <Mail />
      <PanneauActionsMail mode="mobile" />
    {:else}
      <BoiteMail />
    {/if}
  </div>
</dsfr-container>
{#if réponseUtilisateur === 'bonne'}
  <CanonAConfetti lectureAutomatique={true} />
{/if}

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  dsfr-container {
    background-color: var(--background-alt-blue-france);
    display: flex;
    flex-direction: column;
    padding-bottom: 1.5rem;

    &.bonne-reponse {
      background-color: var(--success-975-75);
    }

    &.mauvaise-reponse {
      background-color: var(--error-975-75);
    }
  }

  .conteneur {
    @include a-partir-de(lg) {
      display: flex;
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
    @include a-partir-de(sm) {
      text-align: left;
    }
    @include a-partir-de(lg) {
      margin-bottom: 2.5rem;
    }
  }
</style>
