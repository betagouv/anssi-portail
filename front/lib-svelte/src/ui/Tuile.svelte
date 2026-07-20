<script lang="ts">
  import { untrack } from 'svelte';

  // ATTENTION: Le `slot` description n'a pas le style "fr-tile_desc" et donc ne s'affiche pas au
  // "bon" endroit : il est au-dessus du titre au lieu d'être en-dessous.
  // Ce comportement est voulu sur les tuiles de la page Statistiques mais pas dans
  // CarrouselDesInterlocuteurs où la description est en-dessous.
  //
  // Utilisez le `<slot>` pour mettre la description au-dessus et l'attribut `descriptionTexte`
  // pour le placer en-dessous !

  type Props = {
    descriptionTexte?: string;
    élargi?: boolean;
    horizontal?: boolean;
    href?: string;
    compact?: boolean;
    titre: string;
    pictogramme?: string;
    taille?: 'sm' | 'md';
  };

  let {
    descriptionTexte: descriptionTexteInitiale,
    élargi: enlarge = false,
    horizontal,
    href,
    compact: compactInitial,
    titre: title,
    pictogramme: pictogram,
    taille: size,
  }: Props = $props();

  const compact = untrack(() => compactInitial);
  const descriptionTexte = untrack(() => descriptionTexteInitiale);

  const hasDescription = ($$slots.description || descriptionTexte) && !compact;
  const actionMarkup = $derived(href ? 'a' : false);

  horizontal ??= compact;
  size ??= compact ? 'sm' : undefined; // garde la taille par défaut
</script>

<dsfr-tile
  {title}
  description={descriptionTexte}
  {hasDescription}
  {enlarge}
  {pictogram}
  {horizontal}
  {size}
  {actionMarkup}
  {href}
>
  <slot name="pictogram" slot="pictogram"></slot>
  <slot name="description" slot="description"></slot>
</dsfr-tile>
