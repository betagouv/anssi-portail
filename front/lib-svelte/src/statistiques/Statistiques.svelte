<script>
  import Tuile from './Tuile.svelte';
</script>

<div class="tuiles">
  <Tuile
    description="Utilisateurs inscrits"
    image="stat-utilisateurs-inscrits"
    mesure={1200}
  />
  <Tuile
    description="Test de maturité cyber"
    image="stat-test-maturite"
    mesure={1200}
  />
  <Tuile
    description="Diagnostics cyber"
    image="stat-diagnostics-cyber"
    mesure={1200}
  />
  <Tuile
    description="Services et ressources consultés"
    image="stat-services-et-ressources-consultes"
    mesure={1200}
  />
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .tuiles {
    display: grid;
    gap: 24px;
    @include a-partir-de(sm) {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
