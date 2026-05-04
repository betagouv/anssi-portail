<script lang="ts">
  import { profilStore } from '../stores/profil.store';

  const menu = [{ label: 'Services ANSSI utilisés', href: '/services-anssi' }];
</script>

<div class="conteneur-zone-indentification">
  {#if $profilStore === undefined}
    <dsfr-button kind="tertiary-no-outline" markup="a" href="/inscription" size="sm">S’inscrire</dsfr-button>
    <dsfr-button kind="tertiary-no-outline" markup="a" href="/connexion" size="sm" has-icon icon="user-line">
      Se connecter
    </dsfr-button>
  {:else}
    <dsfr-user
      kind="tertiary-no-outline"
      expandable
      has-icon
      icon="account-circle-line"
      buttonLabel="{$profilStore.prenom} {$profilStore.nom}"
      id="utilisateur"
      button-id="utilisateur-btn"
      collapse-id="nav-utilisateur"
      hasLogout
      links={menu}
    >
      <dsfr-button
        slot="logout"
        centered
        kind="tertiary-no-outline"
        markup="a"
        href="/oidc/deconnexion"
        size="sm"
        has-icon
        icon="logout-box-r-line"
      >
        Se déconnecter
      </dsfr-button>
    </dsfr-user>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  * {
    box-sizing: border-box;
  }

  .conteneur-zone-indentification {
    @include a-partir-de(lg) {
      display: flex;
      align-items: center;
    }
  }
</style>
