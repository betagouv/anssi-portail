import type { CouleurDeBadge } from '../../ui/badge.type';
import type { CollectionGuide, Guide } from '../Guide.types';

export const decodeEntitesHtml = (chaine: string) => {
  return chaine.replaceAll('&#039;', "'");
};

export const laCouleurDuBadgeSelonLaCollection = (
  collection: CollectionGuide
): string => {
  const couleursTypes: Record<CollectionGuide, CouleurDeBadge> = {
    'Crise cyber': 'yellow-tournesol',
    'Gestion des risques cyber': 'pink-tuile',
    'Les essentiels': 'blue-cumulus',
    'Les fondamentaux': 'purple-glycine',
    Remédiation: 'pink-tuile',
    'Supervision de sécurité': 'beige-gris-galet',
  };

  return (collection && couleursTypes[collection]) ?? 'purple-glycine';
};

export const guidePourCarteItem = (guide: Guide): Guide => ({
  ...guide,
  id: '/guides/' + guide.id,
  type: 'Guide' as const,
  illustration: guide.image?.petite ?? '/assets/images/image-generique.avif',
  lienInterne: '/guides/' + guide.id,
  sources: ['ANSSI'],
});
