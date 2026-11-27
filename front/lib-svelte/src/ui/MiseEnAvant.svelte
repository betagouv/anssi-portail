<script lang="ts">
  import { DsfrCallout } from '@lab-anssi/ui-kit';
  import type { Snippet } from 'svelte';

  import type { CouleurIllustrativeDsfr } from './couleurDsfr.type';

  type Props = {
    accent?: CouleurIllustrativeDsfr;
    bouton?: Snippet;
    icone?: string;
    libelléBouton?: string;
    niveauTitre?: 2 | 3 | 4 | 5;
    texte: string;
    titre?: string;
  };

  const { accent, bouton, icone, libelléBouton, niveauTitre, texte, titre }: Props = $props();
  const titleMarkup = $derived(niveauTitre ? (`h${niveauTitre}` as const) : undefined);
  const hasButton = $derived(Boolean(bouton));
  const hasIcon = $derived(Boolean(icone));
  const hasTitle = $derived(Boolean(titre));
</script>

<DsfrCallout
  {accent}
  {hasButton}
  {hasIcon}
  {hasTitle}
  {titleMarkup}
  buttonLabel={libelléBouton}
  icon={icone}
  text={texte}
  title={titre}
>
  <svelte:fragment slot="button">
    {#if bouton}
      {@render bouton()}
    {/if}
  </svelte:fragment>
</DsfrCallout>
