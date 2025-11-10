import assert from 'node:assert';
import { describe, it } from 'node:test';
import { RecuperateurDAdressesDesGuides } from '../src/recuperateurDAdressesDesGuides';

describe('Récupérateur des adresses des guides', () => {
  it('récupère un guide', async () => {
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => `
    <div class="views-row">
      <a href="/guide-xyz">Lien</a>
    </div>`,
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    const [adresse] = await recuperateurDeGuides.recupere(
      'https://example.com/guide',
      1
    );

    assert.equal(adresse, 'https://example.com/guide-xyz');
  });

  it('appelle la bonne URL', async () => {
    let urlAppelee = '';
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => {
        urlAppelee = url;
        return '<h3></h3>';
      },
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    await recuperateurDeGuides.recupere('https://example.com/guide', 1);

    assert.equal(urlAppelee, 'https://example.com/guide?page=0');
  });

  it('récupère plusieurs guides', async () => {
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => `
    <div class="views-row">
      <a href="/guide-abc">Lien</a>
    </div>
    <div class="views-row">
      <a href="/guide-def">Lien</a>
    </div>`,
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    const adresses = await recuperateurDeGuides.recupere(
      'https://example.com/guides',
      1
    );

    assert.equal(adresses.length, 2);
    const [adresse1, adresse2] = adresses;
    assert.equal(adresse1, 'https://example.com/guide-abc');
    assert.equal(adresse2, 'https://example.com/guide-def');
  });

  it('récupère uniquement les adresses des guides', async () => {
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => `
<html>
  <body>
    <a href="/autre-lien">Lien</a>
  </body>
</html>`,
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    const adresses = await recuperateurDeGuides.recupere(
      'https://example.com/guides',
      1
    );

    assert.equal(adresses.length, 0);
  });

  it('récupère les adresses sur toutes les pages', async () => {
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => {
        if (
          url === 'https://example.com/guides' ||
          url === 'https://example.com/guides?page=0'
        ) {
          return ` <div class="views-row"><a href="/guide-page-1">Lien</a></div>`;
        }
        if (url === 'https://example.com/guides?page=1') {
          return ` <div class="views-row"><a href="/guide-page-2">Lien</a></div>`;
        }
        return '';
      },
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    const adresses = await recuperateurDeGuides.recupere(
      'https://example.com/guides',
      2
    );

    assert.equal(adresses.length, 2);
    assert.equal(adresses[0], 'https://example.com/guide-page-1');
    assert.equal(adresses[1], 'https://example.com/guide-page-2');
  });

  it("fonctionne quand l'url contient déjà des paramètres", async () => {
    let adresseAppelee = '';
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => {
        adresseAppelee = url;
        return '';
      },
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    await recuperateurDeGuides.recupere(
      'https://example.com/guides?filtre=A',
      1
    );

    assert.equal(adresseAppelee, 'https://example.com/guides?filtre=A&page=0');
  });
});
