<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import type { Snippet } from 'svelte';
  import Reactions from '../ui/Reactions.svelte';

  type Props = {
    couleurDeFond: string;
    cible: string;
    image: Snippet<[boolean]>;
    titre: string;
    href: string;
  };
  const { couleurDeFond, cible, image, titre, href }: Props = $props();

  let survol = $state(false);
  let réactions = $state({ '❤️': 0, '👍': 0, '🔥': 0 });
</script>

<div class="carte">
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <dsfr-card
    actionMarkup="a"
    data-cible={cible}
    data-source="MiniTest"
    enlarge
    hasDescription={false}
    {href}
    markup="h3"
    size="md"
    title={titre}
    onmouseenter={() => (survol = true)}
    onmouseleave={() => (survol = false)}
    style="--background-default-grey: var({couleurDeFond});--background-default-grey-hover: var({couleurDeFond}-hover);"
  >
    <div slot="image" class="image">
      {@render image(survol)}
    </div>
    <div slot="seo">
      <h3>
        <a {href}>{titre}</a>
      </h3>
    </div>
  </dsfr-card>
  {#if !estServeur}
    <Reactions
      bind:réactions
      clé="réaction:mini-test:{cible}"
      urlDePost="/api/reactions-mini-tests"
      variant="tertiaire-sans-bordure"
    />
  {/if}
</div>

<style lang="scss">
  .carte {
    border: 1px solid var(--border-default-grey);
    display: grid;
    grid-template-rows: 1fr auto;

    dsfr-card {
      margin: -1px;

      .image {
        display: grid;
        place-items: center;
        aspect-ratio: 16/9;
      }
    }
  }
</style>
