<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  interface Props {
    titre?: string;
    type: 'primaire' | 'secondaire' | 'secondaire-inverse';
    taille?: 'md';
    desactive?: boolean;
    boutonSoumission?: boolean;
    icone?: string;
    iconeSeule?: boolean;
    surClic?: (e: MouseEvent | KeyboardEvent) => void;
  }

  const {
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
    }[type]
  );
  const boutonType = $derived(boutonSoumission ? 'submit' : 'button');
  const hasIcon = $derived(!!icone);
  const icon = $derived(icone === 'partager' ? 'share-line' : icone);

  const gereClick = (e: MouseEvent | KeyboardEvent) => {
    surClic?.(e);
  };
</script>

<dsfr-button
  label={titre}
  {kind}
  size={taille}
  type={boutonType}
  disabled={desactive}
  {hasIcon}
  {icon}
  iconPlace={iconeSeule ? 'only' : 'left'}
  use:clic={gereClick}
></dsfr-button>
