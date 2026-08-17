"""Analyseur minimal de données de chemin SVG.

Suit le point courant et le début de sous-chemin sans calculer la géométrie des
courbes. Suffisant pour détecter les sous-chemins contigus et les recoller.

Gère les formes compressées produites par SVGO : commandes relatives,
répétitions implicites de paramètres, et drapeaux d'arc collés (`a5 5 0 013-3`).
"""

import re

NOMBRE = r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?'
JETON_NOMBRE = re.compile(NOMBRE)
COMMANDE = re.compile(r'[MmZzLlHhVvCcSsQqTtAa]')
ARITE = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0}

# Un arc porte deux drapeaux d'un seul chiffre, que SVGO colle au nombre suivant.
ARC = re.compile(
    rf'\s*({NOMBRE})[\s,]*({NOMBRE})[\s,]*({NOMBRE})[\s,]*([01])[\s,]*([01])[\s,]*({NOMBRE})[\s,]*({NOMBRE})'
)


def parametres(commande, bloc):
    """Découpe le bloc de nombres suivant une commande en lots de la bonne arité."""
    haut = commande.upper()
    if haut == 'Z':
        return [[]]
    if haut == 'A':
        lots, position = [], 0
        while position < len(bloc):
            m = ARC.match(bloc, position)
            if not m:
                break
            lots.append([float(x) for x in m.groups()])
            position = m.end()
        return lots
    n = ARITE[haut]
    nombres = [float(x) for x in JETON_NOMBRE.findall(bloc)]
    return [nombres[i:i + n] for i in range(0, len(nombres) - n + 1, n)]


def commandes(d):
    """Retourne la suite (lettre, paramètres) en dépliant les répétitions implicites."""
    sortie, position = [], 0
    while position < len(d):
        m = COMMANDE.search(d, position)
        if not m:
            break
        lettre = m.group(0)
        suivante = COMMANDE.search(d, m.end())
        fin = suivante.start() if suivante else len(d)
        for index, lot in enumerate(parametres(lettre, d[m.end():fin])):
            if index == 0:
                sortie.append((lettre, lot))
            else:
                # Un M répété vaut moveto puis linetos implicites.
                sortie.append(({'M': 'L', 'm': 'l'}.get(lettre, lettre), lot))
        position = fin
    return sortie


def sous_chemins(d):
    """Découpe `d` en sous-chemins décrits par leurs points remarquables.

    Chaque entrée expose : texte brut, point de départ, dernier point réellement
    dessiné (hors fermeture) et présence d'un `Z`.
    """
    resultat, courant = [], (0.0, 0.0)
    for texte in [x for x in re.split(r'(?=[Mm])', d) if x.strip()]:
        depart, point, dernier_dessine, ferme = None, courant, None, False
        for lettre, valeurs in commandes(texte):
            haut, relatif = lettre.upper(), lettre.islower()
            if haut == 'M':
                point = (valeurs[0] + (point[0] if relatif else 0),
                         valeurs[1] + (point[1] if relatif else 0))
                depart = point
            elif haut == 'Z':
                ferme = True
                point = depart
            elif haut == 'H':
                point = (valeurs[0] + (point[0] if relatif else 0), point[1])
                dernier_dessine = point
            elif haut == 'V':
                point = (point[0], valeurs[0] + (point[1] if relatif else 0))
                dernier_dessine = point
            else:
                dx, dy = point if relatif else (0.0, 0.0)
                point = (valeurs[-2] + dx, valeurs[-1] + dy)
                dernier_dessine = point
        resultat.append({
            'texte': texte,
            'depart': depart,
            'fin_dessin': dernier_dessine,
            'ferme': ferme,
        })
        courant = depart if ferme else point
    return resultat
