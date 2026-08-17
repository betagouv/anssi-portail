# Vérifier une animation

Une illustration correcte à l'arrêt ne dit rien de son animation. Plusieurs
défauts sont invisibles à l'œil sur une capture unique : animation qui tourne
sans effet, dessin en morceaux, cadrage décalé d'un pixel, déclenchement au
scroll inopérant.

Les contrôles ci-dessous sont objectifs et rapides.

## Monter une page d'essai

Le serveur Vite de `front/lib-svelte` sert la racine du paquet, pas
`front/assets`. Exposer les images sous `front/lib-svelte/public/assets/…` le
temps du test, puis supprimer ce dossier.

```bash
cd front/lib-svelte
mkdir -p public/assets/images && cp -r ../assets/images/<domaine> public/assets/images/
pnpm exec vite --port 3099 --strictPort
```

Monter la scène ou l'enveloppe dans une page minimale, et isoler les calques à
observer avec `visibility: hidden` sur les autres.

## Conservation de la géométrie

Après toute réécriture de `d`, comparer les longueurs de chemin avant et après.
Une dérive au-delà du centième signale une transformation fautive.

```js
[...document.querySelectorAll('.trace')].map((p) => p.getTotalLength().toFixed(2));
```

Comparer aussi les rendus pixel à pixel :

```bash
compare -metric AE avant.png apres.png null:
```

Quelques dizaines de pixels sont normales : ce sont les jonctions et
l'antialiasing. Localiser l'écart avant de conclure — la bande contenant un
encart de debug fausse la mesure.

```bash
convert avant.png apres.png -compose difference -composite -colorspace Gray \
  -threshold 20% -define connected-components:verbose=true -connected-components 8 null:
```

## Continuité du dessin

Un tracé doit se dessiner d'un seul trait. Compter les fragments bleus disjoints
pendant l'animation : leur nombre doit être égal au nombre d'éléments `.trace`,
jamais supérieur.

```bash
convert capture.png -colorspace Gray -threshold 60% -negate \
  -define connected-components:area-threshold=4 \
  -define connected-components:verbose=true -connected-components 8 null: | grep -c 'gray(255)'
```

## Captures échelonnées

`--virtual-time-budget` accélère les timers et donne une frame à un instant
choisi.

```bash
for t in 200 600 1000 1600; do
  google-chrome --headless --disable-gpu --hide-scrollbars --window-size=1000,700 \
    --virtual-time-budget=$t --screenshot=t$t.png http://localhost:3099/essai.html
done
montage t*.png -tile 4x1 -geometry +4+4 planche.png
```

Attention : l'`IntersectionObserver` ne se réévalue pas sous
`--virtual-time-budget`. Le déclenchement au scroll doit se vérifier en temps
réel, via le protocole de débogage.

## Déclenchement au scroll

Lancer Chrome avec `--remote-debugging-port`, puis piloter la page en temps réel
depuis Node — `WebSocket` est disponible nativement. Sonder après chaque
défilement :

```js
[...document.querySelectorAll('.illustration-animee')].map((el) => ({
  gelee: el.classList.contains('en-pause'),
  animations: el
    .querySelector('.carte-1')
    ?.getAnimations()
    .map((a) => a.playState + '@' + Math.round(a.currentTime)),
}));
```

Attendu : gelée à la frame 0 hors écran, jouée puis terminée une fois visible,
regelée en sortant. Les temps de fin doivent correspondre au délai plus la durée
de la convention.

## Mouvement réduit

```bash
google-chrome --headless --force-prefers-reduced-motion …
```

`document.getAnimations().length` doit valoir `0`, et l'illustration afficher
son état final immédiatement. Comparer la capture à celle de l'animation
terminée : l'écart doit être nul à quelques pixels près.

## Avant de rendre la main

```bash
python3 .agents/skills/animer-illustration/scripts/auditer_traces.py front/lib-svelte/src
pnpm lint && pnpm --filter @anssi-portail/svelte build
```

Arrêter les serveurs de test, supprimer `front/lib-svelte/public` et les pages
d'essai, et vérifier que `git status` ne montre que les fichiers attendus.
