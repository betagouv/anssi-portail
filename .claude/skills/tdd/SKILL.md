---
name: tdd
description: |
  Applique le cycle TDD (Rouge → Vert → Refactor) sur une tâche donnée, un comportement à la fois,
  avec proposition de commit après chaque étape Vert.
---

# Méthode TDD — baby steps stricts

Le cycle est **Rouge → Vert → Refactor**, un comportement à la fois :

1. **Ajouter un seul test** qui échoue (Rouge) — jamais plusieurs à la fois
2. **Écrire le minimum de code** pour faire passer ce test et uniquement ce test (Vert)
3. **Refactorer** si nécessaire sans casser les tests existants
4. **Recommencer** avec le comportement suivant

## Règles impératives

- Ne jamais modifier un test existant — seulement en ajouter de nouveaux
- Ne jamais écrire du code de production sans avoir d'abord un test rouge
- Exécuter les tests après chaque étape Rouge **et** chaque étape Vert
- Si un test existant se met à échouer après une modification, corriger le code, pas le test

## Commits git

- Après chaque étape Vert (tests au vert), **proposer un commit** au développeur avant de passer à l'étape suivante
- Format : `[CATEGORIE] Message impératif en français` (ex. `[TOTO] Ajoute le cas nominal GET /api/toto`)
- Ne jamais créer le commit sans l'accord explicite du développeur
- Un commit = une étape de TDD Vert accompli (jamais regrouper plusieurs étapes)
