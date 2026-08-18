import { hydrate } from 'svelte';
import IllustrationConnexionInscription from './connexion/IllustrationConnexionInscription.svelte';

hydrate(IllustrationConnexionInscription, {
  target: document.getElementById('illustration-connexion-inscription')!,
});
