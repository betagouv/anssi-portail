<script lang="ts">
  import Lien from '../../ui/Lien.svelte';
  import type { Mesure } from '../mesure';

  type ModulePrésentation = {
    id: number;
    titre: string;
    description: string;
    cibleBadge?: number;
    nombreMesuresTotal: number;
    nombreMesuresPrisesEnCompte: number;
    mesures: Mesure[];
  };
  const { modules }: { modules: ModulePrésentation[] } = $props();
  const mesures = $derived(modules.flatMap((module) => module.mesures));
</script>

<ul>
  {#each mesures as mesure (mesure.id)}
    <li>
      <div>{mesure.titre}</div>
      <Lien apparence="bouton" href={`/mesures/${mesure.id}`} libelle={"Passer à l'action"} />
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-block: 1rem;
    border-bottom: 1px solid var(--border-default-grey);
  }
</style>
