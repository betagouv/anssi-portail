import { afterEach, describe, expect, it, vi } from 'vitest';
import { adaptateurHorloge } from '@infra/adaptateurHorloge.js';

describe("L'adaptateur d'horloge", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('concernant `maintenantZoné`', () => {
    it("renvoie l'instant courant", () => {
      vi.useFakeTimers({ now: new Date('2026-10-14T08:00:00Z') });

      const maintenantZoné = adaptateurHorloge.maintenantZoné();

      expect(maintenantZoné.toInstant().toString()).toBe('2026-10-14T08:00:00Z');
    });

    it.each([
      ['Europe/Paris', '2026-10-14T10:00:00+02:00[Europe/Paris]'],
      ['America/Los_Angeles', '2026-10-14T01:00:00-07:00[America/Los_Angeles]'],
      ['UTC', '2026-10-14T08:00:00+00:00[UTC]'],
    ])('est exprimé dans le fuseau horaire courant (%s)', (fuseau, attendu) => {
      vi.useFakeTimers({ now: new Date('2026-10-14T08:00:00Z') });
      vi.spyOn(Temporal.Now, 'timeZoneId').mockReturnValue(fuseau);

      const maintenantZoné = adaptateurHorloge.maintenantZoné();

      expect(maintenantZoné.timeZoneId).toBe(fuseau);
      expect(maintenantZoné.toString()).toBe(attendu);
    });

    it('désigne le même instant que `maintenant`', () => {
      vi.useFakeTimers({ now: new Date('2026-03-29T00:30:00Z') });

      expect(adaptateurHorloge.maintenantZoné().toInstant().equals(adaptateurHorloge.maintenant())).toBe(true);
    });
  });
});
