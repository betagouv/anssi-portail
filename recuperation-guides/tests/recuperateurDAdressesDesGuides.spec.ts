import { describe, it } from 'node:test';
import assert from 'node:assert';
import { RecuperateurDAdressesDesGuides } from '../src/recuperateurDAdressesDesGuides';

describe('Récupérateur des adresses des guides', () => {
  it('récupère un guide', async () => {
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => {
        return `<html>
  <body>
    <div class="views-row">
      <a href="/guide-xyz">Lien</a>
    </div>
  </body>
</html>`;
      },
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    const [adresse] = await recuperateurDeGuides.recupere(
      'https://example.com/guide'
    );

    assert.equal(adresse, '/guide-xyz');
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

    await recuperateurDeGuides.recupere('https://example.com/guide');

    assert.equal(urlAppelee, 'https://example.com/guide');
  });

  it('récupère plusieurs guides', async () => {
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => {
        return `<html>
  <body>
    <div class="views-row">
      <a href="/guide-abc">Lien</a>
    </div>
    <div class="views-row">
      <a href="/guide-def">Lien</a>
    </div>
  </body>
</html>`;
      },
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    const adresses = await recuperateurDeGuides.recupere(
      'https://example.com/guides'
    );

    assert.equal(adresses.length, 2);
    const [adresse1, adresse2] = adresses;
    assert.deepEqual(adresse1, '/guide-abc');
    assert.deepEqual(adresse2, '/guide-def');
  });

  it('récupère uniquement les liens des guides', async () => {
    const lecteurDeSite = {
      lis: async (url: string): Promise<string> => {
        return `<html>
  <body>
    <a href="/autre-lien">Lien</a>
  </body>
</html>`;
      },
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    const adresses = await recuperateurDeGuides.recupere(
      'https://example.com/guides'
    );

    assert.equal(adresses.length, 0);
  });
});
