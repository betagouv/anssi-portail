import { describe, it } from 'node:test';
import assert from 'node:assert';
import { RecuperateurDAdressesDesGuides } from '../src/recuperateurDAdressesDesGuides';

describe('Récupérateur des adresses des guides', () => {
  it('récupère un guide', () => {
    const lecteurDeSite = {
      lis: (url: string): string => {
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

    const [adresse] = recuperateurDeGuides.recupere(
      'https://example.com/guide'
    );

    assert.equal(adresse, '/guide-xyz');
  });

  it('appelle la bonne URL', () => {
    let urlAppelee = '';
    const lecteurDeSite = {
      lis: (url: string): string => {
        urlAppelee = url;
        return '<h3></h3>';
      },
    };
    const recuperateurDeGuides = new RecuperateurDAdressesDesGuides(
      lecteurDeSite
    );

    recuperateurDeGuides.recupere('https://example.com/guide');

    assert.equal(urlAppelee, 'https://example.com/guide');
  });

  it('récupère plusieurs guides', () => {
    const lecteurDeSite = {
      lis: (url: string): string => {
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

    const adresses = recuperateurDeGuides.recupere(
      'https://example.com/guides'
    );

    assert.equal(adresses.length, 2);
    const [adresse1, adresse2] = adresses;
    assert.deepEqual(adresse1, '/guide-abc');
    assert.deepEqual(adresse2, '/guide-def');
  });
});
