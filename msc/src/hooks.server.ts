import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import type { ContexteMSC } from '../contexte';

// Empreinte du seul attribut style de #svelte-announcer dans le composant racine de SvelteKit.
const styleAnnonceNavigation = "'sha256-S8qMpvofolR8Mpjy4kQvEm7m1q8clzU4dfDH0AmvZjo='";

export const handle: Handle = async ({ event, resolve }) => {
  const requête = event.platform?.req;
  if (!requête || !('msc' in requête)) throw new Error('La requête doit passer par Express');
  Object.assign(event.locals, requête.msc as ContexteMSC);
  const réponse = await resolve(event);
  // Kit signe son script de démarrage. Conserver les autres directives Helmet et
  // autoriser le même nonce pour les styles des composants du kit UI.
  const cspKit = réponse.headers.get('content-security-policy');
  const nonce = cspKit?.match(/'nonce-[^']+'/u)?.[0];
  if (nonce && event.locals.politiqueDeSécurité) {
    réponse.headers.set(
      'content-security-policy',
      event.locals.politiqueDeSécurité
        .replace(/\bscript-src /u, `script-src ${nonce} `)
        .replace(
          /\bstyle-src (?![^;]*'unsafe-inline')/u,
          `style-src-attr 'unsafe-hashes' ${styleAnnonceNavigation};style-src ${nonce} `
        )
    );
  }
  return réponse;
};
export const handleError: HandleServerError = ({ error, event, kind }) => {
  if (kind === 'unknown' || (kind === 'framework' && error.status >= 500))
    event.locals.rapporteur?.erreur(error, 'SvelteKit');
};
