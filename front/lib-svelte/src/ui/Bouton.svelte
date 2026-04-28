<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  interface Props {
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
