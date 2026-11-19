import { unRappelAnnuel } from './rappelAnnuel.js';

export const rappelMiseAJourAnnuaireContacts = unRappelAnnuel()
  .avecTitre("MesServicesCyber - Mettre à jour l'annuaire de contacts en cas de crise cyber")
  .avecDescription(
    `Il y a un an, vous avez constitué votre annuaire de crise cyber. En cas d'attaque, c'est ce document, imprimé et lisible sans réseau, qui vous permettra de joindre les bonnes personnes rapidement.\n
Pour qu'il reste fiable, prenez quelques minutes pour le vérifier :\n
- Les personnes ont-elles changé (départ, arrivée, changement de poste) ?\n
- Vos prestataires et leurs contacts (informatique, hébergeur, assureur, banque) sont-ils toujours les mêmes ?\n
- Les numéros et adresses e-mail sont-ils toujours valides ?\n
\n
Pensez ensuite à dater la nouvelle version, à réimprimer le document et à remplacer les anciens exemplaires, y compris ceux conservés hors du bureau.\n
- Retrouvez le modèle et la mesure sur MesServicesCyber : https://messervices.cyber.gouv.fr`
  )
  .avecDescriptionAlarme("RAPPEL : mettre à jour l'annuaire de contacts en cas de crise cyber")
  .construis();

export const rappelMiseAJourListeDActivités = unRappelAnnuel()
  .avecTitre("MesServicesCyber - Mettre à jour la liste d'activités")
  .avecDescription(
    `Il y a un an, vous avez recensé les activités et les systèmes à protéger en priorité. C’est ce document, tenu à jour, qui vous permet de savoir ce qui doit être sécurisé et remis en marche en premier en cas d’attaque.\n
\n
Pour qu’il reste fiable, prenez quelques minutes pour le vérifier :\n
- Les activités prioritaires sont-elles toujours les mêmes (nouvelle activité, activité arrêtée ou devenue critique) ?\n
- Les responsables de chaque activité ont-ils changé (départ, arrivée, changement de poste) ?\n
- Les outils, logiciels, équipements et services numériques utilisés sont-ils toujours les mêmes (nouvel outil, ancien serveur ou équipement oublié, changement de prestataire) ?\n
\n
Pensez ensuite à dater la nouvelle version et à remplacer l’ancienne, y compris les exemplaires partagés avec vos collaborateurs.\n
\n
Retrouvez le modèle et la mesure sur MesServicesCyber : [https://messervicescyber.beta.gouv.fr](https://messervicescyber.beta.gouv.fr)`
  )
  .avecDescriptionAlarme("RAPPEL : mettre à jour la liste d'activités")
  .construis();

export const rappelMiseAJourListeInterconnexions = unRappelAnnuel()
  .avecTitre("MesServicesCyber - Mettre à jour la liste des interconnexions du système d'information")
  .avecDescription(
    "Il y a un an, vous avez dressé la liste des interconnexions de votre système d'information avec les autres systèmes, avec un point de contact pour chacune. En cas d'incident, c'est cette liste qui vous permettra de savoir ce qui entre et sort de votre SI, et qui appeler.",
    "Pour qu'elle reste fiable, prenez quelques minutes pour la vérifier :",
    '- Des interconnexions ont-elles été ajoutées, modifiées ou supprimées (VPN, services en ligne, télémaintenance, flux avec des partenaires) ?',
    '- Les systèmes concernés, des deux côtés, sont-ils toujours les mêmes ?',
    '- Les points de contact opérationnels chez vos partenaires et prestataires sont-ils toujours valides ?',
    'Pensez ensuite à dater la nouvelle version et à remplacer les anciens exemplaires.',
    '- Retrouvez le modèle et la mesure sur MesServicesCyber : https://messervices.cyber.gouv.fr'
  )
  .avecDescriptionAlarme("Rappel : mettre à jour la liste des interconnexions du système d'information")
  .construis();

export const rappelMiseAJourListePrestatairesEtFournisseurs = unRappelAnnuel()
  .avecTitre('MesServicesCyber - Mettre à jour la liste des prestataires et fournisseurs')
  .avecDescription(
    "Il y a un an, vous avez constitué la liste de vos prestataires et fournisseurs informatiques avec leurs coordonnées. En cas d'incident, c'est cette liste qui vous permettra de joindre rapidement les bonnes personnes.",
    "Pour qu'elle reste fiable, prenez quelques minutes pour la vérifier :",
    '- Vos prestataires et fournisseurs ont-ils changé (nouveau prestataire, fin de contrat) ?',
    '- Les contacts opérationnels et les contacts de secours sont-ils toujours les mêmes (départ, arrivée, changement de poste) ?',
    "- Les numéros de téléphone, adresses e-mail et modalités d'astreinte sont-ils toujours valides ?",
    'Pensez ensuite à dater la nouvelle version et à remplacer les anciens exemplaires, y compris ceux conservés hors du bureau.',
    '- Retrouvez le modèle et la mesure sur MesServicesCyber : https://messervices.cyber.gouv.fr'
  )
  .avecDescriptionAlarme('RAPPEL : mettre à jour la liste de vos prestataires et fournisseurs')
  .construis();

export const rappelMiseAJourInventaireComposantsObsolètes = unRappelAnnuel()
  .avecTitre("MesServicesCyber - Revoir l'inventaire des composants obsolètes")
  .avecDescription(
    "Vérifier que l'inventaire des composants obsolètes est à jour : nouveaux composants, statuts, mesures de compensation et échéances de remplacement.",
    '- Retrouvez le modèle et la mesure sur MesServicesCyber : https://messervices.cyber.gouv.fr'
  )
  .avecDescriptionAlarme("Rappel : revoir l'inventaire des composants obsolètes")
  .construis();
