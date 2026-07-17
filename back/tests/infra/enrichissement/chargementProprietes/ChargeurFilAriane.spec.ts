import { JSDOM } from 'jsdom';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ChargeurFilAriane } from '../../../../src/infra/enrichissement/chargementProprietes/chargeurFilAriane.js';

describe("Le chargeur de propriétés du fil d'Ariane", () => {
  const chargeurDeProps = new ChargeurFilAriane();

  const prépareLeDOM = () => {
    const dom = new JSDOM();
    const [body] = dom.window.document.getElementsByTagName('body');
    const baliseDeDonnées = dom.window.document.createElement('script');
    body.appendChild(baliseDeDonnées);
    baliseDeDonnées.outerHTML = `
<script type="application/json" id="donnees-fil-ariane">
  {
    "feuille": "Les services pour se lancer",
    "fondSombre": true
  }
</script>
`;
    return dom;
  };

  it("Ne fais rien si il n'y pas de données liées au fil d'Ariane", async () => {
    const dom = new JSDOM();

    const props = await chargeurDeProps.charge(dom);

    assert.equal(props, undefined);
  });

  it('sait récupérer les données dans le DOM', async () => {
    const dom = prépareLeDOM();

    const props = await chargeurDeProps.charge(dom);

    assert.deepEqual(props, { feuille: 'Les services pour se lancer' });
  });
});
