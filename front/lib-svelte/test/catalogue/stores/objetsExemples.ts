import {
  DroitAcces,
  FormatRessource,
  type ItemCyber,
  Source,
  Typologie,
} from '../../../src/catalogue/Catalogue.types';
import {
  CollectionGuide,
  type Guide,
} from '../../../src/catalogue/Guide.types';

export const mss = (): ItemCyber => ({
  type: 'ItemCyber',
  id: '/services/mss',
  typologie: Typologie.SERVICE,
  nom: 'mss',
  description: 'Pour sécuriser',
  illustration: 'mss.png',
  lienInterne: 'https://...',
  lienExterne: 'https://...',
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ENTITES_PUBLIQUES],
});

export const demainSpecialisteCyber = (): ItemCyber => ({
  type: 'ItemCyber',
  id: '/services/demainspecialistecyber',
  typologie: Typologie.SERVICE,
  nom: 'DemainSpécialisteCyber',
  description: 'Former…',
  illustration: 'mss.png',
  lienInterne: 'https://...',
  lienExterne: 'https://...',
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const monEspaceNIS2 = (): ItemCyber => ({
  type: 'ItemCyber',
  id: '/services/mon-espace-nis2',
  typologie: Typologie.SERVICE,
  nom: 'MonEspaceNIS2',
  description:
    'Se notifier et être guidé dans sa mise en conformité avec la directive NIS 2',
  illustration: 'nis2.png',
  lienInterne: 'https://nis2',
  lienExterne: 'https://...',
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE, DroitAcces.REGULES_NIS2],
});

export const livretEnJeux = (): ItemCyber => ({
  type: 'ItemCyber',
  id: '/ressources/livret-cyber-enjeux',
  typologie: Typologie.RESSOURCE,
  nom: 'enjeux',
  format: FormatRessource.OUTIL,
  description: '',
  illustration: 'livret.png',
  lienInterne: 'https://...',
  lienExterne: 'https://...',
  sources: [Source.ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const guidesTechniques = (): ItemCyber => ({
  type: 'ItemCyber',
  id: '/ressources/guides-techniques',
  typologie: Typologie.RESSOURCE,
  nom: 'Guides techniques',
  format: FormatRessource.PUBLICATION,
  description: '',
  illustration: 'guide.png',
  lienInterne: 'https://...',
  lienExterne: 'https://...',
  sources: [Source.ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const kitCyber = (): ItemCyber => ({
  type: 'ItemCyber',
  id: '/ressources/kit-cyber',
  typologie: Typologie.RESSOURCE,
  nom: 'KIT CYBER',
  format: FormatRessource.PUBLICATION,
  description: '',
  illustration: 'kit.png',
  lienInterne: 'https://...',
  lienExterne: 'https://...',
  sources: ['Gendarmerie'],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const guideZeroTrust: Guide = {
  type: 'Guide',
  id: 'zero-trust',
  nom: 'Zero Trust',
  resume: 'Les fondamentaux du modèle Zero Trust',
  description:
    "Les fondamentaux du modèle Zero Trust pour sécuriser les systèmes d'information",
  illustration:
    'http://localhost/anssi-fondamentaux-zero-trust-v1_publication.jpg',
  langue: 'FR',
  collections: [CollectionGuide.LES_ESSENTIELS],
  image: {
    grande: '',
    petite: '',
  },
  lienInterne: '/guides/zero-trust',
  sources: ['ANSSI'],
  documents: [],
  dateMiseAJour: '20 Juin 2025',
  datePublication: '20 Juin 2025',
};

export const guideDevsecops: Guide = {
  type: 'Guide',
  id: 'devsecops',
  nom: 'DevSecOps',
  resume: 'Intégrer la sécurité dans les pratiques DevOps',
  description:
    'Intégrer la sécurité dans les pratiques DevOps pour renforcer la sécurité du développement logiciel',
  illustration: 'http://localhost/anssi_essentiels_devsecops_v1.jpg',
  langue: 'FR',
  collections: [CollectionGuide.LES_FONDAMENTAUX],
  image: {
    grande: '',
    petite: '',
  },
  lienInterne: '/guides/devsecops',
  sources: ['ANSSI'],
  documents: [],
  dateMiseAJour: '13 Mars 2024',
  datePublication: '13 Mars 2024',
};

export const guideDevsecopsEN: Guide = {
  type: 'Guide',
  id: 'devsecops',
  nom: 'DevSecOps',
  resume: 'Integrating security into DevOps practices',
  description:
    'Integrating security into DevOps practices to enhance software development security',
  illustration: 'http://localhost/anssi_essentiels_devsecops_v1.jpg',
  langue: 'EN',
  collections: [CollectionGuide.LES_ESSENTIELS],
  image: {
    grande: '',
    petite: '',
  },
  lienInterne: '/guides/en/devsecops',
  sources: ['ANSSI'],
  documents: [],
  dateMiseAJour: '26 September 2024',
  datePublication: '26 September 2024',
};
