<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  estLégitime
  résumé="En résumé&nbsp;: un avis de livraison de colis légitime ne cherche pas à vous pousser à agir dans l’urgence ni à communiquer des informations personnelles ou sensibles."
>
  <li>Le message informe qu’un colis est à retirer, sans demander de paiement ni de saisie de données.</li>
  <li>Au survol, le lien «&nbsp;Suivre mon colis&nbsp;» renvoie vers «&nbsp;laposte.fr&nbsp;», un site légitime.</li>
  <li>Le mail est informatif et n'exerce pas de pression (délai réaliste de retrait).</li>
</ReponseMailGenerique>
