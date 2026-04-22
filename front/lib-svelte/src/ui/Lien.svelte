<svelte:options customElement={{ tag: 'msc-lien', shadow: 'none' }} />

<script lang="ts">
  type Props = {
    apparence?: 'lien' | 'bouton';
    blank?: boolean;
    href: string;
    icone?: string;
    iconeSeule?: boolean;
    id?: string;
    libelle: string;
    neutre?: boolean;
    taille?: 'sm' | 'md' | 'lg';
    telechargement?: string;
    telechargementDetails?: string;
    type?: 'primaire' | 'secondaire' | 'secondaire-inverse';
  };
  const {
    apparence = 'lien',
    blank,
    href,
    icone = '',
    iconeSeule = false,
    id,
    libelle,
    neutre,
    taille,
    telechargement,
    telechargementDetails,
    type,
  }: Props = $props();

  const hasIcon = $derived(!!icone);

  const kind = $derived(
    type
      ? {
          primaire: 'primary',
          secondaire: 'secondary',
          'secondaire-inverse': 'inverted-secondary',
        }[type]
      : 'primary'
  );
</script>

{#if apparence == 'lien'}
  <dsfr-link
    {blank}
    detail={telechargementDetails}
    download={telechargement}
    {hasIcon}
    {href}
    icon={icone}
    iconPlace="left"
    {id}
    label={libelle}
    neutral={neutre}
    size={taille}
  ></dsfr-link>
{:else}
  <dsfr-button
    label={libelle}
    size={taille}
    {hasIcon}
    icon={icone}
    iconPlace={iconeSeule ? 'only' : 'left'}
    {id}
    markup="a"
    {href}
    target={blank ? '_blank' : '_self'}
    {kind}
  ></dsfr-button>
{/if}
