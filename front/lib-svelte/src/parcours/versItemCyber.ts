import type { ItemCyber } from '../catalogue/Catalogue.types';

export const versItemsCyber =
  (itemsCyber: ItemCyber[]) => (idsItem: string[]) =>
    idsItem.reduce((accumulateur, id) => {
      const item = itemsCyber.find((itemCyber) => itemCyber.id === id);
      if (item) {
        accumulateur.push(item);
      }
      return accumulateur;
    }, [] as ItemCyber[]);
