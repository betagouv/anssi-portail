import { join } from 'node:path';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { creeServeur } from '@api/msc/index.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from './cookie.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin } from './fauxObjets.js';
import { jeanneDupont } from './objetsPretsALEmploi.js';

describe('La configuration de notre serveur', () => {
  it('compresse les réponses', async () => {
    const serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin: {
        ...fauxFournisseurDeChemin,
        jekyll: {
          ...fauxFournisseurDeChemin.jekyll,
          page: () =>
            // On a besoin d'un gros fichier pour que 'compression' décide de compresser (defaut 1024 o)
            join(process.cwd(), 'tests', 'ressources', 'factice-gros.html'),
        },
      },
    });

    const { headers: entetes } = await request(serveur).get('/').set('Accept-Encoding', 'gzip, deflate, br, zstd');

    expect(entetes['content-encoding']).toBe('br');
    expect(entetes['vary']).toBe('Accept-Encoding');
  });

  describe('pour le chemin racine', () => {
    it('sert correctement le chemin racine', async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const réponse = await request(serveur).get('/');

      expect(réponse.statusCode).toBe(HttpStatusCode.Ok);
    });

    it('redirige vers tableau de bord pour un utilisateur connecté', async () => {
      const entrepôtUtilisateur = new EntrepotUtilisateurMemoire();
      await entrepôtUtilisateur.ajoute(jeanneDupont);

      const serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotUtilisateur: entrepôtUtilisateur });

      const cookie = encodeSession({ email: jeanneDupont.email, token: 'token' });
      const réponse = await request(serveur).get('/').set('Cookie', [cookie]).send();

      expect(réponse.statusCode).toBe(HttpStatusCode.Found);
      expect(réponse.headers.location).toBe('/tableau-de-bord');
    });
  });

  it('redirige correctement le chemin racine', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('///////////');

    expect(réponse.statusCode).toBe(HttpStatusCode.PermanentRedirect);
    expect(réponse.headers.location).toBe('/');
  });

  it('redirige vers une url sans slashs finaux', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/catalogue/');

    expect(réponse.statusCode).toBe(HttpStatusCode.PermanentRedirect);
    expect(réponse.headers.location).toBe('/catalogue');
  });

  it('redirige vers une url avec paramètres de requête sans slashs finaux', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/catalogue/?param=value');

    expect(réponse.statusCode).toBe(HttpStatusCode.PermanentRedirect);
    expect(réponse.headers.location).toBe('/catalogue?param=value');
  });

  it("redirige vers l'URL voulue sans slash final", async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/guides');

    expect(réponse.statusCode).toBe(HttpStatusCode.MovedPermanently);
    expect(réponse.headers.location).toBe('/catalogue');
  });

  it("redirige vers l'URL voulue avec slash final", async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/guides/');

    expect(réponse.statusCode).toBe(HttpStatusCode.MovedPermanently);
    expect(réponse.headers.location).toBe('/catalogue');
  });

  it('redirige URL inconnue sans slash final vers une 404', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/monurlquinexistepas');

    expect(réponse.statusCode).toBe(HttpStatusCode.NotFound);
  });

  it('redirige URL inconnue avec slash final vers une 404', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/monurlquinexistepas/');

    expect(réponse.statusCode).toBe(HttpStatusCode.NotFound);
  });

  it('redirige URL connue avec des paramètres vers la nouvelle URL', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/cyberdepart?email=test@mail.com');

    expect(réponse.statusCode).toBe(HttpStatusCode.MovedPermanently);
    expect(réponse.headers.location).toBe('/parcours-cyberdepart');
  });
});
