<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import LienNavigation from './LienNavigation.svelte';

  const cheminRelatif = window.location.pathname;

  $: estConnecte = !!$profilStore;
</script>

<nav class="conteneur-nav">
  <div class="contenu-section">
    {#if !estConnecte}
      <LienNavigation href="/" label="Accueil" />
    {/if}
    <LienNavigation
      href="/catalogue/"
      label={estConnecte
        ? 'Le catalogue des services'
        : 'Explorer le catalogue'}
    />
    <details
      class:actif={cheminRelatif === '/parcours-debuter/' ||
        cheminRelatif === '/parcours-approfondir/'}
    >
      <summary>
        {estConnecte ? 'Nos sélections' : 'Découvrir nos sélections'}
      </summary>
      <div class="choix">
        <LienNavigation
          href="/nis2/"
          label="Les services pour vous accompagner avec NIS2"
          dansMenuDeroulant
        />
        <LienNavigation
          href="/parcours-debuter/"
          label="Les services pour se lancer"
          dansMenuDeroulant
        />
        <LienNavigation
          href="/parcours-approfondir/"
          label="Les services pour approfondir"
          dansMenuDeroulant
        />
      </div>
    </details>
    <LienNavigation
      href={estConnecte ? '/ma-maturite' : '/test-maturite/'}
      label={estConnecte ? 'Maturité cyber' : 'Tester votre maturité cyber'}
    />
    <LienNavigation
      href="/promouvoir-messervicescyber/"
      label="Promouvoir MesServicesCyber"
    />
    {#if estConnecte}
      <LienNavigation href="/contacts/" label="Contacts utiles" />
      <LienNavigation href="/favoris/" label="Favoris" />
      <LienNavigation href="/services-anssi/" label="Services ANSSI utilisés" />
      <LienNavigation href="/cyberdepart/" label="Diagnostic cyber" />
    {:else}
      <lab-anssi-mes-services-cyber-lien-diagnostic-cyber lien="/cyberdepart"
      ></lab-anssi-mes-services-cyber-lien-diagnostic-cyber>
    {/if}
  </div>
</nav>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .conteneur-nav {
    padding: 0 var(--gouttiere);
    display: none;
    margin-left: -8px;
    border-top: 1px solid #dddddd;

    @include a-partir-de(xl) {
      margin-left: -32px;
    }

    @include a-partir-de(lg) {
      display: block;
    }

    .contenu-section {
      display: flex;
      align-items: center;

      details {
        font-size: 0.875rem;

        &:hover {
          background: var(--menu-fond-hover);
        }

        &:active {
          background: var(--menu-fond-clique);
        }

        &.actif {
          font-weight: 500;
          border-bottom: 2px solid var(--jaune-msc);
        }
      }

      details {
        position: relative;

        &[open] summary:after {
          transform: rotate(180deg);
        }

        .choix {
          position: absolute;
          background: white;
          box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);
          left: 0;
          width: 320px;
          top: 57px;
          font-size: 0.875rem;
          line-height: 1.5rem;
          z-index: 5;
          border-top: 1px solid #ddd;
        }

        summary {
          padding: 16px 8px;
          display: flex;
          gap: 8px;
          align-items: center;
          cursor: pointer;

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
        margin-left: auto;
      }
    }
  }
</style>
