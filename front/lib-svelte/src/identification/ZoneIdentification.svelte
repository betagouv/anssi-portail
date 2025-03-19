<script lang="ts">
  import { profilStore } from '../stores/profil.store';
</script>

{#if $profilStore === undefined}
  <div class="profil-deconnecte">
    <a href="/connexion">Se connecter</a>
  </div>
{:else}
  <div class="profil-connecte">
    <span class="libelle-profil">{$profilStore.prenom} {$profilStore.nom}</span>
    <a href="/oidc/deconnexion">Se déconnecter</a>
  </div>
{/if}

<style lang="scss">
  .profil-connecte,
  .profil-deconnecte,
  .profil-connecte > a,
  .libelle-profil {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 4px 8px;

    &:before {
      width: 16px;
      height: 16px;
      line-height: 16px;
    }
  }

  .profil-connecte > a,
  .profil-deconnecte > a,
  .libelle-profil {
    color: #000091;
  }

  .profil-deconnecte > a:before {
    content: url('/assets/images/icone-profil-non-connecte.svg');
  }

  .profil-connecte > a:before {
    content: url('/assets/images/icone-profil-deconnecte.svg');
  }

  .libelle-profil:before {
    content: url('/assets/images/icone-profil-connecte.svg');
  }
</style>