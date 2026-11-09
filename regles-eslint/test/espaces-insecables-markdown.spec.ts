import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import reglesEslint from '../src/index.js';

const configuration = reglesEslint.configs.markdown;
const corriger = (code: string) => new Linter().verifyAndFix(code, configuration, { filename: 'exemple.md' });

describe('Espaces insécables dans les fichiers Markdown et Jekyll', () => {
  it.each([
    ['# Question ?\n\n«mot» : oui !', '# Question&#8239;?\n\n«&nbsp;mot&nbsp;»&nbsp;: oui&#8239;!'],
    ['**Important !** et *vraiment ?*', '**Important&#8239;!** et *vraiment&#8239;?*'],
    [
      '[En savoir plus ?](https://example.com/a?b=c "Titre !")',
      '[En savoir plus&#8239;?](https://example.com/a?b=c "Titre !")',
    ],
    [
      '<p>Question ?</p>\n\n<msc-lien libelle="Oui !"></msc-lien>',
      '<p>Question&#8239;?</p>\n\n<msc-lien libelle="Oui&#8239;!"></msc-lien>',
    ],
    ['- Bonjour&nbsp;!\n> Oui ;', '- Bonjour&#8239;!\n> Oui&#8239;;'],
    ['---\r\nnom: "Question ?"\r\n---\r\n😀 Question ?', '---\r\nnom: "Question ?"\r\n---\r\n😀 Question&#8239;?'],
    ['{{ titre }} !', '{{ titre }}&#8239;!'],
  ])('corrige %s sans modifier la syntaxe', (code, attendu) => {
    expect(corriger(code)).toMatchObject({ output: attendu, messages: [] });
    expect(corriger(attendu).fixed).toBe(false);
  });

  it.each([
    '`Question ?`',
    '```js\nconst question = "Bonjour !";\n```',
    '    Code !\n',
    '<https://example.com/a?b=c>',
    '[lien]: https://example.com/ "Titre !"',
    '![Illustration !](image.png)',
    '<!-- Question ? -->',
    '<pre>Question ?</pre>',
    '{% comment %}Question ?{% endcomment %}',
    '{{ titre | default: "Question ?" }}',
    '**mot**!',
    '`mot`!',
  ])('préserve %s', (code) => {
    expect(corriger(code)).toMatchObject({ output: code, fixed: false, messages: [] });
  });

  it('conserve les positions après le frontmatter', () => {
    const messages = new Linter().verify('---\r\nnom: test\r\n---\r\nQuestion ?', configuration, {
      filename: 'exemple.md',
    });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({ line: 4, column: 8, fix: { range: [29, 30], text: '&#8239;' } });
  });
});
