<script>
  import TuilesMaturiteSessionGroupe from './TuilesMaturiteSessionGroupe.svelte';
</script>

<section>
  <div class="contenu-section">
    <h2>Les 5 niveaux de maturité cyber</h2>
    <TuilesMaturiteSessionGroupe />
    <a href="/niveaux-maturite" class="lien" target="_blank">
      Les niveaux de maturité cyber
    </a>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 48px var(--gouttiere) 0;

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding-bottom: 48px;
      border-bottom: 1px solid var(--gris-clair);
    }
  }

  h2 {
    margin: 0;
    font-size: 2rem;
    line-height: 2.5rem;
  }
</style>