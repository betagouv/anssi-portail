---
id: 'mise-en-oeuvre-des-fonctionnalites-de-securite-de-windows-10-reposant-sur-la'
nom: 'Mise en œuvre des fonctionnalités de sécurité de Windows 10 reposant sur la virtualisation'
langue: 'FR'
collections:
  - 'Autre'
listeDocuments:
  - '[object Object]'
dateMiseAJour: '2017-11-10T00:00:00.000Z'
thematique: 'Virtualisation'
besoins:
  - 'SECURISER'
lienCourt: 'https://cyber.gouv.fr/guide-windows10-vsm'
---

<p>Les technologies de virtualisation permettent d'opérer un cloisonnement entre des domaines fonctionnels différents, indépendamment des multiples couches physiques et logiques sous-jacentes. Pour cela, elles s'appuient sur des mécanismes logiciels ou des technologies embarquées au niveau du matériel. Plusieurs systèmes d'exploitation peuvent ainsi être virtualisés, c'est-à-dire exécutés sur une seule machine physique tout en étant isolés les uns des autres. La virtualisation a ainsi connu un essor important ces dernières années, lié notamment au développement de nouveaux usages comme l’informatique en nuage (cloud computing) mais également à la flexibilité qu'elle apporte à l'administration des systèmes d'information.</p><p>Les technologies de virtualisation ne sont toutefois pas l'apanage de l'informatique en nuage ou des infrastructures des systèmes d'information. Elles peuvent également être utilisées sur des postes de travail afin d'y exécuter différents environnements cloisonnés entre eux. Il s'agit d'un usage notamment illustré dans le guide d'administration sécurisée des systèmes d'information de l'ANSSI. Des solutions de sécurité peuvent également tirer profit des technologies de virtualisation pour isoler certains processus, qu'ils soient sensibles et critiques ou, à l'inverse, dangereux voire assurément malveillants.</p><p>Sous Windows 10, Microsoft met à profit les technologies de virtualisation à travers des fonctionnalités de sécurité reposant sur la virtualisation (VBS, Virtualization Based Security). À la date de publication de ce guide, Microsoft a regroupé ces fonctionnalités en deux ensembles : Device Guard et Credential Guard, qui ont tous deux un objectif général d'isolation de certains processus du système d'exploitation. Ils sont décrits dans ce document de manière à expliquer leurs apports et leurs limites en matière de sécurité. Les modalités de leur mise en œuvre sur des postes de travail exécutant le système d'exploitation Windows 10 de Microsoft dans un environnement Active Directory (AD) sont également détaillées. Au préalable, une présentation de la VBS et du VSM est toutefois indispensable à la compréhension du fonctionnement des mécanismes de sécurité mis en œuvre et leurs prérequis.</p><p></p>
