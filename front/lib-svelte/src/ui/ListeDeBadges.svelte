<script lang="ts">
  type Badge = { libelle: string; couleur?: string };
  type InformationBadge = string | Badge;
  type Props = {
    badges: InformationBadge[];
  };
  const { badges }: Props = $props();
  const badgesPrepares = $derived(() => {
    return badges
      .filter((badge) => !!badge)
      .map((tag: InformationBadge) =>
        typeof tag === 'string' ? { libelle: tag } : tag
      );
  });
</script>

<div class="tags">
  <p class="titre">Tags</p>
  {#each badgesPrepares() as { libelle }}
    <lab-anssi-tag label={libelle} taille="sm" type="defaut"></lab-anssi-tag>
  {/each}
</div>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .titre {
      color: var(--gris-aide-saisie);
      text-transform: uppercase;
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 0.875rem;
      line-height: 1.5rem;
      width: 100%;
    }
  }
</style>
