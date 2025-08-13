<script lang="ts">
  import FilAriane from '../ui/FilAriane.svelte';
  import BadgeTypeFinancement from './BadgeTypeFinancement.svelte';
  import type { ResumeFinancement } from './financement';

  export let financement: ResumeFinancement;
</script>

<section class="chapeau">
  <div class="contenu-section">
    <FilAriane
      feuille={financement.nom}
      branche={{ nom: 'Financements cyber', lien: '/financements' }}
    />
    <div class="badges">
      {#each financement.typesDeFinancement as type (type)}
        <BadgeTypeFinancement>{type}</BadgeTypeFinancement>
      {/each}
    </div>
    <h1>{financement.nom}</h1>
    <p>
      {`Zone géographique éligible pour cette aide : ${financement.perimetreGeographique}`}
    </p>
  </div>
</section>

<section class="operations-eligibles">
  <div class="contenu-section">
    <h2>Opérations éligibles</h2>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 0 var(--gouttiere) 40px;
  }

  .chapeau {
    background: #f4f4f4 url('/assets/images/motif-fond-service.png');
    padding-top: 24px;

    .contenu-section {
      display: flex;
      flex-direction: column;
    }

    @include a-partir-de(md) {
      gap: 16px;
    }

    .badges {
      display: flex;
      align-items: flex-start;
      align-content: flex-start;
      gap: 8px;
      align-self: stretch;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    h1 {
      font-size: 2.5rem;
      line-height: 2.875rem;
      margin: 0 0 8px;

      @include a-partir-de(md) {
        font-size: 3.5rem;
        line-height: 3.875rem;
      }
    }

    p {
      margin: 0;
      font-size: 1.25rem;
      line-height: 2rem;
      color: #3a3a3a;

      @include a-partir-de(md) {
        font-size: 1.375rem;
        line-height: 2rem;
      }
    }
  }
</style>
