export const aseptiseMarkdown = (message: string) =>
  [
    '\\',
    '!',
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
  ].reduce(
    (acc, caractere) => acc.replaceAll(caractere, `\\${caractere}`),
    message
  );