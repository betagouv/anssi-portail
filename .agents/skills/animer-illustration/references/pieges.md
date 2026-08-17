# Pièges

Chaque entrée correspond à un dégât constaté en production ou en revue. Les
réglages qui les corrigent sont dans `scripts/svgo.config.mjs` et
`scripts/preparer_illustration.py` : ne pas les retirer sans mesurer.

## Export Figma

**Tracé exporté en aplat.** Le calque arrive en `fill` sans `stroke` : c'est le
contour vectorisé du trait, pas le trait. `stroke-dasharray` et
`stroke-dashoffset` ne pilotent qu'un contour, l'animation tourne jusqu'à
`finished` sans le moindre effet visible et la forme est opaque dès la première
frame. Aucun contournement fiable : faire ré-exporter le calque en trait.

**Tracé découpé en sous-chemins.** Figma coupe un tracé continu à chaque point
de branchement, typiquement autour d'une boucle. Le motif de tirets repart à
zéro sur chaque sous-chemin : le dessin se joue en morceaux simultanés. Le
recollage est automatique quand les extrémités coïncident.

**Calque non nommé.** Un tracé sans nom reconnu perd son id et n'obtient aucune
classe : il apparaît d'un coup. `auditer_traces.py` le détecte par la signature
`stroke-miterlimit="10"`, propre aux traits à main levée.

**Collision de nom.** Le calque `image` entre en conflit avec les ids
techniques `image0_…`. Le filtre exige un chiffre après le préfixe.

**Accents dans les noms de calque.** Figma exporte les accents en références de
caractères latin-1 : un calque `tracé` arrive en `tracÃ©` une fois le XML
décodé, et n'est plus reconnu. La moulinette répare ce mojibake avant de faire
correspondre les motifs.

**Zoom des photos.** Le facteur d'échelle s'écrit `matrix(...)` ou
`translate(...) scale(...)` selon l'export. Lire le premier nombre venu
confondrait la translation avec l'échelle et produirait une image
grossièrement mal dimensionnée.

**Emojis.** Ils ne survivent pas à l'export SVG. Demander des icônes vectorielles.

## SVGO

| Plugin             | Dégât                                                 | Réglage     |
| ------------------ | ----------------------------------------------------- | ----------- |
| `cleanupIds`       | casse les références `url(#pattern…)`                 | désactivé   |
| `collapseGroups`   | écrase le groupe isolant le filtre du nœud animé      | désactivé   |
| `mergePaths`       | fusionne des tracés voisins en sous-chemins           | désactivé   |
| `convertTransform` | arrondit la matrice du `<pattern>`, décale le cadrage | précision 8 |

**`pathLength` retiré des `<circle>`.** SVGO le supprime systématiquement. Il
porte la normalisation nécessaire au dessin progressif, et doit être réinjecté
après coup.

**`<script>` auto-fermant.** SVGO réécrit `<script></script>` en `<script/>`,
que le navigateur ignore. N'ajouter aucun script avant SVGO.

## Rendu

**Tremblement.** Animer un `transform` sur un nœud portant un `filter` fait
recalculer le flou gaussien à chaque frame. La moulinette déplace le filtre sur
un groupe interne. Même cause pour un `<rect>` rempli d'un `<pattern>` bitmap
mis à l'échelle : les photos ne reçoivent qu'un fondu.

**Photo floue.** Figma zoome l'image dans sa boîte via la matrice du `<pattern>`.
Dimensionner sur la taille source produit une image trop petite. La cible se
calcule sur la taille réellement affichée :

```
cible = min(round(largeur_source × zoom × largeur_boîte × 2), largeur_source)
```

Le `<image>` conserve ses `width`/`height` d'origine : seul le `href` change,
le navigateur redimensionne dans la boîte déclarée.

**Largeur nulle.** Un parent en `margin: auto` ou `width: fit-content` avec un
enfant en `width: 100 %` donne une largeur nulle. Donner une largeur définie au
parent, ou une taille intrinsèque à l'enfant.

**Hauteur effondrée.** La première scène est en flux normal (`gabarit`) et donne
sa hauteur au conteneur ; les suivantes sont en `position: absolute`.

## Encodage des photos

**Extension du fichier temporaire.** ImageMagick choisit son encodeur d'après
l'extension du fichier de sortie. Écrire dans `nom.avif.partiel` avant de
renommer produit silencieusement un PNG portant l'extension `.avif` : environ
trente fois le poids attendu, sans le moindre message d'erreur. Le nom
provisoire doit conserver l'extension finale, et la moulinette vérifie avec
`identify` que le fichier livré est bien un AVIF.

Contrôler le format, pas seulement l'existence ou le poids du fichier :

```bash
identify -format '%f %m %wx%h %b\n' front/assets/images/**/animation/*.avif
```

## Production

**CSP.** `style-src` n'autorise qu'un nonce en production : un attribut
`style="…"` inline est bloqué, sans erreur visible en développement. Ne jamais
piloter une animation par une variable CSS inline. C'est ce qui rendait les
illustrations invisibles sur Chrome en environnement déployé.

**Poids du SVG source.** Un export Figma avec photos embarquées pèse plusieurs
mégaoctets de base64. Le supprimer après traitement, et vérifier qu'il n'est pas
resté indexé : `git status --porcelain` ne doit montrer aucun `.svg` source.

**Fichiers tronqués.** Jekyll en mode watch copie les fichiers pendant leur
écriture. Les AVIF sont écrits de façon atomique par la moulinette.
