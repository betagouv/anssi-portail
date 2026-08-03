// Attestation d'obtention — badge CyberDépart (MesServicesCyber / ANSSI)
// Reproduction Typst de la page 18.svg — compiler avec : typst compile attestation.typ
//
// Police : le document original utilise la police « Marianne » (DSFR).
// Elle n'est pas librement redistribuable ; « Carlito » (métriquement proche
// d'une sans-serif humaniste) est utilisée en repli. Si la police Marianne
// est installée sur votre poste, remplacez la valeur de `font` ci-dessous.

// ---------- Paramètres ----------
#let organisation = sys.inputs.at("organisation", default: "[nom de l'organisation]")

#let bleu-fr = rgb("#000091")
#let texte-principal = rgb("#161616")
#let texte-secondaire = rgb("#3A3A3A")
#let gris-ligne = rgb("#DDDDDD")

#set page(
  paper: "a4",
  margin: (left: 36pt, right: 36pt, top: 30pt, bottom: 60pt),
  footer: [
    #set align(left)
    #set text(size: 10pt, fill: texte-secondaire, font: "Marianne", weight: "bold")
    MesServicesCyber
    #set text(size: 10pt, fill: texte-secondaire, font: "Marianne", weight: "regular")
    \- #link("https://messervices.cyber.gouv.fr/")[https://messervices.cyber.gouv.fr/]
  ]
)

#set text(font: "Marianne", size: 11pt, fill: texte-principal, lang: "fr")
#set par(justify: false, leading: 0.8em)

// ---------- En-tête : bloc Marianne + logo MesServicesCyber ----------
#align(center)[
  #grid(
    columns: 3,
    column-gutter: 10pt,
    align: horizon,
    image("./republique_francaise.svg", height: 37pt),
    image("./logo_ANSSI.png", height: 40pt),
    align(left)[
      #stack(
        dir: ttb,
        spacing: 8pt,
        text(size: 12pt, weight: "bold", fill: texte-principal)[MesServiceCyber],
        text(size: 10pt, weight: "regular", fill: texte-principal)[Innovation ANSSI],
      )
    ],
  )
]

#v(14pt)
#line(length: 100%, stroke: 0.5pt + gris-ligne)
#v(10pt)

// ---------- Titre ----------
#align(center)[
  #text(size: 22pt, weight: "bold", fill: texte-principal)[Attestation d'obtention]
]

#v(22pt)

// ---------- Corps ----------
L'Agence nationale de la sécurité des systèmes d'information atteste que #organisation a obtenu son badge CyberDépart sur la base des informations déclarées sur MesServicesCyber.

#v(10pt)

L'obtention de ce badge atteste de l'engagement de #organisation en faveur du renforcement de sa cybersécurité, à travers la mise en œuvre de premières mesures clés de cybersécurité.

// ---------- Badge ----------
#v(24pt)
#align(center)[
  #image("./badge.svg", height: 200pt)
]
#v(6pt)

Le badge CyberDépart marque une première étape dans le parcours de sécurisation qui permettra de protéger #organisation contre les risques cyber les plus courants.
