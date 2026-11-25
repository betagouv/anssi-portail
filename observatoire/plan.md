# Observatoire, onglet « Organisations » : données et plan

Document de travail du 25/11/2026, à relire ensemble avant de développer.

- Maquette : [Figma, onglet Organisations](https://www.figma.com/design/9Ldr1YaoUdj4ICbQMSFXsO/Dataviz?node-id=149-7173)
- Établi à partir de la maquette et du code. **Aucune base n'a été consultée** : les volumes et la qualité des données restent à vérifier.

## 1. En résumé

- Un cron quotidien dans `anssi-portail` publie les données de MesServicesCyber (MSC) dans la base de l'observatoire, dans un nouveau schéma `msc`, comme MonServiceSécurisé (MSS) le fait dans `mss`.
- **L'unité est l'utilisateur** (le compte), comme le service dans MSS. On garde tous les résultats, sans regrouper par SIRET.
- Une table `utilisateurs` contient le hash de l'email et le profil (région, département, secteur...). Ce hash est déjà dans les événements et dans les tables du portail : c'est lui qui permet de tout recouper.
- **Le cron est incrémental** : calcul complet au premier passage, puis seulement les nouveautés.
- Le nombre de diagnostics Cyberdépart est écrit en dur dans le code. Une donnée en dur **n'est pas publiée en base** : `ServiceObservatoire` la lit directement.
- Décisions prises et points en attente en [partie 6](#6-décisions-et-points-en-attente).

## 2. Les données affichées

« Filtrable » : les filtres de la page (territoire, secteur, type d'organisation) s'appliquent. Les sections « Entités sensibilisées » et « Entités passées à l'action » sont nationales, sans filtre.

| #   | Donnée dans la maquette                       | Filtrable | Source                                        | Où                |
| --- | --------------------------------------------- | --------- | --------------------------------------------- | ----------------- |
| 1   | Tests de maturité réalisés                    | Oui       | Table `resultats_test`                        | Base MSC          |
| 2   | Répartition par niveau de maturité            | Oui       | Table `resultats_test`                        | Base MSC          |
| 3   | Tests de sensibilisation (total, cumul)       | Non       | Table `resultats_test` + 4 événements         | Base MSC, journal |
| 4   | Diagnostics Cyberdépart réalisés              | Non       | Constante en dur                              | Code du portail   |
| 5   | Démarches de sécurisation initiées            | Non       | Événement `PARCOURS_REJOINT` + constante      | Journal, code     |
| 6   | Niveau Cyberdépart validé (total, cumul)      | Oui       | Événement `BADGE_CYBERDEPART_DEBLOQUE`        | Journal           |
| 7   | Niveau complet ≥ 50, 80, 100 % (total, cumul) | Oui       | Tables `prises_en_compte` et `mesures`        | Base MSC          |
| 8   | Carte par département                         | Oui       | Données 6 et 7                                | –                 |
| 9   | Profil de l'utilisateur (pour les filtres)    | –         | MonProfilAnssi, puis API Recherche Entreprise | API externes      |

## 3. Comment récupérer chaque donnée

Le hash d'email s'appelle `idUtilisateur` dans le journal, `email_hache` dans `utilisateurs` et `email_utilisateur_hache` dans `resultats_test` et `prises_en_compte`. C'est la même valeur partout.

### 1 et 2. Baromètre de maturité

- Lignes de `resultats_test` dont `type_test` vaut `maturité cyber` : une ligne par test.
- Le niveau (Insuffisant, Émergent, Intermédiaire, Confirmé, Optimal) n'est pas stocké. Il se calcule avec `RésultatTestMaturité.niveau()`, à partir de `reponses`.
- Test rattaché à un compte : profil de l'utilisateur.
- Test sans compte : région, secteur et taille déclarés dans le test, tous facultatifs. Il n'y a **ni département ni type d'organisation**.
- Un test peut être rattaché à un compte plus tard : l'événement `PROPRIETE_TEST_REVENDIQUEE` donne `idResultatTest` et `idUtilisateur`.

### 3. Tests de sensibilisation

| Test           | Source                                        |
| -------------- | --------------------------------------------- |
| Maturité       | `resultats_test`, type `maturité cyber`       |
| Vrai / faux    | Journal, `QUESTIONNAIRE_VRAI_FAUX_TERMINE`    |
| Exposition     | Journal, `TEST_EXPOSITION_REALISE`            |
| Réflexes cyber | Journal, `SIMULATION_REFLEXES_CYBER_TERMINEE` |
| Hameçonnage    | Journal, `TEST_HAMECONNAGE_TERMINE`           |

Une ligne par test. Le journal est nécessaire pour les quatre derniers : `resultats_test` ne garde que les tests faits avec un compte. Dans le journal, `idUtilisateur` est absent quand le test est fait sans compte.

### 4. Diagnostics Cyberdépart réalisés

- Diagnostic gratuit de 1h30 avec un Aidant cyber. Ce n'est pas le badge Cyberdépart.
- Seule valeur présente dans le code : `NOMBRES_DE_DIAGNOSTIC_CYBER = 7130` (`back/src/metier/statistiques.ts`), mise à jour à la main, dernière fois le 09/11/2026.
- **Décidé** : ajouter juste en dessous `DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER`, valeur initiale 09/11/2026. La PM modifie les deux constantes en même temps.
- Les deux constantes restent dans `statistiques.ts` et sont exportées. `ServiceObservatoire` les lit : le nombre comme `total`, la date comme `date` affichée sous le chiffre.

```ts
export const NOMBRES_DE_DIAGNOSTIC_CYBER = 7130;
export const DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER = new Date('2026-11-09');
```

### 5. Démarches de sécurisation initiées

- Même formule que la page Statistiques (`statistiquesMSC.ts`) : diagnostics + parcours démarrés.
- Le cron publie seulement les parcours démarrés (`PARCOURS_REJOINT`). `ServiceObservatoire` ajoute la constante à la lecture.
- Date affichée, proposition : la plus ancienne entre `DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER` et la dernière exécution du cron.

### 6. Niveau Cyberdépart validé

- Règle du code : 50 % des mesures du module 1, arrondi à l'entier inférieur (`back/src/metier/module.ts`).
- Source : journal, événement `BADGE_CYBERDEPART_DEBLOQUE`, un par utilisateur. La date de validation est celle de l'événement.
- Le seuil était de 80 % dans le code avant le 07/09/2026, mais la fonctionnalité n'était pas encore en production : tous les événements correspondent donc à la règle des 50 %.
- L'événement n'est émis que si le nombre de mesures est exactement égal au seuil. Si le seuil ou les mesures du module 1 changent un jour, des utilisateurs pourront être oubliés : prévoir alors un rattrapage.

### 7. Niveau complet

- Part des mesures prises en compte parmi **toutes** les mesures, Cyberdépart inclus (même règle que `ParcoursCompletTerminé`).
- Pour chaque utilisateur et chaque seuil (50, 80, 100 %) : date de la prise en compte qui le fait franchir.
- Pas d'événement pour 50 et 80 %, d'où l'usage de `prises_en_compte`, qui est datée.

### 8. Carte

Regroupement par département des données 6 et 7. Pas de collecte supplémentaire.

### 9. Profil de l'utilisateur

1. `utilisateurs` (portail) : l'email est chiffré, il faut le déchiffrer.
2. MonProfilAnssi, `recherche({ emails })` par lots : donne le SIRET. Ne pas utiliser `EntrepotUtilisateur.tous()`, limité à un compte toutes les 700 ms.
3. API Recherche Entreprise, une fois par SIRET : région, département, secteur, et de quoi calculer type et taille.
4. `typeEntite` et `tailleEntite` de `@lab-anssi/lib`, comme MSS.

| Filtre de la maquette       | Valeur dans l'observatoire                         |
| --------------------------- | -------------------------------------------------- |
| TPE, PME, ETI, Grand groupe | `taille_organisation` : `TPE`, `PME`, `ETI`, `GE`  |
| Collectivité                | `type_organisation` : `collectivite`               |
| État                        | `type_organisation` : `servicePublic`, à confirmer |
| Association                 | `type_organisation` : `association`                |

Codes : MSS écrit la région telle que renvoyée par l'API, le portail la convertit en ISO (`FR-ARA`). Proposition : garder le code INSEE de l'API dans tout l'observatoire, et convertir les régions déclarées dans les tests.

## 4. Tables proposées (schéma `msc`)

| Table                  | Colonnes                                                                                                                                                   | Données       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `executions`           | `date_execution`                                                                                                                                           | Date affichée |
| `utilisateurs`         | `id_hash`, `region`, `departement`, `secteur_activite`, `type_organisation`, `taille_organisation`                                                         | 9             |
| `tests_realises`       | `id_hash`, `type_test`, `date_realisation`, `niveau`, `id_hash_utilisateur`, `region_declaree`, `secteur_activite_declare`, `taille_organisation_declaree` | 1, 2, 3       |
| `parcours_rejoints`    | `id_hash_utilisateur`, `date`                                                                                                                              | 5 (en partie) |
| `badges_cyberdepart`   | `id_hash_utilisateur`, `date`                                                                                                                              | 6, 8          |
| `completions_parcours` | `id_hash_utilisateur`, `seuil` (50, 80, 100), `date`                                                                                                       | 7, 8          |

- La donnée 4 n'a pas de table, volontairement.
- `utilisateurs.id_hash` est le hash d'email du portail. Toutes les autres tables le référencent par `id_hash_utilisateur`.
- `tests_realises` regroupe les cinq types de test. `niveau` n'est rempli que pour la maturité. `id_hash_utilisateur` est vide pour un test sans compte, et les colonnes « déclarées » servent alors de profil.
- `tests_realises.id_hash` : hash de l'identifiant du résultat (maturité) ou de l'événement (autres tests). C'est la clé qui évite les doublons.
- Compte supprimé du portail mais présent dans le journal : ligne `utilisateurs` avec un profil vide, pour rester compté dans les totaux nationaux.
- Pas de ligne par utilisateur et par mois, contrairement à MSS : on stocke des dates, et les cumuls mensuels se calculent à la lecture.

### Rotation des secrets de hachage

Comme pour MSS, on régénère l'ensemble des données : vider `msc` avec `videDonneesMSC`, puis relancer la tâche, qui repart de tout l'historique. `MigrationHash` ne touche pas à la base de l'observatoire.

Les dates de `completions_parcours` sont alors recalculées avec les prises en compte et le catalogue de mesures du moment.

## 5. Plan de réalisation

1. **`lab-anssi-donnees-observatoire`** : migrations du schéma `msc`, `schemas.ts`, script `videDonneesMSC`, README.
2. **Portail, profils** : monter `@lab-anssi/lib` de 3.1.1 à 3.2.2 ou plus, compléter l'adaptateur Recherche Entreprise (nature juridique, catégorie, finances, administration).
3. **Portail, tâche `MiseAJourObservatoire`**, avec tests, sur le modèle de MSS (fonctionnement ci-dessous).
4. **Cron** : `clevercloud/cron.json`, script shell avec garde `INSTANCE_NUMBER`, rapport d'exécution, commande dans la console d'admin. En production le portail exécute le code compilé (`back/dist`). C'est le cron qui écrit dans la base de l'observatoire, le serveur web ne fait que la lire. Au déploiement, le compte de base de données utilisé par le cron doit pouvoir écrire dans `msc`.
5. **Lecture** : export des constantes des diagnostics (nombre et date de mise à jour), `AdaptateurObservatoireMSC` (mémoire et Postgres), `donneesOrganisations()` dans `ServiceObservatoire`, API.
6. **Affichage** : onglet « Organisations ». Les filtres, la carte et l'export CSV de la maquette n'ont pas encore été étudiés. Le filtre actuel de l'API n'accepte qu'une valeur de type, alors que la maquette permet d'en choisir plusieurs.

### Fonctionnement incrémental

Période traitée : depuis la dernière exécution réussie, avec un jour de recouvrement. Premier passage : tout l'historique. Les clés uniques rendent le cron rejouable sans doublon.

| Table                  | Traité à chaque passage                                                                                                    | Écriture                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `utilisateurs`         | Hash du portail absents de `msc.utilisateurs` (la table du portail n'a pas de date de création)                            | Ajout. Profil figé, sauf profil vide : nouvel essai |
| `tests_realises`       | Tests de la période + tests rattachés à un compte dans la période (`PROPRIETE_TEST_REVENDIQUEE`)                           | Ajout, ou mise à jour de `id_hash_utilisateur`      |
| `parcours_rejoints`    | Événements de la période                                                                                                   | Ajout si absent                                     |
| `badges_cyberdepart`   | Événements de la période                                                                                                   | Ajout si absent                                     |
| `completions_parcours` | Utilisateurs ayant une prise en compte dans la période. On relit toutes leurs prises en compte, car les seuils se cumulent | Ajout des seuils franchis, jamais de modification   |

- **API en panne** : l'exécution n'est enregistrée que si tout a réussi. `recherche()` renvoie une liste vide aussi bien en cas d'erreur que sans résultat : il faut pouvoir distinguer les deux.
- **Historique stable** : une date publiée ne change plus, même si une migration supprime des prises en compte, comme le 26/08/2026.
- **Limite** : si des mesures sont retirées du catalogue, un utilisateur peut franchir un seuil sans nouvelle action. Le cron ne le verra qu'à sa prochaine prise en compte.

## 6. Décisions et points en attente

### En attente

- **RSSI** : faut-il masquer les très petits effectifs ? Département + secteur + type peut isoler une seule organisation. Pour l'instant, on ne masque pas.

### Déjà décidé

- L'unité est l'utilisateur, sans regroupement par SIRET. Les textes de la maquette, qui parlent d'« organisations », ne changent pas.
- Le hash d'email est publié dans la base de l'observatoire.
- Le profil d'un utilisateur est figé, même s'il change d'organisation.
- Pour un test de maturité fait avec un compte, on prend le profil du compte.
- Cyberdépart validé : événement `BADGE_CYBERDEPART_DEBLOQUE`.
- Diagnostics : la source est la constante en dur, avec sa date de mise à jour. Rien en base.
- « Niveau complet » inclut les mesures de Cyberdépart.
- Maturité et hameçonnage comptent comme tests de sensibilisation. La page Statistiques exclut l'hameçonnage : les deux totaux différeront.
- Cron incrémental, seul à écrire dans la base de l'observatoire. Régénération complète en cas de rotation des secrets de hachage.

## 7. Limites et incohérences à connaître

- **Filtres du baromètre** : un test sans compte n'a ni département ni type, il sort des résultats dès qu'on filtre dessus.
- **Région des tests rattachés après coup** : `revendiquePropriete()` complète région, secteur et taille en mémoire, mais `metsÀjour()` n'enregistre que l'email haché. Sans effet ici : on prend le profil du compte.
- **Historique** : les courbes de la maquette partent d'octobre 2025, mais les données sont plus récentes. Dates des commits : `prises_en_compte` en mai 2026, `PARCOURS_REJOINT` le 12/08/2026, fin du test hameçonnage le 02/11/2026. Tout est en production aujourd'hui.
- **Saut en mars 2025** : les tests de maturité sans date ont été datés du 19/03/2025 (migration du 19/11/2026).
- **Chiffres de la maquette qui ne concordent pas** :
  - 7 036 démarches initiées, alors qu'elles devraient inclure les 9 412 diagnostics ;
  - 9 412 diagnostics, contre 7 130 dans le code ;
  - 57 031 tests de sensibilisation, mais une courbe de cumul qui plafonne vers 6 000 ;
  - 5 292 Cyberdéparts validés sur la carte de chiffre, 5 330 sur la carte de France.
- **Infobulles** : celle de la courbe Cyberdépart dit « terminé », celle du chiffre dit « 50 % des mesures ». Celle de la courbe des tests dit « chaque mois » alors que le titre dit « cumul ».
