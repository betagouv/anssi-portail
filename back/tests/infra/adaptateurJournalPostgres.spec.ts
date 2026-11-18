import { describe, expect, it, vi } from 'vitest';
import { adaptateurJournalPostgres } from '../../src/infra/adaptateurJournalPostgres.js';

const { insère } = vi.hoisted(() => ({ insère: vi.fn().mockResolvedValue(undefined) }));

vi.mock('knex', () => ({ default: () => () => ({ insert: insère }) }));

describe('L’adaptateur de journal PostgreSQL', () => {
  it.each([
    ['2026-01-01T01:00:00+01:00', '2026-01-01T00:00:00.000Z'],
    ['2026-01-01T00:00:00.123456789Z', '2026-01-01T00:00:00.123Z'],
  ])('sérialise la date en UTC avec trois décimales (%s)', async (instant, dateAttendue) => {
    await adaptateurJournalPostgres().consigneEvenement({
      type: 'UTILISATEUR_CONNECTE',
      donnees: { idUtilisateur: 'un-utilisateur', connexionAvecMFA: false },
      date: Temporal.Instant.from(instant),
    });

    expect(insère).toHaveBeenLastCalledWith({
      id: expect.any(String),
      type: 'UTILISATEUR_CONNECTE',
      donnees: { idUtilisateur: 'un-utilisateur', connexionAvecMFA: false },
      date: dateAttendue,
    });
  });
});
