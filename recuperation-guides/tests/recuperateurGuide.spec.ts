import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
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
    <div class="img-princiale">
      <figure>
        <img src="/mon-imag%C3%A9.jpg" />
        <figcaption>Légende</figcaption>
      </figure>
    </div>
    <div class="paragraph--type--piece-jointe">
      <div class="document">
        <a href="/doc1.pdf">
          <div class="name">Les essentiels</div>
        </a>
      </div>
    </div>  
    <div class="field--name-field-fichier-pdf">
      <div class="document">
        <a href="/doc%202.pdf">
          <div class="name">Les approfondissements</div>
        </a>
      </div>
    </div>
    <div class="field--name-field-contenu-lie">
      <div>
        <a href="/autre-guide-1">
          <article>
            etc...
          </article>
        </a>
      </div>
      <div>
        <a href="/autre-guide-2">
          <article>
            etc...
          </article>
        </a>
      </div>
    </div>
`;

  let recuperateurGuide: RecuperateurGuide;

  beforeEach(() => {
    recuperateurGuide = new RecuperateurGuide({ lis: async (_) => htmlGuide });
  });

  it('récupère le titre', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

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

    await recuperateurGuide.recupere('https://example.com/guide1');

    assert.equal(urlAppelee, 'https://example.com/guide1');
  });

  it('récupère le résumé', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(guide.resume, 'Dans un contexte de prolifération…');
  });

  it('récupère la date de publication', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(guide.datePublication, '26 août 2025');
  });

  it('récupère la date de mise à jour', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(guide.dateMiseAJour, '2 octobre 2025');
  });

  it('récupère la description', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(
      guide.description,
      '<p>La description du guide.</p><p>Sur plusieurs paragraphes.</p>'
    );
  });

  it("récupère l'image", async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(guide.image, 'https://example.com/mon-imag%C3%A9.jpg');
  });

  it('récupère les URLs des documents associés', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.deepEqual(guide.urlDocuments, [
      'https://example.com/doc1.pdf',
      'https://example.com/doc%202.pdf',
    ]);
  });

  it('récupère les documents associés', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(
      guide.documents,
      `Les essentiels : doc1.pdf
Les approfondissements : doc 2.pdf`
    );
  });

  it('récupère les contenus liés', async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(
      guide.contenusLies,
      `https://example.com/autre-guide-1
https://example.com/autre-guide-2`
    );
  });

  it("récupère l'id du guide", async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/publication/guide1-sur-un-sujet'
    );

    assert.equal(guide.id, 'guide1-sur-un-sujet');
  });

  it("récupère le nom de l'image sans l'extension", async () => {
    const guide = await recuperateurGuide.recupere(
      'https://example.com/guide1'
    );

    assert.equal(guide.nomImage, 'mon-imagé');
  });
});
