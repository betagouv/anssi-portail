<script lang="ts">
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';

  let estBureau = $state(false);
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });

  let estConnecte = () => !!$profilStore;

  const menu = $derived([
    ...(estConnecte()
      ? [{ label: 'Maturité cyber', id: 'nav-maturite', type: 'link', href: '/ma-maturite' }]
      : [{ label: 'Test de maturité cyber', id: 'nav-test-maturite', type: 'link', href: '/test-maturite' }]),
    {
      label: 'Catalogue et sélections',
      id: 'nav-catalogue',
      type: 'menu',
      collapsable: true,
      collapseId: 'nav-catalogue',
      items: [
        { label: 'Le catalogue cyber complet', id: 'nav-catalogue-1', type: 'link', href: '/catalogue' },
        { label: 'Les services pour se lancer', id: 'nav-catalogue-2', type: 'link', href: '/parcours-debutter' },
        { label: 'Les services pour approfondir', id: 'nav-catalogue-3', type: 'link', href: '/parcours-approfondir' },
      ],
    },
    { label: 'Directive NIS 2', id: 'nav-nis2', type: 'link', href: '/nis2' },
    ...(estConnecte() ? [{ label: 'Favoris', id: 'nav-favoris', type: 'link', href: '/favoris' }] : []),
    {
      label: 'Contacts utiles',
      id: 'nav-contacts',
      type: 'menu',
      collapsable: true,
      collapseId: 'nav-contacts',
      items: [
        { label: 'Contacts cyber', id: 'nav-contacts-1', type: 'link', href: '/contacts' },
        {
          label: 'Prestataires qualifiés et labellisés',
          id: 'nav-contacts-2',
          type: 'link',
          href: '/prestataires-labellises',
        },
      ],
    },
    { label: 'Financements', id: 'nav-financements', type: 'link', href: '/financements' },
    {
      label: 'Promouvoir',
      id: 'nav-promouvoir',
      type: 'menu',
      collapsable: true,
      collapseId: 'nav-promouvoir',
      items: [
        {
          label: 'Promouvoir MesServicesCyber',
          id: 'nav-promouvoir-1',
          type: 'link',
          href: '/promouvoir-messervicescyber',
        },
        {
          label: 'Promouvoir le diagnostic cyber',
          id: 'nav-promouvoir-2',
          type: 'link',
          href: '/promouvoir-diagnostic-cyber',
        },
      ],
    },
  ]);
</script>

<dsfr-navigation items={menu}>
  {#if estBureau}
    <div slot="afternavigation" class="centre">
      <lab-anssi-mes-services-cyber-lien-diagnostic-cyber lien="/cyberdepart">
      </lab-anssi-mes-services-cyber-lien-diagnostic-cyber>
    </div>
  {/if}
</dsfr-navigation>

<style lang="scss">
  .centre {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
  }
</style>
