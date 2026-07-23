<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';

  // ATTENTION: Le `slot` description n'a pas le style "fr-tile_desc" et donc ne s'affiche pas au
  // "bon" endroit : il est au-dessus du titre au lieu d'être en-dessous.
  // Ce comportement est voulu sur les tuiles de la page Statistiques mais pas dans
  // CarrouselDesInterlocuteurs où la description est en-dessous.
  //
  // Utilisez le snippet `description` pour mettre la description au-dessus et l'attribut `descriptionTexte`
  // pour le placer en-dessous !

  type Props = {
    description?: Snippet | string;
    élargi?: boolean;
    horizontal?: boolean;
    href?: string;
    compact?: boolean;
    illustration?: Snippet;
    titre: string;
    pictogramme?: string;
    taille?: 'sm' | 'md';
  };

  let {
    description: descriptionInitiale,
    élargi: enlarge = false,
    horizontal,
    href,
    compact: compactInitial,
    illustration,
    titre: title,
    pictogramme: pictogram,
    taille: size,
  }: Props = $props();

  const compact = untrack(() => compactInitial);
  const description = untrack(() => typeof descriptionInitiale === 'string' && descriptionInitiale);
  const descriptionSnippet = untrack(() => typeof descriptionInitiale !== 'string' && descriptionInitiale);

  const hasDescription = $derived(Boolean(descriptionInitiale) && !compact);
  const actionMarkup = $derived(href ? 'a' : false);

  horizontal ??= compact;
  size ??= compact ? 'sm' : undefined; // garde la taille par défaut
</script>

<dsfr-tile {title} {description} {hasDescription} {enlarge} {pictogram} {horizontal} {size} {actionMarkup} {href}>
  {#if illustration}
    <span slot="pictogram">{@render illustration()}</span>
  {/if}
  {#if descriptionSnippet}
    <span slot="description">{@render descriptionSnippet()}</span>
  {/if}
  <hgroup slot="seo">
    <h3><a {href}>{title}</a></h3>
    {#if hasDescription}
      {#if descriptionSnippet}
        {@render descriptionSnippet()}
      {:else}
        <p>{description}</p>
      {/if}
    {/if}
  </hgroup>
</dsfr-tile>
