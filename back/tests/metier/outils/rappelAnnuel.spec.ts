import { afterEach, describe, expect, it, vi } from 'vitest';
import { unRappelAnnuel } from '@metier/outils/rappelAnnuel.js';
import { AdaptateurHorloge } from '@infra/adaptateurHorloge.js';

describe('Un rappel annuel', () => {
  const horlogeÀ = (instant: string): AdaptateurHorloge => ({
    maintenant: () => Temporal.Instant.from(instant),
    maintenantZoné: () => Temporal.Instant.from(instant).toZonedDateTimeISO(Temporal.Now.timeZoneId()),
  });
  const rappel = () =>
    unRappelAnnuel()
      .avecTitre('Un titre')
      .avecDescription('Un paragraphe', 'Un autre')
      .avecDescriptionAlarme('Une alarme')
      .construis();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('conserve le titre, la description (paragraphes séparés par une ligne vide) et la description de l’alarme', () => {
    expect(rappel().titre).toBe('Un titre');
    expect(rappel().description).toBe('Un paragraphe\n\nUn autre');
    expect(rappel().descriptionAlarme).toBe('Une alarme');
  });

  describe('concernant son créneau', () => {
    it('a lieu dans un an entre 9h et 9h30', () => {
      vi.spyOn(Temporal.Now, 'timeZoneId').mockReturnValue('UTC');

      const { début, fin } = rappel().créneau(horlogeÀ('2026-10-14T05:00:00Z'));

      expect(début).toBe(Date.parse('2027-10-14T09:00:00Z'));
      expect(fin).toBe(Date.parse('2027-10-14T09:30:00Z'));
    });

    it.each([
      ['Europe/Paris', '2025-02-28T08:00:00Z', '2025-02-28T08:30:00Z'],
      ['America/Los_Angeles', '2025-02-28T17:00:00Z', '2025-02-28T17:30:00Z'],
    ])('se calcule selon la date locale en année bissextile (%s)', (fuseau, début, fin) => {
      vi.spyOn(Temporal.Now, 'timeZoneId').mockReturnValue(fuseau);

      const créneau = rappel().créneau(horlogeÀ('2024-02-28T23:30:00Z'));

      expect(créneau.début).toBe(Date.parse(début));
      expect(créneau.fin).toBe(Date.parse(fin));
    });
  });

  describe('lorsqu’un élément obligatoire manque à la construction', () => {
    it('refuse de construire sans titre', () => {
      expect(() => unRappelAnnuel().avecDescription('d').avecDescriptionAlarme('a').construis()).toThrow(/titre/);
    });

    it('refuse de construire sans description', () => {
      expect(() => unRappelAnnuel().avecTitre('t').avecDescriptionAlarme('a').construis()).toThrow(
        /description du rappel/
      );
    });

    it('refuse de construire sans description d’alarme', () => {
      expect(() => unRappelAnnuel().avecTitre('t').avecDescription('d').construis()).toThrow(/alarme/);
    });
  });
});
