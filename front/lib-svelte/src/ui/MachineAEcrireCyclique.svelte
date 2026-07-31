<script lang="ts">
  import MachineAEcrire from './MachineAEcrire.svelte';

  const INTERVAL_EN_MS = 5000;

  type Props = {
    préfixe?: string;
    phrasesAnimées: string[];
  };

  const { préfixe, phrasesAnimées }: Props = $props();

  let index = $state<number>(0);
  const phraseCourante = $derived(phrasesAnimées[index]);

  $effect(() => {
    const interval = setInterval(() => {
      index = (index + 1) % phrasesAnimées.length;
    }, INTERVAL_EN_MS);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<span>
  {préfixe}<MachineAEcrire texte={phraseCourante} />
</span>
