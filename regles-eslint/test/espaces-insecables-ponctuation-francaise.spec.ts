import { Linter } from 'eslint';
import svelte from 'eslint-plugin-svelte';
import { describe, expect, it } from 'vitest';
import règle from '../src/espaces-insecables-ponctuation-francaise.js';

const configuration = [
  ...svelte.configs.base,
  {
    plugins: { local: { rules: { nbsp: règle } } },
    rules: { 'local/nbsp': 'error' as const },
  },
];

const corriger = (code: string) => new Linter().verifyAndFix(code, configuration, { filename: 'exemple.svelte' });

describe('Espaces insécables dans les templates Svelte', () => {
  it.each([
    ['<p>«&#8239;mot&#x202F;»&nbsp;: oui&nbsp;!</p>', '<p>«&nbsp;mot&nbsp;»&nbsp;: oui&#8239;!</p>'],
    ['<p>Un&thinsp;? Oui&#xA0;! Non :</p>', '<p>Un&#8239;? Oui&#8239;! Non&nbsp;:</p>'],
    ['<p>{"Question ?"}</p>', '<p>{"Question\\u202f?"}</p>'],
    ["<Heros description={'Question ?'} />", "<Heros description={'Question\\u202f?'} />"],
    ['<p>{condition ? `Question ?` : "Autre !"}</p>', '<p>{condition ? `Question\\u202f?` : "Autre\\u202f!"}</p>'],
    [
      '<p>{`Valeur : ${condition ? "Oui !" : `Non ?`}`}</p>',
      '<p>{`Valeur\\u00a0: ${condition ? "Oui\\u202f!" : `Non\\u202f?`}`}</p>',
    ],
    ['<p>{`«${mot}»`}</p>', '<p>{`«\\u00a0${mot}\\u00a0»`}</p>'],
    ['<p>{`«${a}» «${b}»`}</p>', '<p>{`«\\u00a0${a}\\u00a0» «\\u00a0${b}\\u00a0»`}</p>'],
    ['<p>{`Question ?\\nSuite`}</p>', '<p>{`Question\\u202f?\\nSuite`}</p>'],
    ['<p>{`«\\ntexte\\n»`}</p>', '<p>{`«\\ntexte\\n»`}</p>'],
    ['<p>{`«\\xA0mot\\xA0»`}</p>', '<p>{`«\\xA0mot\\xA0»`}</p>'],
    ['<p>{`«\\u{A0}mot\\u{A0}»`}</p>', '<p>{`«\\u{A0}mot\\u{A0}»`}</p>'],
    ['<p>{`«\\u{202f}mot\\u{202f}»`}</p>', '<p>{`«\\u00a0mot\\u00a0»`}</p>'],
    ['<p>{`«\\u00A0mot\\u00A0»`}</p>', '<p>{`«\\u00A0mot\\u00A0»`}</p>'],
    ['<p>{`«\\u202Fmot\\u202F»`}</p>', '<p>{`«\\u00a0mot\\u00a0»`}</p>'],
    ['<p>{`\\u{1F600}\\tQuestion ?`}</p>', '<p>{`\\u{1F600}\\tQuestion\\u202f?`}</p>'],
    ['<p>{`Un\\\n outil ?`}</p>', '<p>{`Un\\\n outil\\u202f?`}</p>'],
    ['<p>{`«\\\\u00a0mot\\\\u00a0»`}</p>', '<p>{`«\\u00a0\\\\u00a0mot\\\\u00a0\\u00a0»`}</p>'],
    ['<p>{`Question\\x20?`}</p>', '<p>{`Question\\u202f?`}</p>'],
    ['<b>Un outil ?</b>', '<b>Un outil&#8239;?</b>'],
    ['<Heros description="Une aide : partout" />', '<Heros description="Une aide&nbsp;: partout" />'],
    [
      '<Heros description={`Zone géographique éligible pour cette aide : ${financement?.perimetresGeographiques}`} />',
      '<Heros description={`Zone géographique éligible pour cette aide\\u00a0: ${financement?.perimetresGeographiques}`} />',
    ],
    ['<p>{`Question ?`}</p>', '<p>{`Question\\u202f?`}</p>'],
    [
      '<p>{`«mot» : ${valeur} ; suite !`}</p>',
      '<p>{`«\\u00a0mot\\u00a0»\\u00a0: ${valeur}\\u202f; suite\\u202f!`}</p>',
    ],
  ])('corrige %s et reste stable', (code, attendu) => {
    const résultat = corriger(code);
    expect(résultat.output).toBe(attendu);
    expect(résultat.messages).toEqual([]);
    expect(corriger(attendu).fixed).toBe(false);
  });

  it.each([
    '<p>{"Test ?" === texte ? "Oui" : "Non"}</p>',
    '<p>{formater("Question ?")}</p>',
    '<p>{`Valeur ${formater("Question ?")}`}</p>',
    '<p>{42}</p>',
    '<code>{"Question ?"}</code>',
    '<pre>{condition ? "Question ?" : `Autre !`}</pre>',
    '<script>const texte = `Question ?`;</script>',
    '<style>p::after { content: "Question ?"; }</style>',
    '<code>{`Question ?`}</code>',
    '<pre>{`Question ?`}</pre>',
    '<p>{String.raw`Question ?`}</p>',
    '<p>{`«\\u00a0mot\\u00a0»`}</p>',
    '<p>{`«\u00a0mot\u00a0»`}</p>',
  ])('préserve %s', (code) => {
    expect(corriger(code)).toMatchObject({ fixed: false, messages: [], output: code });
  });
});

it.each([
  ['<p>Oui !</p>', 'Utiliser une espace fine insécable avant « ! » : &#8239;.'],
  ['<p>{"Oui !"}</p>', 'Utiliser une espace fine insécable avant « ! » : \\u202f.'],
  ['<p>«mot»</p>', 'Utiliser une espace insécable après « « » : &nbsp;.'],
  ['<p>{"Oui :"}</p>', 'Utiliser une espace insécable avant « : » : \\u00a0.'],
])('indique la correction pour %s', (code, message) => {
  const diagnostics = new Linter().verify(code, configuration, { filename: 'exemple.svelte' });
  expect(diagnostics.some((diagnostic) => diagnostic.message === message)).toBe(true);
  expect(
    diagnostics.every((diagnostic) => diagnostic.fix && diagnostic.message.endsWith(diagnostic.fix.text + '.'))
  ).toBe(true);
});
