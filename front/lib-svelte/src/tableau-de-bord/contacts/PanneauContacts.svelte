<script lang="ts">
  import { Icone } from '@lab-anssi/ui-kit';
  import type { Snippet } from 'svelte';

  import IllustrationDragonPasDeResultat from '@ui/IllustrationDragonPasDeResultat.svelte';
  import Lien from '@ui/Lien.svelte';

  type Props = {
    children: Snippet;
    aucunRésultat?: boolean;
    messageAucunRésultat?: string;
    colonnesMax?: 1 | 2 | 3;
  };
  const { children, aucunRésultat = false, messageAucunRésultat = '', colonnesMax = 3 }: Props = $props();
</script>

<div class="contenu">
  <p class="texte-mention-xs">
    Contactez toujours en priorité les personnes responsables au sein de votre organisation.
  </p>
  {#if aucunRésultat}
    <div class="aucun-contact">
      <IllustrationDragonPasDeResultat texteAlternatif="Aucun contact sectoriel trouvé" />
      <p class="texte-standard-md">{messageAucunRésultat}</p>
    </div>
  {:else}
    <div class={['cartes', `colonnes-max-${colonnesMax}`]}>
      {@render children()}
    </div>
  {/if}
  <div class="pied-de-page">
    <Icone nom="verified-badge-fill" />
    <div>
      <span>Trouvez des prestataires qualifiés et labellisés pour vous aider.&#32;</span><Lien
        libelle="Accéder aux prestataires"
        href="/prestataires-labellises"
      />
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .contenu {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .texte-mention-xs {
      margin-bottom: 0;
    }

    .aucun-contact {
      margin: 1.5rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .texte-standard-md {
        margin-bottom: 0;
      }
    }

    .cartes {
      --nombre-colonnes: 1;
      display: grid;
      grid-template-columns: repeat(var(--nombre-colonnes), 1fr);
      gap: 1rem;

      @include a-partir-de(md) {
        --nombre-colonnes: 2;

        &.colonnes-max-1 {
          --nombre-colonnes: 1;
        }
      }
      @include a-partir-de(lg) {
        --nombre-colonnes: 3;

        &.colonnes-max-1 {
          --nombre-colonnes: 1;
        }

        &.colonnes-max-2 {
          --nombre-colonnes: 2;
        }
      }
    }

    .pied-de-page {
      display: flex;
      gap: 0.5rem;

      > :global(.icone) {
        margin-top: 0.2rem;
        color: var(--artwork-major-blue-france);
      }
    }
  }
</style>
