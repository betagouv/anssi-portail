import assert from 'node:assert';
import { describe, it } from 'node:test';
import { estUrlRedirectionApresConnexionAutorisee } from '../../src/api/routesPagesConnectees.js';

describe("L'URL de redirection après connexion", () => {
  it('autorise les pages connectées fixes', () => {
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/ma-maturite'), true);
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/parcours-complet'), true);
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/favoris'), true);
  });

  it('autorise les pages connectées fixes avec paramètres et fragment', () => {
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/favoris?tri=recent#liste'), true);
  });

  it('autorise les pages connectées dynamiques', () => {
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/modules/42'), true);
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/mesures/une-mesure/'), true);
  });

  it('interdit une page publique', () => {
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/catalogue'), false);
    assert.equal(estUrlRedirectionApresConnexionAutorisee('/?'), false);
  });

  it('interdit les URL externes', () => {
    assert.equal(estUrlRedirectionApresConnexionAutorisee('https://example.com/favoris'), false);
    assert.equal(estUrlRedirectionApresConnexionAutorisee('//example.com/favoris'), false);
    assert.equal(estUrlRedirectionApresConnexionAutorisee('javascript:alert(1)'), false);
  });
});
