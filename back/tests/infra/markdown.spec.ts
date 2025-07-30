import assert from 'node:assert';
import { describe, it } from 'node:test';
import { aseptiseMarkdown } from '../../src/infra/markdown';

describe('Le markdown', () => {
  it("retourne la chaîne intacte lorsqu'elle ne contient aucun caractère spécial", () => {
    const markdown = aseptiseMarkdown('bonjour tout le monde');

    assert.equal('bonjour tout le monde', markdown);
  });

  [
    '!',
    '\\',
    '[',
    ']',
    '`',
    '{',
    '}',
    '*',
    '_',
    '<',
    '>',
    '(',
    ')',
    '#',
    '+',
    '-',
    '.',
    '|',
  ].forEach((caractereAEchapper) =>
    it(`échappe les ${caractereAEchapper}`, () => {
      const markdown = aseptiseMarkdown(caractereAEchapper);

      assert.equal(`\\${caractereAEchapper}`, markdown);
    })
  );
});
