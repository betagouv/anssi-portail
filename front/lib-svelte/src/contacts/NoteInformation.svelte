<script lang="ts">
</script>

<p class="note-information">
  Ces contacts sont fournis à titre indicatif et leur pertinence peut varier
  selon les spécificités de votre organisation. Contactez toujours en priorité
  les personnes responsables au sein de votre organisation.
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
