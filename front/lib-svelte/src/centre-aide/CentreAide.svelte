<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';

  const liens = enPropriétéWebC([
    {
      texte: '💬 Nous contacter par chat',
      href: 'https://aide.messervices.cyber.gouv.fr/fr/?chat=ouvert',
    },
    {
      texte: '🙌 Consulter la F.A.Q.',
      href: 'https://aide.messervices.cyber.gouv.fr/fr/',
    },
  ]);
</script>

<lab-anssi-centre-aide nomService="MesServicesCyber" {liens}></lab-anssi-centre-aide>
