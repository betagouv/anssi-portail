import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { Langue } from '../../../src/catalogue/Catalogue.types';
import { guidesStore } from '../../../src/catalogue/stores/guides.store';
import { nombreGuides } from '../../../src/catalogue/stores/nombreGuides.store';
import {
  guideDevsecops,
  guideDevsecopsEN,
  guideZeroTrust,
} from './objetsExemples';

describe('Le store du nombre de guides', () => {
  beforeEach(() => {
    guidesStore.initialise([guideZeroTrust, guideDevsecops, guideDevsecopsEN]);
  });
  describe('se base sur le filtre de la langue', () => {
    it("pour retourner autant d'entrée que de langues", () => {
      const parLangue = get(nombreGuides).parLangue;

      expect(Object.keys(parLangue)).toHaveLength(2);
    });
    it('pour retourner le nombre de guide pour chaque langue', () => {
      const parLangue = get(nombreGuides).parLangue;

      expect(parLangue[Langue.FR]).toBe(2);
      expect(parLangue[Langue.EN]).toBe(1);
    });
  });
});
