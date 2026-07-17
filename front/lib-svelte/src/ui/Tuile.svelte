<script lang="ts">
  type Props = {
    titre: string;
    pictogram?: string;
  };
  const { titre, pictogram }: Props = $props();
</script>

<dsfr-tile title={titre} hasDescription={$$slots.description} {pictogram} actionMarkup="false">
  <slot name="pictogram" slot="pictogram"></slot>
  <slot name="description" slot="description"></slot>
</dsfr-tile>
