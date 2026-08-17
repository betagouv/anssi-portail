"""Transforme un export SVG Figma en composant de scène animable.

Enchaîne : nommage des calques en classes, enveloppe des nœuds filtrés,
recollage des tracés, externalisation des photos en AVIF, optimisation SVGO,
puis écriture du composant Svelte.

    python3 preparer_illustration.py export.svg \
      --composant SectionModules \
      --sortie front/lib-svelte/src/parcours-securisation/animation \
      --images front/assets/images/parcours-securisation/animation
"""

import argparse
import base64
import re
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from recoller_traces import recolle  # noqa: E402

SVG = 'http://www.w3.org/2000/svg'
XLINK = 'http://www.w3.org/1999/xlink'
ET.register_namespace('', SVG)

CONFIG_SVGO = Path(__file__).parent / 'svgo.config.mjs'
VERSION_SVGO = 'svgo@4.0.2'

# Les ids générés par Figma pour les ressources : à conserver, ils sont
# référencés par url(#...). Le chiffre évite de confondre avec le calque `image`.
IDS_TECHNIQUES = re.compile(r'^(pattern|filter|image|paint|mask|clip)\d')

CALQUES = [
    (re.compile(r'^fond(-couleur)?(_\d+)?$'), 'fond'),
    (re.compile(r'^image(_\d+)?$'), 'image'),
    (re.compile(r'^(carte|progression)([-_]\w+)?$'), 'carte'),
    (re.compile(r'^bulle(_\d+)?$'), 'bulle'),
    (re.compile(r'^icone(_\d+)?$'), 'icone'),
    (re.compile(r'^profil(_\d+)?$'), 'profil'),
    (re.compile(r'^curseur(_\d+)?$'), 'curseur'),
    (re.compile(r'^forme(_\d+)?$'), 'forme'),
    (re.compile(r'^trac[eé](_\d+)?$'), 'trace'),
]


def repare_mojibake(texte):
    """Figma exporte les accents en références de caractères latin-1.

    Un calque nommé `tracé` arrive donc en `tracÃ©`, que les motifs ne
    reconnaîtraient pas.
    """
    try:
        return texte.encode('latin-1').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        return texte


def classe_de(identifiant):
    identifiant = repare_mojibake(identifiant)
    for motif, classe in CALQUES:
        if motif.match(identifiant):
            return classe
    return None


def enveloppe_filtre(element):
    """Déplace le filtre sur un groupe interne.

    Un flou gaussien porté par le nœud animé est recalculé à chaque frame, ce
    qui produit un tremblement visible.
    """
    interne = ET.SubElement(element, f'{{{SVG}}}g')
    interne.set('filter', element.attrib.pop('filter'))
    interne.text = element.text
    for enfant in [e for e in list(element) if e is not interne]:
        element.remove(enfant)
        interne.append(enfant)
    element.text = None


def nomme_calques(racine, bilan):
    """Parcours descendant : un calque nommé absorbe ses descendants.

    Les sous-calques d'une carte (titre, icône, badge…) s'animent avec elle ;
    leur donner une classe les ferait vivre leur propre vie.
    """
    rang_carte = [0]

    def visite(parent, sous_calque):
        for element in list(parent):
            href = element.attrib.pop(f'{{{XLINK}}}href', None)
            if href is not None:
                element.set('href', href)
            element.attrib.pop('data-name', None)

            identifiant = element.get('id')
            mappe = False
            if identifiant is not None and not IDS_TECHNIQUES.match(identifiant):
                classe = None if sous_calque else classe_de(identifiant)
                del element.attrib['id']
                if classe is None:
                    bilan['ids_retires'] = bilan.get('ids_retires', 0) + 1
                else:
                    mappe = True
                    bilan[classe] = bilan.get(classe, 0) + 1
                    if classe == 'carte':
                        rang_carte[0] += 1
                        element.set('class', f'carte carte-{rang_carte[0]}')
                    else:
                        element.set('class', classe)
                    if classe == 'trace':
                        element.set('pathLength', '1')
                        d = element.get('d')
                        if d:
                            neuf, raccords = recolle(d)
                            if raccords:
                                element.set('d', neuf)
                                bilan['raccords'] = bilan.get('raccords', 0) + raccords
                    if 'filter' in element.attrib and element.tag == f'{{{SVG}}}g':
                        enveloppe_filtre(element)
                        bilan['enveloppes'] = bilan.get('enveloppes', 0) + 1
            visite(element, sous_calque or mappe)

    visite(racine, False)


NOMBRE_TRANSFORM = r'-?[\d.]+(?:e-?\d+)?'


def facteurs_echelle(transform):
    """Isole le facteur d'échelle d'un transform.

    Figma écrit `matrix(...)` ou `translate(...) scale(...)` : lire le premier
    nombre venu confondrait la translation avec l'échelle.
    """
    matrice = re.search(rf'matrix\(\s*({NOMBRE_TRANSFORM})[\s,]+{NOMBRE_TRANSFORM}[\s,]+'
                        rf'{NOMBRE_TRANSFORM}[\s,]+({NOMBRE_TRANSFORM})', transform)
    if matrice:
        return float(matrice.group(1)), float(matrice.group(2))
    echelle = re.search(rf'scale\(\s*({NOMBRE_TRANSFORM})(?:[\s,]+({NOMBRE_TRANSFORM}))?\s*\)', transform)
    if echelle:
        x = float(echelle.group(1))
        return x, float(echelle.group(2)) if echelle.group(2) else x
    return None


def boites_de_motif(racine):
    """Associe chaque id d'image bitmap au facteur de zoom et à sa boîte d'affichage."""
    resultat = {}
    for motif in racine.iter(f'{{{SVG}}}pattern'):
        usage = motif.find(f'{{{SVG}}}use')
        if usage is None:
            continue
        cible = (usage.get('href') or usage.get(f'{{{XLINK}}}href') or '').lstrip('#')
        zoom = facteurs_echelle(usage.get('transform', ''))
        if zoom is None:
            continue
        zoom_x, zoom_y = zoom
        reference = f"url(#{motif.get('id')})"
        for element in racine.iter():
            if element.get('fill') == reference:
                resultat[cible] = (zoom_x, zoom_y,
                                   float(element.get('width')), float(element.get('height')))
                break
    return resultat


def externalise_images(racine, dossier_images, prefixe, chemin_public, densite, qualite, bilan):
    """Sort les photos base64 en fichiers AVIF dimensionnés pour leur affichage réel."""
    boites = boites_de_motif(racine)
    dossier_images.mkdir(parents=True, exist_ok=True)
    compteur = 0

    for image in racine.iter(f'{{{SVG}}}image'):
        href = image.get('href', '')
        if not href.startswith('data:'):
            continue
        largeur, hauteur = int(image.get('width')), int(image.get('height'))
        identifiant = image.get('id')
        if identifiant not in boites:
            print(f"  ! image {identifiant} sans motif exploitable, ignorée")
            continue
        zoom_x, zoom_y, boite_l, boite_h = boites[identifiant]

        # Figma zoome l'image dans sa boîte : la cible se calcule sur la taille
        # réellement affichée, pas sur la taille source.
        cible_l = min(round(largeur * zoom_x * boite_l * densite), largeur)
        cible_h = min(round(hauteur * zoom_y * boite_h * densite), hauteur)

        compteur += 1
        suffixe = '' if compteur == 1 else f'-{compteur}'
        nom = f'{prefixe}{suffixe}.avif'
        source = dossier_images / f'.source-{nom}.bin'
        source.write_bytes(base64.b64decode(href.split('base64,', 1)[1]))
        # L'extension pilote le choix de l'encodeur ImageMagick : la garder.
        provisoire = dossier_images / f'.partiel-{nom}'
        subprocess.run(['convert', str(source), '-resize', f'{cible_l}x{cible_h}!',
                        '-quality', str(qualite), str(provisoire)], check=True)
        # Écriture atomique : Jekyll en watch copie sinon un fichier tronqué.
        format_obtenu = subprocess.run(['identify', '-format', '%m', str(provisoire)],
                                       capture_output=True, text=True).stdout.strip()
        if format_obtenu.upper() != 'AVIF':
            raise SystemExit(f"encodage AVIF échoué : {provisoire.name} est du {format_obtenu}")
        provisoire.replace(dossier_images / nom)
        source.unlink()

        image.set('href', f'{chemin_public.rstrip("/")}/{nom}')
        poids = (dossier_images / nom).stat().st_size / 1024
        print(f"  image {largeur}x{hauteur} affichée {largeur * zoom_x * boite_l:.0f}"
              f"x{hauteur * zoom_y * boite_h:.0f} -> {cible_l}x{cible_h}  {nom}  {poids:.1f} Ko")
        bilan['images'] = bilan.get('images', 0) + 1


def optimise(source, destination):
    subprocess.run(['pnpm', 'dlx', VERSION_SVGO, '--config', str(CONFIG_SVGO),
                    '-i', str(source), '-o', str(destination)], check=True,
                   stdout=subprocess.DEVNULL)
    texte = destination.read_text()
    # SVGO retire `pathLength` des <circle> : il porte l'animation de dessin.
    texte, remis = re.subn(r'(<circle(?:(?!/>).)*?class="[^"]*\btrace\b[^"]*")(?!(?:(?!/>).)*?pathLength)',
                           r'\1 pathLength="1"', texte, flags=re.S)
    destination.write_text(texte)
    return remis


def main():
    parseur = argparse.ArgumentParser(description=__doc__,
                                      formatter_class=argparse.RawDescriptionHelpFormatter)
    parseur.add_argument('export', help='SVG exporté de Figma, calques nommés')
    parseur.add_argument('--composant', required=True, help='nom PascalCase de la scène')
    parseur.add_argument('--sortie', required=True, help='dossier des composants de scène')
    parseur.add_argument('--images', help='dossier des AVIF (requis si photos embarquées)')
    parseur.add_argument('--chemin-public', help="préfixe d'URL des AVIF, déduit de --images sinon")
    parseur.add_argument('--prefixe-image', help='nom de base des AVIF, déduit du composant sinon')
    parseur.add_argument('--densite', type=int, default=2, help='facteur écran (défaut 2)')
    parseur.add_argument('--qualite', type=int, default=60, help='qualité AVIF (défaut 60)')
    arguments = parseur.parse_args()

    if not shutil.which('convert'):
        parseur.error("ImageMagick (`convert`) est requis pour encoder les AVIF")

    arbre = ET.parse(arguments.export)
    racine = arbre.getroot()
    racine.attrib.pop('width', None)
    racine.attrib.pop('height', None)

    bilan = {}
    nomme_calques(racine, bilan)

    if any(e.get('href', '').startswith('data:') for e in racine.iter(f'{{{SVG}}}image')):
        if not arguments.images:
            parseur.error("l'export contient des photos : --images est requis")
        dossier = Path(arguments.images)
        chemin_public = arguments.chemin_public or '/' + str(dossier).split('assets/', 1)[-1].join(['assets/', ''])
        prefixe = arguments.prefixe_image or re.sub(r'(?<!^)(?=[A-Z])', '-', arguments.composant).lower()
        externalise_images(racine, dossier, prefixe, chemin_public,
                           arguments.densite, arguments.qualite, bilan)

    sortie = Path(arguments.sortie)
    sortie.mkdir(parents=True, exist_ok=True)
    brut = sortie / f'.{arguments.composant}.brut.svg'
    optimise_svg = sortie / f'.{arguments.composant}.opt.svg'
    brut.write_text(ET.tostring(racine, encoding='unicode'))
    remis = optimise(brut, optimise_svg)

    composant = sortie / f'{arguments.composant}.svelte'
    composant.write_text('<script lang="ts"></script>\n\n' + optimise_svg.read_text().strip() + '\n')
    brut.unlink()
    optimise_svg.unlink()

    print(f"\n{composant}")
    print(f"  calques : { {k: v for k, v in bilan.items() if k not in ('ids_retires',)} }")
    print(f"  ids décoratifs retirés : {bilan.get('ids_retires', 0)}")
    if remis:
        print(f"  pathLength réinjecté sur {remis} <circle>")
    print("\nÀ faire ensuite : prettier sur le composant, puis auditer_traces.py")


if __name__ == '__main__':
    main()
