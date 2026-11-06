<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  estLégitime
  résumé="En résumé&nbsp;: une notification confirmant une démarche initiée est un gage de confiance. Réflexe&nbsp;: dans le doute, vérifiez la demande depuis votre espace personnel."
>
  <li>
    Le message accuse réception d’une formalité que votre entreprise a elle-même déposée, auprès d'une institution
    publique dont le nom de domaine est connu de l'entreprise.
  </li>
  <li>Au survol, le lien est le même que le lien de confiance «&nbsp;gouv.fr&nbsp;» affiché.</li>
  <li>Le message comporte une référence de dossier vérifiable dans votre propre espace.</li>
  <li>
    Aucune action n’est demandée, aucun RIB ni identifiant n’est requis&nbsp;: c'est un simple accusé de réception d'une
    formalité déjà déposée par l'entreprise elle-même.
  </li>
</ReponseMailGenerique>
