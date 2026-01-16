<script lang="ts">
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
</script>

<section>
  <div class="contenu-section">
    <hgroup class="preambule">
      <h1>Passez à l'étape suivante</h1>
      <p>
        Votre résultat montre que votre organisation n’est pas suffisamment
        protégée face aux cyber menaces. L’ANSSI vous recommande de réaliser un
        diagnostic cyber (gratuit) afin de définir rapidement les actions
        prioritaires à mettre en place et renforcer votre cybersécurité.
      </p>
    </hgroup>
    <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
    <DemandeDiagnosticSimplifiee></DemandeDiagnosticSimplifiee>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .contenu-section {
    display: flex;
    flex-direction: column;
    gap: 24px;

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }

    hgroup.preambule {
      text-align: center;
      align-self: center;
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
      }

      h1 {
        font-size: 2rem;
        line-height: 2.5rem;
        margin: 0 0 24px;

        @include a-partir-de(md) {
          font-size: 2.5rem;
          line-height: 3rem;
        }
      }
    }

    lab-anssi-icone {
      align-self: center;
    }
  }
</style>
