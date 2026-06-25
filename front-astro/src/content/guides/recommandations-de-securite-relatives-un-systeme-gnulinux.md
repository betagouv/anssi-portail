---
id: 'recommandations-de-securite-relatives-un-systeme-gnulinux'
nom: "Recommandations de configuration d'un système GNU/Linux"
langue: 'FR'
collections:
  - 'Autre'
listeDocuments:
  - '[object Object]'
dateMiseAJour: '2019-02-22T00:00:00.000Z'
thematique: 'GNU/Linux'
besoins:
  - 'SECURISER'
lienCourt: 'https://cyber.gouv.fr/guide-linux'
---

<p>Aujourd’hui les systèmes d’exploitation Unix et dérivés, et notamment GNU/Linux, jouent un rôle important dans l’écosystème des équipements, systèmes, réseaux et télécommunications. Ils sont en effet souvent déployés dans de nombreux produits (commutateurs, routeurs, téléviseurs, véhicules,...) Leur diversité et leur composition font qu’ils sont utilisés suivant un grand nombre de combinaisons possibles. Des règles de configuration permettent cependant d’obtenir des systèmes raisonnablement sûrs du moment que certains principes fondamentaux sont respectés, et de vérifier méthodologiquement qu’elles sont correctement appliquées par exemple à l’aide d’une liste de vérification. Le présent guide se concentre principalement sur des directives de configuration système génériques et des principes de bon sens qu’il convient d’appliquer lors du déploiement de services sur un système GNU/Linux. Il revient notamment sur les points suivants :</p><ul><li>Principes généraux de sécurité et de durcissement</li><li>Configuration matérielle avant installation</li><li>Installation du système</li><li>Configuration et services système</li><li>Solutions de cloisonnement et contrôle d’accès</li></ul><p> Ce document est également <a href="/guides/en-configuration-recommendations-gnulinux-system">disponible en anglais</a>. Certaines des versions ci-dessous sont obsolètes et proposées uniquement à des fins d'archivage.</p><p>Ce guide est accompagné de l'outil "Actionnable Linux", disponible à l'URL <a href="https://github.com/ANSSI-FR/actionnable-linux">https://github.com/ANSSI-FR/actionnable-linux</a>. Il s'agit d'un rôle Ansible qui fournit, à titre d'exemple uniquement, une façon d'implémenter certaines recommandations du guide. La publication de cet outil s’inscrit dans <a href="https://cyber.gouv.fr/enjeux-technologiques/open-source">la politique open source de l’ANSSI</a> visant à partager avec la communauté cyber les codes qu’elle produit. Elle rend possible la réutilisation de l’outil par l’écosystème et participe ainsi à l’amélioration de la sécurité de ses SI.
