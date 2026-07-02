import * as Vite from 'vite';

const injecteNonceWebcomponents = (code: string) => {
  let codeAvecNonce = `const nonce =
  typeof document !== 'undefined'
    ? document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content')
    : null;\n${code}`;

  codeAvecNonce = codeAvecNonce
    .replace(/const (\w+)\s*=\s*\w+\(["']style["']\);/gm, (match, nomVariable) => `${match}${nomVariable}.nonce=nonce;`)
    .replace(
      /const (\w+)\s*=\s*document\.createElement\(["']style["']\);/gm,
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
        // Remplace `const a = u("style");`
        // par `const a = u("style");a.nonce=nonce;`
        file.code = injecteNonceWebcomponents(file.code);
      }
    }
    console.log('✅');
  },
});
