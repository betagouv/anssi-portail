<script lang="ts">
  import Progression from '@parcours-securisation/Progression.svelte';

  type Props = {
    nombreMesuresPrisesEnCompte: number;
    nombreMesures: number;
    cibleBadge: number;
  };

  const { nombreMesuresPrisesEnCompte, nombreMesures, cibleBadge }: Props = $props();

  const encouragement: { accroche: string; suite: string } = $derived.by(() => {
    if (nombreMesuresPrisesEnCompte === nombreMesures) {
      return {
        accroche: '✅ Bravo vous avez terminé\u202f!',
        suite:
          'Vous avez pris en compte les 12 mesures recommandées pour commencer à protéger votre organisation contre les risques de cyberattaques.',
      };
    }

    if (nombreMesuresPrisesEnCompte > cibleBadge) {
      return {
        accroche: '👍 Les fondamentaux se mettent en place.',
        suite: 'Poursuivez votre progression pour consolider votre sécurité.',
      };
    }

    if (nombreMesuresPrisesEnCompte === cibleBadge) {
      return {
        accroche: '👌 Continuez vos efforts\u202f!',
        suite:
          'Complétez votre progression et accédez à des mesures plus avancées pour renforcer vos pratiques, mieux structurer vos actions et réduire les risques de cyberattaques.',
      };
    }

    if (nombreMesuresPrisesEnCompte > 0) {
      return {
        accroche: '🚀 Votre parcours est lancé.',
        suite:
          'Avancez à votre rythme, une mesure après l’autre pour renforcer la cybersécurité de votre organisation contre les risques de cyberattaques.',
      };
    }

    return {
      accroche: '🛡️ Renforcez dès maintenant votre sécurité.',
      suite:
        'Commencez par des actions simples et concrètes pour protéger votre organisation contre les cyberattaques.',
    };
  });
</script>

<div class="entete">
  <h2 class="titre">Cyberdépart</h2>
  <div class="progression">
    <Progression actuel={nombreMesuresPrisesEnCompte} max={nombreMesures} cible={cibleBadge} mode="sans-titre" />
    <p class="texte-standard-md">{nombreMesuresPrisesEnCompte}/{nombreMesures}</p>
  </div>

  <p class="texte-standard-md">
    <b>{encouragement.accroche}</b>
    {encouragement.suite}
  </p>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .entete {
    display: grid;
    grid-template-areas:
      'titre'
      'progression'
      'introduction';
    gap: 1.5rem;
    align-items: center;

    p {
      margin-bottom: 0;
    }

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
      display: flex;

      @include a-partir-de(sm) {
        margin-left: auto;
      }
    }
    p {
      grid-area: introduction;
    }
  }
</style>
