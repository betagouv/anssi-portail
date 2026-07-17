import { hydrate } from 'svelte';
import SessionGroupe from './test-maturite/SessionGroupe.svelte';

hydrate(SessionGroupe, {
  target: document.getElementById('session-groupe')!,
});
