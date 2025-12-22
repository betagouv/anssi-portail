import {
  type CodeRegion,
  type ContactSectoriel,
  type ContactsRegionaux,
} from './contacts.type';

export const contactsParRegion: Record<CodeRegion, ContactsRegionaux> = {
  'FR-ARA': {
    COT: {
      nom: 'Mathieu DELAPLACE / Marianne DELARUE',
      email: 'auvergne-rhone-alpes@ssi.gouv.fr',
    },
  },
  'FR-BFC': {
    CSIRT: {
      nom: 'CSIRT Bourgogne-Franche-Comté',
      siteWeb: 'https://www.csirt-bfc.fr/',
      adresse: '3 Bis Rue de Suzon – 21000 DIJON',
      telephone: '0 970 609 909',
    },
    COT: {
      nom: 'Véronique BRUNET / Françoise MARMOT',
      email: 'bourgogne-franche-comt@ssi.gouv.fr',
    },
  },
  'FR-BRE': {
    CSIRT: {
      nom: 'Breizh Cyber',
      siteWeb: 'https://breizhcyber.bzh/',
      adresse: '5 rue de la Chataigneraie\n35511 \nCesson-Sévigné',
      telephone: '0 800 200 008',
    },
    COT: { nom: 'Jérôme LAINE', email: 'bretagne@ssi.gouv.fr' },
    campus: {
      nom: 'Bretagne Cyber Alliance',
      siteWeb: 'https://www.cyberalliance.bzh/',
      adresse: '1c-1d avenue de Belle Fontaine, 35510 Cesson-Sévigné',
      email: 'contact@cyberalliance.bzh',
    },
  },
  'FR-CVL': {
    CSIRT: {
      nom: 'CybeRéponse',
      siteWeb: 'https://www.cybereponse.fr/',
      adresse: '3 avenue Claude Guillemin\n45100 Orléans',
      telephone: '0 805 69 15 05',
    },
    COT: { nom: 'Mélodie FOUREZ', email: 'centre-val-de-loire@ssi.gouv.fr' },
  },
  'FR-20R': {
    CSIRT: {
      nom: 'CSIRT CyberCorsica | Centre de cybersécurité de Corse',
      siteWeb: 'https://cyber.corsica/',
      adresse: '10 Rue Général Fiorella 20000 Ajaccio',
    },
    COT: { nom: 'Moïse MOYAL', email: 'corse@ssi.gouv.fr' },
  },
  'FR-GES': {
    CSIRT: {
      nom: 'Grand Est Cybersécurité',
      siteWeb: 'https://www.cybersecurite.grandest.fr/',
      telephone: '0 970 512 525',
    },
    COT: { nom: 'Vincent RHIN', email: 'grand-est@ssi.gouv.fr' },
  },
  'FR-HDF': {
    CSIRT: {
      nom: 'CSIRT Hauts-de-France',
      siteWeb: 'https://csirt-hdf.fr/',
      adresse: 'Campus Wenov 149 Avenue de Bretagne 59000 Lille',
      telephone: '0 806 700 111',
    },
    COT: { nom: 'Hugo LONGUESPE', email: 'hauts-de-france@ssi.gouv.fr' },
    campus: {
      nom: 'Campus Cyber Hauts de France - Lille Métropole',
      siteWeb: 'https://hdf.campuscyber.fr/',
      adresse: '177 All. Clémentine Deman, 59000 Lille',
    },
  },
  'FR-IDF': {
    CSIRT: {
      nom: 'Urgence Cyber Île-de-France',
      siteWeb: 'https://urgencecyber.iledefrance.fr/',
      adresse: '2, rue Simone Veil 93400 Saint-Ouen-sur-Seine',
      telephone: '0 800 730 647',
    },
    COT: { nom: 'Guillaume CRÉPIN', email: 'ile-de-france@ssi.gouv.fr' },
    campus: {
      adresse: '5-7 rue Bellini 92800 La Défense',
      nom: 'Le Campus Cyber',
      siteWeb: 'https://campuscyber.fr/',
    },
  },
  'FR-NOR': {
    CSIRT: {
      nom: 'Normandie Cyber',
      siteWeb: 'https://adnormandie.fr/besoin/normandie-cyber/',
      adresse: 'Campus Effiscience 2 Espace Anton Philips14460 Colombelles',
      telephone: '0 808 800 001',
    },
    COT: { nom: 'Eric HAZANE', email: 'normandie@ssi.gouv.fr' },
    campus: {
      nom: 'Campus Normandie Cyber',
      siteWeb: 'https://adnormandie.fr/campus-normandie-cyber/',
      adresse: 'Campus Effiscience 2 Espace Anton Philips14460 Colombelles',
      email: 'contact@campus-normandie-cyber.fr',
    },
  },
  'FR-NAQ': {
    CSIRT: {
      nom: 'Campus régional de Cybersécurité et de Confiance numérique',
      siteWeb: 'https://www.campuscyber-na.fr/',
      adresse: '4 rue Adrienne Bolland 33600 Pessac',
      telephone: '0 805 29 29 40',
    },
    COT: {
      nom: 'Martin VERON / Jean-Denis LAVAL',
      email: 'nouvelle-aquitaine@ssi.gouv.fr',
    },
    campus: {
      nom: 'Campus Régional de Cybersécurité et de Confiance Numérique de Nouvelle Aquitaine',
      siteWeb: 'https://www.campuscyber-na.fr/',
      adresse:
        'Parc Ampéris - Batiment Colibri - 3eme étage - 4 Rue Adrienne Bolland, 33600 Pessac',
      email: 'contact@campuscyber-na.fr',
    },
  },
  'FR-OCC': {
    CSIRT: {
      nom: 'Cyber’Occ',
      siteWeb: 'https://www.cyberocc.com/nos-services/urgence-cyber/',
      adresse: "Data Valley 1000 l'Occitanie 31670 Labège",
      telephone: '0 800 71 13 13',
    },
    COT: {
      nom: 'Rémy DAUDIGNY /Christophe FLEURY',
      email: 'occitanie@ssi.gouv.fr',
    },
    campus: {
      nom: 'Le Centre Régional Cybersécurité Cyber’Occ',
      adresse: "Data Valley 1000 l'Occitanie 31670 Labège",
      siteWeb: 'https://www.cyberocc.com/',
      email: 'contact@cyberocc.fr',
    },
  },
  'FR-PDL': {
    CSIRT: {
      nom: 'Pays de la Loire Cyber Assistance',
      siteWeb:
        'https://www.paysdelaloire.fr/economie-et-innovation/entreprise/mon-organisation-subit-une-cyberattaque',
      adresse: '1000 L’Occitane\n31670 Labège',
      telephone: '0 800 100 200',
    },
    COT: { nom: 'Régis DUBRULLE', email: 'pays-de-la-loire@ssi.gouv.fr' },
  },
  'FR-PAC': {
    CSIRT: {
      nom: 'Urgence Cyber région Sud',
      siteWeb: 'https://urgencecyber-regionsud.fr/',
      adresse:
        "Maison du numérique et de l'innovation, Pl. Georges Pompidou, 83000 Toulon",
      telephone: '0 805 036 083',
    },
    COT: { nom: 'Kevin HEYDON /Célia NOWAK', email: 'paca@ssi.gouv.fr' },
    campus: {
      nom: 'Campus Cyber Région Sud Euromed',
      siteWeb: 'https://ares.campuscyber-regionsud.fr/',
      adresse: 'Tour Mirabeau 1 Boulevard Saade - Quai Arenc 13002 Marseille',
      email: 'contact@campuscyber-regionsud.fr',
    },
  },
  'FR-COM': {
    CSIRT: {
      nom: 'Centre Cyber du Pacifique',
      siteWeb: 'https://centrecyberpacifique.nc/',
      adresse: '0 rue Anatole France, Galerie Nouméa Centre, 98800 Nouméa',
      telephone: '505.300',
    },
    COT: { nom: 'Moïse MOYAL', email: 'outre-mer@ssi.gouv.fr' },
  },
  'FR-971': {
    CSIRT: {
      nom: 'CSIRT-ATLANTIC',
      siteWeb: 'https://www.accyb.org/fr/FindOutAtlantic',
      adresse: '60 Chemin de Reynald\n97170, PETIT-BOURG',
      telephone: '0 970 260 801',
    },
    COT: { nom: 'Moïse MOYAL', email: 'outre-mer@ssi.gouv.fr' },
  },
  'FR-972': {
    CSIRT: {
      nom: 'CSIRT-ATLANTIC',
      siteWeb: 'https://www.accyb.org/fr/FindOutAtlantic',
      adresse: '60 Chemin de Reynald\n97170, PETIT-BOURG',
      telephone: '0 970 260 801',
    },
    COT: { nom: 'Moïse MOYAL', email: 'outre-mer@ssi.gouv.fr' },
  },
  'FR-973': {
    CSIRT: {
      nom: 'CSIRT-ATLANTIC',
      siteWeb: 'https://www.accyb.org/fr/FindOutAtlantic',
      adresse: '60 Chemin de Reynald\n97170, PETIT-BOURG',
      telephone: '0 970 260 801',
    },
    COT: { nom: 'Moïse MOYAL', email: 'outre-mer@ssi.gouv.fr' },
  },
  'FR-974': {
    CSIRT: {
      nom: 'Cyber Réunion',
      siteWeb: 'https://www.cyber-reunion.fr/',
      adresse: '1 Rue Emile Hugot 97490 Sainte Clotilde',
      telephone: '0 262 974 999',
    },
    COT: { nom: 'Moïse MOYAL', email: 'outre-mer@ssi.gouv.fr' },
  },
  'FR-976': {
    CSIRT: {
      nom: 'CSIRT-ATLANTIC',
      siteWeb: 'https://www.accyb.org/fr/FindOutAtlantic',
      adresse: '60 Chemin de Reynald\n97170, PETIT-BOURG',
      telephone: '0 970 260 801',
    },
    COT: { nom: 'Moïse MOYAL', email: 'outre-mer@ssi.gouv.fr' },
  },
};

export const secteursContacts = [
  { valeur: 'aviation', libelle: 'Aviation' },
  { valeur: 'defense', libelle: 'Défense' },
  { valeur: 'sante', libelle: 'Santé' },
  { valeur: 'maritime', libelle: 'Maritime' },
  { valeur: 'enseignement-recherche', libelle: 'Enseignement, recherche' },
  { valeur: 'social', libelle: 'Social' },
] as const;

const codesSecteurContact = secteursContacts.map((s) => s.valeur);

type CodeSecteurContact = (typeof codesSecteurContact)[number];

export const estCodeSecteurContact = (
  codeSecteur: string
): codeSecteur is CodeSecteurContact => {
  return (codesSecteurContact as readonly string[]).includes(codeSecteur);
};

export const contactsParSecteur: Record<CodeSecteurContact, ContactSectoriel> =
  {
    aviation: {
      nom: 'CERT Aviation',
      siteWeb: 'https://www.cert-aviation.fr/',
    },
    'enseignement-recherche': {
      nom: 'CERT Renater',
      siteWeb: 'https://www.renater.fr/securite/le-cert-renater/',
    },
    defense: {
      nom: 'CERT Entreprise Défense (CERT ED)',
      siteWeb:
        'https://www.defense.gouv.fr/drsd/ressources-entreprises/cert-entreprises-defense',
    },
    maritime: { nom: 'CERT Maritime', siteWeb: 'https://www.m-cert.fr/' },
    sante: {
      nom: 'CERT Santé',
      siteWeb: 'https://cyberveille.esante.gouv.fr/',
    },
    social: {
      nom: 'CERT Social',
      siteWeb:
        'https://www.assurance-maladie.ameli.fr/pages-d-informations-legales/cert-social',
    },
  };
