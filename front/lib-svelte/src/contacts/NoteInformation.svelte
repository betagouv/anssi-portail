<script lang="ts">
</script>

<p class="note-information">
  Contactez en priorité les personnes responsables des questions numériques et
  de cybersécurité au sein de votre organisation.
</p>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .note-information {
    align-self: flex-start;
    margin-bottom: 40px;

    @include a-partir-de(md) {
      margin-bottom: 24px;
    }

    :global(.contacts) & {
      margin-bottom: 0;
    }
  }
</style>
