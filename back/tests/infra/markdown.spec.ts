import { describe, it, expect } from 'vitest';
import { aseptiseMarkdown } from '../../src/infra/markdown.js';

describe('Le markdown', () => {
  it("retourne la chaîne intacte lorsqu'elle ne contient aucun caractère spécial", () => {
    const markdown = aseptiseMarkdown('bonjour tout le monde');

    expect('bonjour tout le monde').toBe(markdown);
  });

  it.each(['!', '\\', '[', ']', '`', '{', '}', '*', '_', '<', '>', '(', ')', '#', '+', '-', '.', '|'])(
    `échappe les %s`,
    (caractereAEchapper) => {
      const markdown = aseptiseMarkdown(caractereAEchapper);

      expect(`\\${caractereAEchapper}`).toBe(markdown);
    }
  );
});
