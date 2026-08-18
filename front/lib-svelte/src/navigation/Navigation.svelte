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

  const itemDeMenu = (label: string, href: string, active: boolean) => ({
    label,
    id: `nav-${label.toLowerCase().replaceAll(' ', '-')}`,
    href,
    active,
  });

  const menu = $derived([
    ...(estMobile ? [itemDeMenu('Accueil', '/', cheminRelatif === '/')] : []),

    itemDeMenu('Diagnostic cyber gratuit', '/cyberdepart', cheminRelatif === '/cyberdepart'),

    ...(estConnecte()
      ? [itemDeMenu('Maturité cyber', '/ma-maturite', cheminRelatif === '/ma-maturite')]
      : [itemDeMenu('Test de maturité cyber', '/test-maturite', cheminRelatif === '/test-maturite')]),

    itemDeMenu(
      'Guides et ressources',
      '/catalogue',
      cheminRelatif === '/catalogue' || cheminRelatif.startsWith('/guides/') || cheminRelatif.startsWith('/ressources/')
    ),

    ...(estConnecte() ? [itemDeMenu('Favoris', '/favoris', cheminRelatif === '/favoris')] : []),

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
        itemDeMenu('Contacts cyber', creeLienContactsUtiles($profilStore), cheminRelatif.startsWith('/contacts')),
        itemDeMenu(
          'Prestataires qualifiés et labellisés',
          '/prestataires-labellises',
          cheminRelatif === '/prestataires-labellises'
        ),
        itemDeMenu(
          'Financements',
          '/financements',
          cheminRelatif === '/financements' || cheminRelatif.startsWith('/financements/')
        ),
      ],
    },

    ...(estMobile ? [itemDeMenu('Directive NIS 2', '/nis2', cheminRelatif === '/nis2')] : []),
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
  dsfr-navigation:not(:defined) .bouton-nis2 {
    display: none;
  }

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
