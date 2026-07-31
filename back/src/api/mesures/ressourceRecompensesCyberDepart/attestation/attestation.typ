// Attestation d'obtention — badge CyberDépart (MesServicesCyber / ANSSI)
// Reproduction Typst de la page 18.svg — compiler avec : typst compile attestation.typ
//
// Police : le document original utilise la police « Marianne » (DSFR).
// Elle n'est pas librement redistribuable ; « Carlito » (métriquement proche
// d'une sans-serif humaniste) est utilisée en repli. Si la police Marianne
// est installée sur votre poste, remplacez la valeur de `font` ci-dessous.

// ---------- Paramètres ----------
#let entite = "[Nom de l'entité]"
#let organisation = "[nom de l'organisation]"

#let bleu-fr = rgb("#000091")
#let texte-principal = rgb("#161616")
#let texte-secondaire = rgb("#3A3A3A")
#let gris-ligne = rgb("#DDDDDD")

#set page(
  paper: "a4",
  margin: (left: 36pt, right: 36pt, top: 30pt, bottom: 30pt),
  footer: [
    #set text(size: 8pt, fill: texte-secondaire, font: "Carlito")
    MesServicesCyber - #link("https://messervices.cyber.gouv.fr/")[https://messervices.cyber.gouv.fr/]
  ],
  footer-descent: 12pt,
)

#set text(font: "Carlito", size: 10.5pt, fill: texte-principal, lang: "fr")
#set par(justify: false, leading: 0.8em)

// ---------- En-tête : bloc Marianne + logo MesServicesCyber ----------
#align(center)[
//  #image("assets/header.svg", height: 51pt)
]

#v(14pt)
#line(length: 100%, stroke: 0.5pt + gris-ligne)
#v(14pt)

// ---------- Titre ----------
#align(center)[
  #text(size: 19pt, weight: "bold", fill: texte-principal)[Attestation d'obtention]
]

#v(22pt)

// ---------- Corps ----------
L'Agence nationale de la sécurité des systèmes d'information atteste que #entite a obtenu son badge CyberDépart sur la base des informations déclarées sur MesServicesCyber.

#v(10pt)

L'obtention de ce badge atteste de l'engagement de #organisation en faveur du renforcement de sa cybersécurité, à travers la mise en œuvre de premières mesures clés de cybersécurité.

// ---------- Badge ----------
#v(24pt)
#align(center)[
  #image("./badge.svg", height: 200pt)
]
#v(6pt)

Le badge CyberDépart marque une première étape dans le parcours de sécurisation qui permettra de protéger #organisation contre les risques cyber les plus courants.
