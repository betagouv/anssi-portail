import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { génèreRappelIcs } from '../../../src/api/outils/rappelIcsGenerique/genereRappelIcs.js';
import { AdaptateurHorloge } from '../../../src/infra/adaptateurHorloge.js';
import { unRappelAnnuel } from '../../../src/metier/outils/rappelAnnuel.js';

describe('La génération d’un rappel au format ICS', () => {
  const horloge: AdaptateurHorloge = {
    maintenant: () => Temporal.Instant.from('2026-10-14T05:00:00Z'),
    maintenantZoné: () => Temporal.Instant.from('2026-10-14T05:00:00Z').toZonedDateTimeISO('UTC'),
  };
  const rappel = unRappelAnnuel()
    .avecTitre('Un titre')
    .avecDescription('Un paragraphe', 'Un autre')
    .avecDescriptionAlarme('Une alarme')
    .construis();

  beforeEach(() => {
    vi.stubEnv('TZ', 'UTC');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('produit un évènement annuel portant le contenu du rappel', async () => {
    const lignes = (await génèreRappelIcs(rappel, horloge)).split('\r\n');

    expect(lignes).toContain('PRODID:-//ANSSI//NONSGML MesServicesCyber//FR');
    expect(lignes).toContain('SUMMARY:Un titre');
    expect(lignes).toContain('DESCRIPTION:Un paragraphe\\n\\nUn autre');
    expect(lignes).toContain('RRULE:FREQ=YEARLY');
  });

  it('ajoute une alarme à l’heure de l’évènement', async () => {
    const lignes = (await génèreRappelIcs(rappel, horloge)).split('\r\n');

    expect(lignes).toContain('BEGIN:VALARM');
    expect(lignes).toContain('ACTION:DISPLAY');
    expect(lignes).toContain('DESCRIPTION:Une alarme');
  });

  it('positionne l’évènement sur le créneau du rappel', async () => {
    const lignes = (await génèreRappelIcs(rappel, horloge)).split('\r\n');

    expect(lignes).toContain('DTSTART:20271014T090000Z');
    expect(lignes).toContain('DTEND:20271014T093000Z');
  });
});
