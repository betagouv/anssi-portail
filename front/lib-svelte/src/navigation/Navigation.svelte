<script lang="ts">
  import { onMount } from 'svelte';
  import { creeLienContactsUtiles } from '../contacts/contacts';
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

  const cheminRelatif = window.location.pathname;

  const menu = $derived([
    ...(estConnecte()
      ? [
          {
            label: 'Maturité cyber',
            id: 'nav-maturite',
            type: 'link',
            href: '/ma-maturite',
            active: cheminRelatif === '/ma-maturite',
          },
        ]
      : [
          {
            label: 'Test de maturité cyber',
            id: 'nav-test-maturite',
            type: 'link',
            href: '/test-maturite',
            active: cheminRelatif === '/test-maturite',
          },
        ]),
    {
      label: 'Catalogue',
      id: 'nav-catalogue',
      type: 'link',
      href: '/catalogue',
      active: cheminRelatif === '/catalogue',
    },
    { label: 'Directive NIS 2', id: 'nav-nis2', type: 'link', href: '/nis2', active: cheminRelatif === '/nis2' },
    ...(estConnecte()
      ? [
          {
            label: 'Favoris',
            id: 'nav-favoris',
            type: 'link',
            href: '/favoris',
            active: cheminRelatif === '/favoris',
          },
        ]
      : []),
    {
      label: 'Contacts utiles',
      id: 'nav-contacts',
      type: 'menu',
      collapsable: true,
      collapseId: 'nav-contacts',
      active: ['/contacts/', '/prestataires-labellises'].includes(cheminRelatif),
      items: [
        {
          label: 'Contacts cyber',
          id: 'nav-contacts-1',
          type: 'link',
          href: creeLienContactsUtiles($profilStore),
          active: cheminRelatif === '/contacts/',
        },
        {
          label: 'Prestataires qualifiés et labellisés',
          id: 'nav-contacts-2',
          type: 'link',
          href: '/prestataires-labellises',
          active: cheminRelatif === '/prestataires-labellises',
        },
      ],
    },
    {
      label: 'Financements',
      id: 'nav-financements',
      type: 'link',
      href: '/financements',
      active: cheminRelatif === '/financements',
    },
  ]);
</script>

<div class="nav">
  <dsfr-navigation items={menu}></dsfr-navigation>
  {#if estBureau}
    <div>
      <lab-anssi-mes-services-cyber-lien-diagnostic-cyber lien="/cyberdepart">
      </lab-anssi-mes-services-cyber-lien-diagnostic-cyber>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .nav {
    @include a-partir-de(lg) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
