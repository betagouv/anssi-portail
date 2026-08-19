import * as Vite from 'vite';

const estRuntimeCssSvelte = (id: string): boolean => {
  const CHEMIN_RUNTIME_CSS_SVELTE = '/svelte/src/internal/client/dom/css.js';

  const chemin = Vite.normalizePath(id).split('?')[0];
  return chemin.endsWith(CHEMIN_RUNTIME_CSS_SVELTE);
};

const injecteNonceRuntimeSvelte = (code: string): string => {
  const CREATION_STYLE_SVELTE = "const style = create_element('style');";

  if (!code.includes(CREATION_STYLE_SVELTE)) {
    throw new Error("Impossible d'ajouter le nonce : le runtime CSS de Svelte a changé");
  }

  const récupérationNonce = `const __anssiCspNonce =
  typeof document !== 'undefined'
    ? document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content')
    : null;
`;

  const codeAvecNonce = code.replace(
    CREATION_STYLE_SVELTE,
    `${CREATION_STYLE_SVELTE}
    if (__anssiCspNonce) style.nonce = __anssiCspNonce;`
  );

  return `${récupérationNonce}\n${codeAvecNonce}`;
};

export const injecteNonce = (): Vite.Plugin => ({
  name: 'injecte-nonce',
  enforce: 'pre',

  transform(code, id) {
    if (!estRuntimeCssSvelte(id)) {
      return;
    }

    console.log(`📝 Ajout de la gestion du nonce dans ${id}`);

    return {
      code: injecteNonceRuntimeSvelte(code),
      map: null,
    };
  },
});
