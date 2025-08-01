<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  export let featureFlagAvisUtilisateur: boolean = false;

  let encartOuvert = false;
  const surCliqueCTA = () => {
    encartOuvert = false;
  };
  onMount(() => {
    encartOuvert = true;
  });
</script>

{#if featureFlagAvisUtilisateur && encartOuvert}
  <div
    class="avis-utilisateur-cta"
    transition:fly={{ duration: 500, x: 140, opacity: 1 }}
  >
    <button
      class="zone-cliquable"
      on:click={surCliqueCTA}
      on:keypress
      tabindex={null}
    >
      <div class="illustration">
        <img src="/assets/images/dragon-coeur.svg" alt="Dragon coeur" />
      </div>
      <p class="texte">Votre avis nous intéresse&nbsp;!</p>
    </button>
    <button
      on:keypress
      on:click={() => (encartOuvert = false)}
      tabindex={null}
      aria-label="Fermer"
      class="fermer"
    >
      <lab-anssi-icone nom="close-line" taille="sm"></lab-anssi-icone>
    </button>
  </div>
{/if}

<style lang="scss">
  .avis-utilisateur-cta {
    background-color: #ffffff;
    border-radius: 8px 0 0 8px;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 208px;
    width: 124px;
    z-index: 8;

    .fermer {
      cursor: pointer;
      background: transparent;
      border: 1px solid transparent;
      position: absolute;
      top: 0;
      right: 0;
      padding: 8px;
      margin: 2px 4px;

      &:focus-visible {
        outline: 2px solid #0a76f6;
        outline-offset: 2px;
      }

      &:hover {
        border-color: rgba(0, 0, 0, 0.1);
      }
      &:active {
        border-color: rgba(0, 0, 0, 0.2);
      }
    }
    .zone-cliquable {
      cursor: pointer;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 8px 0 0 8px;

      &:focus-visible {
        outline: 2px solid #0a76f6;
        outline-offset: 2px;
      }

      &:hover {
        background-color: var(--controle-segmente-fond-hover);
      }

      &:active {
        background-color: var(--controle-segmente-fond-clique);
      }

      .illustration {
        background-color: var(--jaune-clair-msc);
        border-top-left-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 120px;

        img {
          width: 97px;
        }
      }

      .texte {
        color: #161616;
        font-size: 14px;
        font-weight: 700;
        line-height: normal;
        margin: 8px 8px 12px;
        text-align: center;
      }
    }
  }
</style>
