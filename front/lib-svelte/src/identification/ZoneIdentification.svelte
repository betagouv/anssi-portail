<script lang="ts">
  import { slide } from 'svelte/transition';
  import LienNavigation from '../navigation/LienNavigation.svelte';
  import { profilStore } from '../stores/profil.store';

  export let estMobile = false;
</script>

<div class="conteneur-zone-indentification" class:mobile={estMobile}>
  {#if $profilStore === undefined}
    <div class="profil-deconnecte">
      <a href="/inscription" class="lien-inscription">S’inscrire</a>
      <a href="/connexion" class="lien-connexion">Se connecter</a>
    </div>
  {:else}
    <details>
      <summary class="libelle-profil">
        {$profilStore.prenom}
        {$profilStore.nom}
      </summary>
      <div class="contenu" transition:slide>
        <LienNavigation
          href="/services-anssi/"
          label="Services ANSSI utilisés"
          dansMenuDeroulant
        />
      </div>
    </details>
    <a class="deconnexion" href="/oidc/deconnexion">Se déconnecter</a>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  * {
    box-sizing: border-box;
  }
  .conteneur-zone-indentification:not(.mobile) {
    display: none;

    @include a-partir-de(lg) {
      display: flex;
      align-items: center;

      details {
        position: relative;
        summary {
          cursor: pointer;
          color: #000091;

          &:after {
            content: '';
            display: block;
            width: 16px;
            height: 16px;
            mask-image: url('/assets/images/icone-chevron-bas.svg');
            transition: transform 0.15s linear;
            background-color: #000091;
          }
        }

        &[open] summary:after {
          transform: rotate(-180deg);
        }

        .contenu {
          position: absolute;
          top: 100%;
          width: 320px;
          background-color: white;
          z-index: 5;
          box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);
        }
      }
    }
  }

  .conteneur-zone-indentification.mobile {
    border-bottom: 1px solid var(--border-default-grey);
    padding-bottom: 12px;

    display: block;

    details {
      display: none;
    }

    a {
      border: none;
    }
  }

  .profil-deconnecte,
  .libelle-profil {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 4px 8px;
    color: #000091;

    &:before {
      width: 16px;
      height: 16px;
      line-height: 16px;
    }
  }

  .profil-deconnecte > a,
  .libelle-profil {
    padding: 4px 12px;
    color: #000091;
  }

  .profil-deconnecte > a.lien-connexion:before {
    content: url('/assets/images/icone-profil-non-connecte.svg');
  }

  .deconnexion {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 4px 12px;
    color: #000091;
    &:before {
      width: 16px;
      height: 16px;
      line-height: 16px;
      content: url('/assets/images/icone-profil-deconnecte.svg');
    }
  }

  .libelle-profil:before {
    content: url('/assets/images/icone-profil-connecte.svg');
  }
</style>
