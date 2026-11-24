<script lang="ts">
  import { Icone } from '@lab-anssi/ui-kit';
  import type { Snippet } from 'svelte';
  import Lien from '../../ui/Lien.svelte';

  const { children }: { children: Snippet } = $props();
</script>

<div class="contenu">
  <p class="texte-mention-xs">
    Contactez toujours en priorité les personnes responsables au sein de votre organisation.
  </p>
  <div class="cartes">
    {@render children()}
  </div>
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

    .cartes {
      --nombre-colonnes: 1;
      display: grid;
      grid-template-columns: repeat(var(--nombre-colonnes), 1fr);
      gap: 1rem;

      @include a-partir-de(md) {
        --nombre-colonnes: 2;
      }
      @include a-partir-de(lg) {
        --nombre-colonnes: 3;
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
