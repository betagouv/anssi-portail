<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  export interface Props {
    etire?: boolean;
    libelle?: string;
    titre?: string;
    type?:
      'primaire' | 'primaire-inverse' | 'secondaire' | 'secondaire-inverse' | 'tertiaire' | 'tertiaire-sans-bordure';
    taille?: 'sm' | 'md';
    desactive?: boolean;
    boutonSoumission?: boolean;
    icone?: string;
    iconeSeule?: boolean;
    iconeADroite?: boolean;
    surClic?: (e: MouseEvent | KeyboardEvent) => void;
  }

  const {
    etire,
    libelle,
    titre,
    type = 'primaire',
    taille = undefined,
    desactive = false,
    boutonSoumission = false,
    icone = '',
    iconeSeule = false,
    iconeADroite = false,
    surClic,
  }: Props = $props();

  const kind = $derived(
    {
      primaire: 'primary',
      'primaire-inverse': 'inverted-primary',
      secondaire: 'secondary',
      'secondaire-inverse': 'inverted-secondary',
      'tertiaire-sans-bordure': 'tertiary-no-outline',
      tertiaire: 'tertiary',
    }[type]
  );
  const boutonType = $derived(boutonSoumission ? 'submit' : 'button');
  const hasIcon = $derived(!!icone);
  const iconPlace = $derived(iconeSeule ? 'only' : iconeADroite ? 'right' : 'left');

  const gereClick = (e: MouseEvent | KeyboardEvent) => {
    surClic?.(e);
  };
</script>

<dsfr-button
  centered={etire}
  label={libelle}
  title={titre}
  {kind}
  size={taille}
  type={boutonType}
  disabled={desactive || undefined}
  has-icon={hasIcon}
  icon={icone}
  icon-place={iconPlace}
  use:clic={gereClick}
>
  <button slot="seo" title={titre} disabled={desactive || undefined} type={boutonType}>{libelle}</button>
</dsfr-button>
