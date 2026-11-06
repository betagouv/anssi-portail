<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  résumé="En résumé&nbsp;: une tentative de hameçonnage peut avoir pour objectif d'usurper l'accès à vos comptes professionnels ou personnels. Réflexe&nbsp;: ne communiquez jamais ces informations via un lien, connectez-vous directement à votre espace client."
>
  <li>
    Jamais une organisation légitime ne vous demandera par mail de renseigner votre numéro de téléphone et un code à
    usage unique. Il s'agit d'une tentative d'usurpation de l'accès à l'un de vos comptes (ex. mail, espace client).
  </li>
  <li>L’adresse de l’expéditeur et le lien ne semblent pas correspondre aux coordonnées officielles d’Orange.</li>
  <li>
    Le lien commence par «&nbsp;http&nbsp;» et non «&nbsp;https&nbsp;», ce qui signifie que la connexion n’est pas
    sécurisée.
  </li>
  <li>Aucune référence de dossier ne vous permet de vérifier l'information communiquée.</li>
</ReponseMailGenerique>
