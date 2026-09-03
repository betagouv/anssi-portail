<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import { type Snippet } from 'svelte';
  import Reactions from '../ui/Reactions.svelte';

  type Props = {
    couleurDeFond: string;
    cible: string;
    image: Snippet<[boolean]>;
    titre: string;
    href: string;
    réactions: Record<string, number>;
    badge: { libellé: string | undefined; accent: string };
  };
  let { couleurDeFond, cible, image, titre, href, réactions, badge }: Props = $props();

  const { libellé: libelléDuBadge, accent: accentDuBadge } = $derived(badge);

  let survol = $state(false);

  let carte: HTMLElement | undefined = $state();
  $effect(() => {
    if (carte) {
      carte.style.setProperty('--background-default-grey', `var(${couleurDeFond})`);
      carte.style.setProperty('--background-default-grey-hover', `var(${couleurDeFond}-hover)`);
      carte.style.setProperty('--background-default-grey-active', `var(${couleurDeFond}-active)`);
    }
  });
</script>

<div class="carte">
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <dsfr-card
    bind:this={carte}
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
    has-header-badge={libelléDuBadge}
  >
    <div slot="headerbadges">
      <dsfr-badge accent={accentDuBadge} label={`🔥 ${libelléDuBadge}`} size="md" type="accent"> </dsfr-badge>
    </div>
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
      {réactions}
      clé="réaction:mini-test:{cible}"
      {cible}
      urlDeBase="/api/reactions-mini-tests"
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
