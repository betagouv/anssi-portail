import type { ItemCyber } from '../catalogue/Catalogue.types';
import type { Guide } from '../catalogue/Guide.types';

export const versItemsCyberOuGuide =
  (itemsCyber: ItemCyber[], guides: Guide[]) => (idsItem: string[]) =>
    idsItem.reduce(
      (accumulateur, id) => {
        const item =
          itemsCyber.find((itemCyber) => itemCyber.id === id) ??
          guides.find((guide) => guide.id === id);
        if (item) {
          accumulateur.push(item);
        }
        return accumulateur;
      },
      [] as Array<ItemCyber | Guide>
    );
