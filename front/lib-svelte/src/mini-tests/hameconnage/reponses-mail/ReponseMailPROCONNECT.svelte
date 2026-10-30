<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  estLégitime
  résumé="En résumé&nbsp;: ProConnect est le service d'authentification fédérée utilisé par les agents publics et les professionnels pour accéder aux services de l'État (Chorus Pro, démarches-simplifiées, URSSAF...). Ce type d'alerte de connexion en est une vraie fonctionnalité de sécurité. Réflexe&nbsp;: vérifier le domaine d'expédition, et en cas de doute, se rendre soi-même sur proconnect.gouv.fr plutôt que de cliquer sur un lien reçu, même quand le mail est authentique."
>
  <li>
    Le domaine d'expédition «&nbsp;notifications.proconnect.gouv.fr&nbsp;» (ou proconnect.gouv.fr) est le vrai domaine
    officiel
  </li>
  <li>
    Le lien «&nbsp;Je signale une usurpation&nbsp;» pointe vers le vrai site proconnect.gouv.fr, sans demande de mot de
    passe dans le mail lui-même
  </li>
  <li>
    Aucune action n'est requise si la connexion est reconnue&nbsp;: contrairement à un phishing, ce mail ne pousse pas à
    cliquer immédiatement sur un lien de «&nbsp;sécurisation&nbsp;»
  </li>
  <li>
    Un code d'identification unique et une date/heure précises sont fournis, cohérents avec un vrai historique de
    connexion consultable indépendamment sur le tableau de bord
  </li>
</ReponseMailGenerique>
