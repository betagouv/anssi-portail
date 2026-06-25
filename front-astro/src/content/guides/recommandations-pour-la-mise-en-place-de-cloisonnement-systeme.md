---
id: 'recommandations-pour-la-mise-en-place-de-cloisonnement-systeme'
nom: 'Recommandations pour la mise en place de cloisonnement système'
langue: 'FR'
collections:
  - 'Autre'
listeDocuments:
  - '[object Object]'
dateMiseAJour: '2017-12-22T00:00:00.000Z'
thematique: 'Cloisonnement'
besoins:
  - 'SECURISER'
lienCourt: 'https://cyber.gouv.fr/guide-cloisonnement-systeme'
---

<p>La fonction de sécurité de cloisonnement bénéficie d’une popularité bien moindre que celles de confidentialité et d’intégrité. Un mécanisme de cloisonnement permet de compartimenter un environnement d’exécution en plusieurs parties ne comportant pas les mêmes éléments et ne bénéficiant ni des mêmes droits ni des mêmes ressources. Intuitivement, il s’agit de découper un environnement monolithique à la manière d’un puzzle, sans impact sur le service rendu. L’avantage d’une telle démarche tient alors dans la possibilité de restreindre chaque partie de l’environnement aux actions dont elle a besoin. En d’autres termes, l’intérêt du découpage découle de l’application du principe de moindre privilège sur chaque sous-partie de l’environnement. Une fois ceci mis en œuvre, la compromission d’une sous-partie devient plus difficile car sa surface d’attaque est réduite. De plus, une corruption ne peut avoir que des conséquences limitées.</p><p>Cette démarche peut être appliquée à tout niveau, à l’échelle d’un système d’information entier comme à l’intérieur d’un processeur matériel dédié à des traitements spécifiques. Dans tous les cas, le même objectif est poursuivi : effectuer un découpage pertinent et choisir des mécanismes adaptés à la restriction des actions possibles pour chaque pièce du puzzle. Les mécanismes de cloisonnement se répartissent en trois grandes catégories qui sont complémentaires : le cloisonnement réseau, le cloisonnement cryptographique et le cloisonnement système. Seul le cloisonnement système est traité ici, bien qu’une grande majorité du document s’applique indifféremment aux trois catégories.</p><p>L’ambition de ce document est d’aborder le cloisonnement système de manière générique, en présentant son intérêt et ses objectifs. En effet, il n’existe pas de méthode universelle de mise en place du cloisonnement. Le lecteur est donc invité à s’approprier une démarche et à développer un esprit critique sur des choix de découpage et de mécanismes. Des définitions et des critères de comparaison sont proposés au fil du document.</p><p></p>
