"""Contrôle l'animabilité des tracés de toutes les illustrations.

Trois défauts rendent un tracé muet, tous rencontrés en production :

- aplat : calque exporté en contour rempli, `stroke-dashoffset` n'a aucune prise ;
- morcelé : plusieurs sous-chemins, le dessin se joue en morceaux simultanés ;
- orphelin : calque non nommé dans Figma, donc sans la classe `trace`.

    python3 auditer_traces.py front/lib-svelte/src [--recoller]
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from chemin_svg import sous_chemins  # noqa: E402
from recoller_traces import recolle_fichier  # noqa: E402

# Signature d'un trait à main levée exporté par Figma. Les bordures de cartes
# et les icônes ne portent pas `stroke-miterlimit`.
SIGNATURE = ('stroke-linecap="round"', 'stroke-miterlimit="10"')
CALQUES_ANIMES = ('fond', 'image', 'carte', 'bulle', 'icone', 'profil', 'curseur', 'forme', 'trace')


def elements(contenu):
    for m in re.finditer(r'<(path|circle|ellipse|rect|line|polyline)\b[^>]*?/>', contenu, re.S):
        bloc = re.sub(r'\s+', ' ', m.group(0))
        attributs = dict(re.findall(r'([\w:-]+)="([^"]*)"', bloc))
        yield m, bloc, attributs


def calque_ancetre(contenu, position):
    """Retourne la classe du calque animé englobant, si l'élément est imbriqué."""
    ouverts = []
    for m in re.finditer(r'<g\b([^>]*?)(/?)>|</g\s*>', contenu[:position]):
        if m.group(0).startswith('</'):
            if ouverts:
                ouverts.pop()
        elif not m.group(2):
            classes = re.search(r'class="([^"]*)"', m.group(1) or '')
            ouverts.append(classes.group(1).split()[0] if classes else None)
    return next((c for c in reversed(ouverts) if c in CALQUES_ANIMES), None)


def audite(racine):
    problemes = {'aplat': [], 'morcele': [], 'orphelin': [], 'sans_pathlength': []}
    total = 0

    for fichier in sorted(Path(racine).rglob('*.svelte')):
        contenu = fichier.read_text()
        if '<svg' not in contenu:
            continue
        for m, bloc, attributs in elements(contenu):
            classes = attributs.get('class', '').split()
            trace = 'trace' in classes

            if not trace:
                if all(s in bloc for s in SIGNATURE) and not calque_ancetre(contenu, m.start()):
                    problemes['orphelin'].append((fichier, m.group(1)))
                continue

            total += 1
            if not attributs.get('stroke') or attributs['stroke'] == 'none':
                problemes['aplat'].append((fichier, m.group(1)))
            if 'pathLength' not in attributs:
                problemes['sans_pathlength'].append((fichier, m.group(1)))
            d = attributs.get('d')
            if d and len(sous_chemins(d)) > 1:
                problemes['morcele'].append((fichier, m.group(1)))

    return total, problemes


def repare(racine, problemes):
    """Recolle ce qui peut l'être. Les sous-chemins disjoints restent signalés."""
    for fichier in sorted({f for f, _ in problemes['morcele']}):
        for rapport in recolle_fichier(fichier, ecrire=True):
            print(f"  recollé  {fichier.name:34} {rapport['avant']} -> {rapport['apres']} sous-chemins")


def main():
    arguments = [a for a in sys.argv[1:] if not a.startswith('--')]
    racine = arguments[0] if arguments else 'front/lib-svelte/src'
    total, problemes = audite(racine)

    if '--recoller' in sys.argv and problemes['morcele']:
        repare(racine, problemes)
        # Un second passage : le recollage échoue sur des sous-chemins disjoints,
        # qui doivent rester visibles plutôt que d'être considérés réglés.
        total, problemes = audite(racine)

    libelles = {
        'aplat': "exporté en aplat, à faire ré-exporter en trait",
        'morcele': "en plusieurs sous-chemins, relancer avec --recoller",
        'sans_pathlength': "sans pathLength",
        'orphelin': "trait à main levée sans la classe trace",
    }
    en_defaut = 0
    for cle, libelle in libelles.items():
        for fichier, balise in problemes[cle]:
            en_defaut += 1
            print(f"  {cle:16} <{balise}> {fichier} — {libelle}")

    print(f"\n{total} éléments .trace inspectés, {en_defaut} en défaut")
    return 1 if en_defaut else 0


if __name__ == '__main__':
    raise SystemExit(main())
