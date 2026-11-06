<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  résumé="En résumé&nbsp;: ne scannez pas un QR code reçu par mail. Réflexe&nbsp;: accédez au service en saisissant vous-même l’adresse ou via votre application."
>
  <li>
    L'adresse d'expédition «&nbsp;moncompteformation-securite.net&nbsp;» est suspecte&nbsp;: elle usurpe un domaine
    public légitime en «&nbsp;.gouv.fr&nbsp;».
  </li>
  <li>
    Le QR code cache l’adresse de destination et ne peut pas être vérifié par les filtres de vos boîtes mails. Recevoir
    un QR code par mail est, par ailleurs, inhabituel.
  </li>
  <li>
    La menace d'expiration imminente de droits crée du stress et peut atténuer votre vigilance. L'expiration de droits
    CPF est l'un des scénarios de fraude les plus signalés en France, y compris par SMS.
  </li>
  <li>Le message ne comporte aucune information précise vérifiable (numéro de dossier, etc.).</li>
</ReponseMailGenerique>
