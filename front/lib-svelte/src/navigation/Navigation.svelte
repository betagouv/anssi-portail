<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { creeLienContactsUtiles } from '../contacts/contacts';
  import { profilStore } from '../stores/profil.store';

  let estConnecte = () => !!$profilStore;
  const cheminRelatif: string = typeof window !== 'undefined' ? window.location.pathname : '/';
  const menu = $derived([
    {
      label: 'Diagnostic cyber gratuit',
      id: 'nav-cyberdepart',
      type: 'link',
      href: '/cyberdepart',
      active: cheminRelatif === '/cyberdepart',
    },
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
      label: 'Guides et ressources',
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
          type: 'link',
          href: creeLienContactsUtiles($profilStore),
          active: cheminRelatif.startsWith('/contacts'),
        },
        {
          label: 'Prestataires qualifiés et labellisés',
          id: 'nav-contacts-2',
          type: 'link',
          href: '/prestataires-labellises',
          active: cheminRelatif === '/prestataires-labellises',
        },
        {
          label: 'Financements',
          id: 'nav-contacts-3',
          type: 'link',
          href: '/financements',
          active: cheminRelatif === '/financements' || cheminRelatif.startsWith('/financements/'),
        },
      ],
    },
  ]);
</script>

<dsfr-navigation items={enPropriétéWebC(menu)}></dsfr-navigation>
