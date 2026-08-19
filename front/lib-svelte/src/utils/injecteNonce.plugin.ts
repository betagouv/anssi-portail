import * as Vite from 'vite';

const injecteNonceWebcomponents = (code: string) => {
  let codeAvecNonce = `const nonce =
  typeof document !== 'undefined'
    ? document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content')
    : null;\n${code}`;

  codeAvecNonce = codeAvecNonce
    .replace(
      /\b(?:const|let|var)\s+(\w+)\s*=\s*\w+\(\s*(["'`])style\2\s*\)\s*;/gm,
      (match, nomVariable) => `${match}${nomVariable}.nonce=nonce;`
    )
    .replace(
      /\b(?:const|let|var)\s+(\w+)\s*=\s*document\.createElement\(\s*(["'`])style\2\s*\)\s*;/gm,
      (match, nomVariable) => `${match}${nomVariable}.nonce=nonce;`
    );

  return codeAvecNonce;
};

export const injecteNonce = (): Vite.Plugin => ({
  name: 'injecte-nonce',
  enforce: 'post',
  generateBundle(_options, bundle) {
    console.log('📝 Ajout de la gestion du Nonce');

    for (const file of Object.values(bundle)) {
      if (file.type === 'chunk' && file.code) {
        // Ajoute le nonce aux éléments style générés par Svelte.
        file.code = injecteNonceWebcomponents(file.code);
      }
    }
    console.log('✅');
  },
});
