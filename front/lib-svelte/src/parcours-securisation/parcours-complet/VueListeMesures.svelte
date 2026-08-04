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
      <div class="titre-badge">
        {#if mesure.estPriseEnCompte}
          <dsfr-badge
            accent="green-emeraude"
            has-icon
            icon="checkbox-circle-fill"
            label="Prise en compte"
            size="sm"
            type="accent"
          ></dsfr-badge>
        {/if}
        {mesure.titre}
      </div>
      <div class="lien">
        <Lien
          taille="sm"
          apparence="bouton"
          type={mesure.estPriseEnCompte ? 'tertiaire' : 'primaire'}
          href={`/mesures/${mesure.id}`}
          libelle={mesure.estPriseEnCompte ? 'Accédez aux détails' : "Passer à l'action"}
          source="Vues des mesures"
        />
      </div>
    </li>
  {/each}
</ul>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
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

    @include a-partir-de(md) {
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      gap: 0.5rem;
    }
  }

  .lien {
    min-width: 10rem;
  }

  .titre-badge {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
