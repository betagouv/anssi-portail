<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  résumé="En résumé&nbsp;: assurez-vous qu'un mail contenant une pièce jointe est légitime avant de l'ouvrir. Elle peut contenir un logiciel malveillant."
>
  <li>
    L'adresse d'expédition du message («&nbsp;amendes-gouv-huissier.com&nbsp;») imite une adresse légitime en
    «&nbsp;.gouv.fr&nbsp;» et diffère de celle affichée dans l'image présente dans l'email.
  </li>
  <li>
    Une pièce jointe à télécharger directement dans le corps d'un mail est une pratique inhabituelle, surtout de la part
    d'un site public. Un fichier à télécharger peut cacher un logiciel malveillant.
  </li>
</ReponseMailGenerique>
