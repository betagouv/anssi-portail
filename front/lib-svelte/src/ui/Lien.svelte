<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  type Props = {
    apparence?: 'lien' | 'bouton';
    blank?: boolean;
    etire?: boolean;
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
    source?: string;
    cible?: string;
    classe?: string;
  };
  const {
    apparence = 'lien',
    blank,
    etire,
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
    source,
    cible,
    classe,
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
    data-source={source}
    data-cible={cible}
    class={classe}
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
    centered={etire}
    data-source={source}
    data-cible={cible}
    class={classe}
  ></dsfr-button>
{/if}

<style lang="scss">
  dsfr-link {
    color: inherit;
  }
</style>
