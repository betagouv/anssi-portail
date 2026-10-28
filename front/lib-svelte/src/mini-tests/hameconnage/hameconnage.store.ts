import { writable } from 'svelte/store';
import type { MailHameçonnage } from './hameconnage';

export const mailOuvert = writable<MailHameçonnage | undefined>();
export const tousLesMails = writable<MailHameçonnage[]>([
  {
    id: 'ENEDIS',
    expediteur: {
      nom: 'Enedis - Service Exploitation',
      mail: 'intervention@enedis-exploitation-pro.com',
    },
    destinataire: 'maintenance@votreentreprise.fr',
    objet: 'Anomalie critique détectée sur votre compteur professionnel — Intervention à programmer sous 24h',
    heuresMinutesRéception: '16:40',
    type: 'Hameçonnage',
  },
  {
    id: 'PROCONNECT',
    expediteur: {
      nom: 'ProConnect',
      mail: 'notifications@proconnect.gouv.fr',
    },
    destinataire: 'vous@votreorganisation.fr',
    objet: 'Nouvelle connexion détectée avec ProConnect',
    heuresMinutesRéception: '14:02',
    type: 'Légitime',
  },
  {
    id: 'INPI',
    expediteur: {
      nom: "INPI - Guichet unique des formalités d'entreprises",
      mail: 'noreply@inpi.fr',
    },
    destinataire: 'contact@votreentreprise.fr',
    objet: 'Votre formalité a été transmise aux organismes destinataires',
    heuresMinutesRéception: '12:10',
    type: 'Légitime',
  },
  {
    id: 'CPF',
    expediteur: {
      nom: 'Mon Compte Formation',
      mail: 'cpf-droits@moncompteformation-securite.net',
    },
    destinataire: 'vous@votreadresse.fr',
    objet: 'Vos droits CPF vont expirer – Sécurisez-les avant le 30/09',
    heuresMinutesRéception: '10:50',
    type: 'Hameçonnage',
  },
  {
    id: 'LAPOSTE',
    expediteur: {
      nom: 'La Poste - Colissimo',
      mail: 'noreply@notif-colissimo-laposte.info',
    },
    destinataire: 'vous@votreadresse.fr',
    objet: 'Votre colis arrive !',
    heuresMinutesRéception: '10:05',
    type: 'Légitime',
  },
  {
    id: 'AMENDESGOUV',
    expediteur: {
      nom: 'amendes.gouv.fr - Trésor Public',
      mail: 'recouvrement@amendes-gouv-huissier.com',
    },
    destinataire: 'vous@votreadresse.fr',
    objet: 'Avis de contravention n°AM-664821 - À retourner sous 5 jours',
    heuresMinutesRéception: '09:15',
    type: 'Hameçonnage',
  },
  {
    id: 'ORANGE',
    expediteur: {
      nom: 'Orange - Service Mobile',
      mail: 'portabilite@orange-mobile-service.com',
    },
    destinataire: 'vous@votreadresse.fr',
    objet: 'Une demande de portabilité de votre numéro a été initiée',
    heuresMinutesRéception: '09:14',
    type: 'Hameçonnage',
  },
  {
    id: 'BANQUEPOSTALE',
    expediteur: {
      nom: 'La Banque Postale',
      mail: 'vous@votreadresse.fr',
    },
    destinataire: 'vous@votreadresse.fr',
    objet: 'Votre relevé de compte de septembre est disponible',
    heuresMinutesRéception: '08:30',
    type: 'Légitime',
  },
  {
    id: 'ANSSI',
    expediteur: {
      nom: 'ANSSI - CERT-FR',
      mail: 'alerte-cert@anssi-gouv-fr.net',
    },
    destinataire: 'rssi@votreentreprise.fr',
    objet: 'Votre relevé de compte de septembre est disponible',
    heuresMinutesRéception: '08:12',
    type: 'Hameçonnage',
  },
]);
