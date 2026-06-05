<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  interface Props {
    actif?: boolean;
    etire?: boolean;
    libelle?: string;
    titre?: string;
    type: 'primaire' | 'secondaire' | 'secondaire-inverse' | 'tertiaire' | 'tertiaire-sans-bordure';
    taille?: 'sm' | 'md';
    desactive?: boolean;
    boutonSoumission?: boolean;
    icone?: string;
    iconeSeule?: boolean;
    surClic?: (e: MouseEvent | KeyboardEvent) => void;
  }

  const {
    actif = false,
    etire,
    libelle,
    titre,
    type,
    taille = undefined,
    desactive = false,
    boutonSoumission = false,
    icone = '',
    iconeSeule = false,
    surClic,
  }: Props = $props();

  const kind = $derived(
    {
      primaire: 'primary',
      secondaire: 'secondary',
      'secondaire-inverse': 'inverted-secondary',
      'tertiaire-sans-bordure': 'tertiary-no-outline',
      tertiaire: 'tertiary',
    }[type]
  );
  const boutonType = $derived(boutonSoumission ? 'submit' : 'button');
  const hasIcon = $derived(!!icone);

  const gereClick = (e: MouseEvent | KeyboardEvent) => {
    surClic?.(e);
  };
</script>

<dsfr-button
  class:actif
  centered={etire}
  label={libelle}
  title={titre}
  {kind}
  size={taille}
  type={boutonType}
  disabled={desactive || undefined}
  has-icon={hasIcon}
  icon={icone}
  icon-place={iconeSeule ? 'only' : 'left'}
  use:clic={gereClick}
></dsfr-button>

<style lang="scss">
  .actif {
    background: var(--background-action-high-blue-france);
    border-radius: 8px;

    img {
      filter: brightness(0) invert(1);
    }
  }
</style>
