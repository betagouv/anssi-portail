<script module lang="ts">
  import type { Snippet } from 'svelte';

  export type TypeAlerte = 'neutre' | 'succès' | 'erreur' | 'information' | 'attention';

  export type Props = {
    type?: TypeAlerte;
    estRejetable?: boolean;
  } &
    // Voir les conditions d'affichage de titre et description du DSFR :
    // https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/alerte/design-de-l-alerte
    (
      | {
          taille: 'md';
          titre: string;
          children?: Snippet;
        }
      | {
          taille: 'sm';
          titre?: string;
          children: Snippet;
        }
    );
</script>

<script lang="ts">
  let { type = 'neutre', estRejetable = false, titre, taille, children }: Props = $props();

  const typeDsfr = $derived(
    (
      {
        neutre: 'default',
        succès: 'success',
        erreur: 'error',
        information: 'info',
        attention: 'warning',
      } satisfies { [k in TypeAlerte]: string }
    )[type]
  );
</script>

<dsfr-alert
  type={typeDsfr}
  size={taille}
  title={titre}
  hasTitle={!!titre}
  hasDescription={!!children}
  dismissible={estRejetable}
  buttonCloseLabel={estRejetable ? 'Fermer cette alerte' : undefined}
>
  {#if children}
    <p slot="description">{@render children()}</p>
  {/if}
</dsfr-alert>

<style>
  dsfr-alert {
    width: 100%;
  }

  p {
    margin: var(--text-spacing);
    font-size: 1rem;
    line-height: 1.5rem;
  }
</style>
