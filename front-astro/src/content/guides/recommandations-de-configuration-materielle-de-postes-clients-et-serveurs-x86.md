---
id: 'recommandations-de-configuration-materielle-de-postes-clients-et-serveurs-x86'
nom: 'Recommandations de configuration matérielle de postes clients et serveurs x86'
langue: 'FR'
collections:
  - 'Autre'
listeDocuments:
  - '[object Object]'
dateMiseAJour: '2015-03-31T00:00:00.000Z'
thematique: 'x86'
besoins:
  - 'SECURISER'
---

<p>Certaines de ces nouvelles fonctionnalités sont susceptibles d’engendrer des vulnérabilités du fait de défauts de spécification claire ou de problèmes d’implémentation. Si de nombreuses fonctions ajoutées au fil du temps constituent une menace au regard des vulnérabilités qu’elles peuvent engendrer, d’autres en revanche peuvent contribuer à améliorer la sécurité des systèmes d’exploitation qui les utilisent.</p><p>Ce document est constitué de deux parties :</p><ul><li>le premier chapitre traite essentiellement de mécanismes matériels présents ou prévus sur architecture x86. Certains sont accompagnés de recommandations quant à leur usage ;</li><li>le deuxième chapitre aborde des éléments de configuration qu’il convient de vérifier lors du paramétrage du BIOS d’un ordinateur.</li></ul><p>Les recommandations émises dans cette note technique, particulièrement celles associées à l’activation de fonctions matérielles, sont établies à l’état de l’art des connaissances sur leur sécurité et leurs vulnérabilités. Bien que certaines apportent une réelle plus-value en terme de durcissement sur le système, ces recommandations ne peuvent être considérées seules comme gage de fiabilité quant à leur robustesse. En effet, aucune évaluation de sécurité de ces fonctions n’a aujourd’hui été réalisée par l’ANSSI.<br> Cette note se concentre sur les fonctions de sécurité implantées au sein des processeurs et ne prétend donc pas à l’exhaustivité quant aux mécanismes de sécurité dont la mise en œuvre s’appuie sur des composants externes à ceux-ci. En particulier le TPM ainsi que les mécanismes qui l’utilisent (par exemple : Intel TXT ou le SecureBoot) ne sont pas abordés ici.</p>
