<script lang="ts">
  import { fly } from 'svelte/transition';

  import { profilStore } from '../stores/profil.store';
  import LienNavigationMobile from './LienNavigationMobile.svelte';
  import { mount, onDestroy, onMount, unmount } from 'svelte';
  import MenuBurger from './MenuBurger.svelte';
  import ZoneIdentification from '../identification/ZoneIdentification.svelte';

  const cheminRelatif = window.location.pathname;
  let ouvert = false;

  let menuBurger: Record<string, unknown>;
  onMount(() => {
    const surClic = () => {
      ouvert = true;
    };

    menuBurger = mount(MenuBurger, {
      target: document.getElementById('menu-burger-mobile')!,
      props: { surClic },
    });
  });

  onDestroy(() => {
    unmount(menuBurger);
  });

  $: estConnecte = !!$profilStore;
</script>

{#if ouvert}
  <nav class="menu-mobile" transition:fly={{ x: 300 }}>
    <button class="fermer" on:click={() => (ouvert = false)}>Fermer</button>
    <ZoneIdentification estMobile />
    <div class="choix">
      {#if !estConnecte}
        <lab-anssi-mes-services-cyber-lien-diagnostic-cyber lien="/cyberdepart"
        ></lab-anssi-mes-services-cyber-lien-diagnostic-cyber>
        <LienNavigationMobile href="/" label="Accueil" />
      {/if}
      <LienNavigationMobile
        href="/catalogue/"
        label={estConnecte
          ? 'Le catalogue des services'
          : 'Explorer le catalogue complet'}
      />
      <details
        class:actif={cheminRelatif === '/parcours-debuter/' ||
          cheminRelatif === '/parcours-approfondir/'}
      >
        <summary>
          {estConnecte ? 'Nos sélections' : 'Découvrir nos sélections'}
        </summary>
        <div class="choix">
          <LienNavigationMobile
            href="/nis2/"
            label="Les services pour vous accompagner avec NIS2"
            dansMenuDeroulant
          />
          <LienNavigationMobile
            href="/parcours-debuter/"
            label="Les services pour se lancer"
            dansMenuDeroulant
          />
          <LienNavigationMobile
            href="/parcours-approfondir/"
            label="Les services pour approfondir"
            dansMenuDeroulant
          />
        </div>
      </details>
      <LienNavigationMobile
        href={estConnecte ? '/ma-maturite' : '/test-maturite/'}
        label={estConnecte ? 'Maturité cyber' : 'Tester votre maturité cyber'}
      />
      <details
        class:actif={cheminRelatif === '/promouvoir-messervicescyber/' ||
          cheminRelatif === '/promouvoir-diagnostic-cyber/'}
      >
        <summary>
          Promouvoir
        </summary>
        <div class="choix">
          <LienNavigationMobile
            href="/promouvoir-messervicescyber/"
            label="Promouvoir MesServicesCyber"
            dansMenuDeroulant
          />
          <LienNavigationMobile
            href="/promouvoir-diagnostic-cyber/"
            label="Promouvoir le diagnostic cyber"
            dansMenuDeroulant
          />
        </div>
      </details>


      {#if estConnecte}
        <LienNavigationMobile href="/contacts/" label="Contacts utiles" />
        <LienNavigationMobile href="/favoris/" label="Favoris" />
        <LienNavigationMobile
          href="/services-anssi/"
          label="Services ANSSI utilisés"
        />
        <LienNavigationMobile href="/cyberdepart/" label="Diagnostic cyber" />
      {/if}
    </div>
  </nav>
{/if}

<style lang="scss">
  .menu-mobile {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 11;
    background: white;
    width: calc(100% - 32px);
    padding: 16px;
    height: 100vh;
    top: 0;
    left: 0;

    button.fermer {
      align-self: flex-end;
      color: #000091;
      border: none;
      background: none;
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 0;
      line-height: 24px;

      &:after {
        content: url('/assets/images/icone-croix.svg');
        display: block;
        width: 16px;
        height: 16px;
      }
    }

    .choix {
      display: flex;
      flex-direction: column;
      padding-top: 12px;

      details {
        font-weight: bold;
        width: calc(100% - 32px);
        border-bottom: 1px solid #dddddd;
        padding: 12px 16px;

        &.actif {
          position: relative;

          &:before {
            content: '';
            display: block;
            width: 2px;
            height: 24px;
            left: 0;
            background-color: var(--jaune-msc);
            position: absolute;
          }
        }
      }

      details {
        padding: 12px 16px;

        &[open] summary:after {
          transform: rotate(180deg);
        }

        &[open] summary {
          margin-bottom: 8px;
        }

        summary {
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &::marker {
            content: '';
          }

          &::-webkit-details-marker {
            display: none;
          }

          &:after {
            content: '';
            display: block;
            width: 16px;
            height: 16px;
            background: url('/assets/images/icone-chevron-bas.svg');
          }
        }
      }

      lab-anssi-mes-services-cyber-lien-diagnostic-cyber {
        margin-bottom: 16px;
      }
    }
  }
</style>
