<svelte:options
  customElement={{
    props: {
      blank: { type: 'Boolean', attribute: 'blank' },
      iconeSeule: { type: 'Boolean', attribute: 'icone-seule' },
      iconeADroite: { type: 'Boolean', attribute: 'icone-a-droite' },
      neutre: { type: 'Boolean', attribute: 'neutre' },
    },
    shadow: 'none',
  }}
/>

<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  type Props = {
    apparence?: 'lien' | 'bouton';
    blank?: boolean;
    href: string;
    icone?: string;
    iconeSeule?: boolean;
    iconeADroite?: boolean;
    id?: string;
    libelle: string;
    neutre?: boolean;
    taille?: 'sm' | 'md' | 'lg';
    telechargement?: string;
    telechargementDetails?: string;
    type?: 'primaire' | 'secondaire' | 'secondaire-inverse';
    'data-source'?: string;
    'data-cible'?: string;
    class?: string;
  };
  const {
    apparence = 'lien',
    blank,
    href,
    icone = '',
    iconeSeule,
    iconeADroite,
    id,
    libelle,
    neutre,
    taille,
    telechargement,
    telechargementDetails,
    type,
    ...reste
  }: Props = $props();

  const hasIcon = $derived(!!icone);
  const iconPlace = $derived(iconeADroite ? 'right' : 'left');

  const kind = $derived(
    type
      ? {
          primaire: 'primary',
          secondaire: 'secondary',
          'secondaire-inverse': 'inverted-secondary',
        }[type]
      : 'primary'
  );
  const traceClic = () => {
    const cible = href.startsWith('/') ? `${window.location.protocol}//${window.location.host}${href}` : href;
    window._paq?.push(['trackLink', cible, telechargement ? 'download' : 'link']);
  };
</script>

{#if apparence == 'lien'}
  <dsfr-link
    {blank}
    detail={telechargementDetails}
    download={telechargement}
    has-icon={hasIcon}
    {href}
    icon={icone}
    icon-place={iconPlace}
    {id}
    label={libelle}
    neutral={neutre}
    size={taille}
    use:clic={traceClic}
    {...reste}
  ></dsfr-link>
{:else}
  <dsfr-button
    label={libelle}
    size={taille}
    has-icon={hasIcon}
    icon={icone}
    icon-place={iconeSeule ? 'only' : iconPlace}
    {id}
    markup="a"
    {href}
    target={blank ? '_blank' : '_self'}
    {kind}
    use:clic={traceClic}
    {...reste}
  ></dsfr-button>
{/if}

<style lang="scss">
  dsfr-link {
    color: inherit;
  }
</style>
