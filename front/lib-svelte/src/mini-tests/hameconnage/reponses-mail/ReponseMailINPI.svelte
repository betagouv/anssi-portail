<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  estLégitime
  résumé="En résumé&nbsp;: un vrai message du Guichet unique confirme une démarche déjà initiée par l'entreprise elle-même, sans jamais demander de resaisir des identifiants ou des coordonnées bancaires. C'est l'absence de demande d'action urgente qui distingue une notification légitime d'une tentative de phishing. Réflexe&nbsp;: vérifier que vous avez bien déposé une formalité, et pour consulter le justificatif, vous rendre vous-même sur formalites.entreprises.gouv.fr plutôt que de cliquer sur un lien reçu."
>
  <li>
    «&nbsp;formalites.entreprises.gouv.fr&nbsp;» est le vrai domaine officiel du Guichet unique des formalités
    d'entreprises, opéré par l'INPI depuis 2023
  </li>
  <li>
    Aucune action, RIB ou identifiant n'est demandé&nbsp;: c'est un simple accusé de réception d'une formalité déjà
    déposée par l'entreprise elle-même
  </li>
  <li>
    Le seul lien mène vers le vrai site du Guichet unique, pour consulter un justificatif, et non vers une page de
    connexion déguisée
  </li>
  <li>
    Le ton est neutre et factuel, cohérent avec le traitement d'une formalité récemment déposée (création, modification,
    cessation d'entreprise)
  </li>
</ReponseMailGenerique>
