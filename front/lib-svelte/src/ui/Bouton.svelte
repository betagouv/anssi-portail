<script lang="ts">
  import { DsfrButton } from '@lab-anssi/ui-kit';

  export interface Props {
    etire?: boolean;
    libelle?: string;
    titre?: string;
    type?:
      'primaire' | 'primaire-inverse' | 'secondaire' | 'secondaire-inverse' | 'tertiaire' | 'tertiaire-sans-bordure';
    taille?: 'sm' | 'md' | 'lg';
    desactive?: boolean;
    boutonSoumission?: boolean;
    icone?: string;
    iconeSeule?: boolean;
    iconeADroite?: boolean;
    idFormulaire?: string;
    surClic?: (e: MouseEvent | KeyboardEvent) => void;
    preset?: 'close' | 'tooltip' | 'fullscreen' | 'display' | 'account' | 'team' | 'briefcase' | 'sort';
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
    idFormulaire,
    surClic,
    preset,
  }: Props = $props();

  const kind = $derived(
    (
      {
        primaire: 'primary',
        'primaire-inverse': 'inverted-primary',
        secondaire: 'secondary',
        'secondaire-inverse': 'inverted-secondary',
        'tertiaire-sans-bordure': 'tertiary-no-outline',
        tertiaire: 'tertiary',
      } as const
    )[type]
  );
  const boutonType = $derived(boutonSoumission ? 'submit' : 'button');
  const hasIcon = $derived(!!icone);
  const iconPlace = $derived(iconeSeule ? 'only' : iconeADroite ? 'right' : 'left');
</script>

<DsfrButton
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
  form={idFormulaire}
  onclick={surClic}
  {preset}
></DsfrButton>
