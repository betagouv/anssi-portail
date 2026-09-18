<script lang="ts">
</script>

<div class="minuteur">
  <p>Temps restant&nbsp;: <strong>30 secondes</strong></p>
  <progress value="25" max="30"></progress>
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

    progress {
      height: 0.5rem;
      background-color: var(--background-default-grey);
      border: none;
      border-radius: 999px;
      overflow: hidden;
      width: 100%;

      &::-webkit-progress-bar {
        background: var(--background-default-grey);
        border-radius: 999px;
      }

      &::-webkit-progress-value {
        background: var(--border-default-blue-france);
        border-radius: 999px;
      }

      &::-moz-progress-bar {
        background: var(--border-default-blue-france);
        border-radius: 999px;
      }
    }
  }
</style>
