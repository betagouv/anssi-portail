<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  résumé="En résumé&nbsp;: cette technique usurpe l'autorité même en charge de la cybersécurité pour faire baisser la vigilance, c'est un vecteur réel et documenté. Réflexe&nbsp;: toute alerte de sécurité se vérifie sur cert.ssi.gouv.fr, et un correctif ne s'installe jamais depuis un fichier reçu par email, aussi urgent et officiel qu'il paraisse."
>
  <li>
    Le vrai domaine de l'agence est cyber.gouv.fr (et cert.ssi.gouv.fr pour les alertes), pas
    «&nbsp;anssi-gouv-fr.net&nbsp;»
  </li>
  <li>
    L'ANSSI et le CERT-FR ne transmettent jamais eux-mêmes un fichier «&nbsp;correctif&nbsp;» à télécharger par
    email&nbsp;: les bulletins d'alerte sont publiés sur cert.ssi.gouv.fr et les correctifs s'appliquent toujours via le
    canal officiel de l'éditeur concerné (Windows Update, éditeur du logiciel, etc.)
  </li>
  <li>
    Un fichier .zip présenté comme un «&nbsp;correctif de sécurité&nbsp;» envoyé par email est un vecteur classique de
    diffusion de malware déguisé en mise à jour
  </li>
  <li>Aucun numéro de bulletin CERT-FR vérifiable indépendamment sur le site officiel</li>
</ReponseMailGenerique>
