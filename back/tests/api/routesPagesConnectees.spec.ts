import { describe, it, expect } from 'vitest';
import { estUrlRedirectionApresConnexionAutorisee } from '../../src/api/routesPagesConnectees.js';

describe("L'URL de redirection après connexion", () => {
  it('autorise les pages connectées fixes', () => {
    expect(estUrlRedirectionApresConnexionAutorisee('/ma-maturite')).toBe(true);
    expect(estUrlRedirectionApresConnexionAutorisee('/parcours-complet')).toBe(true);
    expect(estUrlRedirectionApresConnexionAutorisee('/favoris')).toBe(true);
  });

  it('autorise les pages connectées fixes avec paramètres et fragment', () => {
    expect(estUrlRedirectionApresConnexionAutorisee('/favoris?tri=recent#liste')).toBe(true);
  });

  it('autorise les pages connectées dynamiques', () => {
    expect(estUrlRedirectionApresConnexionAutorisee('/modules/42')).toBe(true);
    expect(estUrlRedirectionApresConnexionAutorisee('/mesures/une-mesure/')).toBe(true);
  });

  it('interdit une page publique', () => {
    expect(estUrlRedirectionApresConnexionAutorisee('/catalogue')).toBe(false);
    expect(estUrlRedirectionApresConnexionAutorisee('/?')).toBe(false);
  });

  it('interdit les URL externes', () => {
    expect(estUrlRedirectionApresConnexionAutorisee('https://example.com/favoris')).toBe(false);
    expect(estUrlRedirectionApresConnexionAutorisee('//example.com/favoris')).toBe(false);
    expect(estUrlRedirectionApresConnexionAutorisee('javascript:alert(1)')).toBe(false);
  });
});
