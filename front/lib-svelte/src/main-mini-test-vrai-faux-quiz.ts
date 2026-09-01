import { hydrate } from 'svelte';
import QuizVraiFaux from './mini-tests/QuizVraiFaux.svelte';

hydrate(QuizVraiFaux, {
  target: document.getElementById('mini-test-vrai-faux-quiz')!,
});
