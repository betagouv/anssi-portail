# Convention de calques

`IllustrationAnimee` n'anime rien qu'il connaisse d'avance : il applique une
chorégraphie à des classes. Une scène expose les classes qu'elle possède et
hérite de l'animation correspondante.

## Vocabulaire

Nom du calque dans Figma → classe générée → animation.

| Calque Figma                                      | Classe          | Entrée                 | Délai                         |
| ------------------------------------------------- | --------------- | ---------------------- | ----------------------------- |
| `fond-couleur`                                    | `fond`          | fondu                  | 0 s                           |
| `image`                                           | `image`         | fondu                  | 0 s                           |
| `trace`, `trace_2`…                               | `trace`         | dessin progressif      | 0,25 s                        |
| `carte`, `carte-01`, `carte-video`, `progression` | `carte carte-N` | fondu + montée         | 0,55 s puis +0,12 s par carte |
| `icone`                                           | `icone`         | apparition avec rebond | 0,6 s                         |
| `bulle`                                           | `bulle`         | fondu + montée         | 0,8 s                         |
| `profil`                                          | `profil`        | fondu + glissement     | 1 s                           |
| `curseur`                                         | `curseur`       | fondu + glissement     | 1,1 s                         |
| `forme`                                           | `forme`         | apparition avec rebond | 1,2 s                         |

Les cartes sont numérotées dans l'ordre du document : `carte-1` à `carte-6`.
Au-delà, ajouter les délais manquants dans `IllustrationAnimee`.

## Absorption des sous-calques

Un calque nommé **absorbe ses descendants**. Les sous-calques d'une carte
(titre, description, icône, badge, barre de progression) ne reçoivent pas de
classe : ils s'animent avec elle.

C'est voulu. Leur donner une classe les ferait entrer séparément de leur
support, ce qui casse la lecture.

Conséquence pratique : un `progression` au premier niveau devient une carte et
prend un rang dans le décalage ; imbriqué dans une carte, il est ignoré.

## Ce que la convention ne couvre pas

Les photos bitmap ne sont pas animées en `transform` : seul un fondu leur est
appliqué. Mettre à l'échelle un `<rect>` rempli par un `<pattern>` bitmap
provoque un tremblement à chaque frame.

## Étendre la convention

Pour un nouveau type de calque, ajouter dans `IllustrationAnimee` :

1. la classe dans la liste `will-change` ;
2. la règle `:global(.nouvelle-classe) { animation: … }` dans le bloc `&.active` ;
3. les keyframes si aucune existante ne convient ;
4. `transform-box: fill-box; transform-origin: center` si l'animation met à
   l'échelle ou pivote — les groupes SVG ont sinon leur origine en `0 0` ;
5. le motif correspondant dans `CALQUES`, dans `scripts/preparer_illustration.py`.

Garder les délais croissants et la durée totale sous deux secondes.

## Mouvement réduit et pause

Sous `prefers-reduced-motion: reduce`, `IllustrationAnimee` neutralise
animations et transitions, et n'affiche que la première scène. Le timer de
défilement ne démarre pas. Ne rien ajouter qui contourne ce garde-fou.

Le gel hors écran réutilise le même mécanisme que la pause :
`animation-play-state: paused !important`. Le `!important` est nécessaire, la
forme raccourcie `animation:` des règles de chorégraphie remettant sinon l'état
à `running` à spécificité égale.

Bouton play/pause seulement pour les illustrations qui bouclent. Le placer hors
du flux de l'illustration, et le masquer sous `prefers-reduced-motion`.
