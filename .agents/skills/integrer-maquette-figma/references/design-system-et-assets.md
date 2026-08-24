# Design system et assets Figma

## UI Kit installé

Manifest exact de version installée :

```text
node_modules/@lab-anssi/ui-kit/dist/ui-kit-components.json
```

Résoudre chemin pnpm si nécessaire :

```bash
find . -path '*/node_modules/@lab-anssi/ui-kit/dist/ui-kit-components.json' -print | head -1
```

Pour chaque composant, vérifier `tagName`, `props`, nom d'attribut HTML,
événements, slots et exemple. Ne jamais inventer tag ou propriété.

Web components sont chargés globalement par `front/_layouts/defaut.html`. Version
vient de `front/lib-svelte/package.json`, lue par
`front/_plugins/package_json.rb` et exposée comme `site.version_lab_ui_kit`.

Si élément Figma ne correspond à aucun composant manifeste, utiliser HTML natif,
SVG/image ou composant existant dans `front/lib-svelte/src/ui/`.

## Tokens CSS locaux

Consulter version installée, sans réseau :

```text
node_modules/@lab-anssi/ui-kit/dist/assets/dsfr-variables.css
node_modules/@lab-anssi/ui-kit/dist/assets/lab-anssi-theme.msc.css
front/assets/styles/site.scss
```

Utiliser couleur codée en dur seulement si aucun token ne représente valeur
sémantique nécessaire. Exemples présents dans projet :

- `--background-flat-blue-france-lab` ;
- `--background-active-blue-france` ;
- `--text-title-grey`, `--text-default-grey`, `--text-inverted-grey` ;
- `--border-default-grey`, `--border-action-high-blue-france` ;
- `--blue-france-925-125` ;
- `--background-contrast-green-bourgeon` ;
- `--background-alt-brown-cafe-creme` ;
- `--noir`, `--jaune-msc`, `--jaune-clair-msc`, `--bouton-arrondi`.

Breakpoints définis dans `front/assets/styles/responsive.scss` : `xs` 320 px,
`sm` 576 px, `md` 767 px, `lg` 992 px, `xl` 1280 px, `xxl` 1440 px.

## Composants de héros

Inspecter signatures actuelles avant usage :

- `front/lib-svelte/src/ui/Heros.svelte` pour formats `banniere`, `heros`,
  `heros-centre`, `details` ;
- `front/lib-svelte/src/ui/HerosRiche.svelte` pour variantes `bleu-clair`,
  `vert-clair`, `cafe-creme`.

## Assets

Emplacement par défaut : `front/assets/images/`, dans sous-dossier métier si
volume le justifie. Nommer en kebab-case français. Demander choix utilisateur
seulement si emplacement ou nom a impact réel ; sinon proposer défaut et avancer.

Préférer :

- SVG pour illustrations et pictogrammes ;
- AVIF pour photographies ;
- dimensions intrinsèques ou ratio explicite pour limiter changements de mise en page.

Optimiser asset sans altérer rendu attendu. Ne pas incorporer secret, URL Figma
temporaire ou donnée privée dans dépôt.

## Limites d'export Figma

Outils Figma peuvent limiter téléchargement ou capture aux nodes de premier
niveau (`\d+:\d+`). Calques imbriqués d'instances peuvent avoir IDs composés
comme `I<instance>;<child>` non ciblables directement.

Ne pas fabriquer recadrage approximatif pour composition complexe. Demander
export utilisateur et utiliser placeholder explicite en attendant. Pour asset
simple exportable, télécharger via connecteur puis enregistrer au chemin retenu.
