<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  estLégitime
  résumé="En résumé&nbsp;: une notification bancaire de routine peut simplement vous informer qu’un document est disponible. Réflexe&nbsp;: en cas de doute, vérifiez sa disponibilité directement depuis votre application bancaire ou votre espace client."
>
  <li>
    Le domaine de l’adresse d’expédition «&nbsp;voscomptesenligne.labanquepostale.fr&nbsp;» est cohérent avec celui de
    La Banque Postale.
  </li>
  <li>Le message vous informe qu’un document mensuel attendu est disponible.</li>
  <li>Le mail ne vous demande ni de vous connecter ni de communiquer vos identifiants ou vos coordonnées bancaires.</li>
  <li>Le ton est neutre et le message ne vous presse pas d’agir.</li>
</ReponseMailGenerique>
