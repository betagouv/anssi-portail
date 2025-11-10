import assert from 'node:assert';
import { describe, it, beforeEach } from 'node:test';
import { RecuperateurGuide } from '../src/recuperateurGuide';

describe("Le récupérateur d'un guide", () => {
  const htmlGuide = `
    <p>Pas le bon résumé</p>
    <div class="banniere-group">
      <H1>Guide 1</H1>
      <p>Dans un contexte de prolifération…</p>
    </div>
    <span class="published-on"> Publié le 26 août 2025 </span>
    <span class="updated-on"> Mis à jour le 2 octobre 2025 </span>
    <div class="text-riche">
      <div>
        <p>La description du guide.</p>
        <p>Sur plusieurs paragraphes.</p>
      </div>
    </div>
`;

  let recuperateurGuide: RecuperateurGuide;

  beforeEach(() => {
    recuperateurGuide = new RecuperateurGuide({ lis: async (_) => htmlGuide });
  });

  it('récupère le titre', async () => {
    const guide = await recuperateurGuide.recupere('/guide1');

    assert.equal(guide.titre, 'Guide 1');
  });

  it('appelle avec la bonne url', async () => {
    let urlAppelee = '';
    const recuperateurGuide = new RecuperateurGuide({
      lis: async (url) => {
        urlAppelee = url;
        return htmlGuide;
      },
    });

    await recuperateurGuide.recupere('/guide1');

    assert.equal(urlAppelee, '/guide1');
  });

  it('récupère le résumé', async () => {
    const guide = await recuperateurGuide.recupere('/guide1');

    assert.equal(guide.resume, 'Dans un contexte de prolifération…');
  });

  it('récupère la date de publication', async () => {
    const guide = await recuperateurGuide.recupere('/guide1');

    assert.equal(guide.datePublication, '26 août 2025');
  });

  it('récupère la date de mise à jour', async () => {
    const guide = await recuperateurGuide.recupere('/guide1');

    assert.equal(guide.dateMiseAJour, '2 octobre 2025');
  });

  it('récupère la description', async () => {
    const guide = await recuperateurGuide.recupere('/guide1');

    assert.equal(
      guide.description,
      '<p>La description du guide.</p><p>Sur plusieurs paragraphes.</p>'
    );
  });
});
