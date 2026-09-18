<script lang="ts">
</script>

<div class="minuteur">
  <p>Temps restant&nbsp;: <strong>30 secondes</strong></p>
  <div class="barre-temps" aria-hidden="true"></div>
</div>

<style lang="scss">
  .minuteur {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background-color: var(--background-alt-grey);

    p {
      margin: 0;
    }

    .barre-temps {
      width: 100%;
      height: 0.5rem;
      border-radius: 999px;
      background-color: var(--border-default-blue-france);
    }
  }
</style>
