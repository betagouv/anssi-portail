---
name: integrer-maquette-figma
description: >-
  Intègre une maquette Figma dans anssi-portail, qu'elle représente une page,
  une section, un composant, un héros, un état d'interface ou une évolution
  visuelle. Utiliser dès qu'une URL Figma, un file key ou un node ID est fourni,
  ou qu'une implémentation fidèle à une maquette Figma est demandée. Si cible
  nécessite une nouvelle page ou route, utiliser aussi `ajouter-page-publique`.
---

# Intégrer une maquette Figma

Traduire design dans cible adéquate sans imposer création d'une page. Préserver
architecture existante, design system, responsive et accessibilité.

## Déterminer portée

Avant modification, identifier cible :

- composant existant ;
- nouvelle section d'une page existante ;
- nouveau composant local ou partagé ;
- nouvelle page publique.

Pour nouvelle page ou route, utiliser `ajouter-page-publique` pour câblage
Jekyll/Svelte/Express. Ne pas dupliquer ce câblage ici.

Inspecter code cible, composants voisins et styles existants avant extraction
Figma. Éviter composant nouveau si variante existante couvre besoin.

## Cadrer maquette

1. Extraire `fileKey` et `nodeId` de l'URL. Conserver format attendu par outil
   Figma utilisé (`6172-6974` ou `6172:6974`).
2. Avec connecteur Figma disponible, récupérer capture globale et métadonnées
   structurelles (`get_screenshot`, `get_metadata` ou équivalents).
3. Repérer frames, sections, composants, états, tailles et ordre visuel.
4. Récupérer contexte de design du node précis avec `get_design_context` ou
   équivalent avant chaque fragment implémenté.
5. Utiliser Code Connect quand présent comme indication d'API, puis adapter au
   code réel et à version installée. Ne pas copier aveuglément.

Si URL ou node exploitable manque, demander élément précis manquant.

## Intégrer progressivement

Pour page ou écran important, travailler section par section :

1. isoler node de section ;
2. identifier composants existants et web components disponibles ;
3. construire markup sémantique ;
4. appliquer styles scopés et responsive ;
5. lancer validations ciblées ;
6. comparer rendu avec capture Figma ;
7. présenter résultat avant section suivante quand utilisateur demande suivi
   interactif.

Ne pas imposer pause après micro-composant autonome. Pour grosse page, ne pas
dérouler toutes sections sans contrôle visuel intermédiaire.

## Design system et assets

Lire [references/design-system-et-assets.md](./references/design-system-et-assets.md)
avant d'ajouter web component, token CSS, image ou illustration.

Règles impératives :

- ne jamais inventer tag `dsfr-*` ou `lab-anssi-*` ;
- utiliser nom exact d'attribut HTML indiqué par manifest installé ;
- pour toute propriété objet ou tableau passée à un web component depuis
  Svelte, importer `enPropriétéWebC` depuis `$plateforme/webComponent` et
  envelopper valeur avec cette fonction ; les propriétés primitives ne la
  nécessitent pas ;
- préférer composant Svelte existant ou HTML natif si UI Kit ne couvre pas cas ;
- préférer token CSS local à couleur codée en dur ;
- préférer SVG pour illustrations et AVIF pour photos ;
- fournir texte alternatif utile, ou `alt=""` pour image décorative ;
- ne pas reproduire texte dans image quand HTML convient.

## Style Svelte

- Utiliser Svelte 5 : `$props()`, `$state()`, snippets et `{@render}` quand
  appropriés.
- Placer `<script lang="ts">` avant markup, puis `<style lang="scss">`.
- Utiliser noms français explicites.
- Éviter styles inline, `!important` et commentaires évidents.
- Réutiliser mixins de `front/assets/styles/responsive.scss` et fonctions de
  `front/assets/styles/grille.scss`.
- Extraire composant local si fragment se répète dans même domaine ; déplacer
  vers `src/ui/` seulement si plusieurs pages le partagent réellement.

## Vérifier fidélité

Exécuter validations code applicables, puis vérifier visuellement :

- structure, espacements et alignements ;
- typographie et hiérarchie des titres ;
- couleurs et états interactifs ;
- comportement mobile, tablette et desktop ;
- focus clavier, ordre de lecture et contraste ;
- absence de débordement et régression autour cible ;
- rendu avec contenu réaliste, y compris textes longs.

Comparer capture locale à capture Figma. Documenter écarts intentionnels liés à
accessibilité, contenu réel ou limites techniques.
