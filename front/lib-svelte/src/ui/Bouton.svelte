<script lang="ts">
  export let titre: string;
  export let type: 'primaire' | 'secondaire';
  export let taille: 'md' | undefined = undefined;
  export let actif: boolean = true;
  export let enCoursEnvoi: boolean = false;
  export let boutonSoumission: boolean = true;
  export let icone: '' | 'partager' = '';

  const kind = type === 'primaire' ? 'primary' : 'secondary';
  const boutonType = boutonSoumission ? 'submit' : 'button';
  const hasIcon = !!icone;
  const iconName = icone === 'partager' ? 'share-line' : '';
</script>

<dsfr-button
  label={titre}
  {kind}
  size={taille}
  type={boutonType}
  disabled={!actif || enCoursEnvoi}
  {hasIcon}
  icon={iconName}
  iconPlace="left"
  on:click
></dsfr-button>
