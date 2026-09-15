const cheminAssets = '/assets/images/mini-tests/reflexe-cyber';

export type IdRôle = 'direction' | 'si' | 'communication' | 'juridique' | 'rh' | 'relations';

export type Rôle = {
  id: IdRôle;
  nom: string;
  description: string;
  image: { src: string; alt: string };
};

// Ordre d'affichage conforme à la maquette et au parcours de référence du prototype.
export const rôles: Rôle[] = [
  {
    id: 'direction',
    nom: 'Direction',
    description: "Coordonner l'ensemble de la réponse, activer le dispositif de crise et arbitrer les décisions.",
    image: { src: `${cheminAssets}/role-direction.avif`, alt: '' },
  },
  {
    id: 'si',
    nom: 'Responsable SI',
    description: "Investiguer l'incident, contenir l'attaque et piloter la reprise des systèmes.",
    image: { src: `${cheminAssets}/role-si.avif`, alt: '' },
  },
  {
    id: 'communication',
    nom: 'Responsable Communication',
    description: 'Conseiller les élus, piloter les messages de crise, gérer la relation presse et réseaux sociaux.',
    image: { src: `${cheminAssets}/role-communication.avif`, alt: '' },
  },
  {
    id: 'juridique',
    nom: 'Responsable Juridique',
    description: 'Évaluer les conséquences financières et juridiques, contacter assurances et autorités.',
    image: { src: `${cheminAssets}/role-juridique.avif`, alt: '' },
  },
  {
    id: 'rh',
    nom: 'Responsable RH',
    description: 'Assurer le paiement des salaires, soutenir les équipes et gérer les conditions de travail.',
    image: { src: `${cheminAssets}/role-rh.avif`, alt: '' },
  },
  {
    id: 'relations',
    nom: 'Responsable relations usagers',
    description: 'Maintenir les services essentiels, informer et accompagner les administrés et partenaires.',
    image: { src: `${cheminAssets}/role-relations.avif`, alt: '' },
  },
];
