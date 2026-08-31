import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('tutoriels')
    .where('id_mesure', 'FILTRE.8')
    .update({
      note: `Optionnel — Au minimum, le pare-feu de la box internet :
    Si un pare-feu physique dédié ne peut pas être mis en place et qu'une box internet est utilisée, activez a minima le pare-feu de votre box. Connectez-vous à l'interface d'administration de la box (adresse du type 192.168.1.1, indiquée sous la box) et vérifiez :
  <ul>
  <li>pare-feu activé ;</li>
  <li>aucune redirection de ports sans besoin explicite ;</li>
  <li>accès distant à l'administration désactivé.</li></ul>`,
    });
  await knex('tutoriels')
    .where('id_mesure', 'MCO_MCS.5')
    .update({
      note: `Attention :
    <ul>
    <li>Certaines mises à jour nécessitent un redémarrage des équipements pour être effectives. Il est donc nécessaire de vérifier périodiquement que les équipements ne sont pas en attente de redémarrage et de planifier les redémarrages ayant un impact sur la disponibilité des systèmes.</li>
    <li>Pour certaines mises à jour importantes (systèmes d'exploitation serveurs, bases de données, etc.), un délai de qualification interne peut être nécessaire pour s'assurer que la mise à jour n'impacte pas le bon fonctionnement du système.</li>
    </ul>`,
    });

  await knex('tutoriels')
    .where('id_mesure', 'MCO_MCS.3')
    .update({
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          '<strong>Sources à suivre :</strong><ul><li>CERT-FR : avis, alertes, indicateurs de compromission, bulletins thématiques (<msc-lien href="https://cert.ssi.gouv.fr/" libelle="Site du CERT-FR" neutre blank></msc-lien>) ;</li><li>listes de diffusion ou pages de sécurité des éditeurs utilisés (Microsoft, Apple, Linux, éditeurs métiers, équipementiers réseau) ;</li><li>CSIRT sectoriel ou régional s\'il en existe un pour l\'entité ;</li><li>prestataire de veille spécialisé pour les plus matures.</li></ul>',
          'Désigner une personne responsable et lui réserver des créneaux pour la veille.',
          "<strong>À chaque alerte critique :</strong> croiser avec l'inventaire et la cartographie pour savoir si l'entité est exposée, et déclencher le traitement (correctif ou mesure d'atténuation).",
          'Tracer les alertes traitées (date, source, équipements concernés, action menée).',
          'Présenter une synthèse trimestrielle au comité de pilotage sécurité.',
        ]),
      ]),
    });

  await knex('tutoriels')
    .where('id_mesure', 'EXO.1')
    .update({
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          `<strong><strong>Utiliser les kits et guides existants.</strong></strong><br>Inutile d'écrire un scénario de zéro. Des kits clés en main et des guides sont disponibles :
            <ul>
              <li><msc-lien href="https://messervices.cyber.gouv.fr/ressources/reflexes-cyber.html" libelle="Kit Réflexes cyber ANSSI" neutre blank></msc-lien></li>
              <li>Kits sectoriels et collectivités ANSSI :
                <ul>
                  <li><msc-lien href="https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/kit-exercice-collectivites-territoriales/" libelle="Kits collectivités ANSSI" neutre blank></msc-lien></li>
                  <li><msc-lien href="https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/kits-dexercices-sectoriels/" libelle="Kits sectoriels ANSSI" neutre blank></msc-lien></li>
                </ul>
              </li>
              <li><msc-lien href="https://messervices.cyber.gouv.fr/guides/organiser-un-exercice-de-gestion-de-crise-cyber" libelle="Guide d'aide à l'organisation d'un exercice de gestion de crise cyber" neutre blank></msc-lien></li><li><msc-lien href="https://www.amf.asso.fr/page-capcyberbrcrises-and-collectivites/43113" libelle="CapCyber Crise" neutre blank></msc-lien></li>
            </ul>`,
          "<strong><strong>Organiser un exercice simple.</strong></strong><br>Un format « sur table » suffit pour commencer : réunissez les personnes-clés (direction, IT ou prestataire, communication, métier), présentez un scénario réaliste (rançongiciel, fuite de données, indisponibilité de la messagerie…) et faites-leur dérouler à voix haute les décisions, dans l'ordre. À l'issue, formalisez les enseignements : qui appeler en priorité, qui décide de couper le réseau, comment alerter les clients, où sont les contacts d'urgence (assureur, CERT-FR, prestataire de réponse à incident).",
          '<strong><strong>Pour les entités plus matures : Rempar.</strong></strong><br><msc-lien href="https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/rempar/rempar25/" libelle="L\'ANSSI organise chaque année un exercice national, Rempar, avec scénarios prêts à jouer et accompagnement" neutre blank></msc-lien><br>C\'est l\'occasion idéale de passer d\'un exercice interne à un exercice plus complet, voire intersectoriel.',
        ]),
      ]),
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('tutoriels').where('id_mesure', 'FILTRE.8').update({
    note: "Optionnel — Au minimum, le pare-feu de la box internet :\nSi un pare-feu physique dédié ne peut pas être mis en place et qu'une box internet est utilisée, activez a minima le pare-feu de votre box. Connectez-vous à l'interface d'administration de la box (adresse du type 192.168.1.1, indiquée sous la box) et vérifiez :\n- pare-feu activé ;\n- aucune redirection de ports sans besoin explicite ;\n- accès distant à l'administration désactivé.",
  });
  await knex('tutoriels').where('id_mesure', 'MCO_MCS.5').update({
    note: "Attention :- Certaines mises à jour nécessitent un redémarrage des équipements pour être effectives. Il est donc nécessaire de vérifier périodiquement que les équipements ne sont pas en attente de redémarrage et de planifier les redémarrages ayant un impact sur la disponibilité des systèmes.  - Pour certaines mises à jour importantes (systèmes d'exploitation serveurs, bases de données, etc.), un délai de qualification interne peut être nécessaire pour s'assurer que la mise à jour n'impacte pas le bon fonctionnement du système.",
  });

  await knex('tutoriels')
    .where('id_mesure', 'MCO_MCS.3')
    .update({
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          "<strong>Sources à suivre :</strong><ul><li>CERT-FR : avis, alertes, indicateurs de compromission, bulletins thématiques (https://cert.ssi.gouv.fr/) ;</li><li>listes de diffusion ou pages de sécurité des éditeurs utilisés (Microsoft, Apple, Linux, éditeurs métiers, équipementiers réseau) ;</li><li>CSIRT sectoriel ou régional s'il en existe un pour l'entité ;</li><li>prestataire de veille spécialisé pour les plus matures.</li></ul>",
          'Désigner une personne responsable et lui réserver des créneaux pour la veille.',
          "<strong>À chaque alerte critique :</strong> croiser avec l'inventaire et la cartographie pour savoir si l'entité est exposée, et déclencher le traitement (correctif ou mesure d'atténuation).",
          'Tracer les alertes traitées (date, source, équipements concernés, action menée).',
          'Présenter une synthèse trimestrielle au comité de pilotage sécurité.',
        ]),
      ]),
    });

  await knex('tutoriels')
    .where('id_mesure', 'EXO.1')
    .update({
      etapes: knex.raw('?::jsonb', [
        JSON.stringify([
          '<strong><strong>Utiliser les kits et guides existants.</strong></strong><br>Inutile d\'écrire un scénario de zéro. Des kits clés en main et des guides sont disponibles :<ul><li><msc-lien href="https://messervices.cyber.gouv.fr/ressources/reflexes-cyber.html" libelle="Kit Réflexes cyber ANSSI" neutre></msc-lien></li><li>[A FILTRER AVEC LE SIRET] Kits sectoriels et collectivités ANSSI : https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/kit-exercice-collectivites-territoriales/ et https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/kits-dexercices-sectoriels/</li><li><msc-lien href="https://messervices.cyber.gouv.fr/guides/organiser-un-exercice-de-gestion-de-crise-cyber" libelle="Guide d\'aide à l\'organisation d\'un exercice de gestion de crise cyber" neutre></msc-lien></li><li><msc-lien href="https://www.amf.asso.fr/page-capcyberbrcrises-and-collectivites/43113" libelle="CapCyber Crise" neutre></msc-lien></li></ul>',
          "<strong><strong>Organiser un exercice simple.</strong></strong><br>Un format « sur table » suffit pour commencer : réunissez les personnes-clés (direction, IT ou prestataire, communication, métier), présentez un scénario réaliste (rançongiciel, fuite de données, indisponibilité de la messagerie…) et faites-leur dérouler à voix haute les décisions, dans l'ordre. À l'issue, formalisez les enseignements : qui appeler en priorité, qui décide de couper le réseau, comment alerter les clients, où sont les contacts d'urgence (assureur, CERT-FR, prestataire de réponse à incident).",
          '<strong><strong>Pour les entités plus matures : Rempar.</strong></strong><br><msc-lien href="https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/rempar/rempar25/" libelle="L\'ANSSI organise chaque année un exercice national, Rempar, avec scénarios prêts à jouer et accompagnement" neutre></msc-lien><br>C\'est l\'occasion idéale de passer d\'un exercice interne à un exercice plus complet, voire intersectoriel.',
        ]),
      ]),
    });
}
