import { describe, expect, it, vi } from 'vitest';
import { BusEvenements } from '../../src/bus/busEvenements.js';

class EvenementTest {}

describe('Le signalement des erreurs du serveur', () => {
  it('signale une erreur de souscripteur et exécute les autres souscripteurs', async () => {
    const erreur = new Error('échec');
    const rapporteurErreur = { erreur: vi.fn() };
    const bus = new BusEvenements(rapporteurErreur);
    const autreSouscripteur = vi.fn().mockResolvedValue(undefined);
    bus.abonne(EvenementTest, async () => {
      throw erreur;
    });
    bus.abonne(EvenementTest, autreSouscripteur);

    await bus.publie(new EvenementTest());

    expect(rapporteurErreur.erreur).toHaveBeenCalledExactlyOnceWith(erreur, "Erreur lors du traitement de l'évènement");
    expect(autreSouscripteur).toHaveBeenCalledOnce();
  });

  it('publie sans attendre la fin des souscripteurs', async () => {
    const rapporteurErreur = { erreur: vi.fn() };
    const bus = new BusEvenements(rapporteurErreur);
    let termine!: () => void;
    const attente = new Promise<void>((resolve) => {
      termine = resolve;
    });
    bus.abonne(EvenementTest, () => attente);

    await bus.publie(new EvenementTest());
    expect(rapporteurErreur.erreur).not.toHaveBeenCalled();
    termine();
    await attente;
  });
});
