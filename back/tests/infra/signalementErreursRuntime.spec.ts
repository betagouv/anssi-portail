import axios from '@anssi-portail/axios';
import { describe, expect, it, vi } from 'vitest';
import { BusEvenements } from '../../src/bus/busEvenements.js';
import { AdaptateurRechercheEntrepriseGouv } from '../../src/infra/adaptateurRechercheEntrepriseGouv.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';

class EvenementTest {}

describe('Le signalement des erreurs du serveur', () => {
  it('signale une recherche échouée et conserve le résultat vide', async () => {
    const erreur = new Error('API indisponible');
    vi.spyOn(axios, 'get').mockRejectedValue(erreur);
    const rapporteur = { erreur: vi.fn() };
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, rapporteur);

    expect(await adaptateur.rechercheOrganisations('organisation', null)).toEqual([]);
    expect(rapporteur.erreur).toHaveBeenCalledExactlyOnceWith(erreur, 'Erreur de recherche entreprise');
  });

  it('signale une erreur de souscripteur et exécute les autres souscripteurs', async () => {
    const erreur = new Error('échec');
    const rapporteur = { erreur: vi.fn() };
    const bus = new BusEvenements(rapporteur);
    const autreSouscripteur = vi.fn().mockResolvedValue(undefined);
    bus.abonne(EvenementTest, async () => {
      throw erreur;
    });
    bus.abonne(EvenementTest, autreSouscripteur);

    await bus.publie(new EvenementTest());

    expect(rapporteur.erreur).toHaveBeenCalledExactlyOnceWith(erreur, "Erreur lors du traitement de l'évènement");
    expect(autreSouscripteur).toHaveBeenCalledOnce();
  });

  it('publie sans attendre la fin des souscripteurs', async () => {
    const rapporteur = { erreur: vi.fn() };
    const bus = new BusEvenements(rapporteur);
    let termine!: () => void;
    const attente = new Promise<void>((resolve) => {
      termine = resolve;
    });
    bus.abonne(EvenementTest, () => attente);

    await bus.publie(new EvenementTest());
    expect(rapporteur.erreur).not.toHaveBeenCalled();
    termine();
    await attente;
  });
});
