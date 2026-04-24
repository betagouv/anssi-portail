<script lang="ts">
  type Props = {
    libelle: string;
    niveauTitre?: 1 | 2 | 3 | 4 | 5;
    id?: string;
    estOuvert?: boolean;
  };
  const { libelle, niveauTitre = 3, id, estOuvert }: Props = $props();
</script>

<dsfr-accordion {id} title-markup-level={niveauTitre} label={libelle} is-expanded={estOuvert}>
  <slot />
</dsfr-accordion>
