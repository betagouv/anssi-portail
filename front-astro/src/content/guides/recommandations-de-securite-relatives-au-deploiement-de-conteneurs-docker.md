---
id: 'recommandations-de-securite-relatives-au-deploiement-de-conteneurs-docker'
nom: 'Recommandations de sécurité relatives au déploiement de conteneurs Docker'
langue: 'FR'
collections:
  - 'Autre'
listeDocuments:
  - '[object Object]'
dateMiseAJour: '2020-12-24T00:00:00.000Z'
thematique: 'Conteneurs Docker'
besoins:
  - 'SECURISER'
lienCourt: 'https://cyber.gouv.fr/guide-docker'
---

<p>Docker est une plateforme ouverte pour le développement, le déploiement et l’exécution d’applications. Il permet d’embarquer et d’exécuter une application dans un environnement cloisonné appelé conteneur. Ce cloisonnement permet d’exécuter plusieurs conteneurs simultanément sur un hôte donné. À la différence de la virtualisation où la machine virtuelle contient un système d’exploitation complet, les outils associés et l’application hébergée, le conteneur ne contient que les bibliothèques et les outils nécessaires à l’exécution de l’application, et il fonctionne directement dans le noyau de la machine hôte.</p><p><strong>Ce document a pour objectif de présenter les bonnes pratiques de sécurité relatives au déploiement et à l’exécution de conteneur Docker. De ce fait, le Docker daemon et la gestion des images Docker sont hors périmètre de l’étude. </strong></p><p>Un conteneur est une unité standard de logiciel, qui embarque le code et toutes ses dépendances, afin que l’application « conteneurisée » fonctionne normalement et de façon fiable, quelle que soit la machine hôte. L’image d’un conteneur, présente sur le système, devient un conteneur au moment de l’exécution.<br> Dans le cas d’un conteneur Docker, l’image devient un conteneur lorsqu’elle fonctionne sur le Docker daemon, ou Docker Engine. L’application « conteneurisée » fonctionnera toujours de la même manière, quel que soit l’hôte. Docker peut s’exécuter soit sur un serveur, soit dans un Cloud privé, ou public, apportant une capacité de portabilité et de flexibilité dans le déploiement et l’exécution de l’application.</p><p>Docker repose sur une architecture client-serveur. Un client Docker communique avec le Docker daemon pour gérer la construction et le fonctionnement des conteneurs Docker ainsi que la distribution des images Docker issues d’un Docker Registry, public ou privé.</p>
