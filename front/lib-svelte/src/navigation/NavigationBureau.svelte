<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import LienNavigation from './LienNavigation.svelte';

  const cheminRelatif = window.location.pathname;

  $: estConnecte = !!$profilStore;
</script>

<nav class="conteneur-nav">
  <div class="contenu-section">
    {#if !estConnecte}
      <LienNavigation href="/" label="Accueil"/>
    {/if}
    <LienNavigation href="/catalogue/" label={estConnecte ? 'Le catalogue des services' : 'Explorer le catalogue'}/>
    <LienNavigation href="/nis2/" label="Vous accompagner avec NIS2"/>
    <details class:actif={ cheminRelatif === '/parcours-debuter/' ||  cheminRelatif === '/parcours-approfondir/'}>
      <summary>{estConnecte ? 'Notre sélection' : 'Découvrir notre sélection'}</summary>
      <div class="choix">
        <LienNavigation href="/parcours-debuter/" label="Les services pour se lancer" dansMenuDeroulant/>
        <LienNavigation href="/parcours-approfondir/" label="Les services pour approfondir" dansMenuDeroulant/>
      </div>
    </details>
    <LienNavigation href={estConnecte ? '/ma-maturite' : '/test-maturite/'} label={estConnecte ? 'Votre maturité cyber' : 'Tester votre maturité cyber'}/>
    {#if estConnecte}
      <LienNavigation href="/contacts/" label='Vos contacts' />
      <LienNavigation href="/favoris/" label='Vos favoris' />
      <LienNavigation href="/services-anssi/" label='Services ANSSI utilisés' />
    {/if}
  </div>
</nav>

<style lang="scss">
  @use "../../../assets/styles/responsive" as *;

  .conteneur-nav {
    padding: 0 var(--gouttiere);
    display: none;

    border-top: 1px solid #dddddd;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

    @include a-partir-de(lg) {
      display: block;
    }

    .contenu-section {
      display: flex;
      align-items: center;

      details {
        padding: 16px 8px;
        font-size: 0.875rem;
        @include a-partir-de(xl) {
          padding: 16px;
        }

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
          right: 0;
          top: 58px;
          font-size: 0.875rem;
          line-height: 1.5rem;
          z-index: 5;
        }

        summary {
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
    }
  }
</style>