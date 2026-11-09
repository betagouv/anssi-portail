import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import reglesEslint from '../src/index.js';

const configuration = reglesEslint.configs.html;
const corriger = (code: string) => new Linter().verifyAndFix(code, configuration, { filename: 'exemple.html' });

describe('Espaces insécables dans les pages HTML et Jekyll', () => {
  it.each([
    [
      '<p>Vous pouvez exercer vos droits en contactant l&#39;ANSSI :</p>',
      '<p>Vous pouvez exercer vos droits en contactant l&#39;ANSSI&nbsp;:</p>',
    ],
    ['<p>«mot» : oui ; vraiment !</p>', '<p>«&nbsp;mot&nbsp;»&nbsp;: oui&#8239;; vraiment&#8239;!</p>'],
    ['<p>Un&thinsp;? Oui&#xA0;! Non :</p>', '<p>Un&#8239;? Oui&#8239;! Non&nbsp;:</p>'],
    ['<msc-lien libelle="En savoir plus ?"></msc-lien>', '<msc-lien libelle="En savoir plus&#8239;?"></msc-lien>'],
    ['---\ntitre: "Question ?"\n---\n<p>Question ?</p>', '---\ntitre: "Question ?"\n---\n<p>Question&#8239;?</p>'],
    [
      '<p>{% if page.visible %}Question ? {{ page.titre | default: "Autre !" }} !{% endif %}</p>',
      '<p>{% if page.visible %}Question&#8239;? {{ page.titre | default: "Autre !" }}&#8239;!{% endif %}</p>',
    ],
    [
      '<msc-lien libelle="Question ? {{ titre | default: \'Autre !\' }}"></msc-lien>',
      '<msc-lien libelle="Question&#8239;? {{ titre | default: \'Autre !\' }}"></msc-lien>',
    ],
    ['<p>«{{ titre }}»</p>', '<p>«&nbsp;{{ titre }}&nbsp;»</p>'],
    ['<p>«{{- titre -}}»</p>', '<p>«&nbsp;{{- titre -}}&nbsp;»</p>'],
    ['<P>Texte !</P>', '<P>Texte&#8239;!</P>'],
    [
      '<p>Avant{% comment %}Masqué !{% endcomment %}Après ?</p>',
      '<p>Avant{% comment %}Masqué !{% endcomment %}Après&#8239;?</p>',
    ],
  ])('corrige %s sans modifier la syntaxe Jekyll', (code, attendu) => {
    expect(corriger(code)).toMatchObject({ output: attendu, messages: [] });
    expect(corriger(attendu).fixed).toBe(false);
  });

  it.each([
    '<!-- Question ? -->',
    '<script>const texte = "Question ?";</script>',
    '<style>p::after { content: "Question ?"; }</style>',
    '<code><span>Question ?</span></code>',
    '<PRE><span>Question ?</span></PRE>',
    '<kbd>Question ?</kbd><samp>Question ?</samp>',
    '<p>{{ "Question ?" | default: "Oui !" }}</p>',
    '{% assign titre = "Question ?" %}',
    '{%- comment -%}<p>Question ?</p>{%- endcomment -%}',
    '<a href="https://example.com/?question=oui">Lien</a>',
    '<p style="--texte: \'Question ?\'">Texte</p>',
    '<button onclick="alert(\'Question ?\')">Texte</button>',
  ])('préserve %s', (code) => {
    expect(corriger(code)).toMatchObject({ output: code, fixed: false, messages: [] });
  });

  it('respecte les balises ignorées configurées', () => {
    const résultat = new Linter().verifyAndFix(
      '<aside><p>Question ?</p></aside><p>Question ?</p>',
      [
        ...configuration,
        {
          rules: { 'regles-eslint/espaces-insécables-ponctuation-francaise': ['warn', { balisesIgnorées: ['aside'] }] },
        },
      ],
      { filename: 'exemple.html' }
    );
    expect(résultat.output).toBe('<aside><p>Question ?</p></aside><p>Question&#8239;?</p>');
  });

  it('conserve les positions et les fins de ligne après le frontmatter', () => {
    const source = '---\r\nlayout: page-statique\r\n---\r\n<p>Contacter l’ANSSI :</p>';
    const diagnostics = new Linter().verify(source, configuration, { filename: 'confidentialite.html' });
    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        line: 4,
        ruleId: 'regles-eslint/espaces-insécables-ponctuation-francaise',
        fix: expect.objectContaining({ text: '&nbsp;' }),
      })
    );
    expect(diagnostics.some((diagnostic) => diagnostic.fatal)).toBe(false);
    expect(corriger(source).output).toBe(source.replace('ANSSI :', 'ANSSI&nbsp;:'));
  });
});
