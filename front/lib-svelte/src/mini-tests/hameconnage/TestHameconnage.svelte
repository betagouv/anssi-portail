<script lang="ts">
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane from '../../ui/FilAriane.svelte';
  import BoiteMail from './BoiteMail.svelte';
  import { mailOuvert, tousLesMails } from './hameconnage.store';
  import Mail from './Mail.svelte';
  import PanneauLateral from './PanneauLateral.svelte';

  $tousLesMails = [
    {
      id: 'ENEDIS',
      expediteur: {
        nom: 'Enedis - Service Exploitation',
        mail: 'intervention@enedis-exploitation-pro.com',
      },
      destinataire: 'maintenance@votreentreprise.fr',
      objet: 'Anomalie critique détectée sur votre compteur professionnel — Intervention à programmer sous 24h',
      heuresMinutesRéception: '08:30',
      estLu: false,
    },
    {
      id: 'PROCONNECT',
      expediteur: {
        nom: 'ProConnect',
        mail: 'notifications@proconnect.gouv.fr',
      },
      destinataire: 'vous@votreorganisation.fr',
      objet: 'Nouvelle connexion détectée avec ProConnect',
      heuresMinutesRéception: '09:14',
      estLu: false,
    },
    {
      id: 'INPI',
      expediteur: {
        nom: 'INPI',
        mail: 'noreply@inpi.fr',
      },
      destinataire: 'contact@votreentreprise.fr',
      objet: 'Votre formalité a été transmise aux organismes destinataires',
      heuresMinutesRéception: '09:15',
      estLu: false,
    },
    {
      id: 'CPF',
      expediteur: {
        nom: 'Mon Compte Formation',
        mail: 'cpf-droits@moncompteformation-securite.net',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Vos droits CPF vont expirer – Sécurisez-les avant le 30/09',
      heuresMinutesRéception: '10:05',
      estLu: true,
    },
    {
      id: 'LA_POSTE',
      expediteur: {
        nom: 'La Poste - Colisimo',
        mail: 'laposte@notifications.laposte.fr',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Votre colis arrive !',
      heuresMinutesRéception: '10:50',
      estLu: true,
    },
    {
      id: 'AMENDES.GOUV',
      expediteur: {
        nom: 'amendes.gouv.fr - Trésor Public',
        mail: 'recouvrement@amendes-gouv-huissier.com',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Avis de contravention n°AM-664821 - À retourner sous 5 jours',
      heuresMinutesRéception: '12:10',
      estLu: true,
    },
    {
      id: 'ORANGE',
      expediteur: {
        nom: 'Orange - Service Mobile',
        mail: 'portabilite@orange-mobile-service.com',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Une demande de portabilité de votre numéro a été initiée',
      heuresMinutesRéception: '14:02',
      estLu: true,
    },
    {
      id: 'BANQUE_POSTALE',
      expediteur: {
        nom: 'La Banque Postale',
        mail: 'vous@votreadresse.fr',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Votre relevé de compte de septembre est disponible',
      heuresMinutesRéception: '16:40',
      estLu: true,
    },
    {
      id: 'ANSSI',
      expediteur: {
        nom: 'ANSSI - CERT-FR',
        mail: 'alerte-cert@anssi-gouv-fr.net',
      },
      destinataire: 'rssi@votreentreprise.fr',
      objet: 'Votre relevé de compte de septembre est disponible',
      heuresMinutesRéception: '16:40',
      estLu: true,
    },
  ];
</script>

<dsfr-container>
  <FilAriane
    segments={fabriqueFilAriane({
      feuille: 'Hameçonnage : saurez-vous distinguer le mail légitime du faux&nbsp;?',
      branche: { nom: 'Faire le test !', lien: '/faire-le-test' },
    })}
  />
  <h1 class="fr-h6">Hameçonnage&nbsp;: saurez-vous distinguer le mail légitime du faux&nbsp;?</h1>
  <div class="conteneur">
    <PanneauLateral />
    {#if $mailOuvert}
      <Mail />
    {:else}
      <BoiteMail />
    {/if}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  dsfr-container {
    background-color: var(--background-alt-blue-france);
    display: flex;
    flex-direction: column;
    padding-bottom: 1.5rem;
  }

  .conteneur {
    @include a-partir-de(lg) {
      display: flex;
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
    @include a-partir-de(sm) {
      text-align: left;
    }
    @include a-partir-de(lg) {
      margin-bottom: 2.5rem;
    }
  }
</style>
