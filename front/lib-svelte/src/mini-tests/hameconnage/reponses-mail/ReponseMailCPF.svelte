<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  résumé="En résumé&nbsp;: la fraude au CPF est l'une des arnaques les plus répandues en France. Les droits CPF ne se gèrent que depuis moncompteformation.gouv.fr, en se connectant soi-même via FranceConnect, jamais via un lien ou un QR code reçu."
>
  <li>
    Le QR code permet de contourner les filtres de sécurité qui analysent les liens texte dans les emails
    («&nbsp;quishing&nbsp;»)
  </li>
  <li>
    Le domaine d'expédition «&nbsp;moncompteformation-securite.net&nbsp;» est différent du site officiel
    moncompteformation.gouv.fr
  </li>
  <li>
    Un discours d'urgence sur l'expiration de droits CPF est l'un des scénarios de fraude les plus signalés en France, y
    compris par SMS
  </li>
  <li>Aucune référence à un dossier de formation en cours, ni à une action initiée par vous</li>
</ReponseMailGenerique>
