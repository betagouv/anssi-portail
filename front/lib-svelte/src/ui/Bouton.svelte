<script lang="ts">
  interface Props {
    titre: string;
    type: 'primaire' | 'secondaire';
    taille?: 'md';
    actif?: boolean;
    enCoursEnvoi?: boolean;
    boutonSoumission?: boolean;
    icone?: '' | 'partager';
  }

  const {
    titre,
    type,
    taille = undefined,
    actif = true,
    enCoursEnvoi = false,
    boutonSoumission = true,
    icone = '',
  }: Props = $props();

  const kind = $derived(type === 'primaire' ? 'primary' : 'secondary');
  const boutonType = $derived(boutonSoumission ? 'submit' : 'button');
  const hasIcon = $derived(!!icone);
  const icon = $derived(icone === 'partager' ? 'share-line' : '');
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
  on:click
></dsfr-button>
