import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { RechercheEntrepriseAvecCache } from '../../src/infra/RechercheEntrepriseAvecCache';

describe('La recherche entreprise avec cache', () => {
  const resultatRecherchePour = (terme: string, departement: string | null) => [
    {
      nom: terme,
      departement: departement,
      siret: 'siret',
      codeTrancheEffectif: undefined,
      codeSecteur: undefined,
      codeRegion: undefined,
      estCollectivite: true,
      estAssociation: true,
      codeActivite: 'activite',
    },
  ];

  let nombreDAppelsALaRecherche = 0;
  let rechercheEntrepriseAvecCache: RechercheEntrepriseAvecCache;

  beforeEach(() => {
    nombreDAppelsALaRecherche = 0;

    rechercheEntrepriseAvecCache = new RechercheEntrepriseAvecCache({
      async rechercheOrganisations(terme: string, departement: string | null) {
        nombreDAppelsALaRecherche++;
        return resultatRecherchePour(terme, departement);
      },
    });
  });

  it('retourne le résultat de la recherche entreprise décorée', async () => {
    const resultat = await rechercheEntrepriseAvecCache.rechercheOrganisations(
      'siret',
      '33'
    );

    assert.deepEqual(resultat, resultatRecherchePour('siret', '33'));
  });

  it('ne rappelle pas la recherche entreprise deux fois', async () => {
    await rechercheEntrepriseAvecCache.rechercheOrganisations('siret', '33');
    await rechercheEntrepriseAvecCache.rechercheOrganisations('siret', '33');

    assert.equal(nombreDAppelsALaRecherche, 1);
  });

  it('distingue les éléments à mettre en cache', async () => {
    const resultat1 = await rechercheEntrepriseAvecCache.rechercheOrganisations(
      'siret1',
      '33'
    );
    const resultat2 = await rechercheEntrepriseAvecCache.rechercheOrganisations(
      'siret2',
      null
    );

    assert.deepEqual(resultat1, resultatRecherchePour('siret1', '33'));
    assert.deepEqual(resultat2, resultatRecherchePour('siret2', null));
    assert.equal(nombreDAppelsALaRecherche, 2);
  });
});
