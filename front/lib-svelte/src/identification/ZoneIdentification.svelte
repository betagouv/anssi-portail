<script lang="ts">
  import { profilStore } from '@stores/profil.store';
  import Lien from '../ui/Lien.svelte';
</script>

<div class="conteneur-zone-indentification">
  {#if $profilStore === undefined}
    <Lien apparence="bouton" type="tertiaire-sans-bordure" href="/inscription" taille="sm" libelle="S’inscrire" />
    <Lien
      apparence="bouton"
      type="tertiaire-sans-bordure"
      href="/connexion"
      taille="sm"
      libelle="Se connecter"
      icone="user-line"
    />
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
      onlogout={() => (window.location.href = '/oidc/deconnexion')}
    >
    </dsfr-user>
  {/if}
</div>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  .conteneur-zone-indentification {
    display: flex;
    align-items: center;
  }
</style>
