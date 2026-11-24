<script lang="ts">
  type Props = {
    nombreMesuresPrisesEnCompte: number;
    nombreMesures: number;
  };

  const { nombreMesuresPrisesEnCompte, nombreMesures }: Props = $props();

  const encouragement: { accroche: string; suite: string } = $derived.by(() => {
    if (nombreMesuresPrisesEnCompte === nombreMesures) {
      return {
        accroche: '✅ Bravo vous avez terminé\u202f!',
        suite: 'Cela témoigne d’un niveau d’engagement élevé dans votre démarche de sécurisation.',
      };
    }

    if (nombreMesuresPrisesEnCompte === nombreMesures / 2) {
      return {
        accroche: '😎 Vous êtes à mi-parcours\u202f!',
        suite:
          'Continuez à mettre en place les mesures recommandées pour renforcer durablement la protection de votre organisation contre les menaces cyber.',
      };
    }

    if (nombreMesuresPrisesEnCompte > 0) {
      return {
        accroche: '🛡️ Votre progression renforce votre cybersécurité\u202f!',
        suite:
          'Poursuivez votre parcours, une mesure après l’autre et renforcez durablement la cybersécurité de votre organisation.',
      };
    }

    return {
      accroche: '👉 Votre parcours de sécurisation commence ici\u202f!',
      suite:
        'Mettez en place vos premières mesures pour renforcer dès maintenant la cybersécurité de votre organisation.',
    };
  });
</script>

<div class="entete">
  <p class="texte-standard-md">
    <b>{encouragement.accroche}</b>
    {encouragement.suite}
  </p>
</div>

<style lang="scss">
  p {
    margin-bottom: 0;
  }
</style>
