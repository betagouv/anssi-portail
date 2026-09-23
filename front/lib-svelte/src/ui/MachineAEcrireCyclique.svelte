<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion';
  import MachineAEcrire from './MachineAEcrire.svelte';

  const INTERVAL_EN_MS = 5000;

  type Props = {
    préfixe?: string;
    phrasesAnimées: string[];
    enPause?: boolean;
  };

  const { préfixe, phrasesAnimées, enPause = false }: Props = $props();

  const mouvementRéduit = $derived(prefersReducedMotion.current);
  let index = $state<number>(0);
  const phraseCourante = $derived(phrasesAnimées[index]);

  $effect(() => {
    if (mouvementRéduit) {
      index = 0;
      return;
    }

    if (enPause) {
      return;
    }

    const interval = setInterval(() => {
      index = (index + 1) % phrasesAnimées.length;
    }, INTERVAL_EN_MS);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<span>
  {préfixe}<MachineAEcrire texte={phraseCourante} {enPause} />
</span>
