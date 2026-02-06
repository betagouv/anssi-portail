<script lang="ts">
  export let type: 'ERREUR';
  export let titre: string;
  export let message: string;
</script>

{#if type === 'ERREUR'}
  <div class="alerte">
    <div class="icone">
      <img src="../../../assets/images/icone-erreur-blanche.svg" alt="Icone d'erreur" />
    </div>
    <div class="contenu">
      <b>{titre}</b>
      <p>{message}</p>
    </div>
  </div>
{/if}
<div>

</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .alerte {
    width: 100%;
    display: flex;
    margin-top: 32px;

    .icone {
      display: flex;
      justify-content: center;
      align-items: start;

      background-color: var(--background-flat-error);

      img {
        margin: 1rem 0.5rem;
        width: 1.5rem;
      }
    }

    .contenu {
      width: 100%;
      padding: 16px 36px 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      font-size: 1rem;

      @include a-partir-de(md) {
        font-size: 1.25rem;
      }

      border: 1px solid var(--border-plain-error);

      p {
        margin: unset;
        font-size: .75rem;

        @include a-partir-de(md) {
          font-size: 1rem;
        }
      }
    }
  }
</style>