---
name: animer-illustration
description: >-
  Transforme une illustration statique en illustration animée dans anssi-portail :
  cinématique d'entrée au scroll, tracés dessinés progressivement, respect du
  mouvement réduit. Utiliser dès qu'un export SVG Figma doit être animé, qu'une
  image statique d'un héros ou d'un bloc de landing doit devenir animée, ou
  qu'un tracé animé ne se dessine pas correctement.
---

# Animer une illustration

Toutes les illustrations animées partagent un composant orchestrateur,
`front/lib-svelte/src/accueil/animation/IllustrationAnimee.svelte`, et une
convention de nommage de calques. Une scène est un SVG inliné dont les calques
portent des classes ; l'orchestrateur y accroche la chorégraphie.

Ne pas écrire d'animation ad hoc dans un composant : étendre la convention.

## Ce que fournit l'orchestrateur

- cinématique d'entrée séquencée, terminée en ~1,7 s ;
- déclenchement à l'entrée dans le viewport, gel hors écran ;
- neutralisation complète sous `prefers-reduced-motion` ;
- défilement de scènes quand il y en a plusieurs, avec bouton pause optionnel.

Lire [references/convention-calques.md](./references/convention-calques.md) pour
le vocabulaire de classes, les délais, et la façon d'étendre la convention.

## Déroulé

### 1. Obtenir l'export

Demander un export SVG **avec les calques nommés** selon le vocabulaire de la
convention. Les calques non nommés seront ignorés et resteront figés.

Exiger que les tracés soient exportés **en trait** (`stroke`), jamais en contour
vectorisé. Un aplat ne peut pas se dessiner progressivement.

### 2. Préparer la scène

```bash
python3 .agents/skills/animer-illustration/scripts/preparer_illustration.py <export.svg> \
  --composant SectionMachin \
  --sortie front/lib-svelte/src/<domaine>/animation \
  --images front/assets/images/<domaine>/animation
```

Le script nomme les calques en classes, isole les filtres, recolle les tracés,
externalise les photos en AVIF dimensionnées pour leur affichage réel, optimise
via SVGO et écrit le composant.

Vérifier le bilan affiché : le compte de calques doit correspondre à ce que
montre la maquette. Un calque attendu absent signale un nommage manquant côté
Figma.

Puis formater et contrôler :

```bash
pnpm --filter @anssi-portail/svelte exec prettier --write <composant>
python3 .agents/skills/animer-illustration/scripts/auditer_traces.py front/lib-svelte/src
```

### 3. Créer le composant enveloppe

Une enveloppe par illustration, à côté des scènes :

```svelte
<script lang="ts">
  import IllustrationAnimee from '<...>/accueil/animation/IllustrationAnimee.svelte';
  import SectionMachin from './SectionMachin.svelte';

  const scènes = [SectionMachin];
</script>

<IllustrationAnimee {scènes} étiquette="Description de ce que montre l'illustration." />
```

`étiquette` devient l'`aria-label` : décrire le contenu, pas la mécanique.

Pour plusieurs scènes qui défilent, passer le tableau complet et exposer une
prop `enPause` transmise à `IllustrationAnimee`.

### 4. Brancher dans la page

Remplacer l'image statique par l'enveloppe. Les composants de héros et de bloc
acceptent un snippet `illustration` qui court-circuite la prop image :

```svelte
{#snippet illustration()}
  <IllustrationMachin />
{/snippet}
```

Un bouton play/pause **uniquement** si l'illustration boucle sur plusieurs
scènes. Une cinématique d'entrée jouée une fois n'en a pas besoin.

### 5. Nettoyer

- supprimer le SVG source du disque, et le désindexer s'il avait été ajouté :
  ces fichiers pèsent plusieurs mégaoctets à cause du base64 ;
- vérifier si l'image statique remplacée sert ailleurs avant de la supprimer.

```bash
grep -rn "<nom-image>" front back --include="*.svelte" --include="*.html" | grep -v /_site/
git status --porcelain   # aucun .svg source ne doit rester indexé
```

## Pièges

Lire [references/pieges.md](./references/pieges.md) avant de modifier la
moulinette ou la configuration SVGO. Chaque réglage y corrige un dégât mesuré :
tremblement des calques filtrés, tracés dessinés en morceaux, `pathLength`
effacé, cadrage des photos décalé, styles inline bloqués par la CSP.

## Vérifier

Le rendu correct à l'arrêt ne prouve rien sur l'animation. Lire
[references/verification.md](./references/verification.md) pour les contrôles
objectifs : conservation de la géométrie, comparaison pixel, comptage des
fragments pendant le dessin, sondes du déclenchement au scroll et du mouvement
réduit.

Contrôle minimal avant de rendre la main :

```bash
python3 .agents/skills/animer-illustration/scripts/auditer_traces.py front/lib-svelte/src
pnpm lint && pnpm --filter @anssi-portail/svelte build
```
