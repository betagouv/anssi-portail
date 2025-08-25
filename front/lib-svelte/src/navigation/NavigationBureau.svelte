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
      href={estConnecte ? '/ma-maturite' : '/test-maturite/'}
      label={estConnecte ? 'Maturité cyber' : 'Test de maturité cyber'}
    />
    <details
      class:actif={[
        '/catalogue/',
        '/nis2/',
        '/parcours-debuter/',
        '/parcours-approfondir/',
      ].includes(cheminRelatif)}
    >
      <summary>Catalogue et sélections</summary>
      <div class="choix">
        <LienNavigation
          href="/catalogue/"
          label={estConnecte
            ? 'Le catalogue des services'
            : 'Explorer le catalogue'}
          dansMenuDeroulant
        />
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
    {#if estConnecte}
      <LienNavigation href="/favoris/" label="Favoris" />
    {/if}
    <details
      class:actif={cheminRelatif === '/contacts/' ||
        cheminRelatif === '/prestataires-labellises/'}
    >
      <summary>Contacts utiles</summary>
      <div class="choix">
        {#if estConnecte}
          <LienNavigation
            href="/contacts/"
            label="Contacts cyber de votre région"
            dansMenuDeroulant
          />
        {/if}
        <LienNavigation
          href="/prestataires-labellises/"
          label="Prestataires labellisés"
          dansMenuDeroulant
        />
      </div>
    </details>
    <LienNavigation href="/financements/" label="Financements" />
    {#if estConnecte}
      <LienNavigation href="/services-anssi/" label="Services ANSSI utilisés" />
    {/if}
    <details
      class:actif={cheminRelatif === '/promouvoir-messervicescyber/' ||
        cheminRelatif === '/promouvoir-diagnostic-cyber/'}
    >
      <summary> Promouvoir </summary>
      <div class="choix">
        <LienNavigation
          href="/promouvoir-messervicescyber/"
          label="Promouvoir MesServicesCyber"
          dansMenuDeroulant
        />
        <LienNavigation
          href="/promouvoir-diagnostic-cyber/"
          label="Promouvoir le diagnostic cyber"
          dansMenuDeroulant
        />
      </div>
    </details>
    <lab-anssi-mes-services-cyber-lien-diagnostic-cyber lien="/cyberdepart"
    ></lab-anssi-mes-services-cyber-lien-diagnostic-cyber>
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
