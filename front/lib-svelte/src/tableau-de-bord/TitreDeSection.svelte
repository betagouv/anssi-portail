<script lang="ts">
  import { Icone } from '@lab-anssi/ui-kit';

  type Props = {
    libellé: string;
    icône: string;
  };

  const { libellé, icône }: Props = $props();
</script>

<h2 class="fr-h4"><span><Icone nom={icône} taille="lg" /></span>{libellé}</h2>

<style lang="scss">
  h2 {
    margin-bottom: 0;
    grid-area: titre;
    display: flex;
    gap: 0.5rem;

    span {
      color: var(--artwork-minor-blue-france);
    }
  }
</style>
