<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { creeLienContactsUtiles } from '../contacts/contacts';
  import { profilStore } from '../stores/profil.store';
  import { onMount } from 'svelte';

  let estConnecte = () => !!$profilStore;

  let estMobile = $state(false);
  onMount(() => {
    const mql = window.matchMedia('(max-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estMobile = e.matches;
    });
    estMobile = mql.matches;
  });

  const cheminRelatif: string = typeof window !== 'undefined' ? window.location.pathname : '/';

  const menu = $derived([
    ...(estMobile
      ? [
          {
            label: 'Accueil',
            id: 'nav-accueil',
            href: '/',
            active: cheminRelatif === '/',
          },
        ]
      : []),
    {
      label: 'Diagnostic cyber gratuit',
      id: 'nav-cyberdepart',
      href: '/cyberdepart',
      active: cheminRelatif === '/cyberdepart',
    },
    ...(estConnecte()
      ? [
          {
            label: 'Maturité cyber',
            id: 'nav-maturite',
            href: '/ma-maturite',
            active: cheminRelatif === '/ma-maturite',
          },
        ]
      : [
          {
            label: 'Test de maturité cyber',
            id: 'nav-test-maturite',
            href: '/test-maturite',
            active: cheminRelatif === '/test-maturite',
          },
        ]),
    {
      label: 'Guides et ressources',
      id: 'nav-catalogue',
      href: '/catalogue',
      active: cheminRelatif === '/catalogue',
    },
    ...(estConnecte()
      ? [
          {
            label: 'Favoris',
            id: 'nav-favoris',
            href: '/favoris',
            active: cheminRelatif === '/favoris',
          },
        ]
      : []),
    {
      label: 'Contacts et financements',
      id: 'nav-contacts',
      type: 'menu',
      collapsable: true,
      collapseId: 'nav-contacts',
      active:
        ['/contacts', '/prestataires-labellises', '/financements'].includes(cheminRelatif) ||
        cheminRelatif.startsWith('/financements/') ||
        cheminRelatif.startsWith('/contacts'),
      items: [
        {
          label: 'Contacts cyber',
          id: 'nav-contacts-1',
          href: creeLienContactsUtiles($profilStore),
          active: cheminRelatif.startsWith('/contacts'),
        },
        {
          label: 'Prestataires qualifiés et labellisés',
          id: 'nav-contacts-2',
          href: '/prestataires-labellises',
          active: cheminRelatif === '/prestataires-labellises',
        },
        {
          label: 'Financements',
          id: 'nav-contacts-3',
          href: '/financements',
          active: cheminRelatif === '/financements' || cheminRelatif.startsWith('/financements/'),
        },
      ],
    },
    ...(estMobile
      ? [
          {
            label: 'Directive NIS 2',
            id: 'nav-nis2',
            href: '/nis2',
            active: cheminRelatif === '/nis2',
          },
        ]
      : []),
  ]);
</script>

<dsfr-navigation items={enPropriétéWebC(menu)}>
  {#if !estMobile}
    <a href="/nis2" class="bouton-nis2" slot="afternavigation">
      <img src="/assets/images/badge-nis2.svg" alt="Directive NIS2" />
    </a>
  {/if}
</dsfr-navigation>

<style lang="scss">
  .bouton-nis2 {
    border-top: 1px solid var(--border-default-grey);
    background-color: var(--yellow-moutarde-975, #fef5e8);
    width: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    padding: 0;

    &:hover {
      background: var(--yellow-moutarde-975-75-hover);
    }
    &:active {
      background: var(--yellow-moutarde-975-75-active);
    }
  }
</style>
