<script lang="ts">
  import ReponseMailGenerique from './ReponseMailGenerique.svelte';
</script>

<ReponseMailGenerique
  résumé="En résumé&nbsp;: contrairement aux précédents scénarios de ce quiz basés sur un lien ou un QR code, celui-ci piège via la pièce jointe elle-même, le simple fait d'ouvrir un fichier Office non sollicité et «&nbsp;d'activer le contenu&nbsp;» peut suffire à compromettre le poste. Réflexe&nbsp;: ne jamais ouvrir une pièce jointe non sollicitée sans vérifier l'expéditeur, et vérifier toute contravention directement sur amendes.gouv.fr plutôt que via un document reçu par email."
>
  <li>
    Le vrai site est amendes.gouv.fr, pas «&nbsp;amendes-gouv-huissier.com&nbsp;»&nbsp;; un vrai avis de contravention
    arrive toujours par courrier officiel du Ministère de l'Intérieur (lettre 48N/48M), jamais en pièce jointe à
    imprimer et retourner par email
  </li>
  <li>
    Le paiement d'une contravention réelle se fait exclusivement en ligne sur amendes.gouv.fr avec la référence de
    l'avis, ou par timbre-amende, jamais en «&nbsp;retournant&nbsp;» un document signé par email
  </li>
  <li>
    Le fichier .doc peut contenir une macro malveillante&nbsp;: c'est un vecteur classique pour installer un logiciel
    espion ou rançongiciel dès l'ouverture, surtout si Word demande d'«&nbsp;activer le contenu&nbsp;»
  </li>
  <li>
    Aucune voie de contestation légale n'est rappelée, alors qu'elle figure systématiquement sur un vrai avis
    administratif
  </li>
</ReponseMailGenerique>
