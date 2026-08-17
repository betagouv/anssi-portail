"""Recolle les sous-chemins contigus d'un tracé animé.

Figma coupe un tracé continu à chaque point de branchement. Comme le motif de
tirets repart à zéro sur chaque sous-chemin, l'animation de dessin se jouerait
en plusieurs morceaux simultanés au lieu d'une ligne unique.
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from chemin_svg import sous_chemins  # noqa: E402

TOLERANCE = 0.02


def _proche(a, b):
    return a is not None and b is not None and abs(a[0] - b[0]) < TOLERANCE and abs(a[1] - b[1]) < TOLERANCE


def _nombre(valeur):
    return f"{valeur:.2f}".rstrip('0').rstrip('.') or '0'


def recolle(d):
    """Retourne (nouveau_d, nombre_de_raccords). Géométrie strictement préservée."""
    morceaux = sous_chemins(d)
    if len(morceaux) < 2:
        return d, 0

    precedent = morceaux[0]
    texte = morceaux[0]['texte']
    fin = precedent['depart'] if precedent['ferme'] else precedent['fin_dessin']
    raccords = 0

    for morceau in morceaux[1:]:
        if not _proche(fin, morceau['depart']):
            texte += morceau['texte']
            precedent = morceau
            fin = morceau['depart'] if morceau['ferme'] else morceau['fin_dessin']
            continue

        # Un Z termine le sous-chemin : il faut le neutraliser avant de raccorder.
        if texte.rstrip()[-1:] in 'Zz':
            sans_z = texte.rstrip()[:-1]
            if _proche(precedent['fin_dessin'], precedent['depart']):
                texte = sans_z
            else:
                texte = sans_z + f"L{_nombre(precedent['depart'][0])} {_nombre(precedent['depart'][1])}"

        entete = re.match(rf'\s*[Mm]\s*[-+0-9.eE]+[\s,]*[-+0-9.eE]+', morceau['texte'])
        reste = morceau['texte'][entete.end():]
        if re.match(r'\s*[-+.\d]', reste):
            # Le M portait des paires supplémentaires : elles valaient des linetos.
            texte += f"L{_nombre(morceau['depart'][0])} {_nombre(morceau['depart'][1])}" + reste
        else:
            texte += reste

        precedent = morceau
        fin = morceau['depart'] if morceau['ferme'] else morceau['fin_dessin']
        raccords += 1

    return texte, raccords


def recolle_fichier(chemin, ecrire=False):
    """Recolle tous les `.trace` d'un composant. Retourne la liste des rapports."""
    fichier = Path(chemin)
    contenu = fichier.read_text()
    rapports = []

    def remplace(m):
        bloc = m.group(0)
        classes = re.search(r'class="([^"]*)"', re.sub(r'\s+', ' ', bloc))
        if not classes or 'trace' not in classes.group(1).split():
            return bloc
        attribut = re.search(r'\bd="([^"]+)"', bloc, re.S)
        if not attribut:
            return bloc
        d = re.sub(r'\s+', ' ', attribut.group(1))
        neuf, raccords = recolle(d)
        if not raccords:
            return bloc
        rapports.append({
            'avant': len(sous_chemins(d)),
            'apres': len(sous_chemins(neuf)),
            'raccords': raccords,
        })
        return bloc[:attribut.start(1)] + neuf + bloc[attribut.end(1):]

    nouveau = re.sub(r'<(path|circle|ellipse|rect)\b[^>]*?/>', remplace, contenu, flags=re.S)
    if ecrire and nouveau != contenu:
        fichier.write_text(nouveau)
    return rapports


if __name__ == '__main__':
    ecrire = '--ecrire' in sys.argv
    fichiers = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not fichiers:
        print("usage: recoller_traces.py [--ecrire] <composant.svelte>...")
        raise SystemExit(2)
    for f in fichiers:
        for r in recolle_fichier(f, ecrire):
            etat = 'OK' if r['apres'] == 1 else 'PARTIEL'
            print(f"  {etat:8} {Path(f).name:34} {r['avant']} -> {r['apres']} sous-chemins")
