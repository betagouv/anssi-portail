<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  estLégitime
  résumé="En résumé&nbsp;: ce type d'alerte de connexion est une vraie fonctionnalité de sécurité. Réflexe&nbsp;: vérifiez le domaine d'expédition, et en cas de doute, rendez-vous directement sur proconnect.gouv.fr plutôt que de cliquer sur un lien reçu, même quand le mail est authentique."
>
  <li>
    Le domaine d'expédition se termine par «&nbsp;.gouv.fr&nbsp;»&nbsp;: un domaine légitime, partagé par de nombreux
    services publics numériques.
  </li>
  <li>Le lien «&nbsp;Je signale une usurpation&nbsp;» pointe vers le même domaine.</li>
  <li>Aucune action n'est imposée sous la pression.</li>
  <li>
    Le mail contient des éléments précis (date, heure, service concerné, identifiant) que vous pouvez vérifier par
    vous-même, via votre propre historique.
  </li>
</ReponseMailGenerique>
