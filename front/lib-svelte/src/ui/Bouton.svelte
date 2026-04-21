<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  interface Props {
    titre: string;
    type: 'primaire' | 'secondaire';
    taille?: 'md';
    actif?: boolean;
    enCoursEnvoi?: boolean;
    boutonSoumission?: boolean;
    icone?: '' | 'partager';
    surClic?: (e: MouseEvent | KeyboardEvent) => void;
  }

  const {
    titre,
    type,
    taille = undefined,
    actif = true,
    enCoursEnvoi = false,
    boutonSoumission = true,
    icone = '',
    surClic,
  }: Props = $props();

  const kind = $derived(type === 'primaire' ? 'primary' : 'secondary');
  const boutonType = $derived(boutonSoumission ? 'submit' : 'button');
  const hasIcon = $derived(!!icone);
  const icon = $derived(icone === 'partager' ? 'share-line' : '');

  const gereClick = (e: MouseEvent | KeyboardEvent) => {
    surClic?.(e);
  };
</script>

<dsfr-button
  label={titre}
  {kind}
  size={taille}
  type={boutonType}
  disabled={!actif || enCoursEnvoi}
  {hasIcon}
  {icon}
  iconPlace="left"
  use:clic={gereClick}
></dsfr-button>
