import type { ItemCyber } from '../catalogue/Catalogue.types';
import type { Guide } from '../catalogue/Guide.types';

export const versItemsCyberOuGuide =
  (itemsCyber: ItemCyber[], guides: Guide[]) =>
  (referencesItem: (string | { id: string; tagsSpecifiques: string[] })[]) =>
    referencesItem.reduce(
      (accumulateur, reference) => {
        const { id, tagsSpecifiques } =
          typeof reference === 'string'
            ? { id: reference, tagsSpecifiques: [] }
            : reference;
        const item =
          itemsCyber.find((itemCyber) => itemCyber.id === id) ??
          guides.find((guide) => guide.id === id);
        if (item) {
          accumulateur.push({ ...item, tagsSpecifiques });
        }
        return accumulateur;
      },
      [] as Array<ItemCyber | Guide>
    );
