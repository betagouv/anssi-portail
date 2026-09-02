import { hydrate } from 'svelte';
import QuizVraiFaux from './mini-tests/vrai-faux/moteur-de-jeu/QuizVraiFaux.svelte';

hydrate(QuizVraiFaux, {
  target: document.getElementById('mini-test-vrai-faux-quiz')!,
});
