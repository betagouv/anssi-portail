<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { profilStore } from '../stores/profil.store.js';
  import { fabriqueFilAriane, type Branche, type Segment } from './filAriane';

  type Props = {
    feuille: string;
    branche?: Branche;
    brancheConnectee?: Branche;
    fondSombre?: boolean;
  };
  const { feuille, branche = undefined, brancheConnectee = undefined, fondSombre = false }: Props = $props();

  const utilisateurEstConnecté = $derived(!!$profilStore);
  const segments: Segment[] = $derived(
    fabriqueFilAriane({ feuille, branche, brancheConnectée: brancheConnectee }, utilisateurEstConnecté)
  );
</script>

<dsfr-breadcrumb inverse={fondSombre} buttonLabel="Voir le fil d'Ariane" segments={enPropriétéWebC(segments)}>
  <ol slot="seo" class="fr-breadcrumb__list">
    {#each segments as segment, index (segment.id)}
      {@const isLast = index === segments.length - 1}
      <li>
        {#if isLast}
          <span>{segment.label}</span>
        {:else}
          <a href={segment.href}>{segment.label}</a>
        {/if}
      </li>
    {/each}
  </ol>
</dsfr-breadcrumb>

<style lang="scss">
  dsfr-breadcrumb {
    max-height: 20px;
    transform: translateY(-16px);
  }
</style>
